"use client";

import { useState, useEffect, useCallback } from "react";
import { Pill } from "@/app/components/Pill";
import { RocketIcon } from "@/app/components/RocketIcon";
import { Trash2, TrendingUp, TrendingDown, Minus, Plus, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TipoLancamento = "receita" | "despesa";

interface Lancamento {
  id: string;
  tipo: TipoLancamento;
  descricao: string;
  valor: number;
  data: string;
  cliente_id: string | null;
  categoria: string | null;
  created_at: string;
}

type TabFinanceiro = "lancamentos" | "contas" | "relatorio";

const CATEGORIAS_RECEITA = ["Consultoria", "Mentoria", "Pacote", "Curso", "Palestra", "Outro"];
const CATEGORIAS_DESPESA = ["Ferramenta", "Marketing", "Educação", "Administrativo", "Pessoal", "Outro"];

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatData(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function mesLabel(iso: string) {
  const [y, m] = iso.split("-");
  const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${nomes[Number(m) - 1]} ${y}`;
}

function EmptyState({ onNovo }: { onNovo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#FCE4EC" }}>
        <TrendingUp size={28} style={{ color: "#D81B60" }} />
      </div>
      <p className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
        Nenhum lançamento ainda
      </p>
      <p className="text-sm mb-6 max-w-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
        Registre receitas e despesas para acompanhar seu financeiro em tempo real.
      </p>
      <button
        onClick={onNovo}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
      >
        <Plus size={15} />
        Registrar primeiro lançamento
      </button>
    </div>
  );
}

interface ModalProps {
  onClose: () => void;
  onSalvar: (dados: { tipo: TipoLancamento; descricao: string; valor: string; data: string; categoria: string }) => Promise<void>;
  salvando: boolean;
}

function ModalLancamento({ onClose, onSalvar, salvando }: ModalProps) {
  const hoje = new Date().toISOString().split("T")[0];
  const [tipo, setTipo] = useState<TipoLancamento>("receita");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hoje);
  const [categoria, setCategoria] = useState("");

  const categorias = tipo === "receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao.trim() || !valor || !data) return;
    await onSalvar({ tipo, descricao, valor, data, categoria });
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
        <h2
          className="text-xl font-bold mb-1"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
        >
          Novo lançamento
        </h2>
        <p className="text-sm mb-6" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
          Registre uma receita ou despesa no seu financeiro.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Toggle tipo */}
          <div className="grid grid-cols-2 gap-2">
            {(["receita", "despesa"] as TipoLancamento[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTipo(t); setCategoria(""); }}
                className="py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: tipo === t
                    ? (t === "receita" ? "#2E7D32" : "#C62828")
                    : (t === "receita" ? "#E8F5E9" : "#FFEBEE"),
                  color: tipo === t
                    ? "#fff"
                    : (t === "receita" ? "#2E7D32" : "#C62828"),
                  fontFamily: "var(--font-inter)",
                }}
              >
                {t === "receita" ? "Receita" : "Despesa"}
              </button>
            ))}
          </div>

          {/* Descrição */}
          <input
            required
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "#F5F5F5",
              border: "1px solid #E8E8E8",
              fontFamily: "var(--font-inter)",
              color: "#2C2C2C",
            }}
          />

          {/* Valor + Data lado a lado */}
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Valor (R$)"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "#F5F5F5",
                border: "1px solid #E8E8E8",
                fontFamily: "var(--font-inter)",
                color: "#2C2C2C",
              }}
            />
            <input
              required
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "#F5F5F5",
                border: "1px solid #E8E8E8",
                fontFamily: "var(--font-inter)",
                color: "#2C2C2C",
              }}
            />
          </div>

          {/* Categoria */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "#F5F5F5",
              border: "1px solid #E8E8E8",
              fontFamily: "var(--font-inter)",
              color: categoria ? "#2C2C2C" : "#9E9E9E",
            }}
          >
            <option value="">Categoria (opcional)</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

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
              {salvando ? "Salvando..." : "Lançar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FinanceiroPage() {
  const [tab, setTab] = useState<TabFinanceiro>("lancamentos");
  const [modalOpen, setModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "receita" | "despesa">("todos");
  const [erro, setErro] = useState<string | null>(null);

  const mesAtual = new Date().toISOString().slice(0, 7); // "2026-05"

  const buscarLancamentos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(`/api/lancamentos?month=${mesAtual}`);
      if (!res.ok) throw new Error("Erro ao buscar lançamentos");
      const json = await res.json();
      setLancamentos(json.lancamentos ?? []);
    } catch {
      setErro("Não foi possível carregar os lançamentos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, [mesAtual]);

  useEffect(() => {
    buscarLancamentos();
  }, [buscarLancamentos]);

  async function handleSalvar(dados: { tipo: TipoLancamento; descricao: string; valor: string; data: string; categoria: string }) {
    setSalvando(true);
    try {
      const res = await fetch("/api/lancamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: dados.tipo,
          descricao: dados.descricao,
          valor: parseFloat(dados.valor),
          data: dados.data,
          categoria: dados.categoria || null,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar lançamento");
      setModalOpen(false);
      await buscarLancamentos();
    } catch {
      // erro silencioso — manter modal aberto
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id: string) {
    try {
      const res = await fetch(`/api/lancamentos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");
      setLancamentos((prev) => prev.filter((l) => l.id !== id));
    } catch {
      // erro silencioso
    }
  }

  const totalReceitas = lancamentos.filter((l) => l.tipo === "receita").reduce((s, l) => s + l.valor, 0);
  const totalDespesas = lancamentos.filter((l) => l.tipo === "despesa").reduce((s, l) => s + l.valor, 0);
  const resultado = totalReceitas - totalDespesas;

  const lancamentosFiltrados = lancamentos.filter((l) =>
    filtro === "todos" ? true : l.tipo === filtro
  );

  // Dados do gráfico — agrupados por mês a partir dos lançamentos reais
  const dadosGrafico = (() => {
    const mapa: Record<string, { receita: number; despesa: number }> = {};
    lancamentos.forEach((l) => {
      const mes = l.data.slice(0, 7);
      if (!mapa[mes]) mapa[mes] = { receita: 0, despesa: 0 };
      if (l.tipo === "receita") mapa[mes].receita += l.valor;
      else mapa[mes].despesa += l.valor;
    });
    return Object.entries(mapa)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, vals]) => ({ mes: mesLabel(mes), ...vals }));
  })();

  const mesNome = mesLabel(mesAtual);

  return (
    <div className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Pill label="FINANCEIRO" />
          <h1
            className="text-2xl font-bold mt-2"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
          >
            Administração e Financeiro
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{
            background: "#D81B60",
            fontFamily: "var(--font-inter)",
            boxShadow: "0 0 16px rgba(216,27,96,0.3)",
          }}
        >
          <RocketIcon size={16} />
          Novo lançamento
        </button>
      </div>

      {/* KPIs do mês */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Receitas", valor: totalReceitas, cor: "#2E7D32", Icon: TrendingUp },
          { label: "Despesas", valor: totalDespesas, cor: "#C62828", Icon: TrendingDown },
          { label: "Resultado", valor: resultado, cor: resultado >= 0 ? "#D81B60" : "#C62828", Icon: resultado >= 0 ? TrendingUp : Minus },
        ].map((k) => (
          <div key={k.label} className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E8E8E8" }}>
            <div className="flex items-center gap-2 mb-2">
              <k.Icon size={14} style={{ color: k.cor }} />
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
                {k.label}
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: k.cor }}>
              {resultado < 0 && k.label === "Resultado" ? "-" : ""}R$ {formatBRL(Math.abs(k.valor))}
            </p>
            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              {mesNome}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
        style={{ background: "#F5F5F5" }}
      >
        {(["lancamentos", "contas", "relatorio"] as TabFinanceiro[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t ? "#D81B60" : "transparent",
              color: tab === t ? "#fff" : "#6B6B6B",
              fontFamily: "var(--font-inter)",
            }}
          >
            {{ lancamentos: "Lançamentos", contas: "Contas a receber", relatorio: "Relatório" }[t]}
          </button>
        ))}
      </div>

      {/* Tab: Lançamentos */}
      {tab === "lancamentos" && (
        <div>
          {carregando ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "#D81B60", borderTopColor: "transparent" }} />
            </div>
          ) : erro ? (
            <div className="text-center py-16">
              <p className="text-sm mb-3" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{erro}</p>
              <button
                onClick={buscarLancamentos}
                className="text-sm font-semibold"
                style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}
              >
                Tentar novamente
              </button>
            </div>
          ) : lancamentos.length === 0 ? (
            <EmptyState onNovo={() => setModalOpen(true)} />
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                {(["todos", "receita", "despesa"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltro(f)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: filtro === f ? "#D81B60" : "#F5F5F5",
                      color: filtro === f ? "#fff" : "#6B6B6B",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {{ todos: "Todos", receita: "Receitas", despesa: "Despesas" }[f]}
                  </button>
                ))}
              </div>

              {lancamentosFiltrados.length === 0 ? (
                <p className="text-sm py-12 text-center" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                  Nenhum lançamento nesta categoria este mês.
                </p>
              ) : (
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E8E8E8" }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#F5F5F5" }}>
                        {["Data", "Descrição", "Categoria", "Valor", ""].map((col, i) => (
                          <th
                            key={i}
                            className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lancamentosFiltrados.map((l) => (
                        <tr
                          key={l.id}
                          className="border-t hover:bg-gray-50 transition-colors group"
                          style={{ borderColor: "#F5F5F5" }}
                        >
                          <td className="px-4 py-3.5 text-sm text-gray-400 whitespace-nowrap" style={{ fontFamily: "var(--font-inter)" }}>
                            {formatData(l.data)}
                          </td>
                          <td className="px-4 py-3.5 text-sm font-medium text-gray-800" style={{ fontFamily: "var(--font-inter)" }}>
                            {l.descricao}
                          </td>
                          <td className="px-4 py-3.5">
                            {l.categoria ? (
                              <span
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ background: "#F5F5F5", color: "#6B6B6B", fontFamily: "var(--font-inter)" }}
                              >
                                {l.categoria}
                              </span>
                            ) : (
                              <span className="text-xs" style={{ color: "#BDBDBD", fontFamily: "var(--font-inter)" }}>
                                --
                              </span>
                            )}
                          </td>
                          <td
                            className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap"
                            style={{
                              fontFamily: "var(--font-inter)",
                              color: l.tipo === "receita" ? "#2E7D32" : "#C62828",
                            }}
                          >
                            {l.tipo === "despesa" ? "-" : "+"}R$ {formatBRL(l.valor)}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => handleDeletar(l.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50"
                              style={{ color: "#BDBDBD" }}
                              title="Excluir lançamento"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab: Contas a receber */}
      {tab === "contas" && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#FFF8E1" }}>
            <TrendingUp size={28} style={{ color: "#F9A825" }} />
          </div>
          <p className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Contas a receber em breve
          </p>
          <p className="text-sm max-w-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            Aqui vão aparecer os pagamentos pendentes das suas clientes, com alertas de vencimento.
          </p>
        </div>
      )}

      {/* Tab: Relatório */}
      {tab === "relatorio" && (
        <div
          className="p-6 rounded-2xl"
          style={{ background: "#fff", border: "1px solid #E8E8E8" }}
        >
          <h2
            className="text-lg font-bold mb-6"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
          >
            Receitas vs Despesas por mês
          </h2>
          {dadosGrafico.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm mb-1" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                Nenhum dado para exibir ainda.
              </p>
              <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                Lance receitas e despesas para visualizar o gráfico.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 12, fill: "#6B6B6B", fontFamily: "var(--font-inter)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6B6B6B", fontFamily: "var(--font-inter)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `R$ ${Number(value).toLocaleString("pt-BR")}`,
                    name === "receita" ? "Receita" : "Despesa",
                  ]}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E8E8E8",
                    borderRadius: "12px",
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="receita" fill="#D81B60" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesa" fill="#E8E8E8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ModalLancamento
          onClose={() => setModalOpen(false)}
          onSalvar={handleSalvar}
          salvando={salvando}
        />
      )}
    </div>
  );
}
