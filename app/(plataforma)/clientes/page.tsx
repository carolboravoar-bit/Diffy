"use client";

import { useState } from "react";
import Link from "next/link";
import { RocketIcon } from "@/app/components/RocketIcon";
import { UserPlus, Search, LayoutGrid, List, ArrowRight, Clock, AlertTriangle } from "lucide-react";

type Fase = "prospect" | "contato" | "proposta" | "contrato";
type StatusAtiva = "ativa" | "pausada" | "renovando" | "encerrada";

const fases: { key: Fase; label: string; cor: string; fundo: string }[] = [
  { key: "prospect", label: "Prospect", cor: "#9E9E9E", fundo: "#F5F5F5" },
  { key: "contato", label: "Contato feito", cor: "#F9A825", fundo: "#FFF8E1" },
  { key: "proposta", label: "Proposta enviada", cor: "#1565C0", fundo: "#E3F2FD" },
  { key: "contrato", label: "Fechando", cor: "#D81B60", fundo: "#FCE4EC" },
];

const pipeline = [
  { id: "p1", nome: "Priscila Neves", profissao: "Personal trainer", fase: "prospect" as Fase, dias: 7, avatar: "P" },
  { id: "p2", nome: "Mariana Torres", profissao: "Consultora financeira", fase: "contato" as Fase, dias: 5, avatar: "M" },
  { id: "p3", nome: "Gabriela Pinto", profissao: "Psicóloga", fase: "contato" as Fase, dias: 2, avatar: "G" },
  { id: "p4", nome: "Beatriz Costa", profissao: "Terapeuta", fase: "proposta" as Fase, dias: 3, avatar: "B" },
  { id: "p5", nome: "Letícia Moura", profissao: "Designer", fase: "proposta" as Fase, dias: 1, avatar: "L" },
  { id: "p6", nome: "Carla Souza", profissao: "Designer", fase: "contrato" as Fase, dias: 0, avatar: "C" },
];

const ativas = [
  { id: "1", nome: "Júlia Martins", profissao: "Coach de carreira", sessoes: "5/8", proximaSessao: "Hoje, 09:00", valor: 2400, status: "ativa" as StatusAtiva, alerta: "Última sessão semana que vem" },
  { id: "2", nome: "Ana Lima", profissao: "Nutricionista", sessoes: "3/12", proximaSessao: "Amanhã, 14:00", valor: 4800, status: "ativa" as StatusAtiva, alerta: null },
  { id: "3", nome: "Fernanda Rocha", profissao: "Fotógrafa", sessoes: "2/4", proximaSessao: "Qui, 10:00", valor: 2400, status: "ativa" as StatusAtiva, alerta: "Parcela vencendo em 2 dias" },
  { id: "4", nome: "Carla Mendes", profissao: "Advogada", sessoes: "8/8", proximaSessao: "—", valor: 3200, status: "renovando" as StatusAtiva, alerta: "Renovação em aberto" },
  { id: "5", nome: "Sofia Andrade", profissao: "Médica", sessoes: "1/6", proximaSessao: "Sex, 15:00", valor: 3600, status: "ativa" as StatusAtiva, alerta: null },
];

const statusAtiva = {
  ativa: { label: "Ativa", cor: "#2E7D32", fundo: "#E8F5E9" },
  pausada: { label: "Pausada", cor: "#F9A825", fundo: "#FFF8E1" },
  renovando: { label: "Renovando", cor: "#D81B60", fundo: "#FCE4EC" },
  encerrada: { label: "Encerrada", cor: "#9E9E9E", fundo: "#F5F5F5" },
};

function AvatarLetra({ letra, cor, fundo }: { letra: string; cor: string; fundo: string }) {
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
      style={{ background: fundo, color: cor, fontFamily: "var(--font-inter)" }}>
      {letra}
    </div>
  );
}

function PipelineKanban({ busca }: { busca: string }) {
  const filtrados = pipeline.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-w-max">
      {fases.map((fase) => {
        const cards = filtrados.filter((p) => p.fase === fase.key);
        return (
          <div key={fase.key} className="w-56 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)", color: fase.cor }}>{fase.label}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ background: fase.fundo, color: fase.cor, fontFamily: "var(--font-inter)" }}>{cards.length}</span>
            </div>
            <div className="space-y-2.5">
              {cards.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-white hover:-translate-y-0.5 transition-transform cursor-pointer" style={{ border: "1px solid #EFEFEF" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AvatarLetra letra={c.avatar} cor={fase.cor} fundo={fase.fundo} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{c.nome}</p>
                      <p className="text-xs truncate" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{c.profissao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} style={{ color: "#BDBDBD" }} />
                    <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                      {c.dias === 0 ? "Hoje" : `${c.dias}d atrás`}
                    </p>
                  </div>
                </div>
              ))}
              <button className="w-full py-2.5 rounded-xl text-xs font-medium text-center transition-all hover:border-pink-200"
                style={{ border: "1.5px dashed #E8E8E8", color: "#BDBDBD", fontFamily: "var(--font-inter)" }}>
                + adicionar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProntuariosLista({ busca }: { busca: string }) {
  const filtrados = ativas.filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()));
  return (
    <div className="space-y-3">
      {filtrados.map((c) => {
        const st = statusAtiva[c.status];
        const [sessA, sessT] = c.sessoes.split("/").map(Number);
        const pct = (sessA / sessT) * 100;
        return (
          <Link key={c.id} href={`/clientes/${c.id}`}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white hover:shadow-sm transition-all group"
            style={{ border: c.alerta ? "1px solid #F8BBD0" : "1px solid #EFEFEF" }}>
            {/* Avatar */}
            <AvatarLetra letra={c.nome[0]} cor={st.cor} fundo={st.fundo} />
            {/* Info principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{c.nome}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: st.fundo, color: st.cor, fontFamily: "var(--font-inter)" }}>{st.label}</span>
              </div>
              <p className="text-xs mb-2" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{c.profissao}</p>
              {/* Barra de progresso do pacote */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F5F5F5" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 80 ? "#D81B60" : "#2E7D32" }} />
                </div>
                <span className="text-xs font-semibold flex-shrink-0" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                  {c.sessoes} sessões
                </span>
              </div>
            </div>
            {/* Próxima sessão */}
            <div className="text-right flex-shrink-0 hidden md:block">
              <p className="text-xs mb-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Próxima sessão</p>
              <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{c.proximaSessao}</p>
              <p className="text-sm font-bold mt-1" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
                R$ {c.valor.toLocaleString("pt-BR")}
              </p>
            </div>
            {/* Alerta */}
            {c.alerta && (
              <div className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl" style={{ background: "#FCE4EC" }}>
                <AlertTriangle size={12} style={{ color: "#D81B60" }} />
                <span className="text-xs font-medium" style={{ fontFamily: "var(--font-inter)", color: "#D81B60", maxWidth: "140px" }}>{c.alerta}</span>
              </div>
            )}
            <ArrowRight size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#D81B60" }} />
          </Link>
        );
      })}
    </div>
  );
}

export default function ClientesPage() {
  const [tab, setTab] = useState<"prontuarios" | "pipeline">("prontuarios");
  const [busca, setBusca] = useState("");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 flex-shrink-0 bg-white" style={{ borderBottom: "1px solid #EFEFEF" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>Clientes</h1>
          <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            {ativas.length} ativas · {pipeline.length} no pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#F7F7F5", border: "1px solid #EFEFEF" }}>
            <Search size={14} style={{ color: "#BDBDBD" }} />
            <input
              type="text" value={busca} onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar..." className="text-sm outline-none bg-transparent w-36"
              style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)", boxShadow: "0 0 12px rgba(216,27,96,0.25)" }}>
            <UserPlus size={15} />
            Nova cliente
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-8 pt-4 pb-0 flex-shrink-0 bg-white">
        {[
          { key: "prontuarios", label: "Prontuários", icon: List, count: ativas.length },
          { key: "pipeline", label: "Pipeline comercial", icon: LayoutGrid, count: pipeline.length },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key as "prontuarios" | "pipeline")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2"
              style={{
                borderColor: active ? "#D81B60" : "transparent",
                color: active ? "#D81B60" : "#9E9E9E",
                fontFamily: "var(--font-inter)",
              }}>
              <Icon size={15} />
              {t.label}
              <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: active ? "#FCE4EC" : "#F5F5F5", color: active ? "#D81B60" : "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto px-8 py-5 bg-white" style={{ borderTop: "1px solid #EFEFEF" }}>
        {tab === "prontuarios" && <ProntuariosLista busca={busca} />}
        {tab === "pipeline" && <PipelineKanban busca={busca} />}
      </div>
    </div>
  );
}
