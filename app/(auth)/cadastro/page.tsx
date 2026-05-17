"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RocketIcon } from "@/app/components/RocketIcon";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome, whatsapp },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/painel"), 2000);
    }
  }

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#0F0F0F" }}
      >
        <div className="text-center">
          <RocketIcon size={48} className="mx-auto mb-6" animate />
          <h1
            className="text-white text-2xl font-bold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Bem-vinda, {nome}!
          </h1>
          <p className="text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
            Sua Diffy está pronta. Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  const inputStyle = {
    background: "#111",
    border: "1px solid #2E2E2E",
    fontFamily: "var(--font-inter)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#0F0F0F" }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-10">
          <RocketIcon size={28} />
          <span
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Diffy<span style={{ color: "#D81B60" }}>.</span>
          </span>
        </div>

        <div
          className="p-8 rounded-2xl"
          style={{ background: "#1A1A1A", border: "1px solid #2E2E2E" }}
        >
          <h1
            className="text-white text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ativar minha Diffy
          </h1>
          <p className="text-gray-400 text-sm mb-8" style={{ fontFamily: "var(--font-inter)" }}>
            Preenche rápido. Em 5 minutos você já tá conversando com ela.
          </p>

          <form onSubmit={handleCadastro} className="space-y-5">
            {[
              { label: "Seu nome", value: nome, set: setNome, type: "text", placeholder: "Como a Diffy vai te chamar" },
              { label: "Email", value: email, set: setEmail, type: "email", placeholder: "seu@email.com" },
              { label: "Senha", value: password, set: setPassword, type: "password", placeholder: "Mínimo 8 caracteres" },
              { label: "WhatsApp", value: whatsapp, set: setWhatsapp, type: "tel", placeholder: "(11) 99999-9999" },
            ].map((field) => (
              <div key={field.label}>
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  required
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#2E2E2E")}
                />
              </div>
            ))}

            {error && (
              <p className="text-sm" style={{ color: "#EC407A", fontFamily: "var(--font-inter)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "#D81B60",
                fontFamily: "var(--font-inter)",
                boxShadow: "0 0 20px rgba(216,27,96,0.35)",
              }}
            >
              <RocketIcon size={18} />
              {loading ? "Criando sua conta..." : "Ativar minha Diffy — R$ 88/mês"}
            </button>
          </form>

          <p
            className="mt-6 text-center text-sm text-gray-500"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Já tem conta?{" "}
            <Link href="/login" className="font-medium" style={{ color: "#D81B60" }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
