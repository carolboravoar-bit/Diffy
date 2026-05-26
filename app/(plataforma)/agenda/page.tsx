"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, ChevronLeft, ChevronRight, X,
  Users, FileText, Bell, CheckCircle2, Circle,
  ArrowRight, Calendar,
} from "lucide-react";
import { Celebracao } from "@/app/components/plataforma/Celebracao";

type TipoEvento = "sessao" | "entrega" | "followup" | "pessoal" | "lembrete";

const tipoConfig: Record<TipoEvento, { label: string; cor: string; fundo: string; icon: React.ReactNode }> = {
  sessao:   { label: "Sessao",    cor: "#D81B60", fundo: "#FCE4EC",  icon: <Users size={12} /> },
  entrega:  { label: "Entrega",   cor: "#1565C0", fundo: "#E3F2FD",  icon: <FileText size={12} /> },
  followup: { label: "Follow-up", cor: "#2E7D32", fundo: "#E8F5E9",  icon: <ArrowRight size={12} /> },
  pessoal:  { label: "Pessoal",   cor: "#6B6B6B", fundo: "#F5F5F5",  icon: <Circle size={12} /> },
  lembrete: { label: "Lembrete",  cor: "#F9A825", fundo: "#FFF8E1",  icon: <Bell size={12} /> },
};

interface Agendamento {
  id: string;
  titulo: string;
  subtitulo: string | null;
  tipo: TipoEvento;
  hora: string | null;
  data: string;
  feito: boolean;
  cliente_id: string | null;
}

// ------- helpers de data -------

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function diasNoMes(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

// offset de dia da semana (0=seg, 6=dom) para o dia 1 do mês
function offsetMes(year: number, month: number) {
  const jsDay = new Date(year, month - 1, 1).getDay(); // 0=dom
  return jsDay === 0 ? 6 : jsDay - 1;
}

function labelDia(iso: string, hoje: string): string {
  if (iso === hoje) return "Hoje";
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  if (iso === amanha.toISOString().split("T")[0]) return "Amanha";
  const [, m, d] = iso.split("-");
  const semana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];
  const jsDay = new Date(iso + "T00:00:00").getDay();
  return `${semana[jsDay]} ${d}/${m}`;
}

const MESES = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

// ------- MiniCalendario -------

function MiniCalendario({
  year, month, diaAtivo, onChange, onMes, datasComEvento,
}: {
  year: number;
  month: number;
  diaAtivo: number;
  onChange: (d: number) => void;
  onMes: (delta: -1 | 1) => void;
  datasComEvento: Set<string>;
}) {
  const total = diasNoMes(year, month);
  const offset = offsetMes(year, month);
  const hoje = new Date().toISOString().split("T")[0];
  const [hojeY, hojeM, hojeD] = hoje.split("-").map(Number);
  const ehMesAtual = year === hojeY && month === hojeM;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onMes(-1)} style={{ color: "#BDBDBD" }}>
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
          {MESES[month - 1]} {year}
        </span>
        <button onClick={() => onMes(1)} style={{ color: "#BDBDBD" }}>
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["S","T","Q","Q","S","S","D"].map((d, i) => (
          <div key={i} className="text-center text-xs font-medium py-1" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {[...Array(offset)].map((_, i) => <div key={`x${i}`} />)}
        {[...Array(total)].map((_, i) => {
          const d = i + 1;
          const iso = toISO(year, month, d);
          const active = d === diaAtivo;
          const isHoje = ehMesAtual && d === hojeD;
          const temEv = datasComEvento.has(iso);
          return (
            <button
              key={d}
              onClick={() => onChange(d)}
              className="flex flex-col items-center justify-center h-8 rounded-lg text-xs font-medium transition-all relative"
              style={{
                background: active ? "#D81B60" : "transparent",
                color: active ? "#fff" : isHoje ? "#D81B60" : "#6B6B6B",
                fontFamily: "var(--font-inter)",
                fontWeight: active || isHoje ? "700" : "500",
              }}
            >
              {d}
              {temEv && !active && (
                <span
                  className="w-1 h-1 rounded-full absolute bottom-0.5"
                  style={{ background: "#D81B60" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ------- EventoCard -------

function EventoCard({
  ev,
  onToggle,
}: {
  ev: Agendamento;
  onToggle: (id: string) => void;
}) {
  const cfg = tipoConfig[ev.tipo];
  return (
    <div className="flex items-start gap-3 py-3 group" style={{ borderBottom: "1px solid #F5F5F5" }}>
      <button onClick={() => onToggle(ev.id)} className="flex-shrink-0 mt-0.5">
        {ev.feito
          ? <CheckCircle2 size={17} style={{ color: "#D81B60" }} />
          : <Circle size={17} style={{ color: "#E0E0E0" }} />}
      </button>
      <div className="w-14 text-right flex-shrink-0">
        <span className="text-xs font-bold" style={{ fontFamily: "var(--font-inter)", color: ev.feito ? "#BDBDBD" : "#2C2C2C" }}>
          {ev.hora ?? "--:--"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p
            className="text-sm font-semibold"
            style={{
              fontFamily: "var(--font-inter)",
              color: ev.feito ? "#BDBDBD" : "#2C2C2C",
              textDecoration: ev.feito ? "line-through" : "none",
            }}
          >
            {ev.titulo}
          </p>
          <span
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
            style={{ background: cfg.fundo, color: cfg.cor, fontFamily: "var(--font-inter)" }}
          >
            {cfg.icon}
            {cfg.label}
          </span>
        </div>
        {ev.subtitulo && (
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            {ev.subtitulo}
          </p>
        )}
      </div>
      {ev.cliente_id && (
        <Link
          href={`/clientes/${ev.cliente_id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold flex-shrink-0"
          style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}
        >
          Ver prontuario
        </Link>
      )}
    </div>
  );
}

// ------- Modal -------

interface ModalAgendaProps {
  diaPreSelecionado: string;
  onClose: () => void;
  onSalvar: (dados: {
    titulo: string;
    subtitulo: string;
    tipo: TipoEvento;
    data: string;
    hora: string;
  }) => Promise<void>;
  salvando: boolean;
}

function ModalAgendamento({ diaPreSelecionado, onClose, onSalvar, salvando }: ModalAgendaProps) {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [tipo, setTipo] = useState<TipoEvento>("sessao");
  const [data, setData] = useState(diaPreSelecionado);
  const [hora, setHora] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !data) return;
    await onSalvar({ titulo, subtitulo, tipo, data, hora });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div
        className="w-full max-w-md p-8 rounded-2xl relative"
        style={{ background: "#fff", border: "1px solid #E8E8E8" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: "#9E9E9E" }}
        >
          <X size={16} />
        </button>
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
          Novo compromisso
        </h2>
        <p className="text-sm mb-6" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
          Adicione um compromisso na sua agenda.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="flex flex-wrap gap-2">
            {(Object.entries(tipoConfig) as [TipoEvento, typeof tipoConfig[TipoEvento]][]).map(([t, cfg]) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: tipo === t ? cfg.cor : cfg.fundo,
                  color: tipo === t ? "#fff" : cfg.cor,
                  fontFamily: "var(--font-inter)",
                }}
              >
                {cfg.icon}
                {cfg.label}
              </button>
            ))}
          </div>

          {/* Titulo */}
          <input
            required
            placeholder="Titulo do compromisso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "#F5F5F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
          />

          {/* Subtitulo */}
          <input
            placeholder="Subtitulo (opcional)"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "#F5F5F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
          />

          {/* Data + Hora */}
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#F5F5F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
            />
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              placeholder="Horario (opcional)"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#F5F5F5", border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", color: hora ? "#2C2C2C" : "#9E9E9E" }}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "#F5F5F5", color: "#6B6B6B", fontFamily: "var(--font-inter)" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
            >
              {salvando ? "Salvando..." : "Agendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ------- Page -------

export default function AgendaPage() {
  const hoje = new Date().toISOString().split("T")[0];
  const [hojeY, hojeM, hojeD] = hoje.split("-").map(Number);

  const [calYear, setCalYear] = useState(hojeY);
  const [calMonth, setCalMonth] = useState(hojeM);
  const [diaAtivo, setDiaAtivo] = useState(hojeD);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [celebracao, setCelebracao] = useState<{ mensagem: string; submensagem: string } | null>(null);

  function navegarMes(delta: -1 | 1) {
    let m = calMonth + delta;
    let y = calYear;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setCalMonth(m);
    setCalYear(y);
  }

  const buscarAgendamentos = useCallback(async () => {
    setCarregando(true);
    try {
      // Busca 3 meses ao redor para o calendário
      const inicio = toISO(calYear, calMonth === 1 ? 12 : calMonth - 1, 1);
      const fimAno = calMonth === 12 ? calYear + 1 : calYear;
      const fimMes = calMonth === 12 ? 1 : calMonth + 1;
      const fim = toISO(fimAno, fimMes, diasNoMes(fimAno, fimMes));
      const res = await fetch(`/api/agendamentos?data_inicio=${inicio}&data_fim=${fim}`);
      if (!res.ok) throw new Error("Erro");
      const json = await res.json();
      setAgendamentos(json.agendamentos ?? []);
    } catch {
      // silencioso
    } finally {
      setCarregando(false);
    }
  }, [calYear, calMonth]);

  useEffect(() => {
    buscarAgendamentos();
  }, [buscarAgendamentos]);

  async function handleToggle(id: string) {
    const ev = agendamentos.find((e) => e.id === id);
    if (!ev) return;
    const novoFeito = !ev.feito;

    // Otimista
    setAgendamentos((prev) => prev.map((e) => e.id === id ? { ...e, feito: novoFeito } : e));

    try {
      await fetch(`/api/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feito: novoFeito }),
      });
    } catch {
      // reverte se falhar
      setAgendamentos((prev) => prev.map((e) => e.id === id ? { ...e, feito: !novoFeito } : e));
      return;
    }

    if (novoFeito && ev.tipo === "sessao") {
      const nomeCliente = ev.titulo.replace(/^Sessao \d+ [—-] /, "");
      setCelebracao({
        mensagem: "Sessao concluida!",
        submensagem: `Mais uma transformacao com ${nomeCliente}. Continue assim.`,
      });
    }
  }

  async function handleSalvar(dados: { titulo: string; subtitulo: string; tipo: TipoEvento; data: string; hora: string }) {
    setSalvando(true);
    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: dados.titulo,
          subtitulo: dados.subtitulo || null,
          tipo: dados.tipo,
          data: dados.data,
          hora: dados.hora || null,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar agendamento");
      setModalOpen(false);
      await buscarAgendamentos();
    } catch {
      // silencioso
    } finally {
      setSalvando(false);
    }
  }

  // Dados derivados
  const datasComEvento = new Set(agendamentos.map((e) => e.data));

  const dataAtiva = toISO(calYear, calMonth, diaAtivo);
  const evsDiaAtivo = agendamentos
    .filter((e) => e.data === dataAtiva)
    .sort((a, b) => (a.hora ?? "99:99").localeCompare(b.hora ?? "99:99"));

  const evsDiasAgrupados = agendamentos
    .filter((e) => e.data >= hoje)
    .reduce<Record<string, Agendamento[]>>((acc, ev) => {
      if (!acc[ev.data]) acc[ev.data] = [];
      acc[ev.data].push(ev);
      return acc;
    }, {});

  const evsHoje = agendamentos.filter((e) => e.data === hoje);
  const pendentesHoje = evsHoje.filter((e) => !e.feito).length;
  const diaAtivoISO = toISO(calYear, calMonth, diaAtivo);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {celebracao && (
        <Celebracao
          mensagem={celebracao.mensagem}
          submensagem={celebracao.submensagem}
          onFim={() => setCelebracao(null)}
        />
      )}

      {/* Header */}
      <div
        className="flex items-center justify-between px-8 py-5 flex-shrink-0 bg-white"
        style={{ borderBottom: "1px solid #EFEFEF" }}
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Agenda
          </h1>
          <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            {carregando
              ? "Carregando..."
              : `${pendentesHoje} compromisso${pendentesHoje !== 1 ? "s" : ""} pendente${pendentesHoje !== 1 ? "s" : ""} hoje`}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
        >
          <Plus size={15} />
          Novo compromisso
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar esquerda */}
        <div
          className="w-72 flex-shrink-0 overflow-y-auto px-6 py-6 bg-white"
          style={{ borderRight: "1px solid #EFEFEF" }}
        >
          {/* Mini calendário */}
          <div className="mb-6">
            <MiniCalendario
              year={calYear}
              month={calMonth}
              diaAtivo={diaAtivo}
              onChange={setDiaAtivo}
              onMes={navegarMes}
              datasComEvento={datasComEvento}
            />
          </div>

          {/* Resumo do dia ativo */}
          {evsDiaAtivo.length > 0 ? (
            <div
              className="p-4 rounded-2xl mb-4"
              style={{ background: "#FCE4EC", border: "1px solid #F8BBD0" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
              >
                {diaAtivoISO === hoje ? "Hoje" : `Dia ${diaAtivo}`}
              </p>
              {evsDiaAtivo.map((ev) => {
                const cfg = tipoConfig[ev.tipo];
                return (
                  <div key={ev.id} className="flex items-center gap-2 mb-2 last:mb-0">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.cor }} />
                    <span className="text-xs font-semibold flex-shrink-0" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
                      {ev.hora ?? "--"}
                    </span>
                    <span className="text-xs truncate" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                      {ev.titulo}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="p-4 rounded-2xl mb-4"
              style={{ background: "#F5F5F5", border: "1px solid #EFEFEF" }}
            >
              <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                Nenhum compromisso neste dia.
              </p>
            </div>
          )}
        </div>

        {/* Lista principal */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {carregando ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "#D81B60", borderTopColor: "transparent" }} />
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "#FCE4EC" }}
              >
                <Calendar size={28} style={{ color: "#D81B60" }} />
              </div>
              <p className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
                Nenhum compromisso ainda
              </p>
              <p className="text-sm mb-6 max-w-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                Que tal agendar sua proxima sessao?
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
              >
                <Plus size={15} />
                Novo agendamento
              </button>
            </div>
          ) : (
            <div className="max-w-2xl space-y-6">
              {Object.entries(evsDiasAgrupados)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([data, evs]) => {
                  const label = labelDia(data, hoje);
                  const pendentes = evs.filter((e) => !e.feito).length;
                  return (
                    <div key={data}>
                      <div className="flex items-center gap-3 mb-3">
                        <p
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{
                            fontFamily: "var(--font-inter)",
                            color: data === hoje ? "#D81B60" : "#9E9E9E",
                          }}
                        >
                          {label}
                        </p>
                        <div className="flex-1 h-px" style={{ background: "#F5F5F5" }} />
                        <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                          {pendentes} pendente{pendentes !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="rounded-2xl bg-white px-5" style={{ border: "1px solid #EFEFEF" }}>
                        {evs
                          .sort((a, b) => (a.hora ?? "99:99").localeCompare(b.hora ?? "99:99"))
                          .map((ev) => (
                            <EventoCard key={ev.id} ev={ev} onToggle={handleToggle} />
                          ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ModalAgendamento
          diaPreSelecionado={diaAtivoISO}
          onClose={() => setModalOpen(false)}
          onSalvar={handleSalvar}
          salvando={salvando}
        />
      )}
    </div>
  );
}
