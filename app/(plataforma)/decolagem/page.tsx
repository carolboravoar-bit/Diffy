"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  MessageCircle, LayoutDashboard, Users, Megaphone,
  DollarSign, Calendar, FileText, Zap, CheckCircle2,
  Circle, ChevronDown, ChevronUp, ArrowRight,
} from "lucide-react";

const modulos = [
  {
    icon: MessageCircle,
    cor: "#D81B60",
    fundo: "#FCE4EC",
    nome: "Conversar",
    href: "/conversar",
    o_que: "Sua linha direta com a Diffy — dentro da plataforma ou pelo WhatsApp.",
    quando: "Sempre que surgir uma dúvida, uma ideia, uma cliente difícil ou um dia pesado. A Diffy está online agora.",
    dica: "Manda mensagens curtas e diretas. Quanto mais contexto você dá, melhor ela responde.",
  },
  {
    icon: LayoutDashboard,
    cor: "#2C2C2C",
    fundo: "#F5F5F5",
    nome: "Painel",
    href: "/painel",
    o_que: "Visão geral do negócio: alertas da Diffy, agenda do dia, tarefas e faturamento.",
    quando: "Para começar o dia — 2 minutos de leitura e você já sabe o que importa.",
    dica: "Os alertas da Diffy no topo são priorizados por urgência. Comece por eles.",
  },
  {
    icon: Users,
    cor: "#1565C0",
    fundo: "#E3F2FD",
    nome: "Clientes",
    href: "/clientes",
    o_que: "Prontuário completo de cada cliente ativa + pipeline das que estão chegando.",
    quando: "Antes de cada sessão, para lembrar o contexto. Depois da sessão, para registrar.",
    dica: "As Notas da Carol são privadas — anota tudo o que você precisaria lembrar num dia ruim.",
  },
  {
    icon: Megaphone,
    cor: "#D81B60",
    fundo: "#FCE4EC",
    nome: "Marketing",
    href: "/marketing",
    o_que: "Calendário editorial, banco de ideias e sugestões da Diffy baseadas no seu posicionamento.",
    quando: "Quando travar no conteúdo, quando quiser planejar a semana ou salvar uma ideia que surgiu.",
    dica: "Use a Captura Rápida (botão rosa) pra salvar ideias de conteúdo no exato momento em que aparecem.",
  },
  {
    icon: DollarSign,
    cor: "#2E7D32",
    fundo: "#E8F5E9",
    nome: "Financeiro",
    href: "/financeiro",
    o_que: "Lançamentos, contas a receber e relatório mensal do seu negócio.",
    quando: "Ao receber um pagamento, ao fechar um pacote ou no fim do mês pra ver o panorama.",
    dica: "Lança os recebimentos assim que entram — a Diffy usa esses dados pra te dar alertas certeiros.",
  },
  {
    icon: Calendar,
    cor: "#F9A825",
    fundo: "#FFF8E1",
    nome: "Agenda",
    href: "/agenda",
    o_que: "Seus compromissos, sessões agendadas e lembretes organizados por dia.",
    quando: "Para visualizar a semana, registrar uma nova sessão ou checar o que vem depois.",
    dica: "Marcar uma sessão como concluída libera um momento especial. Experimenta.",
  },
  {
    icon: FileText,
    cor: "#6B6B6B",
    fundo: "#F5F5F5",
    nome: "Contratos",
    href: "/contratos",
    o_que: "Banco de contratos com status de assinatura integrado ao ZapSign.",
    quando: "Ao fechar uma nova cliente — gera o contrato a partir do modelo e envia pra assinar em minutos.",
    dica: "Crie modelos para cada tipo de pacote. Um clique e o contrato vai com o nome da cliente já preenchido.",
  },
  {
    icon: Zap,
    cor: "#D81B60",
    fundo: "#FCE4EC",
    nome: "RaioX",
    href: "/raiox",
    o_que: "Aqui você alimenta a Diffy com tudo o que ela precisa saber sobre você e o seu negócio.",
    quando: "Na primeira semana — quanto antes, mais inteligente ela fica. E revisita quando algo muda.",
    dica: "Quanto mais rico o RaioX, mais precisa e personalizada fica cada resposta da Diffy.",
  },
];

const faqs = [
  {
    pergunta: "A Diffy aprende sobre mim com o tempo?",
    resposta: "Sim. O RaioX é a base — quanto mais você preencher, mais contexto ela tem. Além disso, o histórico das suas conversas e os dados das suas clientes vão sendo absorvidos. Com o tempo, ela fala cada vez mais a sua língua.",
  },
  {
    pergunta: "A Diffy é a mesma que responde no WhatsApp?",
    resposta: "Sim. O 'Conversar' dentro da plataforma é o espelho exato do WhatsApp. Você pode usar os dois — a Diffy mantém a continuidade. Muitas empreendedoras preferem o WhatsApp no dia a dia e a plataforma para revisitar histórico e prontuários.",
  },
  {
    pergunta: "Meus dados e os dados das minhas clientes são seguros?",
    resposta: "Sim. Cada conta é completamente isolada — nenhuma outra empreendedora vê os seus dados. As notas das clientes são privadas e só você acessa. Utilizamos criptografia e armazenamento seguro em nuvem.",
  },
  {
    pergunta: "Posso usar a Diffy pra redigir contratos e propostas?",
    resposta: "Sim! Conta pra ela no Conversar o que você precisa — o tipo de pacote, o perfil da cliente, o valor. Ela te ajuda a rascunhar a proposta ou o contrato e você ajusta antes de enviar.",
  },
  {
    pergunta: "A Diffy substitui minha intuição como coach?",
    resposta: "Jamais. Ela é sua parceira de bastidores — organiza, lembra, sugere e alivia a carga operacional. A intuição, a presença e a metodologia são suas. A Diffy cuida do que tira você do foco.",
  },
  {
    pergunta: "O que faço se a Diffy errar ou não entender?",
    resposta: "Corrige ela na conversa — ela reajusta. Você também pode usar a Captura Rápida pra registrar contextos importantes que ela deve ter. Quanto mais você interage, menos ela erra.",
  },
  {
    pergunta: "Preciso preencher tudo antes de começar a usar?",
    resposta: "Não. Começa pelo Conversar hoje mesmo. O RaioX pode ser preenchido aos poucos, nas primeiras semanas. A Diffy já funciona desde o primeiro contato — vai ficando mais afinada com o tempo.",
  },
];

const checklistPrimeirosPassos = [
  { texto: "Conversar com a Diffy pelo menos uma vez", href: "/conversar" },
  { texto: "Preencher o RaioX com seus dados e metodologia", href: "/raiox" },
  { texto: "Cadastrar sua primeira cliente ativa", href: "/clientes" },
  { texto: "Configurar o WhatsApp conectado", href: "/configuracoes" },
  { texto: "Salvar pelo menos uma ideia de conteúdo", href: "/marketing" },
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
        <div className="px-5 pb-5 pt-0">
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
            {resposta}
          </p>
        </div>
      )}
    </div>
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
          <p className="text-base leading-relaxed mb-4" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C", maxWidth: "560px" }}>
            Aqui você aprende a voar com a Diffy. Cada módulo, cada função, cada detalhe que vai fazer a diferença no seu dia a dia como empreendedora. Guarda essa aba — você vai querer voltar.
          </p>
          <Link href="/conversar"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#D81B60", fontFamily: "var(--font-inter)", boxShadow: "0 0 16px rgba(216,27,96,0.3)" }}>
            <RocketIcon size={15} />
            Começar agora — falar com a Diffy
          </Link>
        </div>
      </div>

      <div className="px-8 py-8 max-w-4xl space-y-10">

        {/* Primeiros passos */}
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

        {/* Módulos */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Cada módulo explicado
          </h2>
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
                  <div className="p-3 rounded-xl mb-3" style={{ background: "#F7F7F5" }}>
                    <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                      QUANDO USAR
                    </p>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                      {m.quando}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl mb-3" style={{ background: m.fundo }}>
                    <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: m.cor }}>
                      DICA DA DIFFY
                    </p>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                      {m.dica}
                    </p>
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

        {/* FAQ */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
            Perguntas frequentes
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
            Dúvida em qualquer momento? Volta aqui. Ou manda mensagem pra ela diretamente.
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
