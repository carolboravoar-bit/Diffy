"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, X, Check } from "lucide-react";

export function BannerEmailTemporario() {
  const [emailAtual, setEmailAtual] = useState<string | null>(null);
  const [novoEmail, setNovoEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "enviado" | "erro">("idle");
  const [dispensado, setDispensado] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email ?? "";
      if (email.endsWith("@diffy.app")) {
        setEmailAtual(email);
      }
    });
  }, []);

  if (!emailAtual || dispensado) return null;

  async function salvar() {
    if (!novoEmail.includes("@") || !novoEmail.includes(".")) return;
    setStatus("loading");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email: novoEmail.trim() });

    if (error) {
      setStatus("erro");
      return;
    }

    // Atualiza também no profile
    await fetch("/api/meu-contexto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_real: novoEmail.trim() }),
    });

    setStatus("enviado");
  }

  return (
    <div
      style={{
        background: "#FFF8E1",
        borderBottom: "1px solid #F9A825",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "var(--font-inter)",
        fontSize: 13,
        flexWrap: "wrap",
      }}
    >
      <Mail size={16} style={{ color: "#F9A825", flexShrink: 0 }} />

      {status === "enviado" ? (
        <span style={{ color: "#2E7D32", display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={14} />
          Link de confirmação enviado para <strong>{novoEmail}</strong>. Clique no e-mail para confirmar.
        </span>
      ) : (
        <>
          <span style={{ color: "#795548" }}>
            Seu acesso usa um e-mail temporário. Cadastre seu e-mail real para recuperar senha:
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="seu@email.com"
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && salvar()}
              style={{
                border: "1px solid #F9A825",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 13,
                outline: "none",
                fontFamily: "var(--font-inter)",
                background: "white",
                width: 220,
              }}
            />
            <button
              onClick={salvar}
              disabled={status === "loading" || !novoEmail}
              style={{
                background: "#D81B60",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "5px 14px",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Salvando..." : "Salvar"}
            </button>
            {status === "erro" && (
              <span style={{ color: "#C62828", fontSize: 12 }}>Erro ao salvar. Tenta de novo.</span>
            )}
          </div>
        </>
      )}

      <button
        onClick={() => setDispensado(true)}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#9E9E9E",
          padding: 2,
          display: "flex",
        }}
        title="Dispensar por agora"
      >
        <X size={14} />
      </button>
    </div>
  );
}
