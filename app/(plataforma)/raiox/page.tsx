"use client";

import { useState, useRef } from "react";
import { Pill } from "@/app/components/Pill";
import { RocketIcon } from "@/app/components/RocketIcon";

type StatusRaiox = "vazio" | "uploading" | "processando" | "ativo";

const dimensoesMock = [
  { label: "Conceito Estratégico", valor: "Diferenciação pelo método próprio de transformação comportamental" },
  { label: "Público-Alvo", valor: "Empreendedoras solo, 28-45 anos, com negócio estabelecido mas sem clareza estratégica" },
  { label: "Diferenciação Principal", valor: "Única metodologia que combina comportamento com posicionamento de preço premium" },
  { label: "Tom de Voz", valor: "Direto, quente, sem enrolação, linguagem feminina e empoderada" },
  { label: "Problema que Resolve", valor: "Empreendedora que cobra barato por não saber comunicar seu real valor" },
  { label: "Resultado Prometido", valor: "Cobrar 3x mais pelos mesmos serviços com mais confiança e menos desgaste" },
  { label: "Promessa Única", valor: "Em 90 dias você sabe exatamente o que te diferencia e cobra pelo que vale" },
];

export default function RaioXPage() {
  const [status, setStatus] = useState<StatusRaiox>("vazio");
  const [progresso, setProgresso] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function simularUpload() {
    setStatus("uploading");
    setProgresso(0);
    const interval = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("processando");
          setTimeout(() => setStatus("ativo"), 2500);
          return 100;
        }
        return prev + 8;
      });
    }, 120);
  }

  return (
    <div className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
      {/* Header */}
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
          como conhecedora real do teu negócio.
        </p>
      </div>

      {status === "vazio" && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload */}
          <div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={simularUpload}
            />
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
                Apenas arquivos PDF
              </span>
            </div>
          </div>

          {/* Explicação dos modos */}
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
            className="text-lg font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
          >
            Subindo o RaioX...
          </h2>
          <div
            className="w-full h-2 rounded-full mb-2 overflow-hidden"
            style={{ background: "#F5F5F5" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progresso}%`,
                background: "linear-gradient(to right, #D81B60, #EC407A)",
              }}
            />
          </div>
          <p className="text-sm text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
            {progresso}%
          </p>
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
        </div>
      )}

      {status === "ativo" && (
        <div>
          {/* Badge modo estratégico */}
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

          {/* Dimensões extraídas */}
          <div className="grid gap-4">
            {dimensoesMock.map((d, i) => (
              <div
                key={i}
                className="p-5 rounded-xl"
                style={{ background: "#fff", border: "1px solid #E8E8E8" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
                >
                  {d.label}
                </p>
                <p
                  className="text-sm text-gray-700"
                  style={{ fontFamily: "var(--font-inter)", lineHeight: 1.7 }}
                >
                  {d.valor}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStatus("vazio")}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Substituir o RaioX →
          </button>
        </div>
      )}
    </div>
  );
}
