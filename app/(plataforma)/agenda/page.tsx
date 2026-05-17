"use client";

import { useState } from "react";
import Link from "next/link";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  Plus, ChevronLeft, ChevronRight, Clock, Users,
  FileText, Bell, CheckCircle2, Circle, Calendar,
  AlertCircle, ArrowRight,
} from "lucide-react";
import { Celebracao } from "@/app/components/plataforma/Celebracao";

type TipoEvento = "sessao" | "entrega" | "followup" | "pessoal" | "lembrete";

const tipoConfig: Record<TipoEvento, { label: string; cor: string; fundo: string; icon: React.ReactNode }> = {
  sessao:   { label: "Sessão",          cor: "#D81B60", fundo: "#FCE4EC",  icon: <Users size={12} /> },
  entrega:  { label: "Entrega",         cor: "#1565C0", fundo: "#E3F2FD",  icon: <FileText size={12} /> },
  followup: { label: "Follow-up",       cor: "#2E7D32", fundo: "#E8F5E9",  icon: <ArrowRight size={12} /> },
  pessoal:  { label: "Pessoal",         cor: "#6B6B6B", fundo: "#F5F5F5",  icon: <Circle size={12} /> },
  lembrete: { label: "Lembrete",        cor: "#F9A825", fundo: "#FFF8E1",  icon: <Bell size={12} /> },
};

type Evento = {
  id: string;
  titulo: string;
  subtitulo?: string;
  tipo: TipoEvento;
  hora: string;
  data: string;
  dataLabel: string;
  feito: boolean;
  clienteId?: string;
};

const eventos: Evento[] = [
  { id: "e1",  titulo: "Sessão 6 — Júlia Martins",        subtitulo: "Tema: precificação premium", tipo: "sessao",   hora: "09:00", data: "2026-05-16", dataLabel: "Hoje",       feito: false, clienteId: "1" },
  { id: "e2",  titulo: "Entrega proposta — Ana Lima",     subtitulo: "Mentoria Intensiva 12 sessões", tipo: "entrega", hora: "14:00", data: "2026-05-16", dataLabel: "Hoje",       feito: false },
  { id: "e3",  titulo: "Call follow-up — Carla Mendes",   subtitulo: "Renovação do pacote em aberto", tipo: "followup", hora: "16:30", data: "2026-05-16", dataLabel: "Hoje",  feito: false },
  { id: "e4",  titulo: "Cobrar parcela — Fernanda Rocha", subtitulo: "Parcela 3/4 — R$ 600",          tipo: "lembrete", hora: "—",    data: "2026-05-17", dataLabel: "Amanhã",    feito: false },
  { id: "e5",  titulo: "Sessão 4 — Sofia Andrade",        subtitulo: "Tema: identidade de marca",     tipo: "sessao",   hora: "15:00", data: "2026-05-18", dataLabel: "Seg 18/05", feito: false, clienteId: "5" },
  { id: "e6",  titulo: "Sessão 7 — Júlia Martins",        subtitulo: "Posicionamento final",          tipo: "sessao",   hora: "09:00", data: "2026-05-21", dataLabel: "Qui 21/05", feito: false, clienteId: "1" },
  { id: "e7",  titulo: "Sessão 5 — Ana Lima",             subtitulo: "Estratégia de lançamento",      tipo: "sessao",   hora: "14:00", data: "2026-05-22", dataLabel: "Sex 22/05", feito: false },
  { id: "e8",  titulo: "Enviar contrato — Beatriz Costa", subtitulo: "Contrato mentoria premium 8x",  tipo: "entrega",  hora: "—",    data: "2026-05-22", dataLabel: "Sex 22/05", feito: false },
];

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const numeros = [11, 12, 13, 14, 15, 16, 17, 18];

function MiniCalendario({ diaAtivo, onChange }: { diaAtivo: number; onChange: (d: number) => void }) {
  const temEvento = (d: number) => eventos.some((e) => parseInt(e.data.split("-")[2]) === d);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button style={{ color: "#BDBDBD" }}><ChevronLeft size={14} /></button>
        <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
          Maio 2026
        </span>
        <button style={{ color: "#BDBDBD" }}><ChevronRight size={14} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["S","T","Q","Q","S","S","D"].map((d, i) => (
          <div key={i} className="text-center text-xs font-medium py-1"
            style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {/* Offset — maio começa na sexta */}
        {[...Array(4)].map((_, i) => <div key={`x${i}`} />)}
        {[...Array(31)].map((_, i) => {
          const d = i + 1;
          const active = d === diaAtivo;
          const hoje = d === 16;
          const temEv = temEvento(d);
          return (
            <button key={d} onClick={() => onChange(d)}
              className="flex flex-col items-center justify-center h-8 rounded-lg text-xs font-medium transition-all relative"
              style={{
                background: active ? "#D81B60" : "transparent",
                color: active ? "#fff" : hoje ? "#D81B60" : "#6B6B6B",
                fontFamily: "var(--font-inter)",
                fontWeight: active || hoje ? "700" : "500",
              }}>
              {d}
              {temEv && !active && (
                <span className="w-1 h-1 rounded-full absolute bottom-0.5"
                  style={{ background: active ? "#fff" : "#D81B60" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EventoCard({ ev, onToggle }: { ev: Evento; onToggle: (id: string) => void }) {
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
          {ev.hora}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold" style={{
            fontFamily: "var(--font-inter)",
            color: ev.feito ? "#BDBDBD" : "#2C2C2C",
            textDecoration: ev.feito ? "line-through" : "none",
          }}>
            {ev.titulo}
          </p>
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
            style={{ background: cfg.fundo, color: cfg.cor, fontFamily: "var(--font-inter)" }}>
            {cfg.icon}
            {cfg.label}
          </span>
        </div>
        {ev.subtitulo && (
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{ev.subtitulo}</p>
        )}
      </div>
      {ev.clienteId && (
        <Link href={`/clientes/${ev.clienteId}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold flex-shrink-0"
          style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
          Ver prontuário →
        </Link>
      )}
    </div>
  );
}

export default function AgendaPage() {
  const [diaAtivo, setDiaAtivo] = useState(16);
  const [lista, setLista] = useState(eventos);
  const [celebracao, setCelebracao] = useState<{ mensagem: string; submensagem: string } | null>(null);

  function toggle(id: string) {
    const ev = lista.find((e) => e.id === id);
    if (!ev) return;
    const tornandoFeito = !ev.feito;
    setLista((prev) => prev.map((e) => e.id === id ? { ...e, feito: !e.feito } : e));
    if (tornandoFeito && ev.tipo === "sessao") {
      const nomeCliente = ev.titulo.replace(/^Sessão \d+ — /, "");
      setCelebracao({ mensagem: "Sessão concluída!", submensagem: `Mais uma transformação com ${nomeCliente}. Continue assim.` });
    }
  }

  const grupos = lista.reduce<Record<string, Evento[]>>((acc, ev) => {
    if (!acc[ev.dataLabel]) acc[ev.dataLabel] = [];
    acc[ev.dataLabel].push(ev);
    return acc;
  }, {});

  const hoje = lista.filter((e) => e.dataLabel === "Hoje");
  const pendentesHoje = hoje.filter((e) => !e.feito).length;

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
      <div className="flex items-center justify-between px-8 py-5 flex-shrink-0 bg-white" style={{ borderBottom: "1px solid #EFEFEF" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>Agenda</h1>
          <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            {pendentesHoje} compromisso{pendentesHoje !== 1 ? "s" : ""} pendente{pendentesHoje !== 1 ? "s" : ""} hoje
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
          <Plus size={15} />
          Novo compromisso
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar esquerda — calendário + resumo */}
        <div className="w-72 flex-shrink-0 overflow-y-auto px-6 py-6 bg-white" style={{ borderRight: "1px solid #EFEFEF" }}>
          {/* Mini calendário */}
          <div className="mb-6">
            <MiniCalendario diaAtivo={diaAtivo} onChange={setDiaAtivo} />
          </div>

          {/* Resumo de hoje */}
          <div className="p-4 rounded-2xl mb-4" style={{ background: "#FCE4EC", border: "1px solid #F8BBD0" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
              Hoje — 16 de maio
            </p>
            {hoje.map((ev) => {
              const cfg = tipoConfig[ev.tipo];
              return (
                <div key={ev.id} className="flex items-center gap-2 mb-2 last:mb-0">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.cor }} />
                  <span className="text-xs font-semibold flex-shrink-0" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
                    {ev.hora}
                  </span>
                  <span className="text-xs truncate" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                    {ev.titulo.replace(/^Sessão \d+ — |^Entrega |^Call /, "")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Alerta */}
          <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "#FFF8E1", border: "1px solid #FFE082" }}>
            <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#F9A825" }} />
            <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
              Parcela da Fernanda vence amanhã. Lembrar de cobrar.
            </p>
          </div>
        </div>

        {/* Lista principal */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-2xl space-y-6">
            {Object.entries(grupos).map(([label, evs]) => (
              <div key={label}>
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-inter)", color: label === "Hoje" ? "#D81B60" : "#9E9E9E" }}>
                    {label}
                  </p>
                  <div className="flex-1 h-px" style={{ background: "#F5F5F5" }} />
                  <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                    {evs.filter((e) => !e.feito).length} pendente{evs.filter((e) => !e.feito).length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="rounded-2xl bg-white px-5" style={{ border: "1px solid #EFEFEF" }}>
                  {evs.map((ev) => (
                    <EventoCard key={ev.id} ev={ev} onToggle={toggle} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
