"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Trash2, FileText, CheckCircle, Clock, AlertCircle, Link2, X } from "lucide-react";
import { use } from "react";

interface Documento {
  id: string;
  nome: string;
  tipo: string | null;
  texto_extraido: string | null;
  tamanho_bytes: number | null;
  storage_path: string;
  created_at: string;
}

function formatarBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatusDoc({ doc }: { doc: Documento }) {
  if (doc.texto_extraido) {
    return (
      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
        style={{ background: "#E8F5E9", color: "#2E7D32", fontFamily: "var(--font-inter)" }}>
        <CheckCircle size={11} />
        Processado
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
      style={{ background: "#FFF8E1", color: "#F9A825", fontFamily: "var(--font-inter)" }}>
      <Clock size={11} />
      Processando
    </span>
  );
}

export default function InEditaDocumentosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [modalUrl, setModalUrl] = useState(false);
  const [urlForm, setUrlForm] = useState({ url: "", nome: "" });
  const [enviandoUrl, setEnviandoUrl] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const poolRef = useRef<NodeJS.Timeout | null>(null);

  async function carregar() {
    const res = await fetch(`/api/documentos?inedita_id=${id}`);
    const data = await res.json();
    setDocumentos(data.documentos ?? []);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
    // Recarrega a cada 5s enquanto houver docs processando
    poolRef.current = setInterval(() => {
      setDocumentos((prev) => {
        const temProcessando = prev.some((d) => !d.texto_extraido);
        if (temProcessando) carregar();
        return prev;
      });
    }, 5000);
    return () => { if (poolRef.current) clearInterval(poolRef.current); };
  }, [id]);

  async function enviarArquivo(arquivo: File) {
    setEnviando(true);
    setErro("");
    const form = new FormData();
    form.append("arquivo", arquivo);
    form.append("inedita_id", id);
    const res = await fetch("/api/documentos/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.error) {
      setErro(data.error);
    } else {
      carregar();
    }
    setEnviando(false);
  }

  async function deletar(docId: string, nome: string) {
    if (!confirm(`Remover "${nome}"?`)) return;
    await fetch(`/api/documentos?id=${docId}`, { method: "DELETE" });
    carregar();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const arquivo = e.dataTransfer.files[0];
    if (arquivo) enviarArquivo(arquivo);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/admin"
        className="flex items-center gap-2 text-sm mb-6"
        style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}
      >
        <ArrowLeft size={15} />
        Voltar
      </Link>

      <h1
        className="text-2xl font-bold mb-1"
        style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
      >
        Documentos da inédita
      </h1>
      <p className="text-sm mb-8" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
        Tudo que você subir aqui a Diffy vai usar para conhecer o projeto dela.
      </p>

      {/* Zona de upload */}
      <div
        className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center mb-4 cursor-pointer transition-colors"
        style={{ borderColor: enviando ? "#D81B60" : "#EFEFEF", background: enviando ? "#FFF0F5" : "#FAFAFA" }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) enviarArquivo(f); }}
        />
        <Upload size={28} style={{ color: enviando ? "#D81B60" : "#9E9E9E" }} />
        <p className="mt-3 font-medium text-sm" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>
          {enviando ? "Enviando e processando..." : "Clique ou arraste um arquivo"}
        </p>
        <p className="text-xs mt-1" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
          PDF, TXT, MD — até 10MB
        </p>
      </div>

      <button
        onClick={() => setModalUrl(true)}
        className="flex items-center gap-2 w-full justify-center py-3 rounded-xl text-sm font-medium mb-6 transition-colors hover:bg-pink-50"
        style={{ border: "1px solid #EFEFEF", color: "#D81B60", fontFamily: "var(--font-inter)" }}
      >
        <Link2 size={14} />
        Adicionar link (site, entregável, landing page...)
      </button>

      {erro && (
        <div className="flex items-center gap-2 p-3 rounded-xl mb-4"
          style={{ background: "#FFEBEE", color: "#C62828", fontFamily: "var(--font-inter)" }}>
          <AlertCircle size={15} />
          <span className="text-sm">{erro}</span>
        </div>
      )}

      {/* Lista de documentos */}
      {carregando ? (
        <p style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>Carregando...</p>
      ) : documentos.length === 0 ? (
        <div className="flex flex-col items-center py-12 rounded-2xl"
          style={{ background: "#fff", border: "1px solid #EFEFEF" }}>
          <FileText size={36} style={{ color: "#EFEFEF" }} />
          <p className="mt-3 text-sm" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
            Nenhum documento ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {documentos.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: "#fff", border: "1px solid #EFEFEF" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#FCE4EC" }}>
                {doc.tipo === "url"
                  ? <Link2 size={15} style={{ color: "#D81B60" }} />
                  : <FileText size={15} style={{ color: "#D81B60" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>
                  {doc.nome}
                </p>
                <p className="text-xs truncate" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                  {doc.tipo === "url" ? doc.storage_path : formatarBytes(doc.tamanho_bytes)}
                  {doc.texto_extraido && ` · ${doc.texto_extraido.length.toLocaleString()} chars`}
                </p>
              </div>
              <StatusDoc doc={doc} />
              <button onClick={() => deletar(doc.id, doc.nome)}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors ml-1"
                style={{ color: "#9E9E9E" }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal URL */}
      {modalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#fff" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
                Adicionar link
              </h2>
              <button onClick={() => setModalUrl(false)}><X size={18} style={{ color: "#9E9E9E" }} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "URL", key: "url", type: "url", placeholder: "https://..." },
                { label: "Nome (opcional)", key: "nome", type: "text", placeholder: "Ex: Entregável Universo Visual" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>{label}</label>
                  <input
                    type={type}
                    value={urlForm[key as keyof typeof urlForm]}
                    onChange={(e) => setUrlForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#EFEFEF")}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModalUrl(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid #EFEFEF", color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    setEnviandoUrl(true);
                    setErro("");
                    const res = await fetch("/api/documentos/url", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...urlForm, inedita_id: id }),
                    });
                    const data = await res.json();
                    if (data.error) setErro(data.error);
                    else { setModalUrl(false); setUrlForm({ url: "", nome: "" }); carregar(); }
                    setEnviandoUrl(false);
                  }}
                  disabled={!urlForm.url || enviandoUrl}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60"
                  style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
                  {enviandoUrl ? "Lendo..." : "Adicionar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
