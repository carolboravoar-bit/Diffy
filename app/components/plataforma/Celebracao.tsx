"use client";

import { useEffect, useRef, useState } from "react";
import { RocketIcon } from "@/app/components/RocketIcon";

const CORES = ["#D81B60", "#EC407A", "#F8BBD0", "#2E7D32", "#F9A825", "#1565C0", "#fff"];

type Props = {
  mensagem: string;
  submensagem?: string;
  duracao?: number;
  onFim?: () => void;
};

export function Celebracao({ mensagem, submensagem, duracao = 3200, onFim }: Props) {
  const [visivel, setVisivel] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const partículas = 42;
    const elementos: HTMLElement[] = [];

    for (let i = 0; i < partículas; i++) {
      const el = document.createElement("div");
      el.className = "confetti-particle";
      el.style.left = `${Math.random() * 100}vw`;
      el.style.bottom = "0";
      el.style.background = CORES[Math.floor(Math.random() * CORES.length)];
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      el.style.width = `${6 + Math.random() * 8}px`;
      el.style.height = `${6 + Math.random() * 8}px`;
      el.style.animationDelay = `${Math.random() * 0.8}s`;
      el.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
      document.body.appendChild(el);
      elementos.push(el);
    }

    const timer = setTimeout(() => {
      setVisivel(false);
      onFim?.();
    }, duracao);

    return () => {
      clearTimeout(timer);
      elementos.forEach((el) => el.remove());
    };
  }, [duracao, onFim]);

  if (!visivel) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="bg-white rounded-3xl px-10 py-8 text-center shadow-2xl pointer-events-auto"
        style={{
          animation: "celebration-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          border: "2px solid #FCE4EC",
          maxWidth: "340px",
        }}
      >
        <div className="flex justify-center mb-4">
          <RocketIcon size={48} animate />
        </div>
        <p
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
        >
          {mensagem}
        </p>
        {submensagem && (
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}
          >
            {submensagem}
          </p>
        )}
      </div>
    </div>
  );
}
