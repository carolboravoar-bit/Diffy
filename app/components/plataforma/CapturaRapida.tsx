"use client";

import { useState, useRef } from "react";
import { X, Mic, Send } from "lucide-react";
import { RocketIcon } from "@/app/components/RocketIcon";

type Categoria = "lembrete" | "lancamento" | "ideia" | "tarefa";

const categorias: { key: Categoria; label: string; cor: string; fundo: string; exemplo: string }[] = [
  { key: "lembrete", label: "Lembrete", cor: "#F9A825", fundo: "#FFF8E1", exemplo: "Ligar pra Júlia amanhã às 14h" },
  { key: "lancamento", label: "Lançamento", cor: "#2E7D32", fundo: "#E8F5E9", exemplo: "Recebi R$ 600 da Ana, sessão de hoje" },
  { key: "ideia", label: "Ideia de conteúdo", cor: "#D81B60", fundo: "#FCE4EC", exemplo: "Post sobre o que me diferencia como coach" },
  { key: "tarefa", label: "Tarefa", cor: "#1565C0", fundo: "#E3F2FD", exemplo: "Enviar contrato pra Beatriz" },
];

export function CapturaRapida() {
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("lembrete");
  const [enviado, setEnviado] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function abrir() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function fechar() {
    setOpen(false);
    setTexto("");
    setEnviado(false);
  }

  async function enviar() {
    if (!texto.trim()) return;
    setEnviado(true);
    try {
      await fetch("/api/captura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: texto.trim(), categoria }),
      });
    } catch {
      // Falha silenciosa — não bloqueia a UX
    }
    setTimeout(() => fechar(), 1800);
  }

  const cat = categorias.find((c) => c.key === categoria)!;

  return (
    <>
      {/* Botão flutuante */}
      {!open && (
        <button
          onClick={abrir}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full text-white font-semibold text-sm shadow-xl transition-all hover:scale-105 hover:opacity-95"
          style={{
            background: "#D81B60",
            fontFamily: "var(--font-inter)",
            boxShadow: "0 4px 24px rgba(216,27,96,0.45), 0 1px 6px rgba(216,27,96,0.2)",
          }}
        >
          <RocketIcon size={16} />
          Captura rápida
        </button>
      )}

      {/* Modal */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
            onClick={fechar}
          />
          <div
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "#fff", border: "1px solid #E8E8E8" }}
          >
            {enviado ? (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-3">
                  <RocketIcon size={36} animate />
                </div>
                <p
                  className="font-semibold text-gray-800"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "18px" }}
                >
                  Capturado!
                </p>
                <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                  A Diffy já sabe.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: "1px solid #F5F5F5" }}
                >
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  >
                    Captura rápida
                  </p>
                  <button onClick={fechar}>
                    <X size={18} style={{ color: "#BDBDBD" }} />
                  </button>
                </div>

                {/* Categorias */}
                <div className="px-4 pt-4 flex flex-wrap gap-2">
                  {categorias.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setCategoria(c.key)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: categoria === c.key ? c.fundo : "#F5F5F5",
                        color: categoria === c.key ? c.cor : "#9E9E9E",
                        border: categoria === c.key ? `1.5px solid ${c.cor}` : "1.5px solid transparent",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="px-4 py-4">
                  <textarea
                    ref={inputRef}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
                    }}
                    placeholder={cat.exemplo}
                    rows={3}
                    className="w-full resize-none outline-none text-sm leading-relaxed rounded-xl px-4 py-3 transition-all"
                    style={{
                      background: cat.fundo,
                      border: `1.5px solid ${cat.cor}20`,
                      color: "#2C2C2C",
                      fontFamily: "var(--font-inter)",
                    }}
                  />
                </div>

                {/* Actions */}
                <div
                  className="flex items-center justify-between px-4 pb-4 gap-3"
                >
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-50"
                    style={{ border: "1px solid #E8E8E8", color: "#6B6B6B", fontFamily: "var(--font-inter)" }}
                  >
                    <Mic size={15} style={{ color: "#D81B60" }} />
                    Áudio
                  </button>
                  <button
                    onClick={enviar}
                    disabled={!texto.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                    style={{
                      background: "#D81B60",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    <Send size={14} />
                    Capturar
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
