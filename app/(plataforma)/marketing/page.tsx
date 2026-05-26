"use client";

import { useState, useEffect, useCallback } from "react";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  Calendar, Lightbulb, ChevronLeft, ChevronRight, Plus,
  CheckCircle2, Clock, Sparkles,
  Filter, TrendingUp, Zap, Video, AlignLeft, Image,
  Trash2, X, Loader2,
} from "lucide-react";

type StatusConteudo = "ideia" | "rascunho" | "agendado" | "publicado";
type FormatoConteudo = "Reel" | "Carrossel" | "Story" | "Post" | "Live";

type Conteudo = {
  id: string;
  titulo: string;
  formato: FormatoConteudo;
  status: StatusConteudo;
  data_publicacao: string | null;
  destaque: boolean;
  created_at: string;
};

const statusConfig: Record<StatusConteudo, { label: string; cor: string; fundo: string }> = {
  ideia:     { label: "Ideia",     cor: "#9E9E9E", fundo: "#F5F5F5" },
  rascunho:  { label: "Rascunho",  cor: "#F9A825", fundo: "#FFF8E1" },
  agendado:  { label: "Agendado",  cor: "#1565C0", fundo: "#E3F2FD" },
  publicado: { label: "Publicado", cor: "#2E7D32", fundo: "#E8F5E9" },
};

const formatoIcon: Record<FormatoConteudo, React.ReactNode> = {
  Reel:      <Video size={11} />,
  Carrossel: <Image size={11} />,
  Story:     <Zap size={11} />,
  Post:      <AlignLeft size={11} />,
  Live:      <TrendingUp size={11} />,
};

const FORMATOS: FormatoConteudo[] = ["Reel", "Carrossel", "Story", "Post", "Live"];
const STATUSES: StatusConteudo[] = ["ideia", "rascunho", "agendado", "publicado"];

const ideiasDiffy = [
  {
    id: "1",
    gancho: "\"Quanto cobrei pelos meus primeiros 5 clientes e quanto deveria ter cobrado\"",
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
    gancho: "Story: mostrar um insight de sessão (anônimo) que mudou a semana de alguém",
    formato: "Story" as FormatoConteudo,
    porque: "Prova social + emoção. Gera DMs de quem quer saber mais sobre a mentoria.",
    urgencia: "fácil",
  },
  {
    id: "4",
    gancho: "\"Você não precisa de 10 mil seguidores pra fechar bem. Você precisa de 10 pessoas certas\"",
    formato: "Post" as FormatoConteudo,
    porque: "Ressoa com empreendedoras cansadas de crescer devagar e quebra a lógica de volume.",
    urgencia: "rápido",
  },
];

const urgenciaConfig: Record<string, { cor: string; fundo: string }> = {
  quente: { cor: "#D81B60", fundo: "#FCE4EC" },
  ótimo:  { cor: "#2E7D32", fundo: "#E8F5E9" },
  fácil:  { cor: "#1565C0", fundo: "#E3F2FD" },
  rápido: { cor: "#F9A825", fundo: "#FFF8E1" },
};

// ─── Calendário ─────────────────────────────────────────────────────────────

function getWeekDays(anchor: Date): Date[] {
  const d = new Date(anchor);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return dd;
  });
}

const DIAS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function formatWeekLabel(days: Date[]) {
  const first = days[0];
  const last = days[6];
  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()} a ${last.getDate()} de ${MESES_PT[first.getMonth()]} de ${first.getFullYear()}`;
  }
  return `${first.getDate()} de ${MESES_PT[first.getMonth()]} a ${last.getDate()} de ${MESES_PT[last.getMonth()]} de ${last.getFullYear()}`;
}

function toLocalDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function CalendarioSemana({
  conteudos,
  onAdd,
}: {
  conteudos: Conteudo[];
  onAdd: (dataPub?: string) => void;
}) {
  const [anchor, setAnchor] = useState(() => new Date());
  const weekDays = getWeekDays(anchor);
  const weekLabel = formatWeekLabel(weekDays);
  const todayStr = toLocalDateStr(new Date());

  const agendados = conteudos.filter((c) => c.data_publicacao != null);

  function prevWeek() {
    setAnchor((a) => { const d = new Date(a); d.setDate(d.getDate() - 7); return d; });
  }
  function nextWeek() {
    setAnchor((a) => { const d = new Date(a); d.setDate(d.getDate() + 7); return d; });
  }

  const hasAnySlot = weekDays.some((d) => {
    const ds = toLocalDateStr(d);
    return agendados.some((c) => c.data_publicacao === ds);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevWeek}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
          style={{ color: "#9E9E9E", border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)" }}>
          <ChevronLeft size={13} /> Semana anterior
        </button>
        <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
          {weekLabel}
        </p>
        <button
          onClick={nextWeek}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
          style={{ color: "#9E9E9E", border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)" }}>
          Próxima semana <ChevronRight size={13} />
        </button>
      </div>

      {!hasAnySlot && (
        <div className="text-center py-10 mb-4 rounded-2xl" style={{ background: "#F7F7F5" }}>
          <Calendar size={28} style={{ color: "#E0E0E0", margin: "0 auto 10px" }} />
          <p className="text-sm font-medium mb-1" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            Nenhum conteudo agendado esta semana
          </p>
          <p className="text-xs mb-4" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
            Agende um conteudo para aparecer no calendário.
          </p>
          <button
            onClick={() => onAdd()}
            className="text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
            + Adicionar conteudo
          </button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date) => {
          const ds = toLocalDateStr(date);
          const ehHoje = ds === todayStr;
          const slots = agendados.filter((c) => c.data_publicacao === ds);
          return (
            <div key={ds} className="flex flex-col gap-2">
              <div
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl"
                style={{ background: ehHoje ? "#FCE4EC" : "transparent" }}>
                <span className="text-xs font-medium"
                  style={{ fontFamily: "var(--font-inter)", color: ehHoje ? "#D81B60" : "#9E9E9E" }}>
                  {DIAS_PT[date.getDay()]}
                </span>
                <span className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-playfair)", color: ehHoje ? "#D81B60" : "#2C2C2C" }}>
                  {date.getDate()}
                </span>
              </div>
              <div className="space-y-1.5 min-h-[120px]">
                {slots.map((s) => {
                  const st = statusConfig[s.status];
                  return (
                    <div key={s.id} className="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ background: st.fundo, border: `1px solid ${st.cor}30` }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span style={{ color: st.cor }}>{formatoIcon[s.formato]}</span>
                        <span className="text-xs font-semibold"
                          style={{ fontFamily: "var(--font-inter)", color: st.cor }}>
                          {s.formato}
                        </span>
                      </div>
                      <p className="text-xs leading-tight"
                        style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C", fontSize: "10px" }}>
                        {s.titulo}
                      </p>
                    </div>
                  );
                })}
                {slots.length === 0 && (
                  <button
                    onClick={() => onAdd(ds)}
                    className="w-full py-3 rounded-lg text-center transition-all hover:border-pink-200 flex items-center justify-center"
                    style={{ border: "1.5px dashed #E8E8E8" }}>
                    <Plus size={12} style={{ color: "#BDBDBD" }} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

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

// ─── Banco de ideias ─────────────────────────────────────────────────────────

function BancoIdeias({
  conteudos,
  loading,
  onDelete,
  onAdd,
}: {
  conteudos: Conteudo[];
  loading: boolean;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  const [filtro, setFiltro] = useState<StatusConteudo | "todos">("todos");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtrados = filtro === "todos" ? conteudos : conteudos.filter((c) => c.status === filtro);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin" style={{ color: "#D81B60" }} />
      </div>
    );
  }

  return (
    <div>
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

      {conteudos.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ border: "2px dashed #E8E8E8" }}>
          <Lightbulb size={28} style={{ color: "#E0E0E0", margin: "0 auto 10px" }} />
          <p className="text-sm font-medium mb-1" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            Nenhuma ideia ainda.
          </p>
          <p className="text-xs mb-4" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
            Capture sua primeira ideia de conteudo.
          </p>
          <button
            onClick={onAdd}
            className="text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
            + Capturar ideia
          </button>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            Nenhuma ideia com esse status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtrados.map((item) => {
            const st = statusConfig[item.status];
            const isDeleting = deletingId === item.id;
            return (
              <div key={item.id}
                className="p-4 rounded-2xl bg-white hover:shadow-sm transition-all group"
                style={{
                  border: item.destaque ? "1px solid #F8BBD0" : "1px solid #EFEFEF",
                  opacity: isDeleting ? 0.5 : 1,
                }}>
                {item.destaque && (
                  <div className="flex items-center gap-1 mb-2">
                    <RocketIcon size={11} />
                    <span className="text-xs font-semibold"
                      style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
                      Diffy sugeriu
                    </span>
                  </div>
                )}
                <p className="text-sm font-semibold leading-snug mb-3"
                  style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
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
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                      title="Excluir">
                      {isDeleting
                        ? <Loader2 size={12} className="animate-spin" style={{ color: "#9E9E9E" }} />
                        : <Trash2 size={12} style={{ color: "#9E9E9E" }} />}
                    </button>
                  </div>
                </div>
                <p className="text-xs mt-2" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                  Adicionado em {formatDate(item.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Ideias da Diffy (estáticas) ─────────────────────────────────────────────

function IdeiasDiffy({ onSalvar }: { onSalvar: (titulo: string, formato: FormatoConteudo) => Promise<void> }) {
  const [usadas, setUsadas] = useState<Set<string>>(new Set());
  const [salvando, setSalvando] = useState<string | null>(null);

  async function handleSalvar(ideia: typeof ideiasDiffy[0]) {
    setSalvando(ideia.id);
    await onSalvar(ideia.gancho.replace(/^"|"$/g, ""), ideia.formato);
    setUsadas((prev) => new Set([...prev, ideia.id]));
    setSalvando(null);
  }

  return (
    <div>
      <div className="flex items-start gap-3 p-4 rounded-2xl mb-5"
        style={{ background: "#FCE4EC", border: "1px solid #F8BBD0" }}>
        <RocketIcon size={16} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
            Você nao publica há 5 dias
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
          const isSalvando = salvando === ideia.id;
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
                    <p className="text-xs leading-relaxed"
                      style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                      {ideia.porque}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {usada ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} style={{ color: "#2E7D32" }} />
                    <span className="text-xs font-semibold"
                      style={{ fontFamily: "var(--font-inter)", color: "#2E7D32" }}>
                      Adicionada ao banco de ideias
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleSalvar(ideia)}
                      disabled={isSalvando}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white transition-all hover:opacity-90"
                      style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
                      {isSalvando
                        ? <Loader2 size={12} className="animate-spin" />
                        : <Plus size={12} />}
                      Salvar no banco de ideias
                    </button>
                    <button className="text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:bg-gray-50"
                      style={{ color: "#9E9E9E", border: "1px solid #EFEFEF", fontFamily: "var(--font-inter)" }}>
                      Nao, proxima
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

// ─── Modal novo conteúdo ─────────────────────────────────────────────────────

function ModalNovoConteudo({
  open,
  dataPub,
  onClose,
  onSave,
}: {
  open: boolean;
  dataPub?: string;
  onClose: () => void;
  onSave: (payload: { titulo: string; formato: FormatoConteudo; status: StatusConteudo; data_publicacao?: string }) => Promise<void>;
}) {
  const [titulo, setTitulo] = useState("");
  const [formato, setFormato] = useState<FormatoConteudo>("Post");
  const [status, setStatus] = useState<StatusConteudo>("ideia");
  const [dataPubLocal, setDataPubLocal] = useState(dataPub ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitulo("");
      setFormato("Post");
      setStatus(dataPub ? "agendado" : "ideia");
      setDataPubLocal(dataPub ?? "");
    }
  }, [open, dataPub]);

  if (!open) return null;

  async function handleSave() {
    if (!titulo.trim()) return;
    setSaving(true);
    await onSave({
      titulo: titulo.trim(),
      formato,
      status,
      data_publicacao: dataPubLocal || undefined,
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid #EFEFEF" }}>
          <h2 className="text-base font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Nova ideia de conteudo
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
            <X size={16} style={{ color: "#9E9E9E" }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              Titulo *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: 3 sinais de que você está cobrando barato..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                fontFamily: "var(--font-inter)",
                color: "#2C2C2C",
                border: "1px solid #EFEFEF",
                background: "#FAFAFA",
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                Formato
              </label>
              <select
                value={formato}
                onChange={(e) => setFormato(e.target.value as FormatoConteudo)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: "#2C2C2C",
                  border: "1px solid #EFEFEF",
                  background: "#FAFAFA",
                }}>
                {FORMATOS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusConteudo)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: "#2C2C2C",
                  border: "1px solid #EFEFEF",
                  background: "#FAFAFA",
                }}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{statusConfig[s].label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              Data de publicação (opcional)
            </label>
            <input
              type="date"
              value={dataPubLocal}
              onChange={(e) => setDataPubLocal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                fontFamily: "var(--font-inter)",
                color: dataPubLocal ? "#2C2C2C" : "#BDBDBD",
                border: "1px solid #EFEFEF",
                background: "#FAFAFA",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4"
          style={{ borderTop: "1px solid #EFEFEF" }}>
          <button onClick={onClose}
            className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:bg-gray-50"
            style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!titulo.trim() || saving}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  const [tab, setTab] = useState<"calendario" | "banco" | "diffy">("calendario");
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDataPub, setModalDataPub] = useState<string | undefined>(undefined);

  const fetchConteudos = useCallback(async () => {
    try {
      const res = await fetch("/api/conteudos");
      if (!res.ok) return;
      const json = await res.json();
      setConteudos(json.data ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConteudos(); }, [fetchConteudos]);

  async function handleCreate(payload: {
    titulo: string;
    formato: FormatoConteudo;
    status: StatusConteudo;
    data_publicacao?: string;
  }) {
    const res = await fetch("/api/conteudos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      setConteudos((prev) => [json.data, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/conteudos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setConteudos((prev) => prev.filter((c) => c.id !== id));
    }
  }

  async function handleSalvarDiffy(titulo: string, formato: FormatoConteudo) {
    await handleCreate({ titulo, formato, status: "ideia", destaque: true } as Parameters<typeof handleCreate>[0]);
  }

  function openAdd(dataPub?: string) {
    setModalDataPub(dataPub);
    setModalOpen(true);
    if (dataPub) setTab("calendario");
  }

  const publicados = conteudos.filter((c) => c.status === "publicado").length;
  const agendados  = conteudos.filter((c) => c.status === "agendado").length;
  const ideias     = conteudos.filter((c) => c.status === "ideia").length;

  const tabs = [
    { key: "calendario", label: "Calendário editorial", icon: Calendar },
    { key: "banco",      label: "Banco de ideias",      icon: Lightbulb },
    { key: "diffy",      label: "Ideias da Diffy",      icon: Sparkles },
  ] as const;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 flex-shrink-0 bg-white" style={{ borderBottom: "1px solid #EFEFEF" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-0.5"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Marketing & Conteudo
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold"
                style={{ fontFamily: "var(--font-inter)", color: "#2E7D32" }}>
                {loading ? "..." : `● ${publicados} publicado${publicados !== 1 ? "s" : ""} este mes`}
              </span>
              <span className="text-xs font-semibold"
                style={{ fontFamily: "var(--font-inter)", color: "#1565C0" }}>
                {loading ? "" : `${agendados} agendado${agendados !== 1 ? "s" : ""}`}
              </span>
              <span className="text-xs"
                style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                {loading ? "" : `${ideias} ideia${ideias !== 1 ? "s" : ""} no banco`}
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
            <button
              onClick={() => { setModalDataPub(undefined); setModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
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
              <button key={t.key} onClick={() => setTab(t.key)}
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
                    style={{ background: "#FCE4EC", color: "#D81B60" }}>
                    {ideiasDiffy.length}
                  </span>
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
              <CalendarioSemana
                conteudos={conteudos}
                onAdd={(dataPub) => openAdd(dataPub)}
              />
            </div>
          )}
          {tab === "banco" && (
            <BancoIdeias
              conteudos={conteudos}
              loading={loading}
              onDelete={handleDelete}
              onAdd={() => { setModalDataPub(undefined); setModalOpen(true); }}
            />
          )}
          {tab === "diffy" && (
            <IdeiasDiffy onSalvar={handleSalvarDiffy} />
          )}
        </div>
      </div>

      <ModalNovoConteudo
        open={modalOpen}
        dataPub={modalDataPub}
        onClose={() => setModalOpen(false)}
        onSave={handleCreate}
      />
    </div>
  );
}
