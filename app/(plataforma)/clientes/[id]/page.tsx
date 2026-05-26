"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Calendar, FileText, DollarSign, Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { RocketIcon } from "@/app/components/RocketIcon";

type StatusCliente = "ativa" | "pausada" | "renovando" | "encerrada";

interface Cliente {
  id: string;
  nome: string;
  profissao: string | null;
  email: string | null;
  whatsapp: string | null;
  status: StatusCliente;
  fase_pipeline: string | null;
  total_sessoes: number;
  sessoes_realizadas: number;
  valor_pacote: number | null;
  observacoes: string | null;
  created_at: string;
}

interface Sessao {
  id: string;
  titulo: string;
  subtitulo: string | null;
  data: string;
  feito: boolean;
  tipo: string;
}

const statusConfig: Record<StatusCliente, { label: string; cor: string; fundo: string }> = {
  ativa:     { label: "Ativa",     cor: "#2E7D32", fundo: "#E8F5E9" },
  pausada:   { label: "Pausada",   cor: "#F9A825", fundo: "#FFF8E1" },
  renovando: { label: "Renovando", cor: "#D81B60", fundo: "#FCE4EC" },
  encerrada: { label: "Encerrada", cor: "#9E9E9E", fundo: "#F5F5F5" },
};

function BarraSessoes({ feitas, total }: { feitas: number; total: number }) {
  if (total === 0) return null;
  const pct = Math.min((feitas / total) * 100, 100);
  const urgente = pct >= 75;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Progresso do pacote</span>
        <span className="text-xs font-bold" style={{ fontFamily: "var(--font-inter)", color: urgente ? "#D81B60" : "#2E7D32" }}>
          {feitas}/{total} sessões
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F5F5F5" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: urgente ? "#D81B60" : "#2E7D32" }} />
      </div>
      {urgente && (
        <p className="text-xs mt-1.5 font-medium" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
          Restam {total - feitas} sessões. Hora de pensar na renovação.
        </p>
      )}
    </div>
  );
}

function SessaoCard({ s, onDelete }: { s: Sessao; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const dataFormatada = new Date(s.data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #EFEFEF" }}>
      <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ background: "#FCE4EC", color: "#D81B60", fontFamily: "var(--font-inter)" }}>
          <Calendar size={13} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{s.titulo}</p>
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{dataFormatada}</p>
        </div>
        {open ? <ChevronUp size={15} style={{ color: "#BDBDBD" }} /> : <ChevronDown size={15} style={{ color: "#BDBDBD" }} />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2">
          {s.subtitulo && (
            <div className="p-3 rounded-xl" style={{ background: "#F7F7F5" }}>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{s.subtitulo}</p>
            </div>
          )}
          <button onClick={() => onDelete(s.id)} className="text-xs flex items-center gap-1 mt-1"
            style={{ color: "#BDBDBD", fontFamily: "var(--font-inter)" }}>
            <Trash2 size={11} /> Remover
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProntuarioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [notas, setNotas] = useState("");
  const [salvandoNotas, setSalvandoNotas] = useState(false);
  const [notasSalvas, setNotasSalvas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabAtiva, setTabAtiva] = useState<"historico" | "pagamentos" | "notas">("historico");
  const [modalSessao, setModalSessao] = useState(false);
  const [novaSessao, setNovaSessao] = useState({ titulo: "", data: new Date().toISOString().split("T")[0], subtitulo: "" });
  const [salvandoSessao, setSalvandoSessao] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/clientes/${id}`).then((r) => r.json()),
      fetch(`/api/agendamentos?cliente_id=${id}`).then((r) => r.json()).catch(() => []),
    ]).then(([c, a]) => {
      if (c.error || !c.id) { router.push("/clientes"); return; }
      setCliente(c);
      setNotas(c.observacoes ?? "");
      setSessoes(Array.isArray(a) ? a.filter((x: Sessao) => x.tipo === "sessao") : []);
      setLoading(false);
    });
  }, [id, router]);

  async function salvarNotas() {
    setSalvandoNotas(true);
    await fetch(`/api/clientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ observacoes: notas }),
    });
    setSalvandoNotas(false);
    setNotasSalvas(true);
    setTimeout(() => setNotasSalvas(false), 2500);
  }

  async function adicionarSessao() {
    if (!novaSessao.titulo) return;
    setSalvandoSessao(true);
    const res = await fetch("/api/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id: id,
        titulo: novaSessao.titulo,
        subtitulo: novaSessao.subtitulo || null,
        tipo: "sessao",
        data: novaSessao.data,
      }),
    });
    const nova = await res.json();
    if (nova.id) {
      setSessoes((prev) => [nova, ...prev]);
      // Incrementa sessoes_realizadas
      await fetch(`/api/clientes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessoes_realizadas: (cliente?.sessoes_realizadas ?? 0) + 1 }),
      });
      setCliente((prev) => prev ? { ...prev, sessoes_realizadas: (prev.sessoes_realizadas ?? 0) + 1 } : prev);
    }
    setSalvandoSessao(false);
    setModalSessao(false);
    setNovaSessao({ titulo: "", data: new Date().toISOString().split("T")[0], subtitulo: "" });
  }

  async function deletarSessao(sessaoId: string) {
    await fetch(`/api/agendamentos/${sessaoId}`, { method: "DELETE" });
    setSessoes((prev) => prev.filter((s) => s.id !== sessaoId));
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="animate-pulse space-y-4 max-w-3xl">
          <div className="h-6 w-32 rounded-xl" style={{ background: "#F0F0F0" }} />
          <div className="h-20 rounded-2xl" style={{ background: "#F0F0F0" }} />
          <div className="h-48 rounded-2xl" style={{ background: "#F0F0F0" }} />
        </div>
      </div>
    );
  }

  if (!cliente) return null;

  const st = statusConfig[cliente.status] ?? statusConfig.ativa;
  const inicial = cliente.nome.charAt(0).toUpperCase();
  const dataCadastro = new Date(cliente.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-0 bg-white" style={{ borderBottom: "1px solid #EFEFEF" }}>
        <Link href="/clientes" className="flex items-center gap-1.5 text-sm mb-5 w-fit"
          style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
          <ArrowLeft size={14} /> Voltar para Clientes
        </Link>

        <div className="flex items-start gap-5 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: "#FCE4EC", color: "#D81B60", fontFamily: "var(--font-playfair)" }}>
            {inicial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>{cliente.nome}</h1>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: st.fundo, color: st.cor, fontFamily: "var(--font-inter)" }}>
                {st.label}
              </span>
            </div>
            <p className="text-sm mb-3" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              {cliente.profissao ?? "Profissão não informada"} · desde {dataCadastro}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              {cliente.whatsapp && (
                <span className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                  <Phone size={12} /> {cliente.whatsapp}
                </span>
              )}
              {cliente.email && (
                <span className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                  <Mail size={12} /> {cliente.email}
                </span>
              )}
            </div>
          </div>
          <Link href={`/conversar?contexto=cliente:${id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
            <RocketIcon size={14} />
            Falar sobre ela com a Diffy
          </Link>
        </div>

        <div className="flex gap-1">
          {[
            { key: "historico", label: "Sessões", icon: Calendar },
            { key: "pagamentos", label: "Pagamentos", icon: DollarSign },
            { key: "notas", label: "Notas privadas", icon: FileText },
          ].map(({ key, label, icon: Icon }) => {
            const active = tabAtiva === key;
            return (
              <button key={key} onClick={() => setTabAtiva(key as typeof tabAtiva)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2"
                style={{ borderColor: active ? "#D81B60" : "transparent", color: active ? "#D81B60" : "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-8 py-6 max-w-4xl">
        {/* Pacote */}
        {(cliente.total_sessoes > 0 || cliente.valor_pacote) && (
          <div className="p-5 rounded-2xl mb-6" style={{ background: "#fff", border: "1px solid #EFEFEF" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Pacote</p>
                <p className="font-bold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                  {cliente.total_sessoes > 0 ? `${cliente.total_sessoes} sessões` : "Pacote ativo"}
                </p>
              </div>
              {cliente.valor_pacote && (
                <div className="text-right">
                  <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Valor</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#D81B60" }}>
                    R$ {Number(cliente.valor_pacote).toLocaleString("pt-BR")}
                  </p>
                </div>
              )}
            </div>
            <BarraSessoes feitas={cliente.sessoes_realizadas} total={cliente.total_sessoes} />
          </div>
        )}

        {/* Tab: Sessões */}
        {tabAtiva === "historico" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                {sessoes.length} {sessoes.length === 1 ? "sessão registrada" : "sessões registradas"}
              </p>
              <button onClick={() => setModalSessao(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ color: "#D81B60", background: "#FCE4EC", fontFamily: "var(--font-inter)" }}>
                <Plus size={13} /> Nova sessão
              </button>
            </div>
            {sessoes.length === 0 ? (
              <div className="text-center py-10 rounded-2xl" style={{ border: "1px dashed #E0E0E0" }}>
                <Calendar size={28} style={{ color: "#E0E0E0", margin: "0 auto 8px" }} />
                <p className="text-sm mb-1" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>Nenhuma sessão ainda</p>
                <button onClick={() => setModalSessao(true)} className="text-xs font-semibold mt-1"
                  style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                  + Registrar primeira sessão
                </button>
              </div>
            ) : (
              sessoes.map((s) => <SessaoCard key={s.id} s={s} onDelete={deletarSessao} />)
            )}
          </div>
        )}

        {/* Tab: Pagamentos */}
        {tabAtiva === "pagamentos" && (
          <div className="text-center py-12 rounded-2xl" style={{ border: "1px dashed #E0E0E0" }}>
            <DollarSign size={28} style={{ color: "#E0E0E0", margin: "0 auto 8px" }} />
            <p className="text-sm mb-1" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>Pagamentos registrados no Financeiro</p>
            <Link href="/financeiro" className="text-xs font-semibold mt-1 inline-block"
              style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
              Ver lançamentos
            </Link>
          </div>
        )}

        {/* Tab: Notas */}
        {tabAtiva === "notas" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Notas privadas — só você vê</p>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={8}
              className="w-full rounded-2xl px-5 py-4 text-sm leading-relaxed outline-none resize-none transition-all"
              style={{ background: "#FFF8E1", border: "1.5px solid #F9A825", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
              placeholder="Anota aqui tudo que importa sobre essa cliente. Jeito de ser, o que funciona, o que não funciona, histórico relevante..."
            />
            <button onClick={salvarNotas} disabled={salvandoNotas}
              className="mt-3 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ color: notasSalvas ? "#2E7D32" : "#D81B60", background: notasSalvas ? "#E8F5E9" : "#FCE4EC", fontFamily: "var(--font-inter)" }}>
              {notasSalvas ? "Salvo!" : salvandoNotas ? "Salvando..." : "Salvar notas"}
            </button>
          </div>
        )}
      </div>

      {/* Modal nova sessão */}
      {modalSessao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 bg-white shadow-xl">
            <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Nova sessão com {cliente.nome}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Tema da sessão</label>
                <input value={novaSessao.titulo} onChange={(e) => setNovaSessao((p) => ({ ...p, titulo: e.target.value }))}
                  placeholder="Ex: Posicionamento e diferencial"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#F7F7F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E8E8")} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Data</label>
                <input type="date" value={novaSessao.data} onChange={(e) => setNovaSessao((p) => ({ ...p, data: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#F7F7F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E8E8")} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Observação (opcional)</label>
                <textarea value={novaSessao.subtitulo} onChange={(e) => setNovaSessao((p) => ({ ...p, subtitulo: e.target.value }))}
                  rows={3} placeholder="O que foi feito, próximo passo..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: "#F7F7F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E8E8")} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalSessao(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "#F5F5F5", color: "#6B6B6B", fontFamily: "var(--font-inter)" }}>
                Cancelar
              </button>
              <button onClick={adicionarSessao} disabled={salvandoSessao || !novaSessao.titulo}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
                {salvandoSessao ? "Salvando..." : "Registrar sessão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
