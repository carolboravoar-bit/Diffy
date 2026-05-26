"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RocketIcon } from "@/app/components/RocketIcon";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, TrendingUp, Users, Calendar, Lightbulb, ArrowRight, Plus } from "lucide-react";

type Agendamento = {
  id: string; titulo: string; hora: string | null; tipo: string; feito: boolean; data: string;
};
type Lancamento = {
  id: string; tipo: string; valor: number; data: string; descricao: string;
};
type Cliente = { id: string; nome: string; status: string; };

const corTipo: Record<string, string> = {
  sessao: "#D81B60", entrega: "#1565C0", followup: "#2E7D32", pessoal: "#6B6B6B", lembrete: "#F9A825",
};

export default function PainelPage() {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [agendaHoje, setAgendaHoje] = useState<Agendamento[]>([]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [nomeUsuaria, setNomeUsuaria] = useState("");

  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];
    Promise.all([
      fetch("/api/clientes").then((r) => r.json()).catch(() => []),
      fetch(`/api/agendamentos?data=${hoje}`).then((r) => r.json()).catch(() => []),
      fetch("/api/lancamentos").then((r) => r.json()).catch(() => []),
      fetch("/api/meu-contexto").then((r) => r.json()).catch(() => ({})),
    ]).then(([c, a, l, ctx]) => {
      setClientes(Array.isArray(c) ? c : []);
      setAgendaHoje(Array.isArray(a) ? a : []);
      setLancamentos(Array.isArray(l) ? l.slice(0, 20) : []);
      if (ctx?.nome) setNomeUsuaria(ctx.nome.split(" ")[0]);
      setLoading(false);
    });
  }, []);

  const ativas = clientes.filter((c) => c.status === "ativa").length;
  const prospects = clientes.filter((c) => c.status === "prospect" || c.status === null).length;

  const mesAtual = new Date().toISOString().slice(0, 7);
  const receitaMes = lancamentos
    .filter((l) => l.data.startsWith(mesAtual) && l.tipo === "receita")
    .reduce((s, l) => s + Number(l.valor), 0);
  const despesaMes = lancamentos
    .filter((l) => l.data.startsWith(mesAtual) && l.tipo === "despesa")
    .reduce((s, l) => s + Number(l.valor), 0);

  const isEmpty = clientes.length === 0 && agendaHoje.length === 0 && lancamentos.length === 0;

  // Monta gráfico dos últimos 6 meses a partir dos lançamentos reais
  const graficoDados = (() => {
    const meses: Record<string, number> = {};
    lancamentos.filter((l) => l.tipo === "receita").forEach((l) => {
      const m = l.data.slice(0, 7);
      meses[m] = (meses[m] || 0) + Number(l.valor);
    });
    const labels = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([m, v]) => ({ mes: labels[parseInt(m.split("-")[1]) - 1], valor: v }));
  })();

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-7">
        <div className="animate-pulse space-y-4 max-w-4xl">
          <div className="h-8 w-48 rounded-xl" style={{ background: "#F0F0F0" }} />
          <div className="grid grid-cols-4 gap-3">
            {[1,2,3,4].map((i) => <div key={i} className="h-24 rounded-2xl" style={{ background: "#F0F0F0" }} />)}
          </div>
          <div className="h-48 rounded-2xl" style={{ background: "#F0F0F0" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm mb-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            {saudacao}{nomeUsuaria ? `, ${nomeUsuaria}` : ""}
          </p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Painel do negócio
          </h1>
        </div>
        <Link
          href="/conversar"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "#D81B60", fontFamily: "var(--font-inter)", boxShadow: "0 0 16px rgba(216,27,96,0.3)" }}
        >
          <RocketIcon size={15} />
          Falar com a Diffy
        </Link>
      </div>

      {isEmpty ? (
        /* ── ESTADO VAZIO ── */
        <div className="max-w-2xl">
          {/* Boas-vindas */}
          <div className="p-6 rounded-2xl mb-6" style={{ background: "linear-gradient(135deg, #FCE4EC 0%, #fff 70%)", border: "1px solid #F8BBD0" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>Diffy diz</p>
              </div>
            </div>
            <p className="text-base leading-relaxed mb-1" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
              Seu painel ainda está em branco porque você ainda não cadastrou nada. Isso é normal.
            </p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
              Quando você começar a usar, vou trazer aqui os alertas mais importantes: clientes com pagamentos pendentes, sessões chegando, propostas sem resposta. Você vai ver tudo num olhar.
            </p>
          </div>

          {/* Por onde começar */}
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
            Por onde começar
          </p>
          <div className="space-y-2.5">
            {[
              { href: "/clientes", icon: Users, cor: "#D81B60", fundo: "#FCE4EC", titulo: "Cadastrar suas clientes", desc: "Adicione as clientes que você já tem ativas e as que estão no pipeline." },
              { href: "/agenda", icon: Calendar, cor: "#1565C0", fundo: "#E3F2FD", titulo: "Agendar suas sessões", desc: "Coloque na agenda as sessões da semana. A Diffy vai te lembrar." },
              { href: "/financeiro", icon: TrendingUp, cor: "#2E7D32", fundo: "#E8F5E9", titulo: "Registrar seus recebimentos", desc: "Lance as receitas do mês. Quanto antes, mais preciso fica o painel." },
              { href: "/configuracoes", icon: Lightbulb, cor: "#F9A825", fundo: "#FFF8E1", titulo: "Contar pra Diffy quem você é", desc: "Vai em Configurações e preenche o campo Meu Contexto. Ela fica muito mais útil." },
            ].map(({ href, icon: Icon, cor, fundo, titulo, desc }) => (
              <Link key={href} href={href} className="flex items-start gap-4 p-4 rounded-2xl bg-white transition-all hover:shadow-sm"
                style={{ border: "1px solid #EFEFEF" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: fundo }}>
                  <Icon size={16} style={{ color: cor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{titulo}</p>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{desc}</p>
                </div>
                <ArrowRight size={14} style={{ color: "#BDBDBD", flexShrink: 0, marginTop: "2px" }} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* ── PAINEL REAL ── */
        <div className="space-y-5 max-w-5xl">
          {/* Caixa da Diffy */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative w-6 h-6 flex-shrink-0 rounded-full overflow-hidden">
                <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
              </div>
              <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                Diffy diz
              </p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "#FCE4EC", border: "1px solid #F8BBD0" }}>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                {agendaHoje.length > 0
                  ? `Você tem ${agendaHoje.length} compromisso${agendaHoje.length > 1 ? "s" : ""} hoje. Quer um resumo do que vem pela frente?`
                  : "Nenhum compromisso agendado pra hoje. Boa hora pra checar o pipeline de clientes ou criar um conteúdo."}
              </p>
              <Link href="/conversar" className="inline-flex items-center gap-1 text-xs font-semibold mt-2"
                style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                Perguntar pra Diffy <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Faturamento do mês", valor: `R$ ${receitaMes.toLocaleString("pt-BR")}`, icon: TrendingUp, cor: "#2E7D32", fundo: "#E8F5E9" },
              { label: "Clientes ativas", valor: String(ativas), icon: Users, cor: "#D81B60", fundo: "#FCE4EC" },
              { label: "Prospects no pipeline", valor: String(prospects), icon: AlertCircle, cor: "#F9A825", fundo: "#FFF8E1" },
              { label: "Compromissos hoje", valor: String(agendaHoje.length), icon: Calendar, cor: "#1565C0", fundo: "#E3F2FD" },
            ].map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="p-4 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: k.fundo }}>
                      <Icon size={13} style={{ color: k.cor }} />
                    </div>
                    <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{k.label}</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>{k.valor}</p>
                </div>
              );
            })}
          </div>

          {/* Hoje + Lançamentos */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Agenda do dia */}
            <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>Hoje</h2>
                <Link href="/agenda" className="text-xs font-medium" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                  Ver agenda
                </Link>
              </div>
              {agendaHoje.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar size={28} style={{ color: "#E0E0E0", margin: "0 auto 8px" }} />
                  <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>Nenhum compromisso hoje</p>
                  <Link href="/agenda" className="text-xs font-semibold mt-2 inline-block" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                    + Agendar
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {agendaHoje.slice(0, 4).map((e) => (
                    <div key={e.id} className="flex items-center gap-3">
                      <span className="w-1 h-9 rounded-full flex-shrink-0" style={{ background: corTipo[e.tipo] || "#D81B60" }} />
                      <div>
                        <p className="text-xs font-bold" style={{ fontFamily: "var(--font-inter)", color: corTipo[e.tipo] || "#D81B60" }}>
                          {e.hora || "Sem hora"}
                        </p>
                        <p className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{e.titulo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Últimos lançamentos */}
            <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>Financeiro</h2>
                <Link href="/financeiro" className="text-xs font-medium" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                  Ver tudo
                </Link>
              </div>
              {lancamentos.length === 0 ? (
                <div className="text-center py-6">
                  <TrendingUp size={28} style={{ color: "#E0E0E0", margin: "0 auto 8px" }} />
                  <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>Nenhum lançamento ainda</p>
                  <Link href="/financeiro" className="text-xs font-semibold mt-2 inline-block" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                    + Registrar
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ background: "#F7F7F5" }}>
                    <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>Resultado do mês</p>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-inter)", color: receitaMes - despesaMes >= 0 ? "#2E7D32" : "#C62828" }}>
                      R$ {(receitaMes - despesaMes).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  {lancamentos.slice(0, 4).map((l) => (
                    <div key={l.id} className="flex items-center justify-between">
                      <p className="text-sm flex-1 truncate pr-2" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{l.descricao}</p>
                      <p className="text-sm font-semibold flex-shrink-0" style={{ fontFamily: "var(--font-inter)", color: l.tipo === "receita" ? "#2E7D32" : "#C62828" }}>
                        {l.tipo === "receita" ? "+" : "-"}R$ {Number(l.valor).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gráfico — só mostra se tiver dados */}
          {graficoDados.length > 0 && (
            <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
              <h2 className="text-sm font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>Faturamento</h2>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={graficoDados}>
                  <defs>
                    <linearGradient id="gradFat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D81B60" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#D81B60" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9E9E9E" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(v: unknown) => [`R$ ${Number(v).toLocaleString("pt-BR")}`, "Receita"]}
                    contentStyle={{ borderRadius: "10px", border: "1px solid #EFEFEF", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="valor" stroke="#D81B60" strokeWidth={2} fill="url(#gradFat)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Clientes recentes */}
          {clientes.length > 0 && (
            <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>Clientes</h2>
                <Link href="/clientes" className="text-xs font-medium" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                  Ver todas
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {clientes.slice(0, 6).map((c) => (
                  <Link key={c.id} href={`/clientes/${c.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors" style={{ border: "1px solid #F5F5F5" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                      style={{ background: "#FCE4EC", color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                      {c.nome.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium truncate" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{c.nome}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
