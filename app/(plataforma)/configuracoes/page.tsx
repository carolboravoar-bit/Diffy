"use client";

import { useEffect, useRef, useState } from "react";
import { Pill } from "@/app/components/Pill";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  Upload, Trash2, FileText, Link2, CheckCircle, Clock,
  AlertCircle, LogOut, Plus, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Tab = "contexto" | "documentos" | "perfil" | "integracoes" | "plano";

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
      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full shrink-0"
        style={{ background: "#E8F5E9", color: "#2E7D32", fontFamily: "var(--font-inter)" }}>
        <CheckCircle size={10} /> Pronto
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full shrink-0"
      style={{ background: "#FFF8E1", color: "#F9A825", fontFamily: "var(--font-inter)" }}>
      <Clock size={10} /> Lendo...
    </span>
  );
}

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("contexto");

  // Contexto pessoal
  const [contexto, setContexto] = useState("");
  const [salvandoContexto, setSalvandoContexto] = useState(false);
  const [contextoSalvo, setContextoSalvo] = useState(false);

  // Documentos
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregandoDocs, setCarregandoDocs] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroDocs, setErroDocs] = useState("");
  const [modalUrl, setModalUrl] = useState(false);
  const [urlForm, setUrlForm] = useState({ url: "", nome: "" });
  const [enviandoUrl, setEnviandoUrl] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Perfil
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [perfilSalvo, setPerfilSalvo] = useState(false);

  useEffect(() => {
    carregarContexto();
    carregarDocs();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (tab === "documentos") {
      carregarDocs();
      pollRef.current = setInterval(() => {
        setDocumentos((prev) => {
          if (prev.some((d) => !d.texto_extraido)) carregarDocs();
          return prev;
        });
      }, 5000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [tab]);

  async function carregarContexto() {
    const res = await fetch("/api/meu-contexto");
    const data = await res.json();
    setContexto(data.contexto_pessoal ?? "");
    if (data.nome) setNome(data.nome);
    if (data.whatsapp) setWhatsapp(data.whatsapp);
  }

  async function carregarDocs() {
    setCarregandoDocs(true);
    const res = await fetch("/api/meus-documentos");
    const data = await res.json();
    setDocumentos(data.documentos ?? []);
    setCarregandoDocs(false);
  }

  async function salvarContexto() {
    setSalvandoContexto(true);
    await fetch("/api/meu-contexto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contexto_pessoal: contexto }),
    });
    setSalvandoContexto(false);
    setContextoSalvo(true);
    setTimeout(() => setContextoSalvo(false), 2500);
  }

  async function enviarArquivo(arquivo: File) {
    setEnviando(true);
    setErroDocs("");
    const form = new FormData();
    form.append("arquivo", arquivo);
    const res = await fetch("/api/meus-documentos/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.error) setErroDocs(data.error);
    else carregarDocs();
    setEnviando(false);
  }

  async function enviarUrl() {
    setEnviandoUrl(true);
    setErroDocs("");
    const res = await fetch("/api/documentos/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(urlForm),
    });
    const data = await res.json();
    if (data.error) setErroDocs(data.error);
    else { setModalUrl(false); setUrlForm({ url: "", nome: "" }); carregarDocs(); }
    setEnviandoUrl(false);
  }

  async function deletarDoc(id: string, nome: string) {
    if (!confirm(`Remover "${nome}"?`)) return;
    await fetch(`/api/meus-documentos?id=${id}`, { method: "DELETE" });
    carregarDocs();
  }

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "contexto", label: "Meu contexto" },
    { key: "documentos", label: "Documentos" },
    { key: "perfil", label: "Perfil" },
    { key: "integracoes", label: "Integrações" },
  ];

  return (
    <div className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Pill label="CONFIGURAÇÕES" />
          <h1 className="text-2xl font-bold mt-2" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Conta e preferências
          </h1>
        </div>
        <button
          onClick={sair}
          className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl"
          style={{ color: "#9E9E9E", border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)" }}
        >
          <LogOut size={14} /> Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit flex-wrap" style={{ background: "#F5F5F5" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.key ? "#D81B60" : "transparent",
              color: tab === t.key ? "#fff" : "#6B6B6B",
              fontFamily: "var(--font-inter)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MEU CONTEXTO ── */}
      {tab === "contexto" && (
        <div className="max-w-2xl">
          <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #EFEFEF" }}>
            <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Fala pra Diffy quem você é
            </h2>
            <p className="text-sm mb-5" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
              Escreve aqui o que quiser que ela saiba: o que você está construindo, onde trava, como prefere ser ajudada. Quanto mais você contar, mais ela vai entender o seu negócio.
            </p>
            <textarea
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
              rows={12}
              placeholder={`Exemplos do que você pode contar:
• O que é o seu negócio e para quem você atende
• Qual é o seu principal produto ou serviço agora
• Onde você sente que mais precisa de ajuda
• Qual é o seu maior desafio do momento
• Como você prefere que a Diffy te ajude (direto ao ponto, perguntas, sugestões...)`}
              className="w-full rounded-xl text-sm resize-none outline-none p-4 leading-relaxed"
              style={{
                border: "1px solid #EFEFEF",
                fontFamily: "var(--font-inter)",
                color: "#2C2C2C",
                background: "#FAFAFA",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#EFEFEF")}
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                {contexto.length} caracteres
              </p>
              <button
                onClick={salvarContexto}
                disabled={salvandoContexto}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                style={{ background: contextoSalvo ? "#2E7D32" : "#D81B60", fontFamily: "var(--font-inter)" }}
              >
                {salvandoContexto ? "Salvando..." : contextoSalvo ? "✓ Salvo!" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DOCUMENTOS ── */}
      {tab === "documentos" && (
        <div className="max-w-2xl">
          <p className="text-sm mb-6" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
            Suba PDFs, textos e links que a Diffy deve conhecer sobre você e seu negócio.
          </p>

          {/* Zona de upload */}
          <div
            className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center mb-4 cursor-pointer transition-colors"
            style={{ borderColor: enviando ? "#D81B60" : "#EFEFEF", background: enviando ? "#FFF0F5" : "#FAFAFA" }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) enviarArquivo(f); }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) enviarArquivo(f); }}
            />
            <Upload size={26} style={{ color: enviando ? "#D81B60" : "#9E9E9E" }} />
            <p className="mt-2 font-medium text-sm" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>
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
            <Link2 size={15} />
            Adicionar um link (site, entregável, landing page...)
          </button>

          {erroDocs && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background: "#FFEBEE", color: "#C62828", fontFamily: "var(--font-inter)" }}>
              <AlertCircle size={14} />
              <span className="text-sm">{erroDocs}</span>
            </div>
          )}

          {carregandoDocs ? (
            <p className="text-sm" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>Carregando...</p>
          ) : documentos.length === 0 ? (
            <div className="flex flex-col items-center py-10 rounded-2xl" style={{ background: "#fff", border: "1px solid #EFEFEF" }}>
              <FileText size={32} style={{ color: "#EFEFEF" }} />
              <p className="mt-3 text-sm" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                Nenhum documento ainda.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: "#fff", border: "1px solid #EFEFEF" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "#FCE4EC" }}>
                    {doc.tipo === "url" ? <Link2 size={14} style={{ color: "#D81B60" }} /> : <FileText size={14} style={{ color: "#D81B60" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>
                      {doc.nome}
                    </p>
                    <p className="text-xs" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                      {doc.tipo === "url" ? doc.storage_path : formatarBytes(doc.tamanho_bytes)}
                    </p>
                  </div>
                  <StatusDoc doc={doc} />
                  <button onClick={() => deletarDoc(doc.id, doc.nome)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors ml-1"
                    style={{ color: "#9E9E9E" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PERFIL ── */}
      {tab === "perfil" && (
        <div className="max-w-lg">
          <div className="p-8 rounded-2xl" style={{ background: "#fff", border: "1px solid #E8E8E8" }}>
            <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Seus dados
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400"
                  style={{ fontFamily: "var(--font-inter)" }}>Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "#F5F5F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E8E8")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400"
                  style={{ fontFamily: "var(--font-inter)" }}>WhatsApp</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "#F5F5F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E8E8")}
                />
                <p className="text-xs mt-1.5" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                  Com código do país, ex: +5511999999999. A Diffy usa esse número para te enviar mensagens.
                </p>
              </div>
              <button
                onClick={async () => {
                  setSalvandoPerfil(true);
                  await fetch("/api/meu-contexto", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, whatsapp }),
                  });
                  setSalvandoPerfil(false);
                  setPerfilSalvo(true);
                  setTimeout(() => setPerfilSalvo(false), 2500);
                }}
                disabled={salvandoPerfil}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: perfilSalvo ? "#2E7D32" : "#D81B60", fontFamily: "var(--font-inter)" }}
              >
                {perfilSalvo ? "Salvo!" : salvandoPerfil ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INTEGRAÇÕES ── */}
      {tab === "integracoes" && (
        <div className="max-w-2xl space-y-4">
          {[
            { nome: "WhatsApp Business", descricao: "Conecta o número da Diffy no seu WhatsApp.", status: "conectado", cor: "#25D366" },
            { nome: "Google Calendar", descricao: "Sincroniza seus compromissos.", status: "desconectado", cor: "#6B6B6B" },
            { nome: "Calendly", descricao: "A Diffy vê seus horários disponíveis.", status: "desconectado", cor: "#6B6B6B" },
            { nome: "ZapSign", descricao: "Contratos digitais direto pela plataforma.", status: "desconectado", cor: "#6B6B6B" },
            { nome: "Instagram", descricao: "Análise de posts e ideias de conteúdo.", status: "em breve", cor: "#F9A825" },
          ].map((integracao) => (
            <div key={integracao.nome} className="flex items-center justify-between p-5 rounded-2xl"
              style={{ background: "#fff", border: "1px solid #E8E8E8" }}>
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                    {integracao.nome}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: integracao.status === "conectado" ? "#E8F5E9" : integracao.status === "em breve" ? "#FFF8E1" : "#F5F5F5",
                      color: integracao.cor,
                      fontFamily: "var(--font-inter)",
                    }}>
                    {integracao.status === "conectado" ? "● conectado" : integracao.status === "em breve" ? "em breve" : "desconectado"}
                  </span>
                </div>
                <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
                  {integracao.descricao}
                </p>
              </div>
              <button
                disabled={integracao.status === "em breve"}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: integracao.status === "conectado" ? "#F5F5F5" : "#FCE4EC",
                  color: integracao.status === "conectado" ? "#6B6B6B" : "#D81B60",
                  fontFamily: "var(--font-inter)",
                  flexShrink: 0,
                }}>
                {integracao.status === "conectado" ? "Desconectar" : "Conectar"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── PLANO ── */}
      {tab === "plano" && (
        <div className="max-w-lg">
          <div className="p-8 rounded-2xl mb-6"
            style={{ background: "#1A0010", border: "1px solid #D81B60", boxShadow: "0 0 30px rgba(216,27,96,0.12)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>Plano ativo</p>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  Diffy — Modo Estratégico
                </h2>
              </div>
              <RocketIcon size={32} />
            </div>
            <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              Acesso Beta · Gratuito por tempo limitado
            </p>
            <div className="space-y-2">
              {["RaioX ativado", "Chat ilimitado no WhatsApp", "Painel web completo", "Financeiro, clientes, agenda", "Suporte por WhatsApp"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span style={{ color: "#D81B60" }}>✓</span>
                  <span className="text-sm text-gray-300" style={{ fontFamily: "var(--font-inter)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}>
            Cancelar assinatura
          </button>
        </div>
      )}

      {/* Modal adicionar URL */}
      {modalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#fff" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
                Adicionar link
              </h2>
              <button onClick={() => setModalUrl(false)}>
                <X size={18} style={{ color: "#9E9E9E" }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>
                  URL
                </label>
                <input
                  type="url"
                  value={urlForm.url}
                  onChange={(e) => setUrlForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#EFEFEF")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>
                  Nome (opcional)
                </label>
                <input
                  type="text"
                  value={urlForm.nome}
                  onChange={(e) => setUrlForm((f) => ({ ...f, nome: e.target.value }))}
                  placeholder="Ex: Entregável Universo Visual, Landing page..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#EFEFEF")}
                />
              </div>
              {erroDocs && (
                <p className="text-sm" style={{ color: "#C62828", fontFamily: "var(--font-inter)" }}>{erroDocs}</p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setModalUrl(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid #EFEFEF", color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                  Cancelar
                </button>
                <button
                  onClick={enviarUrl}
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
