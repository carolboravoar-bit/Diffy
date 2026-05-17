"use client";

import Link from "next/link";
import Image from "next/image";
import { RocketIcon } from "@/app/components/RocketIcon";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, CheckCircle2, TrendingUp, Users, Calendar, Lightbulb } from "lucide-react";

const faturamento = [
  { mes: "Dez", valor: 3800 },
  { mes: "Jan", valor: 4200 },
  { mes: "Fev", valor: 5800 },
  { mes: "Mar", valor: 4900 },
  { mes: "Abr", valor: 7200 },
  { mes: "Mai", valor: 8100 },
];

type PrioridadeCaixa = "urgente" | "acao" | "oportunidade" | "info";

const caixaDiffy: {
  tipo: PrioridadeCaixa;
  texto: string;
  acao?: string;
  href?: string;
}[] = [
  {
    tipo: "urgente",
    texto: "Fernanda Rocha tem parcela vencendo em 2 dias — R$ 600.",
    acao: "Cobrar agora",
    href: "/financeiro",
  },
  {
    tipo: "oportunidade",
    texto: "Júlia Martins termina o pacote na próxima semana. Hora de oferecer renovação.",
    acao: "Ver prontuário",
    href: "/clientes/1",
  },
  {
    tipo: "acao",
    texto: "Você não publica há 5 dias. Tenho 3 ideias prontas da sua diferenciação.",
    acao: "Ver ideias",
    href: "/marketing",
  },
  {
    tipo: "info",
    texto: "Beatriz Costa recebeu a proposta há 3 dias. Vale um follow-up hoje.",
    acao: "Follow-up",
    href: "/clientes",
  },
];

const iconeCaixa = {
  urgente:     <AlertCircle size={15} style={{ color: "#C62828" }} />,
  acao:        <Lightbulb size={15} style={{ color: "#D81B60" }} />,
  oportunidade:<TrendingUp size={15} style={{ color: "#2E7D32" }} />,
  info:        <Calendar size={15} style={{ color: "#1565C0" }} />,
};

const fundoCaixa = {
  urgente:      "#FFEBEE",
  acao:         "#FCE4EC",
  oportunidade: "#E8F5E9",
  info:         "#E3F2FD",
};

const corCaixa = {
  urgente:      "#C62828",
  acao:         "#D81B60",
  oportunidade: "#2E7D32",
  info:         "#1565C0",
};

const kpis = [
  { label: "Faturamento do mês",    valor: "R$ 8.100", delta: "+26%",       positivo: true,  icon: TrendingUp },
  { label: "Clientes ativas",       valor: "12",        delta: "+2 novas",   positivo: true,  icon: Users },
  { label: "A receber (7 dias)",    valor: "R$ 3.600",  delta: "3 pendentes",positivo: null,  icon: AlertCircle },
  { label: "Próximo compromisso",   valor: "09:00",     delta: "Júlia Martins", positivo: null, icon: Calendar },
];

const agenda = [
  { hora: "09:00", titulo: "Sessão — Júlia Martins",           cor: "#D81B60" },
  { hora: "14:00", titulo: "Entrega proposta — Ana Lima",      cor: "#1565C0" },
  { hora: "16:30", titulo: "Call follow-up — Carla",           cor: "#2E7D32" },
];

const tarefas = [
  { texto: "Lançar recebimento da Mariana",     feito: false },
  { texto: "Enviar contrato pra Beatriz",        feito: false },
  { texto: "Postar no Instagram (reel)",         feito: false },
  { texto: "Briefing de reunião — Ana Lima",     feito: true },
  { texto: "Cobrar parcela 2 — Fernanda",        feito: false },
];

export default function PainelPage() {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm mb-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            {saudacao}, Carol
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

      {/* ① CAIXA DA DIFFY — o que precisa de atenção agora */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="relative w-6 h-6 flex-shrink-0 rounded-full overflow-hidden">
            <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
          </div>
          <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
            Diffy diz — {caixaDiffy.length} coisas pra você ver hoje
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {caixaDiffy.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: fundoCaixa[item.tipo], border: `1px solid ${corCaixa[item.tipo]}20` }}>
              <div className="flex-shrink-0 mt-0.5">{iconeCaixa[item.tipo]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed mb-2" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                  {item.texto}
                </p>
                {item.acao && item.href && (
                  <Link href={item.href} className="text-xs font-semibold"
                    style={{ color: corCaixa[item.tipo], fontFamily: "var(--font-inter)" }}>
                    {item.acao} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ② HOJE — agenda + tarefas */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Agenda do dia */}
        <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Hoje
            </h2>
            <Link href="/agenda" className="text-xs font-medium" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
              Agenda completa →
            </Link>
          </div>
          <div className="space-y-3">
            {agenda.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-1 h-9 rounded-full flex-shrink-0" style={{ background: c.cor }} />
                <div>
                  <p className="text-xs font-bold" style={{ fontFamily: "var(--font-inter)", color: c.cor }}>{c.hora}</p>
                  <p className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{c.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista do dia */}
        <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Lista do dia
            </h2>
            <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              {tarefas.filter((t) => !t.feito).length} pendentes
            </span>
          </div>
          <ul className="space-y-2.5">
            {tarefas.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center"
                  style={{ borderColor: t.feito ? "#D81B60" : "#BDBDBD", background: t.feito ? "#D81B60" : "transparent" }}>
                  {t.feito && <CheckCircle2 size={10} color="white" />}
                </span>
                <span className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--font-inter)",
                    color: t.feito ? "#BDBDBD" : "#2C2C2C",
                    textDecoration: t.feito ? "line-through" : "none",
                  }}>
                  {t.texto}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ③ KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                  {k.label}
                </p>
                <Icon size={14} style={{ color: "#BDBDBD" }} />
              </div>
              <p className="text-2xl font-bold mb-1.5" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
                {k.valor}
              </p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: k.positivo === true ? "#E8F5E9" : k.positivo === false ? "#FFEBEE" : "#F5F5F5",
                  color: k.positivo === true ? "#2E7D32" : k.positivo === false ? "#C62828" : "#6B6B6B",
                  fontFamily: "var(--font-inter)",
                }}>
                {k.delta}
              </span>
            </div>
          );
        })}
      </div>

      {/* ④ FATURAMENTO — contexto histórico, não urgência */}
      <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Faturamento — últimos 6 meses
            </h2>
            <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              Tendência de crescimento de 26% no período
            </p>
          </div>
          <Link href="/financeiro" className="text-xs font-medium" style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
            Ver detalhes →
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={faturamento}>
            <defs>
              <linearGradient id="fat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D81B60" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#D81B60" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9E9E9E", fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9E9E9E", fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `R$${(Number(v) / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Faturamento"]}
              contentStyle={{ background: "#fff", border: "1px solid #EFEFEF", borderRadius: "10px", fontFamily: "var(--font-inter)", fontSize: "12px" }}
            />
            <Area type="monotone" dataKey="valor" stroke="#D81B60" strokeWidth={2} fill="url(#fat)"
              dot={{ fill: "#D81B60", strokeWidth: 0, r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
