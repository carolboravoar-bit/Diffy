"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  UserPlus,
  Search,
  LayoutGrid,
  List,
  ArrowRight,
  Clock,
  AlertTriangle,
  Users,
  X,
  Loader2,
  Trash2,
} from "lucide-react";

// ─── Tipos ──────────────────────────────────────────────────────────────────

type Fase = "prospect" | "contato" | "proposta" | "contrato";
type StatusAtiva = "ativa" | "pausada" | "renovando" | "encerrada";

interface Cliente {
  id: string;
  inedita_id: string;
  nome: string;
  profissao: string | null;
  email: string | null;
  whatsapp: string | null;
  status: StatusAtiva;
  fase_pipeline: Fase | null;
  total_sessoes: number | null;
  sessoes_realizadas: number | null;
  valor_pacote: number | null;
  observacoes: string | null;
  created_at: string;
}

// ─── Constantes visuais ──────────────────────────────────────────────────────

const fases: { key: Fase; label: string; cor: string; fundo: string }[] = [
  { key: "prospect", label: "Prospect", cor: "#9E9E9E", fundo: "#F5F5F5" },
  { key: "contato", label: "Contato feito", cor: "#F9A825", fundo: "#FFF8E1" },
  { key: "proposta", label: "Proposta enviada", cor: "#1565C0", fundo: "#E3F2FD" },
  { key: "contrato", label: "Fechando", cor: "#D81B60", fundo: "#FCE4EC" },
];

const statusConfig: Record<StatusAtiva, { label: string; cor: string; fundo: string }> = {
  ativa: { label: "Ativa", cor: "#2E7D32", fundo: "#E8F5E9" },
  pausada: { label: "Pausada", cor: "#F9A825", fundo: "#FFF8E1" },
  renovando: { label: "Renovando", cor: "#D81B60", fundo: "#FCE4EC" },
  encerrada: { label: "Encerrada", cor: "#9E9E9E", fundo: "#F5F5F5" },
};

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function AvatarLetra({ letra, cor, fundo }: { letra: string; cor: string; fundo: string }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
      style={{ background: fundo, color: cor, fontFamily: "var(--font-inter)" }}
    >
      {letra.toUpperCase()}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white animate-pulse" style={{ border: "1px solid #EFEFEF" }}>
      <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-20" />
        <div className="h-1.5 bg-gray-100 rounded w-48" />
      </div>
      <div className="hidden md:flex flex-col gap-1 items-end">
        <div className="h-3 bg-gray-100 rounded w-20" />
        <div className="h-3.5 bg-gray-100 rounded w-16" />
      </div>
    </div>
  );
}

function EmptyState({ onAdicionar }: { onAdicionar: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "#FCE4EC" }}
      >
        <Users size={32} style={{ color: "#D81B60" }} />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
          Nenhuma cliente ainda
        </p>
        <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
          Adicione sua primeira cliente para começar a organizar seu negócio.
        </p>
      </div>
      <button
        onClick={onAdicionar}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: "#D81B60", fontFamily: "var(--font-inter)", boxShadow: "0 0 12px rgba(216,27,96,0.25)" }}
      >
        <UserPlus size={15} />
        Adicionar primeira cliente
      </button>
    </div>
  );
}

function EmptyStateKanban({ onAdicionar }: { onAdicionar: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "#E3F2FD" }}
      >
        <LayoutGrid size={32} style={{ color: "#1565C0" }} />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
          Pipeline vazio
        </p>
        <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
          Clientes com etapa de pipeline definida aparecem aqui.
        </p>
      </div>
      <button
        onClick={onAdicionar}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: "#D81B60", fontFamily: "var(--font-inter)", boxShadow: "0 0 12px rgba(216,27,96,0.25)" }}
      >
        <UserPlus size={15} />
        Adicionar cliente ao pipeline
      </button>
    </div>
  );
}

// ─── Pipeline Kanban ─────────────────────────────────────────────────────────

function PipelineKanban({
  clientes,
  busca,
  onAdicionar,
  onDelete,
}: {
  clientes: Cliente[];
  busca: string;
  onAdicionar: () => void;
  onDelete: (id: string) => void;
}) {
  const pipeline = clientes.filter((c) => c.fase_pipeline !== null);
  const filtrados = pipeline.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (pipeline.length === 0) {
    return <EmptyStateKanban onAdicionar={onAdicionar} />;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-w-max">
      {fases.map((fase) => {
        const cards = filtrados.filter((c) => c.fase_pipeline === fase.key);
        return (
          <div key={fase.key} className="w-56 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ fontFamily: "var(--font-inter)", color: fase.cor }}
              >
                {fase.label}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: fase.fundo, color: fase.cor, fontFamily: "var(--font-inter)" }}
              >
                {cards.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {cards.map((c) => {
                const diasAtras = Math.floor(
                  (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-white hover:-translate-y-0.5 transition-transform cursor-pointer group relative"
                    style={{ border: "1px solid #EFEFEF" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AvatarLetra letra={c.nome[0]} cor={fase.cor} fundo={fase.fundo} />
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                        >
                          {c.nome}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}
                        >
                          {c.profissao || "Sem profissão"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} style={{ color: "#BDBDBD" }} />
                        <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                          {diasAtras === 0 ? "Hoje" : `${diasAtras}d atrás`}
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50"
                        title="Remover cliente"
                      >
                        <Trash2 size={11} style={{ color: "#D81B60" }} />
                      </button>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={onAdicionar}
                className="w-full py-2.5 rounded-xl text-xs font-medium text-center transition-all hover:border-pink-200"
                style={{ border: "1.5px dashed #E8E8E8", color: "#BDBDBD", fontFamily: "var(--font-inter)" }}
              >
                + adicionar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Prontuários lista ───────────────────────────────────────────────────────

function ProntuariosLista({
  clientes,
  busca,
  onAdicionar,
  onDelete,
}: {
  clientes: Cliente[];
  busca: string;
  onAdicionar: () => void;
  onDelete: (id: string) => void;
}) {
  // Prontuários = clientes sem fase_pipeline (são clientes ativos, não leads)
  const ativas = clientes.filter((c) => c.fase_pipeline === null);
  const filtrados = ativas.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (ativas.length === 0) {
    return <EmptyState onAdicionar={onAdicionar} />;
  }

  return (
    <div className="space-y-3">
      {filtrados.length === 0 && busca && (
        <p className="text-sm text-center py-10" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
          Nenhuma cliente encontrada para "{busca}"
        </p>
      )}
      {filtrados.map((c) => {
        const st = statusConfig[c.status] ?? statusConfig.ativa;
        const sessA = c.sessoes_realizadas ?? 0;
        const sessT = c.total_sessoes ?? 0;
        const pct = sessT > 0 ? (sessA / sessT) * 100 : 0;
        const alertaRenovacao = sessT > 0 && sessA >= sessT;
        return (
          <div
            key={c.id}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white hover:shadow-sm transition-all group"
            style={{ border: alertaRenovacao ? "1px solid #F8BBD0" : "1px solid #EFEFEF" }}
          >
            {/* Avatar */}
            <AvatarLetra letra={c.nome[0]} cor={st.cor} fundo={st.fundo} />

            {/* Info principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <Link
                  href={`/clientes/${c.id}`}
                  className="text-sm font-semibold hover:text-pink-700 transition-colors"
                  style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                >
                  {c.nome}
                </Link>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: st.fundo, color: st.cor, fontFamily: "var(--font-inter)" }}
                >
                  {st.label}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                {c.profissao || "Sem profissão"}
              </p>
              {sessT > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F5F5F5" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 80 ? "#D81B60" : "#2E7D32" }}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold flex-shrink-0"
                    style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}
                  >
                    {sessA}/{sessT} sessões
                  </span>
                </div>
              )}
            </div>

            {/* Valor do pacote */}
            {c.valor_pacote != null && (
              <div className="text-right flex-shrink-0 hidden md:block">
                <p className="text-xs mb-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                  Valor do pacote
                </p>
                <p className="text-sm font-bold" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
                  R$ {c.valor_pacote.toLocaleString("pt-BR")}
                </p>
              </div>
            )}

            {/* Alerta renovação */}
            {alertaRenovacao && (
              <div
                className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl"
                style={{ background: "#FCE4EC" }}
              >
                <AlertTriangle size={12} style={{ color: "#D81B60" }} />
                <span
                  className="text-xs font-medium"
                  style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
                >
                  Pacote encerrado
                </span>
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onDelete(c.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl hover:bg-red-50"
                title="Remover cliente"
              >
                <Trash2 size={14} style={{ color: "#D81B60" }} />
              </button>
              <Link href={`/clientes/${c.id}`}>
                <ArrowRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#D81B60" }}
                />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Modal Nova Cliente ──────────────────────────────────────────────────────

interface FormNovaCliente {
  nome: string;
  profissao: string;
  whatsapp: string;
  email: string;
  status: StatusAtiva | "prospect";
  fase_pipeline: Fase | "";
  valor_pacote: string;
  total_sessoes: string;
}

const formInicial: FormNovaCliente = {
  nome: "",
  profissao: "",
  whatsapp: "",
  email: "",
  status: "ativa",
  fase_pipeline: "",
  valor_pacote: "",
  total_sessoes: "",
};

function ModalNovaCliente({
  onClose,
  onCriada,
}: {
  onClose: () => void;
  onCriada: () => void;
}) {
  const [form, setForm] = useState<FormNovaCliente>(formInicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function campo(field: keyof FormNovaCliente, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) {
      setErro("O nome da cliente é obrigatório.");
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      const body: Record<string, unknown> = {
        nome: form.nome,
        profissao: form.profissao || null,
        whatsapp: form.whatsapp || null,
        email: form.email || null,
        status: form.status === "prospect" ? "ativa" : form.status,
        fase_pipeline: form.fase_pipeline || null,
        valor_pacote: form.valor_pacote ? Number(form.valor_pacote) : null,
        total_sessoes: form.total_sessoes ? Number(form.total_sessoes) : null,
      };
      // Se escolheu "prospect" no status, salva como prospect no pipeline
      if (form.status === "prospect" && !form.fase_pipeline) {
        body.fase_pipeline = "prospect";
        body.status = "ativa";
      }

      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Erro ao criar cliente");
      }
      onCriada();
      onClose();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(44,44,44,0.45)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden" style={{ border: "1px solid #EFEFEF" }}>
        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #EFEFEF" }}>
          <div>
            <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
              Nova cliente
            </h2>
            <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              Preencha os dados para adicionar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <X size={18} style={{ color: "#9E9E9E" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nome */}
          <div>
            <label
              className="text-xs font-semibold mb-1.5 block"
              style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
            >
              Nome <span style={{ color: "#D81B60" }}>*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => campo("nome", e.target.value)}
              placeholder="Nome da cliente"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                border: "1px solid #EFEFEF",
                background: "#F7F7F5",
                fontFamily: "var(--font-inter)",
                color: "#2C2C2C",
              }}
              required
            />
          </div>

          {/* Profissão */}
          <div>
            <label
              className="text-xs font-semibold mb-1.5 block"
              style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
            >
              Profissão
            </label>
            <input
              type="text"
              value={form.profissao}
              onChange={(e) => campo("profissao", e.target.value)}
              placeholder="Ex: Coach, Nutricionista..."
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                border: "1px solid #EFEFEF",
                background: "#F7F7F5",
                fontFamily: "var(--font-inter)",
                color: "#2C2C2C",
              }}
            />
          </div>

          {/* WhatsApp + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="text-xs font-semibold mb-1.5 block"
                style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
              >
                WhatsApp
              </label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => campo("whatsapp", e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1px solid #EFEFEF",
                  background: "#F7F7F5",
                  fontFamily: "var(--font-inter)",
                  color: "#2C2C2C",
                }}
              />
            </div>
            <div>
              <label
                className="text-xs font-semibold mb-1.5 block"
                style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
              >
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => campo("email", e.target.value)}
                placeholder="email@cliente.com"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1px solid #EFEFEF",
                  background: "#F7F7F5",
                  fontFamily: "var(--font-inter)",
                  color: "#2C2C2C",
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              className="text-xs font-semibold mb-1.5 block"
              style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
            >
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => campo("status", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all appearance-none"
              style={{
                border: "1px solid #EFEFEF",
                background: "#F7F7F5",
                fontFamily: "var(--font-inter)",
                color: "#2C2C2C",
              }}
            >
              <option value="ativa">Ativa</option>
              <option value="prospect">Prospect (pipeline)</option>
              <option value="pausada">Pausada</option>
              <option value="renovando">Renovando</option>
              <option value="encerrada">Encerrada</option>
            </select>
          </div>

          {/* Fase pipeline (só se prospect) */}
          {form.status === "prospect" && (
            <div>
              <label
                className="text-xs font-semibold mb-1.5 block"
                style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
              >
                Etapa do pipeline
              </label>
              <select
                value={form.fase_pipeline}
                onChange={(e) => campo("fase_pipeline", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all appearance-none"
                style={{
                  border: "1px solid #EFEFEF",
                  background: "#F7F7F5",
                  fontFamily: "var(--font-inter)",
                  color: "#2C2C2C",
                }}
              >
                <option value="prospect">Prospect</option>
                <option value="contato">Contato feito</option>
                <option value="proposta">Proposta enviada</option>
                <option value="contrato">Fechando</option>
              </select>
            </div>
          )}

          {/* Valor + Sessões (só se ativa) */}
          {form.status !== "prospect" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="text-xs font-semibold mb-1.5 block"
                  style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                >
                  Valor do pacote (R$)
                </label>
                <input
                  type="number"
                  value={form.valor_pacote}
                  onChange={(e) => campo("valor_pacote", e.target.value)}
                  placeholder="2400"
                  min="0"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1px solid #EFEFEF",
                    background: "#F7F7F5",
                    fontFamily: "var(--font-inter)",
                    color: "#2C2C2C",
                  }}
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold mb-1.5 block"
                  style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                >
                  Total de sessões
                </label>
                <input
                  type="number"
                  value={form.total_sessoes}
                  onChange={(e) => campo("total_sessoes", e.target.value)}
                  placeholder="8"
                  min="1"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1px solid #EFEFEF",
                    background: "#F7F7F5",
                    fontFamily: "var(--font-inter)",
                    color: "#2C2C2C",
                  }}
                />
              </div>
            </div>
          )}

          {/* Erro */}
          {erro && (
            <p className="text-xs font-medium" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
              {erro}
            </p>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-50"
              style={{
                border: "1px solid #EFEFEF",
                fontFamily: "var(--font-inter)",
                color: "#9E9E9E",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{
                background: "#D81B60",
                fontFamily: "var(--font-inter)",
                boxShadow: "0 0 12px rgba(216,27,96,0.25)",
              }}
            >
              {salvando ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              {salvando ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function ClientesPage() {
  const [tab, setTab] = useState<"prontuarios" | "pipeline">("prontuarios");
  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarClientes = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch("/api/clientes");
      if (res.ok) {
        const json = await res.json();
        setClientes(json.clientes ?? []);
      }
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  async function handleDelete(id: string) {
    if (!confirm("Remover esta cliente? Essa ação não pode ser desfeita.")) return;
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClientes((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Erro ao deletar cliente:", err);
    }
  }

  const ativas = clientes.filter((c) => c.fase_pipeline === null);
  const pipeline = clientes.filter((c) => c.fase_pipeline !== null);

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5 flex-shrink-0 bg-white"
          style={{ borderBottom: "1px solid #EFEFEF" }}
        >
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
            >
              Clientes
            </h1>
            <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              {carregando ? "Carregando..." : `${ativas.length} ativa${ativas.length !== 1 ? "s" : ""} · ${pipeline.length} no pipeline`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#F7F7F5", border: "1px solid #EFEFEF" }}
            >
              <Search size={14} style={{ color: "#BDBDBD" }} />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar..."
                className="text-sm outline-none bg-transparent w-36"
                style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
              />
            </div>
            <button
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "#D81B60",
                fontFamily: "var(--font-inter)",
                boxShadow: "0 0 12px rgba(216,27,96,0.25)",
              }}
            >
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
              <button
                key={t.key}
                onClick={() => setTab(t.key as "prontuarios" | "pipeline")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2"
                style={{
                  borderColor: active ? "#D81B60" : "transparent",
                  color: active ? "#D81B60" : "#9E9E9E",
                  fontFamily: "var(--font-inter)",
                }}
              >
                <Icon size={15} />
                {t.label}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: active ? "#FCE4EC" : "#F5F5F5",
                    color: active ? "#D81B60" : "#9E9E9E",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {carregando ? "..." : t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-auto px-8 py-5 bg-white" style={{ borderTop: "1px solid #EFEFEF" }}>
          {carregando ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <>
              {tab === "prontuarios" && (
                <ProntuariosLista
                  clientes={clientes}
                  busca={busca}
                  onAdicionar={() => setModalAberto(true)}
                  onDelete={handleDelete}
                />
              )}
              {tab === "pipeline" && (
                <PipelineKanban
                  clientes={clientes}
                  busca={busca}
                  onAdicionar={() => setModalAberto(true)}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <ModalNovaCliente
          onClose={() => setModalAberto(false)}
          onCriada={carregarClientes}
        />
      )}
    </>
  );
}
