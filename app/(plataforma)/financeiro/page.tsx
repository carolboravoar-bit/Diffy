"use client";

import { useState } from "react";
import { Pill } from "@/app/components/Pill";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const lancamentosMock = [
  { id: 1, tipo: "receita", descricao: "Sessão — Júlia Martins", valor: 600, data: "2026-05-15", cliente: "Júlia Martins", categoria: "Consultoria" },
  { id: 2, tipo: "receita", descricao: "Pacote 4 sessões — Ana Lima", valor: 2400, data: "2026-05-14", cliente: "Ana Lima", categoria: "Pacote" },
  { id: 3, tipo: "despesa", descricao: "Canva Pro", valor: 89, data: "2026-05-13", cliente: null, categoria: "Ferramenta" },
  { id: 4, tipo: "receita", descricao: "Sessão — Carla Souza", valor: 600, data: "2026-05-12", cliente: "Carla Souza", categoria: "Consultoria" },
  { id: 5, tipo: "despesa", descricao: "Instagram Ads", valor: 300, data: "2026-05-10", cliente: null, categoria: "Marketing" },
  { id: 6, tipo: "receita", descricao: "Mentoria avulsa — Beatriz", valor: 800, data: "2026-05-08", cliente: "Beatriz Costa", categoria: "Mentoria" },
  { id: 7, tipo: "despesa", descricao: "Diffy — assinatura", valor: 88, data: "2026-05-01", cliente: null, categoria: "Ferramenta" },
];

const comparativo = [
  { mes: "Mar", receita: 4900, despesa: 1200 },
  { mes: "Abr", receita: 7200, despesa: 1800 },
  { mes: "Mai", receita: 8100, despesa: 1650 },
];

const contasAReceber = [
  { cliente: "Fernanda Rocha", valor: 600, vencimento: "2026-05-19", parcela: "2/4" },
  { cliente: "Júlia Martins", valor: 600, vencimento: "2026-05-22", parcela: "1/1" },
  { cliente: "Ana Lima", valor: 600, vencimento: "2026-05-28", parcela: "2/4" },
];

type TabFinanceiro = "lancamentos" | "contas" | "relatorio";

export default function FinanceiroPage() {
  const [tab, setTab] = useState<TabFinanceiro>("lancamentos");
  const [modalOpen, setModalOpen] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | "receita" | "despesa">("todos");

  const totalReceitas = lancamentosMock.filter((l) => l.tipo === "receita").reduce((s, l) => s + l.valor, 0);
  const totalDespesas = lancamentosMock.filter((l) => l.tipo === "despesa").reduce((s, l) => s + l.valor, 0);
  const resultado = totalReceitas - totalDespesas;

  const lancamentosFiltrados = lancamentosMock.filter((l) =>
    filtro === "todos" ? true : l.tipo === filtro
  );

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
          Lançar por áudio
        </button>
      </div>

      {/* KPIs do mês */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Receitas", valor: totalReceitas, cor: "#2E7D32", fundo: "#E8F5E9" },
          { label: "Despesas", valor: totalDespesas, cor: "#C62828", fundo: "#FFEBEE" },
          { label: "Resultado", valor: resultado, cor: resultado >= 0 ? "#D81B60" : "#C62828", fundo: resultado >= 0 ? "#FCE4EC" : "#FFEBEE" },
        ].map((k) => (
          <div key={k.label} className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E8E8E8" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
              {k.label}
            </p>
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: k.cor }}>
              R$ {k.valor.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              Maio 2026
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
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E8E8E8" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#F5F5F5" }}>
                  {["Data", "Descrição", "Cliente", "Categoria", "Valor"].map((col) => (
                    <th
                      key={col}
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
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#F5F5F5" }}
                  >
                    <td className="px-4 py-3.5 text-sm text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
                      {new Date(l.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800" style={{ fontFamily: "var(--font-inter)" }}>
                      {l.descricao}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500" style={{ fontFamily: "var(--font-inter)" }}>
                      {l.cliente ?? "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: "#F5F5F5",
                          color: "#6B6B6B",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {l.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: l.tipo === "receita" ? "#2E7D32" : "#C62828" }}>
                      {l.tipo === "despesa" ? "−" : "+"}R$ {l.valor.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Contas a receber */}
      {tab === "contas" && (
        <div className="space-y-3">
          {contasAReceber.map((c, i) => {
            const diasRestantes = Math.ceil((new Date(c.vencimento).getTime() - Date.now()) / 86400000);
            const urgente = diasRestantes <= 3;
            return (
              <div
                key={i}
                className="flex items-center justify-between p-5 rounded-2xl"
                style={{
                  background: "#fff",
                  border: `1px solid ${urgente ? "#F8BBD0" : "#E8E8E8"}`,
                  boxShadow: urgente ? "0 0 12px rgba(216,27,96,0.08)" : "none",
                }}
              >
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                    {c.cliente}
                  </p>
                  <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    Parcela {c.parcela} · Vence {new Date(c.vencimento).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className="font-bold text-lg"
                    style={{ fontFamily: "var(--font-playfair)", color: urgente ? "#D81B60" : "#2C2C2C" }}
                  >
                    R$ {c.valor.toLocaleString("pt-BR")}
                  </p>
                  <button
                    className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:opacity-80"
                    style={{
                      background: "#FCE4EC",
                      color: "#D81B60",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    Cobrar
                  </button>
                </div>
              </div>
            );
          })}
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
            Receitas vs Despesas — últimos 3 meses
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparativo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#6B6B6B", fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B6B6B", fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value, name) => [
                  `R$ ${Number(value).toLocaleString("pt-BR")}`,
                  name === "receita" ? "Receita" : "Despesa",
                ]}
                contentStyle={{ background: "#fff", border: "1px solid #E8E8E8", borderRadius: "12px", fontFamily: "var(--font-inter)", fontSize: "13px" }}
              />
              <Bar dataKey="receita" fill="#D81B60" radius={[6, 6, 0, 0]} />
              <Bar dataKey="despesa" fill="#E8E8E8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Modal de lançamento rápido */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div
            className="w-full max-w-md p-8 rounded-2xl"
            style={{ background: "#fff", border: "1px solid #E8E8E8" }}
          >
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
            >
              Lançamento rápido
            </h2>
            <p className="text-sm text-gray-400 mb-6" style={{ fontFamily: "var(--font-inter)" }}>
              Fale com a Diffy pra lançar por áudio, ou preenche aqui.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {["Receita", "Despesa"].map((tipo) => (
                  <button
                    key={tipo}
                    className="py-3 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: tipo === "Receita" ? "#E8F5E9" : "#FFEBEE",
                      color: tipo === "Receita" ? "#2E7D32" : "#C62828",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
              {["Descrição", "Valor (R$)", "Cliente (opcional)"].map((f) => (
                <input
                  key={f}
                  placeholder={f}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "#F5F5F5",
                    border: "1px solid #E8E8E8",
                    fontFamily: "var(--font-inter)",
                    color: "#2C2C2C",
                  }}
                />
              ))}
              <div className="flex gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: "#F5F5F5", color: "#6B6B6B", fontFamily: "var(--font-inter)" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
                >
                  Lançar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
