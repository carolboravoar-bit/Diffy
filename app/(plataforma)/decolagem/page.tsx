"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  MessageCircle, LayoutDashboard, Users, Megaphone,
  DollarSign, Calendar, FileText, Zap, CheckCircle2,
  Circle, ChevronDown, ChevronUp, ArrowRight, Smartphone, Copy, Check, CheckCheck,
  Lightbulb, FileEdit, HeartHandshake, TrendingUp,
} from "lucide-react";

const WHATSAPP_NUMBER = "+1 (415) 523-8886";
const WHATSAPP_JOIN_CODE = "join grabbed-particles";
const WHATSAPP_JOIN_URL = "https://wa.me/14155238886?text=join%20grabbed-particles";

const conversaMockup = [
  { lado: "inedita", texto: "Tenho uma cliente que sumiu depois de fechar o pacote. Como lido com isso?", hora: "09:14" },
  { lado: "diffy", texto: "Antes de cobrar: manda uma mensagem curta e sem cobrança. Tipo \"Oi [nome], tô aqui quando você precisar retomar.\" Dá espaço, mas marca presença. Quer que eu te ajude a escrever?", hora: "09:14" },
  { lado: "inedita", texto: "sim por favor", hora: "09:15" },
  { lado: "diffy", texto: "Aqui: \"Oi [nome]! Só passando pra dizer que o seu espaço aqui tá guardado. Qualquer hora que quiser continuar, é só falar.\" Simples, sem pressão, e deixa a porta aberta.", hora: "09:15" },
];

const exemplosWhatsApp = [
  {
    icon: TrendingUp,
    titulo: "Estratégia e posicionamento",
    trocas: [
      { lado: "inedita", msg: "Tô com dificuldade de explicar o que me diferencia. Me ajuda?" },
      { lado: "diffy", msg: "Me conta: o que suas clientes mais falam depois de trabalhar com você? Qual transformação elas descrevem?" },
    ],
  },
  {
    icon: FileEdit,
    titulo: "Redigir proposta ou cobrança",
    trocas: [
      { lado: "inedita", msg: "Preciso mandar uma proposta pra uma cliente nova. Pacote de 3 meses, R$2.400." },
      { lado: "diffy", msg: "Me conta um pouco sobre ela e o que ela precisa resolver — faço a proposta completa pra você ajustar e enviar." },
    ],
  },
  {
    icon: Lightbulb,
    titulo: "Ideia de conteúdo na hora",
    trocas: [
      { lado: "inedita", msg: "Travei no conteúdo de amanhã. Tema: precificação." },
      { lado: "diffy", msg: "\"O preço que você cobra diz o que você acredita que vale. E quando você subestima, a cliente também subestima.\" Quer esse como legenda ou abertura de carrossel?" },
    ],
  },
  {
    icon: HeartHandshake,
    titulo: "Um dia difícil",
    trocas: [
      { lado: "inedita", msg: "Perdi uma cliente hoje. Tô me sentindo péssima." },
      { lado: "diffy", msg: "Isso dói de verdade. Quer desabafar mais ou prefere que a gente olhe o que aconteceu com calma pra entender o que fazer diferente?" },
    ],
  },
];

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

          {/* Aviso sandbox */}
          <div className="flex gap-3 p-4 rounded-xl mb-6" style={{ background: "#FCE4EC", border: "1px solid #F48FB1" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white" style={{ background: "#D81B60" }}>!</div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>Passo obrigatório antes de começar no WhatsApp</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>
                Como estamos em versão Beta, é preciso fazer uma ativação rápida no WhatsApp antes de começar a conversar. São só dois cliques — siga os passos abaixo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_260px] gap-8 items-start" style={{ gridTemplateColumns: "1fr 260px" }}>
            {/* Coluna esquerda: passos + exemplos */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>Como ativar</p>

              {/* Passo 1 */}
              <div className="flex gap-4 items-start mb-5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#2C2C2C", color: "#D81B60", fontFamily: "var(--font-inter)" }}>1</div>
                <div className="flex-1">
                  <p className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>Clique no botão abaixo</p>
                  <p className="text-sm mb-4 leading-snug" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>Abre o WhatsApp com o número e a mensagem de ativação já prontos.</p>
                  <a
                    href={WHATSAPP_JOIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm font-bold px-5 py-3 rounded-xl transition-opacity hover:opacity-90"
                    style={{ background: "#25D366", color: "#fff", fontFamily: "var(--font-inter)" }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Ativar Diffy no WhatsApp
                  </a>
                </div>
              </div>

              <div className="h-px ml-[52px] mb-5" style={{ background: "#F0F0F0" }} />

              {/* Passo 2 */}
              <div className="flex gap-4 items-start mb-5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#2C2C2C", color: "#D81B60", fontFamily: "var(--font-inter)" }}>2</div>
                <div className="flex-1">
                  <p className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>Toque em <span style={{ fontFamily: "monospace", background: "rgba(44,44,44,0.06)", padding: "2px 6px", borderRadius: "4px" }}>Enviar</span> no WhatsApp</p>
                  <p className="text-sm leading-snug" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>A mensagem <strong style={{ color: "#2C2C2C" }}>"join grabbed-particles"</strong> já vai estar digitada. É só enviar para confirmar seu número.</p>
                </div>
              </div>

              <div className="h-px ml-[52px] mb-5" style={{ background: "#F0F0F0" }} />

              {/* Passo 3 */}
              <div className="flex gap-4 items-start mb-8">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white" style={{ background: "#25D366", fontFamily: "var(--font-inter)" }}>✓</div>
                <div className="flex-1">
                  <p className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>Pronto — agora é só mandar mensagem!</p>
                  <p className="text-sm leading-snug" style={{ fontFamily: "var(--font-inter)", color: "#6B6B6B" }}>A Diffy vai responder direto no WhatsApp. Se em algum momento parar de funcionar, basta repetir os passos 1 e 2 para reativar.</p>
                </div>
              </div>

              {/* Exemplos */}
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>O que dá pra fazer</p>
              <div className="space-y-3">
                {exemplosWhatsApp.map(({ icon: Icon, titulo, trocas }) => (
                  <div key={titulo} className="rounded-xl overflow-hidden" style={{ border: "1px solid #EFEFEF" }}>
                    <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
                      <Icon size={12} style={{ color: "#D81B60", flexShrink: 0 }} />
                      <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>{titulo}</p>
                    </div>
                    <div className="p-3 space-y-2" style={{ background: "#ECE5DD" }}>
                      {trocas.map((t, i) => (
                        <div key={i} className={`flex ${t.lado === "inedita" ? "justify-end" : "justify-start"}`}>
                          <div className="px-3 py-2 shadow-sm max-w-[85%]" style={{
                            background: t.lado === "inedita" ? "#DCF8C6" : "#fff",
                            borderRadius: t.lado === "inedita" ? "10px 10px 3px 10px" : "10px 10px 10px 3px",
                          }}>
                            <p className="text-xs leading-snug" style={{ color: "rgba(0,0,0,0.82)", fontFamily: "var(--font-inter)" }}>{t.msg}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #EFEFEF" }}>
                <p className="text-xs font-semibold mb-2" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>Mais pra testar</p>
                <div className="space-y-1.5">
                  {[
                    "\"Como precificar meu novo pacote?\"",
                    "\"Me dá um roteiro pra sessão de hoje\"",
                    "\"Preciso de um argumento pra uma cliente indecisa\"",
                    "\"Resumo do que eu tenho que fazer essa semana\"",
                  ].map((ex) => (
                    <div key={ex} className="flex items-start gap-2">
                      <ArrowRight size={11} style={{ color: "#D81B60", flexShrink: 0, marginTop: "3px" }} />
                      <p className="text-sm italic" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{ex}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna direita: mockup celular */}
            <div className="sticky top-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>Como fica a conversa</p>
              <div className="rounded-[2rem] p-2 shadow-xl" style={{ background: "#2C2C2C" }}>
                <div className="rounded-[1.6rem] overflow-hidden" style={{ background: "#ECE5DD" }}>
                  {/* Header WhatsApp */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5" style={{ background: "#2C2C2C" }}>
                    <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
                      <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#fff" }}>Diffy</p>
                      <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>online agora</p>
                    </div>
                  </div>
                  {/* Mensagens */}
                  <div className="p-2.5 space-y-1.5" style={{ minHeight: "260px" }}>
                    <div className="flex justify-center my-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.07)", color: "rgba(0,0,0,0.4)" }}>Hoje</span>
                    </div>
                    {conversaMockup.map((msg, i) => (
                      <div key={i} className={`flex ${msg.lado === "inedita" ? "justify-end" : "justify-start"}`}>
                        <div className="px-2.5 py-1.5 shadow-sm" style={{
                          background: msg.lado === "inedita" ? "#DCF8C6" : "#fff",
                          borderRadius: msg.lado === "inedita" ? "10px 10px 3px 10px" : "10px 10px 10px 3px",
                          maxWidth: "83%",
                        }}>
                          <p className="text-[11px] leading-snug" style={{ color: "rgba(0,0,0,0.85)", fontFamily: "var(--font-inter)" }}>{msg.texto}</p>
                          <div className={`flex items-center gap-0.5 mt-0.5 ${msg.lado === "inedita" ? "justify-end" : "justify-start"}`}>
                            <span className="text-[9px]" style={{ color: "rgba(0,0,0,0.35)" }}>{msg.hora}</span>
                            {msg.lado === "inedita" && <CheckCheck size={10} style={{ color: "#53BDEB" }} />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Input */}
                  <div className="flex items-center gap-1.5 mx-2 mb-2 px-3 py-1.5 rounded-full" style={{ background: "#fff" }}>
                    <p className="flex-1 text-[10px]" style={{ color: "rgba(0,0,0,0.3)" }}>Mensagem</p>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#D81B60" }}>
                      <MessageCircle size={11} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-center mt-3" style={{ color: "#BDBDBD", fontFamily: "var(--font-inter)" }}>No celular que você já usa</p>
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
