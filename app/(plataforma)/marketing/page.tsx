"use client";

import { useState } from "react";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  Calendar, Lightbulb, ChevronLeft, ChevronRight, Plus,
  CheckCircle2, Edit3, Clock, Sparkles,
  Filter, TrendingUp, Zap, Video, AlignLeft, Image,
} from "lucide-react";

type StatusConteudo = "ideia" | "rascunho" | "agendado" | "publicado";
type FormatoConteudo = "Reel" | "Carrossel" | "Story" | "Post" | "Live";

const statusConfig: Record<StatusConteudo, { label: string; cor: string; fundo: string }> = {
  ideia:      { label: "Ideia",      cor: "#9E9E9E", fundo: "#F5F5F5" },
  rascunho:   { label: "Rascunho",   cor: "#F9A825", fundo: "#FFF8E1" },
  agendado:   { label: "Agendado",   cor: "#1565C0", fundo: "#E3F2FD" },
  publicado:  { label: "Publicado",  cor: "#2E7D32", fundo: "#E8F5E9" },
};

const formatoIcon: Record<FormatoConteudo, React.ReactNode> = {
  Reel:      <Video size={11} />,
  Carrossel: <Image size={11} />,
  Story:     <Zap size={11} />,
  Post:      <AlignLeft size={11} />,
  Live:      <TrendingUp size={11} />,
};

const banco = [
  {
    id: "1",
    titulo: "3 sinais de que você está cobrando barato demais",
    formato: "Carrossel" as FormatoConteudo,
    status: "rascunho" as StatusConteudo,
    adicionado: "12/05",
    destaque: false,
  },
  {
    id: "2",
    titulo: "O que acontece quando você para de se comparar com outras coaches",
    formato: "Reel" as FormatoConteudo,
    status: "ideia" as StatusConteudo,
    adicionado: "11/05",
    destaque: true,
  },
  {
    id: "3",
    titulo: "Story: bastidores de uma sessão de mentoria",
    formato: "Story" as FormatoConteudo,
    status: "agendado" as StatusConteudo,
    adicionado: "10/05",
    destaque: false,
  },
  {
    id: "4",
    titulo: "O erro mais comum de coaches que querem cobrar mais caro",
    formato: "Carrossel" as FormatoConteudo,
    status: "publicado" as StatusConteudo,
    adicionado: "09/05",
    destaque: false,
  },
  {
    id: "5",
    titulo: "Por que eu não me importo mais com o número de seguidores",
    formato: "Post" as FormatoConteudo,
    status: "ideia" as StatusConteudo,
    adicionado: "08/05",
    destaque: true,
  },
  {
    id: "6",
    titulo: "Tutorial: como definir seu preço em 3 perguntas",
    formato: "Reel" as FormatoConteudo,
    status: "rascunho" as StatusConteudo,
    adicionado: "07/05",
    destaque: false,
  },
];

const ideiasDiffy = [
  {
    id: "1",
    gancho: "\"Quanto cobrei pelos meus primeiros 5 clientes — e quanto deveria ter cobrado\"",
    formato: "Carrossel" as FormatoConteudo,
    porque: "Transparência + números = alto compartilhamento. Seu público identifica com a jornada de subir o preço.",
    urgencia: "quente",
  },
  {
    id: "2",
    gancho: "\"A pergunta que faço toda cliente antes de começar a mentoria\"",
    formato: "Reel" as FormatoConteudo,
    porque: "Humaniza o processo e posiciona metodologia única sem vender diretamente.",
    urgencia: "ótimo",
  },
  {
    id: "3",
    gancho: "Story: mostrar uma insight de sessão (anônimo) que mudou a semana de alguém",
    formato: "Story" as FormatoConteudo,
    porque: "Prova social + emoção. Gera DMs de quem quer saber mais sobre a mentoria.",
    urgencia: "fácil",
  },
  {
    id: "4",
    gancho: "\"Você não precisa de 10 mil seguidores pra fechar bem. Você precisa de 10 pessoas certas\"",
    formato: "Post" as FormatoConteudo,
    porque: "Ressoa com empreendedoras cansadas de crescer devagar — quebra a lógica de volume.",
    urgencia: "rápido",
  },
];

const urgenciaConfig: Record<string, { cor: string; fundo: string }> = {
  quente: { cor: "#D81B60", fundo: "#FCE4EC" },
  ótimo:  { cor: "#2E7D32", fundo: "#E8F5E9" },
  fácil:  { cor: "#1565C0", fundo: "#E3F2FD" },
  rápido: { cor: "#F9A825", fundo: "#FFF8E1" },
};

type SlotCalendario = { formato: FormatoConteudo; status: StatusConteudo; tema: string; hora: string };
type DiaCalendario = { dia: string; data: string; slots: SlotCalendario[] };

const semanaAtual: DiaCalendario[] = [
  { dia: "Seg", data: "12", slots: [{ formato: "Carrossel", status: "publicado", tema: "3 sinais que você cobra barato", hora: "09:00" }] },
  { dia: "Ter", data: "13", slots: [] },
  { dia: "Qua", data: "14", slots: [{ formato: "Story", status: "publicado", tema: "Bastidores de sessão", hora: "18:00" }] },
  { dia: "Qui", data: "15", slots: [{ formato: "Reel", status: "agendado", tema: "O erro mais comum de coaches", hora: "12:00" }] },
  { dia: "Sex", data: "16", slots: [{ formato: "Post", status: "rascunho", tema: "Você não precisa de 10k seguidores", hora: "—" }] },
  { dia: "Sáb", data: "17", slots: [] },
  { dia: "Dom", data: "18", slots: [] },
];

function CalendarioSemana() {
  const hoje = "16";
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
          style={{ color: "#9E9E9E", border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)" }}>
          <ChevronLeft size={13} /> Semana anterior
        </button>
        <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
          12 – 18 de maio de 2026
        </p>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
          style={{ color: "#9E9E9E", border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)" }}>
          Próxima semana <ChevronRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {semanaAtual.map((d) => {
          const ehHoje = d.data === hoje;
          return (
            <div key={d.dia} className="flex flex-col gap-2">
              <div className={`flex flex-col items-center gap-0.5 py-2 rounded-xl ${ehHoje ? "" : ""}`}
                style={{ background: ehHoje ? "#FCE4EC" : "transparent" }}>
                <span className="text-xs font-medium" style={{ fontFamily: "var(--font-inter)", color: ehHoje ? "#D81B60" : "#9E9E9E" }}>
                  {d.dia}
                </span>
                <span className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: ehHoje ? "#D81B60" : "#2C2C2C" }}>
                  {d.data}
                </span>
              </div>

              <div className="space-y-1.5 min-h-[120px]">
                {d.slots.map((s, i) => {
                  const st = statusConfig[s.status];
                  return (
                    <div key={i} className="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ background: st.fundo, border: `1px solid ${st.cor}30` }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span style={{ color: st.cor }}>{formatoIcon[s.formato]}</span>
                        <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: st.cor }}>
                          {s.formato}
                        </span>
                      </div>
                      <p className="text-xs leading-tight" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C", fontSize: "10px" }}>
                        {s.tema}
                      </p>
                      {s.hora !== "—" && (
                        <div className="flex items-center gap-0.5 mt-1">
                          <Clock size={9} style={{ color: st.cor }} />
                          <span style={{ fontFamily: "var(--font-inter)", color: st.cor, fontSize: "10px" }}>{s.hora}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                {d.slots.length === 0 && (
                  <button className="w-full py-3 rounded-lg text-center transition-all hover:border-pink-200 flex items-center justify-center"
                    style={{ border: "1.5px dashed #E8E8E8" }}>
                    <Plus size={12} style={{ color: "#BDBDBD" }} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid #EFEFEF" }}>
        {Object.entries(statusConfig).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: val.cor }} />
            <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BancoIdeias() {
  const [filtro, setFiltro] = useState<StatusConteudo | "todos">("todos");
  const filtrados = filtro === "todos" ? banco : banco.filter((b) => b.status === filtro);

  return (
    <div>
      {/* Filtro */}
      <div className="flex items-center gap-2 mb-5">
        <Filter size={13} style={{ color: "#BDBDBD" }} />
        {(["todos", "ideia", "rascunho", "agendado", "publicado"] as const).map((f) => {
          const active = filtro === f;
          const cfg = f === "todos" ? { cor: "#2C2C2C", fundo: "#F5F5F5" } : statusConfig[f];
          return (
            <button key={f} onClick={() => setFiltro(f)}
              className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all capitalize"
              style={{
                background: active ? cfg.fundo : "transparent",
                color: active ? cfg.cor : "#9E9E9E",
                border: active ? `1px solid ${cfg.cor}30` : "1px solid transparent",
                fontFamily: "var(--font-inter)",
              }}>
              {f === "todos" ? "Todos" : statusConfig[f].label}
            </button>
          );
        })}
        <span className="ml-auto text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
          {filtrados.length} ideia{filtrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtrados.map((item) => {
          const st = statusConfig[item.status];
          return (
            <div key={item.id} className="p-4 rounded-2xl bg-white hover:shadow-sm transition-all cursor-pointer group"
              style={{ border: item.destaque ? "1px solid #F8BBD0" : "1px solid #EFEFEF" }}>
              {item.destaque && (
                <div className="flex items-center gap-1 mb-2">
                  <RocketIcon size={11} />
                  <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
                    Diffy sugeriu
                  </span>
                </div>
              )}
              <p className="text-sm font-semibold leading-snug mb-3" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                {item.titulo}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                    style={{ background: "#F5F5F5", color: "#6B6B6B", fontFamily: "var(--font-inter)" }}>
                    {formatoIcon[item.formato]}
                    {item.formato}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{ background: st.fundo, color: st.cor, fontFamily: "var(--font-inter)" }}>
                    {st.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button style={{ color: "#D81B60" }}><Edit3 size={13} /></button>
                  <button style={{ color: "#2E7D32" }}><CheckCircle2 size={13} /></button>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                Adicionado em {item.adicionado}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IdeiasDiffy() {
  const [usadas, setUsadas] = useState<Set<string>>(new Set());

  return (
    <div>
      <div className="flex items-start gap-3 p-4 rounded-2xl mb-5"
        style={{ background: "#FCE4EC", border: "1px solid #F8BBD0" }}>
        <RocketIcon size={16} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
            Você não publica há 5 dias
          </p>
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
            Trouxe 4 ideias prontas baseadas no seu posicionamento e nas suas clientes. Pega uma e publica hoje.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {ideiasDiffy.map((ideia) => {
          const usada = usadas.has(ideia.id);
          const u = urgenciaConfig[ideia.urgencia];
          return (
            <div key={ideia.id} className="p-5 rounded-2xl bg-white transition-all"
              style={{ border: usada ? "1.5px solid #2E7D32" : "1px solid #EFEFEF", opacity: usada ? 0.6 : 1 }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: u.fundo, color: u.cor, fontFamily: "var(--font-inter)" }}>
                      {ideia.urgencia}
                    </span>
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                      style={{ background: "#F5F5F5", color: "#6B6B6B", fontFamily: "var(--font-inter)" }}>
                      {formatoIcon[ideia.formato]}
                      {ideia.formato}
                    </span>
                  </div>
                  <p className="text-base font-semibold leading-snug mb-3"
                    style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                    {ideia.gancho}
                  </p>
                  <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "#F7F7F5" }}>
                    <Sparkles size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#D81B60" }} />
                    <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                      {ideia.porque}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {usada ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} style={{ color: "#2E7D32" }} />
                    <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2E7D32" }}>
                      Adicionada ao banco de ideias
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setUsadas((prev) => new Set([...prev, ideia.id]))}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white transition-all hover:opacity-90"
                      style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
                      <Plus size={12} /> Salvar no banco de ideias
                    </button>
                    <button className="text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:bg-gray-50"
                      style={{ color: "#9E9E9E", border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)" }}>
                      Não, próxima →
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MarketingPage() {
  const [tab, setTab] = useState<"calendario" | "banco" | "diffy">("calendario");

  const resumo = {
    publicados: banco.filter((b) => b.status === "publicado").length,
    agendados: banco.filter((b) => b.status === "agendado").length,
    ideias: banco.filter((b) => b.status === "ideia").length,
  };

  const tabs = [
    { key: "calendario", label: "Calendário editorial", icon: Calendar },
    { key: "banco",      label: "Banco de ideias",      icon: Lightbulb },
    { key: "diffy",      label: "Ideias da Diffy",      icon: Sparkles },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 flex-shrink-0 bg-white" style={{ borderBottom: "1px solid #EFEFEF" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-0.5" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Marketing & Conteúdo
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2E7D32" }}>
                ● {resumo.publicados} publicados este mês
              </span>
              <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#1565C0" }}>
                {resumo.agendados} agendados
              </span>
              <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                {resumo.ideias} ideias no banco
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("diffy")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#FCE4EC", color: "#D81B60", fontFamily: "var(--font-inter)" }}>
              <RocketIcon size={14} />
              Pedir ideia pra Diffy
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
              <Plus size={15} />
              Nova ideia
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2"
                style={{
                  borderColor: active ? "#D81B60" : "transparent",
                  color: active ? "#D81B60" : "#9E9E9E",
                  fontFamily: "var(--font-inter)",
                }}>
                <Icon size={14} />
                {t.label}
                {t.key === "diffy" && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: "#FCE4EC", color: "#D81B60" }}>4</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-5xl">
          {tab === "calendario" && (
            <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
              <CalendarioSemana />
            </div>
          )}
          {tab === "banco" && <BancoIdeias />}
          {tab === "diffy" && <IdeiasDiffy />}
        </div>
      </div>
    </div>
  );
}
