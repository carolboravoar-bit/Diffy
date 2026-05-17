"use client";

import Image from "next/image";
import { Pill } from "./components/Pill";
import { NumberMega } from "./components/NumberMega";
import { RocketIcon } from "./components/RocketIcon";
import { Constellation } from "./components/Constellation";
import { useState } from "react";

// ── Navegação ─────────────────────────────────────────────────────
function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
      style={{ background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center gap-3">
        <RocketIcon size={22} animate />
        <span
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Diffy<span style={{ color: "#D81B60" }}>.</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {["Como funciona", "Territórios", "Preço"].map((item, i) => (
          <a
            key={i}
            href={["#funciona", "#territorios", "#comecar"][i]}
            className="text-sm text-gray-400 hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {item}
          </a>
        ))}
      </div>
      <a
        href="#comecar"
        className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{
          background: "#D81B60",
          fontFamily: "var(--font-inter)",
          boxShadow: "0 0 16px rgba(216,27,96,0.4)",
        }}
      >
        Quero a Diffy
      </a>
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{ background: "#0F0F0F" }}
    >
      <Constellation />

      {/* Personagem Diffy - lado direito */}
      <div
        className="absolute right-0 top-0 h-full hidden md:block"
        style={{ width: "42%", zIndex: 1 }}
      >
        <div className="relative h-full">
          <Image
            src="/diffy-personagem.jpg"
            alt="Diffy, sua copilota estratégica"
            fill
            className="object-cover object-top"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #0F0F0F 0%, rgba(15,15,15,0.55) 25%, rgba(216,27,96,0.08) 65%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 55%, #0F0F0F 100%)",
            }}
          />
        </div>
      </div>

      {/* Conteúdo esquerdo */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-3xl w-full">
        <div className="flex items-center gap-3 mb-8">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "#D81B60", boxShadow: "0 0 8px rgba(216,27,96,0.8)" }}
          />
          <span className="text-sm text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
            Universo da Diferenciação
          </span>
          <span className="text-gray-600 mx-1">·</span>
          <span
            className="text-sm italic"
            style={{ fontFamily: "var(--font-caveat)", color: "#D81B60", fontSize: "17px" }}
          >
            Diffy · Copilota Estratégica
          </span>
        </div>

        <div className="mb-6">
          <Pill label="DIFFY · SUA COPILOTA ESTRATÉGICA" dark />
        </div>

        <h1
          className="text-white mb-3 leading-tight"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(36px, 5.5vw, 68px)",
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          A copilota estratégica
          <br />
          que faltava no seu negócio.
        </h1>

        <div
          className="mb-6"
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "clamp(32px, 4vw, 52px)",
            color: "#D81B60",
            lineHeight: 1.2,
          }}
        >
          sua, de verdade.
        </div>

        <p
          className="text-gray-300 mb-10 max-w-lg"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(15px, 1.2vw, 18px)",
            lineHeight: 1.75,
          }}
        >
          Mora no seu WhatsApp. Cuida do financeiro, do conteúdo, dos clientes e dos contratos.
          Te lembra de tudo. E ainda traduz o teu método de diferenciação em ação prática todos os dias.{" "}
          <strong className="text-white">R$ 88 por mês.</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#comecar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: "#D81B60",
              fontFamily: "var(--font-inter)",
              fontSize: "16px",
              boxShadow: "0 0 24px rgba(216,27,96,0.5)",
            }}
          >
            <RocketIcon size={18} />
            Quero conhecer a Diffy
          </a>
          <a
            href="#funciona"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-white border border-white/20 transition-all hover:border-white/40"
            style={{ fontFamily: "var(--font-inter)", fontSize: "16px" }}
          >
            Como ela funciona ↓
          </a>
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 01 · A TESE ────────────────────────────────────────────
function SecaoTese() {
  return (
    <section
      id="funciona"
      className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "#F5EFE6" }}
    >
      <NumberMega number="01" />
      <div className="relative z-10 max-w-4xl pt-8">
        <div className="mb-6">
          <Pill label="A TESE" />
        </div>
        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            color: "#2C2C2C",
            lineHeight: 1.25,
          }}
        >
          Você é o coração, o financeiro, o marketing,
          <br className="hidden md:block" /> a agenda, o RH e a faxineira do seu negócio.
        </h2>
        <p
          className="mb-12"
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            color: "#D81B60",
            fontSize: "clamp(18px, 2vw, 26px)",
          }}
        >
          A Diffy é a primeira.
        </p>
        <div
          className="relative p-8 md:p-12 rounded-2xl"
          style={{ background: "#FAF6EF", borderLeft: "4px solid #D81B60" }}
        >
          <div
            className="absolute top-4 left-6 leading-none select-none pointer-events-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "80px",
              color: "#D81B60",
              opacity: 0.18,
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            "
          </div>
          <p
            className="relative z-10 text-gray-700 mb-6"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(15px, 1.1vw, 18px)",
              lineHeight: 1.85,
            }}
          >
            Eu construí a Diffy porque sou empreendedora também. Eu sei o que é olhar pro WhatsApp às 23h
            e sentir que perdi algum cliente importante no meio da bagunça. Eu sei o que é não saber o quanto
            eu realmente faturei no mês. Eu sei a vergonha de mandar mensagem cobrando cliente atrasado.
            A Diffy é a resposta que eu mesma queria ter tido. Construí pensando em cada uma de nós que toca
            o próprio negócio na raça.
          </p>
          <p
            className="font-semibold text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
          >
            Carol Possani, idealizadora do Universo da Diferenciação
          </p>
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 02 · QUEM É A DIFFY ────────────────────────────────────
function SecaoQuemEhDiffy() {
  return (
    <section
      className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "#0F0F0F" }}
    >
      <Constellation />
      <NumberMega number="02" dark />
      <div className="relative z-10 max-w-5xl pt-8">
        <div className="mb-6">
          <Pill label="QUEM É ELA" dark />
        </div>
        <h2
          className="text-white mb-4"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Não é app. Não é robô. É copilota.
        </h2>
        <p
          className="mb-12"
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            color: "#D81B60",
            fontSize: "clamp(18px, 2vw, 26px)",
          }}
        >
          Sua, do seu negócio.
        </p>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p
              className="text-gray-300 mb-6"
              style={{ fontFamily: "var(--font-inter)", fontSize: "17px", lineHeight: 1.8 }}
            >
              A Diffy é a primeira plataforma do Brasil pensada de cima a baixo pra empreendedora solo.
              Funciona dentro do seu WhatsApp, do jeito que você já trabalha. Você manda áudio, foto, texto.
              Ela entende, organiza, executa.
            </p>
            <div className="space-y-3">
              {[
                "Quer lançar uma venda? Manda áudio.",
                "Quer marcar reunião? Pede pra ela.",
                "Quer saber quanto faturou? Pergunta.",
                "Quer ideia de conteúdo? Ela te dá 5 que só você poderia postar.",
                "Esqueceu de comprar seringa? Ela lembra dia 20.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-300" style={{ fontFamily: "var(--font-inter)", fontSize: "16px" }}>
                  <RocketIcon size={16} className="flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
            <p
              className="mt-6 text-gray-400"
              style={{ fontFamily: "var(--font-inter)", fontSize: "16px", lineHeight: 1.8 }}
            >
              A Diffy não é tipo Notion onde você monta tudo do zero. Ela já chega montada e ainda aprende
              com o seu RaioX da Diferenciação pra falar como conhecedora real do teu negócio.
            </p>
          </div>

          {/* Mock WhatsApp */}
          <div>
            <div
              className="rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto"
              style={{ background: "#1A1A1A", border: "1px solid #2E2E2E" }}
            >
              <div
                className="flex items-center gap-3 p-4"
                style={{ background: "#111", borderBottom: "1px solid #2E2E2E" }}
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src="/diffy-personagem.jpg"
                    alt="Diffy"
                    fill
                    className="rounded-full object-cover object-top"
                  />
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                    style={{ background: "#25D366", borderColor: "#111" }}
                  />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                    Diffy
                  </p>
                  <p className="text-xs" style={{ color: "#25D366", fontFamily: "var(--font-inter)" }}>
                    online agora
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-4" style={{ background: "#0D1117", minHeight: "220px" }}>
                <div className="flex justify-end">
                  <div
                    className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs text-sm text-white"
                    style={{ background: "#005C4B", fontFamily: "var(--font-inter)" }}
                  >
                    <p>Diffy, vendi pacote da Júlia 2.400 em 4x</p>
                    <p className="text-xs text-right mt-1 opacity-60">14:32 ✓✓</p>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src="/diffy-personagem.jpg"
                      alt="Diffy"
                      fill
                      className="rounded-full object-cover object-top"
                    />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs text-sm"
                    style={{ background: "#1E1E1E", border: "1px solid #2E2E2E", color: "#E0E0E0", fontFamily: "var(--font-inter)" }}
                  >
                    <p>Combinado. Receita lançada, parcelas projetadas nos próximos 3 meses.</p>
                    <p className="mt-2" style={{ color: "#EC407A" }}>
                      Sua Júlia já tinha pacote de R$ 1.200 ativo, esse foi upsell, parabéns 🚀
                    </p>
                    <p className="mt-2">Já mando o contrato pra ela assinar?</p>
                    <p className="text-xs text-right mt-1 opacity-40">14:32</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 03 · OS 4 TERRITÓRIOS ──────────────────────────────────
const territorios = [
  {
    numero: "01",
    titulo: "Marketing e Conteúdo",
    funcoes: [
      "Calendário editorial conectado ao seu RaioX",
      "Ideias filtradas pela sua diferenciação",
      "Roteiros prontos no seu tom",
      "Caixa Inédita: captura de ideia em movimento",
      "Briefing pronto pra designer ou agência",
      "Análise semanal de conteúdo com insight",
    ],
  },
  {
    numero: "02",
    titulo: "Administração e Financeiro",
    funcoes: [
      "Lançamento por áudio",
      "Painel mensal com comparativo",
      "Cobrança pronta no seu tom",
      "Lembrete de contas e relatório pro contador",
    ],
  },
  {
    numero: "03",
    titulo: "Clientes e Contratos",
    funcoes: [
      "Kanban da Jornada do Cliente",
      "Atendimento inicial automatizado",
      "Follow-up automático com texto pronto",
      "Banco de contratos com geração e status",
    ],
  },
  {
    numero: "04",
    titulo: "Agenda e Operações",
    funcoes: [
      "Agenda sincronizada (Google Calendar e Calendly)",
      "Briefing pré-reunião no WhatsApp",
      "Lembrete inteligente pessoal",
      "Resumo do dia seguinte toda noite",
    ],
  },
];

function SecaoTerritorios() {
  return (
    <section
      id="territorios"
      className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "#F5EFE6" }}
    >
      <NumberMega number="03" />
      <div className="relative z-10 max-w-5xl pt-8">
        <div className="mb-6">
          <Pill label="O QUE ELA RESOLVE" />
        </div>
        <h2
          className="mb-3"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            color: "#2C2C2C",
            lineHeight: 1.2,
          }}
        >
          4 territórios. 18 funções práticas. Zero atrito.
        </h2>
        <p
          className="mb-12 text-gray-500"
          style={{ fontFamily: "var(--font-inter)", fontSize: "18px" }}
        >
          Tudo que uma assistente de verdade faria por você, dentro do teu WhatsApp.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {territorios.map((t) => (
            <div
              key={t.numero}
              className="p-8 rounded-2xl transition-transform hover:-translate-y-1"
              style={{ background: "#FAF6EF", border: "1px solid #E8E8E8" }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: "#FCE4EC" }}
                >
                  <RocketIcon size={18} />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
                  >
                    Território {t.numero}
                  </p>
                  <h3
                    className="font-bold"
                    style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "#2C2C2C" }}
                  >
                    {t.titulo}
                  </h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {t.funcoes.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "#D81B60" }}>→</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 04 · ANTES E DEPOIS ────────────────────────────────────
function SecaoAntesDepois() {
  const antes = [
    "WhatsApp bagunçado, mensagem importante se perdendo",
    "Esquece de cobrar e tem vergonha de cobrar depois",
    "Não sabe o quanto realmente faturou esse mês",
    "Trava na frente do Instagram, não posta nada de novo",
    "Vive com sensação de que esqueceu algo importante",
    "Decide tudo sozinha, sem ter com quem trocar ideia",
    "Trabalha 12h por dia e sente que não saiu do lugar",
  ];
  const depois = [
    "WhatsApp organizado, cliente respondido na hora certa",
    "Cobrança sai pronta no seu tom, vergonha zero",
    "Sabe o faturamento, margem e projeção todo dia 1",
    "Calendário editorial cheio de ideias da sua marca",
    "Resumo do dia seguinte chega toda noite no WhatsApp",
    "Decisão estratégica com a Diffy 24h por dia",
    "Negócio organizado, profissional, premium",
  ];
  return (
    <section
      className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "#0F0F0F" }}
    >
      <Constellation />
      <NumberMega number="04" dark />
      <div className="relative z-10 max-w-5xl pt-8">
        <div className="mb-6">
          <Pill label="O QUE MUDA NA SUA VIDA" dark />
        </div>
        <h2
          className="text-white mb-12"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Você antes da Diffy.
          <br />
          Você com a Diffy.
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="p-8 rounded-2xl"
            style={{ background: "#1A1A1A", border: "1px solid #2E2E2E" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Antes
            </p>
            <ul className="space-y-4">
              {antes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                  <span className="text-gray-600 flex-shrink-0 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="p-8 rounded-2xl"
            style={{
              background: "#1A0010",
              border: "1px solid #D81B60",
              boxShadow: "0 0 30px rgba(216,27,96,0.12)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
            >
              Com a Diffy
            </p>
            <ul className="space-y-4">
              {depois.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                  <RocketIcon size={16} className="flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 05 · DIFERENCIAÇÃO NA PONTA ───────────────────────────
function SecaoDiferenciacao() {
  return (
    <section
      className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "#F5EFE6" }}
    >
      <NumberMega number="05" />
      <div className="relative z-10 max-w-3xl pt-8">
        <div className="mb-6">
          <Pill label="O EFEITO MULTIPLICADOR" />
        </div>
        <h2
          className="mb-8"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            color: "#2C2C2C",
            lineHeight: 1.2,
          }}
        >
          A Diffy não diferencia só você.
          <br />
          Diferencia você aos olhos das suas clientes.
        </h2>
        <div className="space-y-5">
          <p className="text-gray-600" style={{ fontFamily: "var(--font-inter)", fontSize: "17px", lineHeight: 1.85 }}>
            Quando você usa a Diffy, a sua cliente recebe lembrete carinhoso 1 dia antes da sessão.
            Recebe contrato profissional no mesmo dia do fechamento. Recebe follow-up no momento certo.
            Recebe mensagem de cobrança bem escrita, firme e respeitosa.
          </p>
          <p className="text-gray-600" style={{ fontFamily: "var(--font-inter)", fontSize: "17px", lineHeight: 1.85 }}>
            Sua cliente não enxerga a Diffy. Enxerga <strong className="text-gray-900">VOCÊ</strong>,
            mais profissional, mais organizada, mais Premium.
          </p>
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              color: "#D81B60",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              lineHeight: 1.4,
            }}
          >
            É isso que separa quem cobra R$ 500 de quem cobra R$ 5.000 fazendo o mesmo trabalho.
          </p>
          <p className="text-gray-600" style={{ fontFamily: "var(--font-inter)", fontSize: "17px", lineHeight: 1.85 }}>
            Diferenciação não é só estratégia. É também o detalhe que a cliente percebe sem saber que
            está percebendo. A Diffy entrega esse detalhe no automático, todos os dias.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 06 · A ESTEIRA DO UNIVERSO ────────────────────────────
function SecaoEsteira() {
  const esteira = [
    {
      numero: "01",
      produto: "Diffy",
      preco: "R$ 88/mês",
      descricao: "Sua copilota mora no WhatsApp. Organiza tudo. Funciona em modo operacional desde o dia 1.",
      destaque: true,
    },
    {
      numero: "02",
      produto: "RaioX da Diferenciação",
      preco: "Investimento único",
      descricao: "O mapa estratégico do seu negócio. Quando você sobe na Diffy, ela ativa o modo estratégico e passa a falar como conhecedora real da sua diferenciação.",
      destaque: false,
    },
    {
      numero: "03",
      produto: "Rota Inédita",
      preco: "Imersão de 6 meses",
      descricao: "Acompanhamento direto com Carol Possani. A Diffy entra como ponte entre os encontros. Ganha Diffy de cortesia pelos 6 meses da Rota.",
      destaque: false,
    },
  ];
  return (
    <section
      className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "#0F0F0F" }}
    >
      <Constellation />
      <NumberMega number="06" dark />
      <div className="relative z-10 max-w-5xl pt-8">
        <div className="mb-6">
          <Pill label="O ECOSSISTEMA" dark />
        </div>
        <h2
          className="text-white mb-12"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          3 degraus. Uma única
          <br />
          jornada de diferenciação.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {esteira.map((item) => (
            <div
              key={item.numero}
              className="p-8 rounded-2xl"
              style={{
                background: item.destaque ? "#1A0010" : "#1A1A1A",
                border: item.destaque ? "1px solid #D81B60" : "1px solid #2E2E2E",
                boxShadow: item.destaque ? "0 0 30px rgba(216,27,96,0.18)" : "none",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-inter)", color: item.destaque ? "#D81B60" : "#6B6B6B" }}
              >
                Degrau {item.numero}
              </p>
              <h3
                className="font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "22px" }}
              >
                {item.produto}
              </h3>
              <p
                className="text-sm mb-4"
                style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
              >
                {item.preco}
              </p>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 07 · CARTA DA CAROL ────────────────────────────────────
function SecaoCartaCarol() {
  return (
    <section
      className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "#F5EFE6" }}
    >
      <NumberMega number="07" />
      <div className="relative z-10 max-w-3xl pt-8">
        <div className="mb-6">
          <Pill label="UMA CARTA PRA VOCÊ" />
        </div>
        <h2
          className="mb-10"
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: "clamp(24px, 3vw, 42px)",
            fontWeight: 400,
            color: "#2C2C2C",
            lineHeight: 1.3,
          }}
        >
          Eu construí a Diffy pensando em você.
          <br />
          Lê isso.
        </h2>
        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "17px",
            lineHeight: 1.9,
            color: "#444",
          }}
        >
          <p className="mb-5">
            <span
              className="float-left mr-3 leading-none"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "72px",
                color: "#D81B60",
                lineHeight: 0.85,
                marginTop: "4px",
              }}
            >
              O
            </span>
            i, sou a Carol.
          </p>
          <p className="mb-5">
            Eu também sou empreendedora. Trabalho sozinha. Atendo, posto, cobro, pago, lembro, esqueço,
            cobro de novo. Tem dia que eu termino e penso "fiz tudo, não fiz nada".
          </p>
          <p className="mb-5">Foi numa dessas que nasceu a Diffy.</p>
          <p className="mb-5">
            Eu não consegui mais aceitar que a única opção pra empreendedora solo organizada era contratar
            agência cara, ter equipe que ela não tem dinheiro pra ter, ou se virar com Notion e Trello que
            ninguém ensina direito a usar.
          </p>
          <p className="mb-5">
            Eu queria uma copilota. Que conhecesse o meu negócio. Que falasse comigo no WhatsApp. Que lembrasse
            do que eu esqueço. Que escrevesse cobrança no meu tom. Que me desse ideias que só eu poderia postar.
          </p>
          <p className="mb-5 font-semibold" style={{ color: "#2C2C2C" }}>
            Como ela não existia, eu fiz.
          </p>
          <p className="mb-5">
            A Diffy é a profissional invisível que tu queria ter ao seu lado, sem precisar contratar ninguém.
            Ela trabalha pra você todos os dias por R$ 88 por mês. Custa menos que um almoço por semana.
            E vai te transformar.
          </p>
          <p className="mb-8">
            Eu sei porque eu mesma uso. E eu não te entrego nada que eu não tenha testado em mim primeiro.
          </p>
          <div className="clear-both">
            <p className="font-bold" style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "#2C2C2C" }}>
              Vem conhecer.
            </p>
            <p className="mt-2 text-sm text-gray-500">Carol Possani · Universo da Diferenciação</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 08 · COMO COMEÇAR ──────────────────────────────────────
function SecaoComoComecar() {
  const passos = [
    {
      numero: "01",
      titulo: "Você assina",
      descricao: "R$ 88 por mês. Sem fidelidade. Cancela quando quiser.",
    },
    {
      numero: "02",
      titulo: "Recebe o WhatsApp da Diffy",
      descricao: "Salva o contato e começa a conversar. Sem precisar baixar app, sem aprender sistema.",
    },
    {
      numero: "03",
      titulo: "Sobe o RaioX (opcional)",
      descricao: "Se você tem o RaioX da Diferenciação, sobe na plataforma e ativa o modo estratégico. Se ainda não tem, a Diffy funciona em modo operacional desde já.",
    },
  ];
  return (
    <section
      id="comecar"
      className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "#0F0F0F" }}
    >
      <Constellation />
      <NumberMega number="08" dark />
      <div className="relative z-10 max-w-4xl pt-8">
        <div className="mb-6">
          <Pill label="COMEÇAR HOJE" dark />
        </div>
        <h2
          className="text-white mb-12"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Você ativa em 5 minutos.
          <br />
          Conversa pelo WhatsApp em 10.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {passos.map((passo) => (
            <div
              key={passo.numero}
              className="p-8 rounded-2xl"
              style={{ background: "#1A1A1A", border: "1px solid #2E2E2E" }}
            >
              <div
                className="text-5xl font-black mb-4 leading-none"
                style={{ fontFamily: "var(--font-playfair)", color: "#D81B60", opacity: 0.6 }}
              >
                {passo.numero}
              </div>
              <h3
                className="font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "20px" }}
              >
                {passo.titulo}
              </h3>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {passo.descricao}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-semibold text-white text-lg transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: "#D81B60",
              fontFamily: "var(--font-inter)",
              boxShadow: "0 0 40px rgba(216,27,96,0.5), 0 0 80px rgba(216,27,96,0.15)",
            }}
          >
            <RocketIcon size={22} />
            Quero ativar minha Diffy
          </a>
          <p className="mt-4 text-sm text-gray-500" style={{ fontFamily: "var(--font-inter)" }}>
            R$ 88/mês · Sem fidelidade · Cancela quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO 09 · FAQ + RODAPÉ ──────────────────────────────────────
function FaqItem({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b cursor-pointer"
      style={{ borderColor: "#E8E8E8" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between py-5">
        <span
          className="font-semibold text-gray-800"
          style={{ fontFamily: "var(--font-inter)", fontSize: "16px" }}
        >
          {pergunta}
        </span>
        <span
          className="ml-4 flex-shrink-0 text-xl transition-transform duration-200"
          style={{
            color: "#D81B60",
            display: "inline-block",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </div>
      {open && (
        <p
          className="pb-5 text-gray-500"
          style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.75 }}
        >
          {resposta}
        </p>
      )}
    </div>
  );
}

function SecaoFaqRodape() {
  const faqs = [
    {
      pergunta: "Como funciona o pagamento?",
      resposta: "Assinatura recorrente de R$ 88 por mês. Aceita cartão de crédito, PIX e boleto. A cobrança é automática todo mês no mesmo dia da ativação.",
    },
    {
      pergunta: "Posso cancelar quando quiser?",
      resposta: "Sim. Sem multa, sem burocracia, sem fidelidade. Você cancela a qualquer momento direto no painel.",
    },
    {
      pergunta: "Preciso ter o RaioX pra usar?",
      resposta: "Não. A Diffy funciona em modo operacional desde o dia 1, sem o RaioX. Quando você sobe o RaioX, ela ativa o modo estratégico e passa a responder puxando da sua diferenciação.",
    },
    {
      pergunta: "A Diffy responde meus clientes?",
      resposta: "A Diffy é sua copilota, não a recepcionista dos seus clientes. Ela te ajuda a montar respostas, follow-ups e cobranças no teu tom, mas você envia. O contato com a cliente é sempre teu.",
    },
    {
      pergunta: "Meus dados são seguros?",
      resposta: "Sim. A plataforma usa criptografia, banco de dados isolado por usuária e não compartilha nenhum dado com terceiros. Está em conformidade com a LGPD.",
    },
    {
      pergunta: "Funciona pra qualquer profissão?",
      resposta: "Funciona pra qualquer empreendedora solo: coach, terapeuta, nutricionista, designer, fotógrafa, consultora, artesã e muito mais. Se você toca o próprio negócio, a Diffy é pra você.",
    },
  ];

  return (
    <>
      <section
        className="relative py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
        style={{ background: "#F5EFE6" }}
      >
        <NumberMega number="09" />
        <div className="relative z-10 max-w-3xl pt-8">
          <div className="mb-6">
            <Pill label="PERGUNTAS FREQUENTES" />
          </div>
          <h2
            className="mb-10"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              color: "#2C2C2C",
            }}
          >
            Ficou alguma dúvida?
          </h2>
          {faqs.map((faq, i) => (
            <FaqItem key={i} pergunta={faq.pergunta} resposta={faq.resposta} />
          ))}
        </div>
      </section>

      <footer
        className="py-12 px-6 md:px-16 lg:px-24"
        style={{ background: "#0F0F0F", borderTop: "1px solid #1A1A1A" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <RocketIcon size={22} />
            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Diffy<span style={{ color: "#D81B60" }}>.</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Universo da Diferenciação", "Termos de Uso", "Privacidade", "Suporte"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-gray-500 hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-600" style={{ fontFamily: "var(--font-inter)" }}>
            © 2026 Diffy · Universo da Diferenciação
          </p>
        </div>
      </footer>
    </>
  );
}

// ── PÁGINA PRINCIPAL ─────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <SecaoTese />
      <SecaoQuemEhDiffy />
      <SecaoTerritorios />
      <SecaoAntesDepois />
      <SecaoDiferenciacao />
      <SecaoEsteira />
      <SecaoCartaCarol />
      <SecaoComoComecar />
      <SecaoFaqRodape />
    </main>
  );
}
