"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ChevronRight, Plus, Trash2, FileText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Inedita {
  id: string;
  nome: string | null;
  email: string | null;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [ineditas, setIneditas] = useState<Inedita[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    const res = await fetch("/api/admin/ineditas");
    const data = await res.json();
    setIneditas(data.ineditas ?? []);
    setCarregando(false);
  }

  useEffect(() => { carregar(); }, []);

  async function criarInedita(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    const res = await fetch("/api/admin/ineditas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      setErro(data.error);
      setSalvando(false);
      return;
    }
    setModalAberto(false);
    setForm({ nome: "", email: "", senha: "" });
    carregar();
    setSalvando(false);
  }

  async function deletar(id: string, nome: string) {
    if (!confirm(`Deletar ${nome}? Esta ação remove o acesso dela e todos os documentos.`)) return;
    await fetch(`/api/admin/ineditas?id=${id}`, { method: "DELETE" });
    carregar();
  }

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
          >
            Inéditas
          </h1>
          <p className="text-sm mt-1" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
            Gerencie os acessos e documentos de cada cliente
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
          >
            <Plus size={16} />
            Nova inédita
          </button>
          <button
            onClick={sair}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "#fff", border: "1px solid #EFEFEF", color: "#9E9E9E", fontFamily: "var(--font-inter)" }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>

      {/* Lista */}
      {carregando ? (
        <p style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>Carregando...</p>
      ) : ineditas.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{ background: "#fff", border: "1px solid #EFEFEF" }}
        >
          <Users size={40} style={{ color: "#EFEFEF" }} />
          <p className="mt-4 text-sm" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
            Nenhuma inédita ainda. Cria a primeira!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ineditas.map((i) => (
            <div
              key={i.id}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: "#fff", border: "1px solid #EFEFEF" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
                style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
              >
                {(i.nome ?? i.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>
                  {i.nome ?? "(sem nome)"}
                </p>
                <p className="text-xs truncate" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                  {i.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/ineditas/${i.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: "#F7F7F5", color: "#2C2C2C", fontFamily: "var(--font-inter)" }}
                >
                  <FileText size={13} />
                  Documentos
                </Link>
                <button
                  onClick={() => deletar(i.id, i.nome ?? i.email ?? "esta inédita")}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                  style={{ color: "#9E9E9E" }}
                >
                  <Trash2 size={15} />
                </button>
                <Link href={`/admin/ineditas/${i.id}`}>
                  <ChevronRight size={16} style={{ color: "#9E9E9E" }} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal nova inédita */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#fff" }}>
            <h2
              className="text-xl font-bold mb-5"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
            >
              Nova inédita
            </h2>
            <form onSubmit={criarInedita} className="space-y-4">
              {[
                { label: "Nome", key: "nome", type: "text", placeholder: "Ana Paula" },
                { label: "Email", key: "email", type: "email", placeholder: "ana@email.com" },
                { label: "Senha", key: "senha", type: "password", placeholder: "Mínimo 8 caracteres" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#2C2C2C", fontFamily: "var(--font-inter)" }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    required
                    placeholder={placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#EFEFEF")}
                  />
                </div>
              ))}

              {erro && (
                <p className="text-sm" style={{ color: "#C62828", fontFamily: "var(--font-inter)" }}>{erro}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setModalAberto(false); setErro(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid #EFEFEF", color: "#9E9E9E", fontFamily: "var(--font-inter)" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60"
                  style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
                >
                  {salvando ? "Criando..." : "Criar acesso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
