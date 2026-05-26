"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Pill } from "@/app/components/Pill";
import { RocketIcon } from "@/app/components/RocketIcon";

type StatusRaiox = "carregando" | "vazio" | "uploading" | "processando" | "ativo";

export default function RaioXPage() {
  const [status, setStatus] = useState<StatusRaiox>("carregando");
  const [textoExtraido, setTextoExtraido] = useState<string>("");
  const [erro, setErro] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checarStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/raiox/status");
      const data = await res.json();
      if (data.status === "ativo") {
        setTextoExtraido(data.texto_extraido ?? "");
        setStatus("ativo");
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } else if (data.status === "processando") {
        setStatus("processando");
      } else {
        setStatus("vazio");
      }
    } catch {
      setStatus("vazio");
    }
  }, []);

  useEffect(() => {
    checarStatus();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [checarStatus]);

  async function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setErro("");
    setStatus("uploading");

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    const res = await fetch("/api/raiox/upload", { method: "POST", body: formData });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error ?? "Erro ao subir arquivo.");
      setStatus("vazio");
      return;
    }

    setStatus("processando");
    pollingRef.current = setInterval(checarStatus, 3000);
  }

  async function substituir() {
    await fetch("/api/raiox/status", { method: "DELETE" });
    setTextoExtraido("");
    setStatus("vazio");
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }

  if (status === "carregando") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: "#D81B60",
                animation: `twinkle 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
      <div className="mb-8">
        <Pill label="RAIOX DA DIFERENCIAÇÃO" />
        <h1
          className="text-2xl font-bold mt-2"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
        >
          Seu mapa estratégico
        </h1>
        <p
          className="text-gray-500 mt-1"
          style={{ fontFamily: "var(--font-inter)", fontSize: "15px" }}
        >
          Quando você sobe o RaioX, a Diffy ativa o modo estratégico e passa a responder
          como conhecedora real do seu negócio.
        </p>
      </div>

      {status === "vazio" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={handleArquivo}
            />
            {erro && (
              <p
                className="mb-3 text-sm text-red-600"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {erro}
              </p>
            )}
            <div
              className="rounded-2xl p-10 text-center cursor-pointer transition-all hover:border-pink-300"
              style={{
                border: "2px dashed #E8E8E8",
                background: "#FAF6EF",
              }}
              onClick={() => inputRef.current?.click()}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "#FCE4EC" }}
              >
                <RocketIcon size={28} />
              </div>
              <h2
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
              >
                Subir meu RaioX
              </h2>
              <p
                className="text-sm text-gray-500 mb-4"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Clica aqui ou arrasta o PDF do seu RaioX da Diferenciação.
                A Diffy extrai os conceitos e ativa o modo estratégico.
              </p>
              <span
                className="text-xs font-semibold"
                style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
              >
                PDF, TXT ou MD — até 10MB
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
            >
              O que muda com o RaioX ativado
            </h2>
            {[
              {
                modo: "Sem RaioX",
                descricao: "Diffy funciona em modo operacional. Organiza, lembra, lança, cobra. Útil desde o dia 1.",
                cor: "#F9A825",
                fundo: "#FFF8E1",
              },
              {
                modo: "Com RaioX",
                descricao: "Diffy ativa o modo estratégico. Passa a falar como conhecedora da sua diferenciação, sugere conteúdo alinhado à sua marca, posiciona suas cobranças.",
                cor: "#D81B60",
                fundo: "#FCE4EC",
                destaque: true,
              },
              {
                modo: "Rota Inédita",
                descricao: "Diffy entra como ponte entre você e a Carol. Modo imersão completo.",
                cor: "#1565C0",
                fundo: "#E3F2FD",
              },
            ].map((m) => (
              <div
                key={m.modo}
                className="p-5 rounded-xl"
                style={{
                  background: m.fundo,
                  border: m.destaque ? `1.5px solid ${m.cor}` : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: m.cor }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-inter)", color: m.cor }}
                  >
                    {m.modo}
                  </span>
                </div>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "var(--font-inter)", lineHeight: 1.7 }}
                >
                  {m.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "uploading" && (
        <div
          className="max-w-md mx-auto p-8 rounded-2xl text-center"
          style={{ background: "#fff", border: "1px solid #E8E8E8" }}
        >
          <RocketIcon size={40} className="mx-auto mb-4 animate-float" />
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
          >
            Subindo o RaioX...
          </h2>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "#F5F5F5" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "60%",
                background: "linear-gradient(to right, #D81B60, #EC407A)",
                animation: "progress-pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      )}

      {status === "processando" && (
        <div
          className="max-w-md mx-auto p-8 rounded-2xl text-center"
          style={{ background: "#fff", border: "1px solid #D81B60", boxShadow: "0 0 24px rgba(216,27,96,0.12)" }}
        >
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: "#D81B60",
                  animation: `twinkle 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <h2
            className="text-lg font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
          >
            A Diffy está lendo seu RaioX
          </h2>
          <p className="text-sm text-gray-500" style={{ fontFamily: "var(--font-inter)" }}>
            Identificando conceito estratégico, as 7 dimensões e sua diferenciação principal...
          </p>
          <p className="text-xs text-gray-400 mt-3" style={{ fontFamily: "var(--font-inter)" }}>
            Pode levar alguns instantes. Esta página atualiza automaticamente.
          </p>
        </div>
      )}

      {status === "ativo" && (
        <div>
          <div
            className="flex items-center gap-3 p-4 rounded-2xl mb-8 max-w-lg"
            style={{ background: "#FCE4EC", border: "1px solid #D81B60" }}
          >
            <RocketIcon size={24} />
            <div>
              <p
                className="font-bold text-sm"
                style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
              >
                Modo estratégico ativo
              </p>
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Diffy agora conhece a sua diferenciação de verdade.
              </p>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl mb-6"
            style={{ background: "#fff", border: "1px solid #E8E8E8" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
            >
              Conteúdo do seu RaioX
            </p>
            <pre
              className="text-sm text-gray-700 whitespace-pre-wrap"
              style={{ fontFamily: "var(--font-inter)", lineHeight: 1.8 }}
            >
              {textoExtraido}
            </pre>
          </div>

          <button
            onClick={substituir}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Substituir o RaioX →
          </button>
        </div>
      )}
    </div>
  );
}
