"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Calendar, FileText, DollarSign, Plus, ChevronDown, ChevronUp, RocketIcon as _R } from "lucide-react";
import { RocketIcon } from "@/app/components/RocketIcon";

// Mock — em produção vem do Supabase por params.id
const cliente = {
  id: "1",
  nome: "Júlia Martins",
  profissao: "Coach de carreira",
  email: "julia@email.com",
  telefone: "(11) 98765-4321",
  instagram: "@juliacoach",
  iniciou: "12 de março de 2026",
  pacote: "Mentoria Premium — 8 sessões",
  sessoesFeitas: 5,
  sessoesTotal: 8,
  valorTotal: 2400,
  valorRecebido: 1800,
  status: "ativa",
  proximaAcao: "Sessão 6 — tema: precificação premium. Revisar exercício da semana passada antes de entrar.",
  notas: "Júlia é coach de transição de carreira. Trabalha bem com metáforas. Sensível a comparações com outras coaches. Responde bem quando eu conto casos de alunas dela.",
  historico: [
    { sessao: 5, data: "14/05/2026", tema: "Posicionamento e diferencial", feito: "Mapeamos os 3 concorrentes dela e encontramos o gap de mercado. Ela saiu com clareza do que ninguém mais entrega.", proximo: "Criar proposta premium com novo posicionamento." },
    { sessao: 4, data: "07/05/2026", tema: "Ponto de virada — autoconfiança", feito: "Sessão densa. Trabalhamos a relação dela com o próprio preço. Bloqueio vinha de comparação com a mãe profissional.", proximo: "Lição: listar 10 transformações que já gerou em clientes." },
    { sessao: 3, data: "30/04/2026", tema: "Identidade de marca", feito: "Definimos a voz dela e os 3 pilares da comunicação. Boa evolução desde a sessão 1.", proximo: "Criar 5 posts com a nova voz antes da sessão 4." },
    { sessao: 2, data: "23/04/2026", tema: "Diagnóstico do negócio", feito: "Mapeei o histórico, produtos, clientes e precificação atual. Ficou claro que ela cobra 40% abaixo do mercado.", proximo: "Pesquisa de concorrentes e análise de preço." },
    { sessao: 1, data: "16/04/2026", tema: "Onboarding e alinhamento", feito: "Apresentação, expectativas e contrato assinado. Alinhamos objetivos dos 3 meses.", proximo: "Preencher o formulário de diagnóstico até sexta." },
  ],
  pagamentos: [
    { parcela: "1/4", valor: 600, data: "16/04/2026", status: "pago" },
    { parcela: "2/4", valor: 600, data: "16/05/2026", status: "pago" },
    { parcela: "3/4", valor: 600, data: "16/06/2026", status: "pendente" },
    { parcela: "4/4", valor: 600, data: "16/07/2026", status: "pendente" },
  ],
};

function BarraSessoes({ feitas, total }: { feitas: number; total: number }) {
  const pct = (feitas / total) * 100;
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
          Restam {total - feitas} sessões — hora de pensar na renovação.
        </p>
      )}
    </div>
  );
}

function SessaoCard({ s }: { s: typeof cliente.historico[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #EFEFEF" }}>
      <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ background: "#FCE4EC", color: "#D81B60", fontFamily: "var(--font-inter)" }}>
          {s.sessao}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{s.tema}</p>
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{s.data}</p>
        </div>
        {open ? <ChevronUp size={15} style={{ color: "#BDBDBD" }} /> : <ChevronDown size={15} style={{ color: "#BDBDBD" }} />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 space-y-3">
          <div className="p-3 rounded-xl" style={{ background: "#F7F7F5" }}>
            <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>O que foi feito</p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{s.feito}</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: "#FCE4EC" }}>
            <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>Próximo passo combinado</p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{s.proximo}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProntuarioPage() {
  const [tabAtiva, setTabAtiva] = useState<"historico" | "pagamentos" | "notas">("historico");

  const tabs = [
    { key: "historico", label: "Histórico de sessões", icon: Calendar },
    { key: "pagamentos", label: "Pagamentos", icon: DollarSign },
    { key: "notas", label: "Notas da Carol", icon: FileText },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Topo */}
      <div className="px-8 pt-6 pb-0 bg-white" style={{ borderBottom: "1px solid #EFEFEF" }}>
        <Link href="/clientes" className="flex items-center gap-1.5 text-sm mb-5 w-fit"
          style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
          <ArrowLeft size={14} /> Voltar para Clientes
        </Link>

        <div className="flex items-start gap-5 mb-5">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: "#FCE4EC", color: "#D81B60", fontFamily: "var(--font-playfair)" }}>
            J
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>{cliente.nome}</h1>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#E8F5E9", color: "#2E7D32", fontFamily: "var(--font-inter)" }}>
                ● Ativa
              </span>
            </div>
            <p className="text-sm mb-3" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{cliente.profissao} · desde {cliente.iniciou}</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                <Phone size={12} /> {cliente.telefone}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                <Mail size={12} /> {cliente.email}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex-shrink-0"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
            <RocketIcon size={14} />
            Falar com a Diffy sobre ela
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tabAtiva === t.key;
            return (
              <button key={t.key} onClick={() => setTabAtiva(t.key as typeof tabAtiva)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2"
                style={{ borderColor: active ? "#D81B60" : "transparent", color: active ? "#D81B60" : "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-8 py-6 max-w-4xl">
        {/* Próxima ação — sempre visível */}
        <div className="flex gap-3 p-4 rounded-2xl mb-6" style={{ background: "#FCE4EC", border: "1px solid #F8BBD0" }}>
          <RocketIcon size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
              Próxima ação
            </p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
              {cliente.proximaAcao}
            </p>
          </div>
        </div>

        {/* Pacote + progresso */}
        <div className="p-5 rounded-2xl mb-6" style={{ background: "#fff", border: "1px solid #EFEFEF" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Pacote ativo</p>
              <p className="font-bold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{cliente.pacote}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Valor total</p>
              <p className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#D81B60" }}>
                R$ {cliente.valorTotal.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#2E7D32" }}>
                R$ {cliente.valorRecebido.toLocaleString("pt-BR")} recebido
              </p>
            </div>
          </div>
          <BarraSessoes feitas={cliente.sessoesFeitas} total={cliente.sessoesTotal} />
        </div>

        {/* Tab: Histórico */}
        {tabAtiva === "historico" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                {cliente.historico.length} sessões registradas
              </p>
              <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                <Plus size={13} /> Nova sessão
              </button>
            </div>
            {cliente.historico.map((s) => <SessaoCard key={s.sessao} s={s} />)}
          </div>
        )}

        {/* Tab: Pagamentos */}
        {tabAtiva === "pagamentos" && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EFEFEF" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#F7F7F5" }}>
                  {["Parcela", "Valor", "Vencimento", "Status"].map((col) => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cliente.pagamentos.map((p, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "#F5F5F5" }}>
                    <td className="px-4 py-4 text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{p.parcela}</td>
                    <td className="px-4 py-4 text-sm font-bold" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>R$ {p.valor}</td>
                    <td className="px-4 py-4 text-sm" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>{p.data}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{
                          background: p.status === "pago" ? "#E8F5E9" : "#FFF8E1",
                          color: p.status === "pago" ? "#2E7D32" : "#F9A825",
                          fontFamily: "var(--font-inter)",
                        }}>
                        {p.status === "pago" ? "✓ Pago" : "Pendente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Notas */}
        {tabAtiva === "notas" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Notas privadas — só você vê</p>
            <textarea
              defaultValue={cliente.notas}
              rows={8}
              className="w-full rounded-2xl px-5 py-4 text-sm leading-relaxed outline-none resize-none transition-all"
              style={{
                background: "#FFF8E1",
                border: "1.5px solid #F9A825",
                fontFamily: "var(--font-inter)",
                color: "#2C2C2C",
              }}
              placeholder="Anota aqui tudo que importa sobre essa cliente — jeito de ser, o que funciona, o que não funciona, histórico relevante..."
            />
            <button className="mt-3 text-sm font-semibold" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
              Salvar notas →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
