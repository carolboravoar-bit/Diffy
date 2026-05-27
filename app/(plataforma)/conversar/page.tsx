"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Send, ChevronDown, Mic, MicOff } from "lucide-react";

type Mensagem = {
  id: string;
  autoria: "inedita" | "diffy";
  texto: string;
  hora: string;
  origem?: string; // 'web' ou número WhatsApp
};

function formatHora(d: Date | string) {
  const data = typeof d === "string" ? new Date(d) : d;
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function mapearMensagens(raw: {
  id: string;
  role: string;
  conteudo: string;
  created_at: string;
  numero_whatsapp: string;
}[]): Mensagem[] {
  return raw.map((m) => ({
    id: m.id,
    autoria: m.role === "assistant" ? "diffy" : "inedita",
    texto: m.conteudo,
    hora: formatHora(m.created_at),
    origem: m.numero_whatsapp,
  }));
}

const sugestoesPorContexto = [
  { label: "💰 Financeiro", itens: ["Quanto faturei esse mês?", "Tenho conta a receber?", "Me faz um relatório do mês"] },
  { label: "👥 Clientes", itens: ["Quais clientes preciso dar atenção?", "Preparar cobrança pra Fernanda", "Follow-up da Beatriz"] },
  { label: "📣 Conteúdo", itens: ["Ideia de post pra hoje", "Me faz um roteiro rápido", "O que eu poderia postar essa semana?"] },
  { label: "📅 Agenda", itens: ["O que tenho pra hoje?", "Me faz o briefing da próxima reunião", "Criar lembrete pra amanhã"] },
];

function BubbleDiffy({ msg }: { msg: Mensagem }) {
  return (
    <div className="flex items-end gap-2.5 max-w-[80%]">
      <div className="relative w-7 h-7 flex-shrink-0 rounded-full overflow-hidden shadow-sm">
        <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
      </div>
      <div>
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm"
          style={{
            background: "#ffffff",
            color: "#2C2C2C",
            fontFamily: "var(--font-inter)",
            border: "1px solid #F0F0F0",
          }}
        >
          {msg.texto}
        </div>
        <p className="text-xs mt-1 pl-1" style={{ color: "#BDBDBD", fontFamily: "var(--font-inter)" }}>
          {msg.hora}
        </p>
      </div>
    </div>
  );
}

function BubbleCarregando() {
  return (
    <div className="flex items-end gap-2.5 max-w-[80%]">
      <div className="relative w-7 h-7 flex-shrink-0 rounded-full overflow-hidden shadow-sm">
        <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm"
        style={{ background: "#ffffff", border: "1px solid #F0F0F0" }}
      >
        <div className="flex gap-1 items-center py-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#D81B60",
                animation: `twinkle 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BubbleInedita({ msg }: { msg: Mensagem }) {
  const isWhatsApp = msg.origem && msg.origem !== "web";
  return (
    <div className="flex justify-end max-w-[80%] ml-auto">
      <div>
        <div
          className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed text-white shadow-sm"
          style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
        >
          {msg.texto}
        </div>
        <p className="text-xs mt-1 text-right" style={{ color: "#BDBDBD", fontFamily: "var(--font-inter)" }}>
          {isWhatsApp ? "📱 " : ""}{msg.hora} ✓✓
        </p>
      </div>
    </div>
  );
}

const MENSAGEM_INICIAL: Mensagem = {
  id: "initial",
  autoria: "diffy",
  texto: "Oi! Pronta aqui. O que precisa agora?",
  hora: formatHora(new Date()),
};

export default function ConversarPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([MENSAGEM_INICIAL]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [grupoSugestao, setGrupoSugestao] = useState(0);
  const [gravando, setGravando] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idsConhecidos = useRef<Set<string>>(new Set(["initial"]));

  const carregarMensagens = useCallback(async (silencioso = false) => {
    try {
      const res = await fetch("/api/conversa");
      const data = await res.json();
      const novas = mapearMensagens(data.mensagens ?? []);

      if (novas.length === 0) {
        if (!silencioso) setCarregando(false);
        return;
      }

      setMensagens((prev) => {
        const mapaAtual = new Map(prev.map((m) => [m.id, m]));
        let houve = false;
        for (const m of novas) {
          if (!mapaAtual.has(m.id)) {
            mapaAtual.set(m.id, m);
            idsConhecidos.current.add(m.id);
            houve = true;
          }
        }
        if (!houve && silencioso) return prev;
        // Reconstrói lista: inicial + banco (sem duplicatas com id "initial")
        const doBanco = novas.filter((m) => !["initial"].includes(m.id));
        return [MENSAGEM_INICIAL, ...doBanco];
      });
    } catch {
      // Silencioso — não quebra a UI
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    carregarMensagens(false);
  }, [carregarMensagens]);

  // Polling a cada 6 segundos para pegar mensagens do WhatsApp
  useEffect(() => {
    const intervalo = setInterval(() => carregarMensagens(true), 6000);
    return () => clearInterval(intervalo);
  }, [carregarMensagens]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  async function enviar(texto?: string) {
    const conteudo = texto ?? input.trim();
    if (!conteudo || enviando) return;

    const idTemp = `temp-${Date.now()}`;
    const novaMsgInedita: Mensagem = {
      id: idTemp,
      autoria: "inedita",
      texto: conteudo,
      hora: formatHora(new Date()),
      origem: "web",
    };

    setMensagens((prev) => [...prev, novaMsgInedita]);
    setInput("");
    setEnviando(true);

    try {
      const res = await fetch("/api/diffy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: conteudo }),
      });
      const data = await res.json();
      const resposta = data.resposta ?? "Desculpa, algo deu errado. Tenta de novo?";

      const msgDiffy: Mensagem = {
        id: `temp-resp-${Date.now()}`,
        autoria: "diffy",
        texto: resposta,
        hora: formatHora(new Date()),
      };

      setMensagens((prev) => [...prev, msgDiffy]);

      // Sincroniza com banco para pegar IDs reais
      setTimeout(() => carregarMensagens(true), 500);
    } catch {
      setMensagens((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          autoria: "diffy",
          texto: "Tive um problema técnico agora. Tenta de novo?",
          hora: formatHora(new Date()),
        },
      ]);
    } finally {
      setEnviando(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  function toggleMicrofone() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SR) {
      alert("Seu navegador não suporta reconhecimento de voz. Use o Chrome.");
      return;
    }

    if (gravando && recognitionRef.current) {
      recognitionRef.current.stop();
      setGravando(false);
      return;
    }

    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const texto = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + texto : texto));
      inputRef.current?.focus();
    };

    recognition.onend = () => setGravando(false);
    recognition.onerror = () => setGravando(false);

    recognitionRef.current = recognition;
    recognition.start();
    setGravando(true);
  }

  const grupo = sugestoesPorContexto[grupoSugestao];

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3.5 flex-shrink-0"
        style={{ background: "#ffffff", borderBottom: "1px solid #F0F0F0" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0 rounded-full overflow-hidden shadow-sm">
            <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ background: "#25D366" }}
            />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
              Diffy
            </p>
            <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#25D366" }}>
              ● online agora
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "#F7F7F5", color: "#9E9E9E", fontFamily: "var(--font-inter)" }}
          >
            Espelho do WhatsApp
          </span>
        </div>
      </div>

      {/* Mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        style={{ background: "#F7F7F5" }}
      >
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px" style={{ background: "#E8E8E8" }} />
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{ background: "#EFEFEF", color: "#9E9E9E", fontFamily: "var(--font-inter)" }}
          >
            Hoje, {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
          </span>
          <div className="flex-1 h-px" style={{ background: "#E8E8E8" }} />
        </div>

        {carregando ? (
          <div className="flex justify-center py-8">
            <span className="text-sm" style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
              Carregando conversa...
            </span>
          </div>
        ) : (
          mensagens.map((msg) =>
            msg.autoria === "diffy" ? (
              <BubbleDiffy key={msg.id} msg={msg} />
            ) : (
              <BubbleInedita key={msg.id} msg={msg} />
            )
          )
        )}

        {enviando && <BubbleCarregando />}
        <div ref={bottomRef} />
      </div>

      {showScrollBtn && (
        <button
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="fixed bottom-32 right-8 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
          style={{ background: "#D81B60" }}
        >
          <ChevronDown size={18} color="white" />
        </button>
      )}

      {/* Sugestões rápidas */}
      <div
        className="flex-shrink-0 px-4 py-2"
        style={{ background: "#ffffff", borderTop: "1px solid #F5F5F5" }}
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {sugestoesPorContexto.map((g, i) => (
            <button
              key={i}
              onClick={() => setGrupoSugestao(i)}
              className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium transition-all"
              style={{
                background: grupoSugestao === i ? "#FCE4EC" : "transparent",
                color: grupoSugestao === i ? "#D81B60" : "#9E9E9E",
                fontFamily: "var(--font-inter)",
                border: grupoSugestao === i ? "1px solid #F8BBD0" : "1px solid transparent",
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pt-1.5">
          {grupo.itens.map((s) => (
            <button
              key={s}
              onClick={() => enviar(s)}
              disabled={enviando}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
              style={{
                background: "#F7F7F5",
                color: "#6B6B6B",
                fontFamily: "var(--font-inter)",
                border: "1px solid #E8E8E8",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 pb-5 pt-3 flex items-end gap-3 flex-shrink-0"
        style={{ background: "#ffffff" }}
      >
        <div
          className="flex-1 flex items-end gap-2 rounded-2xl px-4 py-2.5 transition-all"
          style={{ background: "#F7F7F5", border: "1.5px solid #E8E8E8" }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder={gravando ? "Ouvindo..." : "Manda mensagem pra Diffy..."}
            rows={1}
            className="flex-1 resize-none text-sm outline-none leading-relaxed bg-transparent"
            style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C", maxHeight: "120px" }}
          />
          <button
            onClick={toggleMicrofone}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{
              color: gravando ? "#D81B60" : "#BDBDBD",
              animation: gravando ? "pulse 1.2s infinite" : "none",
            }}
            title={gravando ? "Parar gravação" : "Falar com a Diffy"}
          >
            {gravando ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
        </div>

        <button
          onClick={() => enviar()}
          disabled={!input.trim() || enviando}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-35"
          style={{
            background: "#D81B60",
            boxShadow: input.trim() ? "0 0 12px rgba(216,27,96,0.35)" : "none",
          }}
        >
          <Send size={15} color="white" />
        </button>
      </div>
    </div>
  );
}
