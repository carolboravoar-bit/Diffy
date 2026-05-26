"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, FileText, CheckCircle2,
  Clock, XCircle, Search, Filter,
  Pen, Loader2, Trash2, X,
} from "lucide-react";

type StatusContrato = "rascunho" | "enviado" | "assinado" | "cancelado";

const statusConfig: Record<StatusContrato, { label: string; cor: string; fundo: string; icon: React.ReactNode }> = {
  rascunho:  { label: "Rascunho",  cor: "#9E9E9E", fundo: "#F5F5F5",  icon: <Pen size={12} /> },
  enviado:   { label: "Enviado",   cor: "#1565C0", fundo: "#E3F2FD",  icon: <Clock size={12} /> },
  assinado:  { label: "Assinado",  cor: "#2E7D32", fundo: "#E8F5E9",  icon: <CheckCircle2 size={12} /> },
  cancelado: { label: "Cancelado", cor: "#C62828", fundo: "#FFEBEE",  icon: <XCircle size={12} /> },
};

type Contrato = {
  id: string;
  titulo: string;
  status: StatusContrato;
  valor: number | null;
  validade: string | null;
  cliente_id: string | null;
  created_at: string;
};

const STATUSES: StatusContrato[] = ["rascunho", "enviado", "assinado", "cancelado"];

function formatBRL(valor: number | null) {
  if (valor == null) return null;
  return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function formatCreatedAt(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// ─── Card ────────────────────────────────────────────────────────────────────

function ContratoCard({
  c,
  onDelete,
  onStatusChange,
}: {
  c: Contrato;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: StatusContrato) => Promise<void>;
}) {
  const st = statusConfig[c.status];
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await onDelete(c.id);
    setDeleting(false);
  }

  async function handleNextStatus() {
    const order: StatusContrato[] = ["rascunho", "enviado", "assinado"];
    const idx = order.indexOf(c.status);
    if (idx === -1 || idx === order.length - 1) return;
    setUpdatingStatus(true);
    await onStatusChange(c.id, order[idx + 1]);
    setUpdatingStatus(false);
  }

  return (
    <div
      className="flex items-center gap-5 px-6 py-4 bg-white hover:bg-gray-50 transition-colors group"
      style={{ borderBottom: "1px solid #F5F5F5", opacity: deleting ? 0.5 : 1 }}>
      {/* Ícone */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "#F7F7F5" }}>
        <FileText size={18} style={{ color: "#9E9E9E" }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold truncate"
            style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
            {c.titulo}
          </p>
          <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0"
            style={{ background: st.fundo, color: st.cor, fontFamily: "var(--font-inter)" }}>
            {st.icon}
            {st.label}
          </span>
        </div>
        <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
          Criado em {formatCreatedAt(c.created_at)}
          {c.validade && ` · Válido até ${formatDate(c.validade)}`}
        </p>
      </div>

      {/* Valor */}
      {c.valor != null && (
        <div className="text-right flex-shrink-0">
          <p className="text-base font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#D81B60" }}>
            {formatBRL(c.valor)}
          </p>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {c.status !== "assinado" && c.status !== "cancelado" && (
          <button
            onClick={handleNextStatus}
            disabled={updatingStatus}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
            style={{
              background: c.status === "rascunho" ? "#E3F2FD" : "#E8F5E9",
              color: c.status === "rascunho" ? "#1565C0" : "#2E7D32",
              fontFamily: "var(--font-inter)",
            }}>
            {updatingStatus
              ? <Loader2 size={11} className="animate-spin" />
              : c.status === "rascunho" ? "Marcar como enviado" : "Marcar como assinado"}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
          title="Excluir contrato">
          {deleting
            ? <Loader2 size={13} className="animate-spin" style={{ color: "#9E9E9E" }} />
            : <Trash2 size={13} style={{ color: "#9E9E9E" }} />}
        </button>
      </div>
    </div>
  );
}

// ─── Modal novo contrato ──────────────────────────────────────────────────────

function ModalNovoContrato({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: { titulo: string; status: StatusContrato; valor?: number; validade?: string }) => Promise<void>;
}) {
  const [titulo, setTitulo] = useState("");
  const [status, setStatus] = useState<StatusContrato>("rascunho");
  const [valor, setValor] = useState("");
  const [validade, setValidade] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitulo("");
      setStatus("rascunho");
      setValor("");
      setValidade("");
    }
  }, [open]);

  if (!open) return null;

  async function handleSave() {
    if (!titulo.trim()) return;
    setSaving(true);
    await onSave({
      titulo: titulo.trim(),
      status,
      valor: valor ? parseFloat(valor.replace(",", ".")) : undefined,
      validade: validade || undefined,
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
            Novo contrato
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
              placeholder="Ex: Mentoria Premium 8 sessoes"
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
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
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusContrato)}
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

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                Valor (R$)
              </label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: "#2C2C2C",
                  border: "1px solid #EFEFEF",
                  background: "#FAFAFA",
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              Validade (opcional)
            </label>
            <input
              type="date"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                fontFamily: "var(--font-inter)",
                color: validade ? "#2C2C2C" : "#BDBDBD",
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
            Criar contrato
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<StatusContrato | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [abaSelecionada, setAbaSelecionada] = useState<"contratos" | "modelos">("contratos");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchContratos = useCallback(async () => {
    try {
      const res = await fetch("/api/contratos");
      if (!res.ok) return;
      const json = await res.json();
      setContratos(json.data ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContratos(); }, [fetchContratos]);

  async function handleCreate(payload: { titulo: string; status: StatusContrato; valor?: number; validade?: string }) {
    const res = await fetch("/api/contratos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      setContratos((prev) => [json.data, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/contratos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setContratos((prev) => prev.filter((c) => c.id !== id));
    }
  }

  async function handleStatusChange(id: string, status: StatusContrato) {
    const res = await fetch(`/api/contratos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const json = await res.json();
      setContratos((prev) => prev.map((c) => (c.id === id ? json.data : c)));
    }
  }

  const filtrados = contratos.filter((c) => {
    const matchBusca = c.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === "todos" || c.status === filtro;
    return matchBusca && matchFiltro;
  });

  const contagens = {
    todos:     contratos.length,
    rascunho:  contratos.filter((c) => c.status === "rascunho").length,
    enviado:   contratos.filter((c) => c.status === "enviado").length,
    assinado:  contratos.filter((c) => c.status === "assinado").length,
    cancelado: contratos.filter((c) => c.status === "cancelado").length,
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 flex-shrink-0 bg-white" style={{ borderBottom: "1px solid #EFEFEF" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Contratos
            </h1>
            <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              {loading
                ? "Carregando..."
                : `${contagens.assinado} assinado${contagens.assinado !== 1 ? "s" : ""} · ${contagens.enviado} aguardando assinatura`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#F7F7F5", border: "1px solid #EFEFEF" }}>
              <Search size={14} style={{ color: "#BDBDBD" }} />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar contrato..."
                className="text-sm outline-none bg-transparent w-40"
                style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
              />
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
              <Plus size={15} />
              Novo contrato
            </button>
          </div>
        </div>

        {/* Abas principais */}
        <div className="flex gap-1">
          {[
            { key: "contratos", label: "Contratos" },
            { key: "modelos",   label: "Modelos" },
          ].map((a) => {
            const active = abaSelecionada === a.key;
            return (
              <button key={a.key}
                onClick={() => setAbaSelecionada(a.key as "contratos" | "modelos")}
                className="px-4 py-2.5 text-sm font-medium border-b-2 transition-all"
                style={{
                  borderColor: active ? "#D81B60" : "transparent",
                  color: active ? "#D81B60" : "#9E9E9E",
                  fontFamily: "var(--font-inter)",
                }}>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {abaSelecionada === "contratos" && (
          <>
            {/* Filtros */}
            <div className="flex items-center gap-2 mb-4">
              <Filter size={13} style={{ color: "#BDBDBD" }} />
              {(["todos", "rascunho", "enviado", "assinado", "cancelado"] as const).map((f) => {
                const active = filtro === f;
                const cfg = f === "todos" ? { cor: "#2C2C2C", fundo: "#F5F5F5" } : statusConfig[f];
                const count = contagens[f];
                return (
                  <button key={f} onClick={() => setFiltro(f)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                    style={{
                      background: active ? cfg.fundo : "transparent",
                      color: active ? cfg.cor : "#9E9E9E",
                      border: active ? `1px solid ${cfg.cor}30` : "1px solid transparent",
                      fontFamily: "var(--font-inter)",
                    }}>
                    {f === "todos" ? "Todos" : statusConfig[f].label}
                    <span className="font-bold">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Lista */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EFEFEF" }}>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={20} className="animate-spin" style={{ color: "#D81B60" }} />
                </div>
              ) : contratos.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <FileText size={32} style={{ color: "#E0E0E0", margin: "0 auto 12px" }} />
                  <p className="text-sm font-medium mb-1"
                    style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                    Nenhum contrato ainda.
                  </p>
                  <p className="text-xs mb-5"
                    style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                    Crie seu primeiro contrato ou modelo.
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
                    style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
                    + Novo contrato
                  </button>
                </div>
              ) : filtrados.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <FileText size={28} style={{ color: "#E0E0E0", margin: "0 auto 10px" }} />
                  <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                    Nenhum contrato encontrado
                  </p>
                </div>
              ) : (
                filtrados.map((c) => (
                  <ContratoCard
                    key={c.id}
                    c={c}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </>
        )}

        {abaSelecionada === "modelos" && (
          <div>
            <p className="text-sm mb-4" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              Modelos de contrato salvos para reutilizar a cada novo fechamento.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:border-pink-200"
                style={{ border: "2px dashed #E8E8E8", minHeight: "160px" }}>
                <Plus size={20} style={{ color: "#BDBDBD" }} />
                <span className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                  Novo contrato
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalNovoContrato
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreate}
      />
    </div>
  );
}
