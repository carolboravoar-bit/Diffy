"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  MessageCircle, LayoutDashboard, Users, Megaphone,
  DollarSign, Calendar, FileText, Zap, CheckCircle2,
  Circle, ChevronDown, ChevronUp, ArrowRight, Smartphone, Copy, Check,
} from "lucide-react";

const WHATSAPP_NUMBER = "+55 11 99999-9999"; // trocar pelo número real do Twilio

const modulos = [
  {
    icon: MessageCircle,
    cor: "#D81B60",
    fundo: "#FCE4EC",
    nome: "Conversar com a Diffy",
    href: "/conversar",
    o_que: "Sua linha direta com a Diffy — dentro da plataforma ou pelo WhatsApp.",
    quando: "Sempre que surgir uma dúvida, uma ideia, uma cliente difícil ou um dia pesado.",
    dica: "Manda mensagens curtas e diretas. Quanto mais contexto você dá, melhor ela responde.",
  },
  {
    icon: LayoutDashboard,
    cor: "#2C2C2C",
    fundo: "#F5F5F5",
    nome: "Painel",
    href: "/painel",
    o_que: "Visão geral do negócio: alertas da Diffy, agenda do dia e faturamento.",
    quando: "Para começar o dia. 2 minutos de leitura e você já sabe o que importa.",
    dica: "Os alertas da Diffy no topo são priorizados por urgência. Comece por eles.",
  },
  {
    icon: Users,
    cor: "#1565C0",
    fundo: "#E3F2FD",
    nome: "Clientes",
    href: "/clientes",
    o_que: "Prontuário completo de cada cliente ativa + pipeline das que estão chegando.",
    quando: "Antes de cada sessão, para lembrar o contexto. Depois, para registrar.",
    dica: "As Notas são privadas. Anota tudo o que você precisaria lembrar num dia ruim.",
  },
  {
    icon: Megaphone,
    cor: "#D81B60",
    fundo: "#FCE4EC",
    nome: "Marketing",
    href: "/marketing",
    o_que: "Calendário editorial, banco de ideias e sugestões baseadas no seu posicionamento.",
    quando: "Quando travar no conteúdo ou quiser planejar a semana.",
    dica: "Use a Captura Rápida (botão rosa) pra salvar ideias no exato momento em que aparecem.",
  },
  {
    icon: DollarSign,
    cor: "#2E7D32",
    fundo: "#E8F5E9",
    nome: "Financeiro",
    href: "/financeiro",
    o_que: "Lançamentos, contas a receber e relatório mensal.",
    quando: "Ao receber um pagamento, fechar um pacote ou no fim do mês.",
    dica: "Lança os recebimentos assim que entram. A Diffy usa esses dados pra te alertar.",
  },
  {
    icon: Calendar,
    cor: "#F9A825",
    fundo: "#FFF8E1",
    nome: "Agenda",
    href: "/agenda",
    o_que: "Seus compromissos e sessões organizados por dia.",
    quando: "Para visualizar a semana, registrar uma nova sessão ou checar o próximo passo.",
    dica: "Marcar uma sessão como concluída libera um momento especial. Experimenta.",
  },
  {
    icon: FileText,
    cor: "#6B6B6B",
    fundo: "#F5F5F5",
    nome: "Contratos",
    href: "/contratos",
    o_que: "Banco de contratos com modelos reutilizáveis.",
    quando: "Ao fechar uma nova cliente. Um clique e o contrato vai com o nome já preenchido.",
    dica: "Crie modelos para cada tipo de pacote.",
  },
  {
    icon: Zap,
    cor: "#D81B60",
    fundo: "#FCE4EC",
    nome: "Documentos e Contexto",
    href: "/configuracoes",
    o_que: "Aqui você alimenta a Diffy com tudo o que ela precisa saber sobre você e o seu negócio.",
    quando: "Na primeira semana. Quanto antes, mais inteligente ela fica.",
    dica: "Quanto mais rico o contexto, mais precisa e personalizada fica cada resposta.",
  },
];

const faqs = [
  {
    pergunta: "A Diffy aprende sobre mim com o tempo?",
    resposta: "Sim. Nos Documentos e Contexto (Configurações) você alimenta ela com tudo sobre você e seu negócio. Quanto mais informação, mais ela fala a sua língua.",
  },
  {
    pergunta: "A Diffy da plataforma é a mesma do WhatsApp?",
    resposta: "Sim. O Conversar dentro da plataforma e o WhatsApp são a mesma Diffy. Você pode usar os dois — ela mantém a continuidade. Muitas preferem o WhatsApp no dia a dia e a plataforma para revisar dados.",
  },
  {
    pergunta: "Meus dados são seguros?",
    resposta: "Sim. Cada conta é completamente isolada. Nenhuma outra empreendedora vê os seus dados. As notas de clientes são privadas e só você acessa.",
  },
  {
    pergunta: "Posso pedir pra ela redigir contratos e propostas?",
    resposta: "Sim. Conta pra ela no Conversar o que você precisa. Ela te ajuda a rascunhar e você ajusta antes de enviar.",
  },
  {
    pergunta: "O que faço se ela errar ou não entender?",
    resposta: "Corrige ela na conversa. Também vai em Configurações > Meu contexto e preenche mais sobre você. Quanto mais você interage, menos ela erra.",
  },
  {
    pergunta: "Preciso preencher tudo antes de usar?",
    resposta: "Não. Começa pelo Conversar hoje mesmo. O contexto pode ser preenchido aos poucos. A Diffy funciona desde o primeiro contato.",
  },
];

const checklistPrimeirosPassos = [
  { texto: "Salvar o número da Diffy e mandar 'Oi Diffy' no WhatsApp", href: "#whatsapp" },
  { texto: "Falar com a Diffy pela plataforma pelo menos uma vez", href: "/conversar" },
  { texto: "Preencher o Meu Contexto em Configurações", href: "/configuracoes" },
  { texto: "Subir pelo menos um documento seu em Configurações", href: "/configuracoes" },
  { texto: "Explorar os módulos que mais fazem sentido pro seu momento", href: "/painel" },
];

function FaqItem({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [aberta, setAberta] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EFEFEF" }}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setAberta(!aberta)}
      >
        <span className="text-sm font-semibold pr-4" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
          {pergunta}
        </span>
        {aberta
          ? <ChevronUp size={16} style={{ color: "#D81B60", flexShrink: 0 }} />
          : <ChevronDown size={16} style={{ color: "#BDBDBD", flexShrink: 0 }} />}
      </button>
      {aberta && (
        <div className="px-5 pb-5">
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
            {resposta}
          </p>
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
      style={{ background: copied ? "#E8F5E9" : "#FCE4EC", color: copied ? "#2E7D32" : "#D81B60", fontFamily: "var(--font-inter)" }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copiado!" : "Copiar número"}
    </button>
  );
}

export default function DecolagemPage() {
  const [passosConcluidos, setPassosConcluidos] = useState<Set<number>>(new Set());

  function togglePasso(i: number) {
    setPassosConcluidos((prev) => {
      const novo = new Set(prev);
      novo.has(i) ? novo.delete(i) : novo.add(i);
      return novo;
    });
  }

  const progresso = Math.round((passosConcluidos.size / checklistPrimeirosPassos.length) * 100);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="px-8 pt-10 pb-8" style={{ background: "linear-gradient(135deg, #FCE4EC 0%, #fff 60%)", borderBottom: "1px solid #F8BBD0" }}>
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden shadow-md">
              <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: "#25D366" }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
                Bem-vinda à
              </p>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
                Decolagem
              </h1>
            </div>
          </div>
          <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C", maxWidth: "560px" }}>
            Sua Diffy está pronta. Aqui você entende tudo o que ela faz e como começar. Guarda essa aba — você vai querer voltar.
          </p>
        </div>
      </div>

      <div className="px-8 py-8 max-w-4xl space-y-10">

        {/* WhatsApp — como instalar */}
        <div id="whatsapp">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Primeiro passo: a Diffy no WhatsApp
          </h2>
          <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #EFEFEF" }}>
            <p className="text-sm mb-5" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
              A Diffy vive no WhatsApp. É por lá que você vai falar com ela no dia a dia — uma mensagem rápida resolve. A plataforma é pra quando você quiser ver os dados, o histórico e os módulos com mais calma.
            </p>
            <div className="space-y-4">
              {[
                {
                  num: "1",
                  titulo: "Salve o número da Diffy",
                  desc: "Salve no celular como \"Minha Diffy\" ou o nome que preferir.",
                  extra: (
                    <div className="flex items-center gap-3 mt-2 p-3 rounded-xl" style={{ background: "#F7F7F5" }}>
                      <Smartphone size={16} style={{ color: "#D81B60" }} />
                      <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{WHATSAPP_NUMBER}</span>
                      <CopyButton text={WHATSAPP_NUMBER} />
                    </div>
                  ),
                },
                {
                  num: "2",
                  titulo: "Mande \"Oi Diffy\" no WhatsApp",
                  desc: "Ela já sabe quem você é. Apresente-se, fale do seu negócio ou vai direto ao que precisa.",
                },
                {
                  num: "3",
                  titulo: "Use como quiser",
                  desc: "Estratégia, cobrança, conteúdo, dúvidas de gestão, um dia difícil. Ela está online agora.",
                },
              ].map((passo) => (
                <div key={passo.num} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                    style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
                    {passo.num}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                      {passo.titulo}
                    </p>
                    <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                      {passo.desc}
                    </p>
                    {"extra" in passo && passo.extra}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5" style={{ borderTop: "1px solid #EFEFEF" }}>
              <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                Prefere começar pela plataforma?
              </p>
              <Link href="/conversar" className="inline-flex items-center gap-1.5 text-sm font-semibold mt-1"
                style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                <MessageCircle size={14} /> Abrir chat na plataforma <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Como a Diffy funciona — diferencial real */}
        <div className="p-6 rounded-2xl" style={{ background: "#2C2C2C", border: "1px solid #1A1A1A" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
            O diferencial que muda tudo
          </p>
          <h2 className="text-xl font-bold mb-3 text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            A Diffy lembra. A Diffy aprende. A Diffy está onde você está.
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
            Não é um chatbot com respostas genéricas. Não é um sisteminha que você precisa abrir toda hora. A Diffy vive no WhatsApp — o lugar que você já usa — e traz tudo pra cá, organizado e esperando por você.
          </p>

          {/* Flow visual */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="p-4 rounded-xl text-center" style={{ background: "#1A1A1A" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#25D366" }}>
                <MessageCircle size={18} className="text-white" />
              </div>
              <p className="text-xs font-semibold text-white mb-1" style={{ fontFamily: "var(--font-inter)" }}>WhatsApp</p>
              <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Você manda uma mensagem. Dúvida, ideia, desabafo, pedido.</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "#FCE4EC" }}>
                  <Zap size={14} style={{ color: "#D81B60" }} />
                </div>
                <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Diffy processa com contexto de você</p>
              </div>
            </div>
            <div className="p-4 rounded-xl text-center" style={{ background: "#1A1A1A" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#D81B60" }}>
                <LayoutDashboard size={18} className="text-white" />
              </div>
              <p className="text-xs font-semibold text-white mb-1" style={{ fontFamily: "var(--font-inter)" }}>Plataforma</p>
              <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>Tudo fica salvo aqui. Histórico, dados, registros. Sempre acessível.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { emoji: "🧠", titulo: "Ela sabe quem você é", texto: "Você alimenta ela com seus documentos, seu contexto, seu jeito. Cada resposta é personalizada para a sua realidade, não para qualquer empreendedora." },
              { emoji: "💬", titulo: "Nada se perde", texto: "Falou no WhatsApp? Está aqui. Registrou uma cliente pela plataforma? A Diffy já sabe. Tudo em um só lugar, tudo conectado." },
              { emoji: "⚡", titulo: "Sem fricção", texto: "Sem abrir app novo, sem aprender ferramenta, sem trocar de aba. Você usa o que já usa. A organização acontece nos bastidores." },
            ].map((item) => (
              <div key={item.titulo} className="flex gap-3 p-4 rounded-xl" style={{ background: "#1A1A1A" }}>
                <span className="text-lg flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "var(--font-inter)" }}>{item.titulo}</p>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Módulos — antes dos primeiros voos */}
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            O que tem aqui dentro
          </h2>
          <p className="text-sm mb-4" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            Explore no seu ritmo. Você não precisa usar tudo de uma vez.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {modulos.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.nome} className="p-5 rounded-2xl bg-white" style={{ border: "1px solid #EFEFEF" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: m.fundo }}>
                      <Icon size={16} style={{ color: m.cor }} />
                    </div>
                    <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                      {m.nome}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                    {m.o_que}
                  </p>
                  <div className="p-3 rounded-xl mb-2" style={{ background: "#F7F7F5" }}>
                    <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>QUANDO USAR</p>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>{m.quando}</p>
                  </div>
                  <div className="p-3 rounded-xl mb-3" style={{ background: m.fundo }}>
                    <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: m.cor }}>DICA DA DIFFY</p>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{m.dica}</p>
                  </div>
                  <Link href={m.href} className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: m.cor, fontFamily: "var(--font-inter)" }}>
                    Ir para {m.nome} <ArrowRight size={11} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primeiros voos — depois dos módulos */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Primeiros voos
            </h2>
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}>
              {passosConcluidos.size}/{checklistPrimeirosPassos.length} concluídos
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "#F5F5F5" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progresso}%`, background: "#D81B60" }} />
          </div>
          <div className="space-y-2.5">
            {checklistPrimeirosPassos.map((passo, i) => {
              const feito = passosConcluidos.has(i);
              return (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white transition-all"
                  style={{ border: feito ? "1px solid #F8BBD0" : "1px solid #EFEFEF" }}>
                  <button onClick={() => togglePasso(i)} className="flex-shrink-0">
                    {feito
                      ? <CheckCircle2 size={20} style={{ color: "#D81B60" }} />
                      : <Circle size={20} style={{ color: "#E0E0E0" }} />}
                  </button>
                  <p className="flex-1 text-sm font-medium" style={{
                    fontFamily: "var(--font-inter)",
                    color: feito ? "#BDBDBD" : "#2C2C2C",
                    textDecoration: feito ? "line-through" : "none",
                  }}>
                    {passo.texto}
                  </p>
                  <Link href={passo.href} className="flex-shrink-0 text-xs font-semibold flex items-center gap-1"
                    style={{ color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                    Ir <ArrowRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Dúvidas frequentes
          </h2>
          <div className="space-y-2.5">
            {faqs.map((f, i) => <FaqItem key={i} pergunta={f.pergunta} resposta={f.resposta} />)}
          </div>
        </div>

        {/* CTA final */}
        <div className="p-8 rounded-2xl text-center" style={{ background: "#FCE4EC", border: "1px solid #F8BBD0" }}>
          <div className="flex justify-center mb-3">
            <RocketIcon size={32} animate />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Sua Diffy está pronta pra voar com você.
          </h3>
          <p className="text-sm mb-5" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
            Dúvida em qualquer momento? Volta aqui. Ou manda mensagem pra ela direto.
          </p>
          <Link href="/conversar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
            <RocketIcon size={14} />
            Falar com a Diffy agora
          </Link>
        </div>

      </div>
    </div>
  );
}
