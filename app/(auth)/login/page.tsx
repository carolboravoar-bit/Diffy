"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RocketIcon } from "@/app/components/RocketIcon";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou senha incorretos. Tenta de novo.");
      setLoading(false);
    } else {
      router.push("/decolagem");
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0F0F0F" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
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
            Boas-vindas de volta
          </h1>
          <p className="text-gray-400 text-sm mb-8" style={{ fontFamily: "var(--font-inter)" }}>
            Entra pra falar com a sua Diffy.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm outline-none transition-all"
                style={{
                  background: "#111",
                  border: "1px solid #2E2E2E",
                  fontFamily: "var(--font-inter)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2E2E2E")}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm outline-none transition-all"
                style={{
                  background: "#111",
                  border: "1px solid #2E2E2E",
                  fontFamily: "var(--font-inter)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2E2E2E")}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "#EC407A", fontFamily: "var(--font-inter)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#D81B60",
                fontFamily: "var(--font-inter)",
                boxShadow: "0 0 20px rgba(216,27,96,0.35)",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p
            className="mt-6 text-center text-sm text-gray-500"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-medium" style={{ color: "#D81B60" }}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
