"use client";

import { useState } from "react";
import { Pill } from "@/app/components/Pill";
import { RocketIcon } from "@/app/components/RocketIcon";

type TabConfig = "perfil" | "integracoes" | "plano";

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<TabConfig>("perfil");
  const [nome, setNome] = useState("Carol Possani");
  const [email, setEmail] = useState("carol@universodadiferenciacao.com");
  const [whatsapp, setWhatsapp] = useState("(11) 99999-9999");
  const [profissao, setProfissao] = useState("Estrategista de Diferenciação");

  return (
    <div className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
      <div className="mb-8">
        <Pill label="CONFIGURAÇÕES" />
        <h1
          className="text-2xl font-bold mt-2"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
        >
          Conta e integrações
        </h1>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-8 p-1 rounded-xl w-fit"
        style={{ background: "#F5F5F5" }}
      >
        {(["perfil", "integracoes", "plano"] as TabConfig[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t ? "#D81B60" : "transparent",
              color: tab === t ? "#fff" : "#6B6B6B",
              fontFamily: "var(--font-inter)",
            }}
          >
            {{ perfil: "Perfil", integracoes: "Integrações", plano: "Plano" }[t]}
          </button>
        ))}
      </div>

      {/* Perfil */}
      {tab === "perfil" && (
        <div className="max-w-lg">
          <div
            className="p-8 rounded-2xl"
            style={{ background: "#fff", border: "1px solid #E8E8E8" }}
          >
            <h2
              className="text-lg font-bold mb-6"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
            >
              Seus dados
            </h2>
            <div className="space-y-5">
              {[
                { label: "Nome", value: nome, set: setNome },
                { label: "Email", value: email, set: setEmail },
                { label: "WhatsApp", value: whatsapp, set: setWhatsapp },
                { label: "Profissão", value: profissao, set: setProfissao },
              ].map((field) => (
                <div key={field.label}>
                  <label
                    className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "#F5F5F5",
                      border: "1px solid #E8E8E8",
                      fontFamily: "var(--font-inter)",
                      color: "#2C2C2C",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#D81B60")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E8E8")}
                  />
                </div>
              ))}
              <button
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integrações */}
      {tab === "integracoes" && (
        <div className="max-w-2xl space-y-4">
          {[
            {
              nome: "WhatsApp Business",
              descricao: "Conecta o número da Diffy no seu WhatsApp pra receber e enviar mensagens.",
              status: "conectado",
              cor: "#25D366",
            },
            {
              nome: "Google Calendar",
              descricao: "Sincroniza seus compromissos e permite que a Diffy lembre antes das reuniões.",
              status: "desconectado",
              cor: "#6B6B6B",
            },
            {
              nome: "Calendly",
              descricao: "A Diffy vê seus horários disponíveis e pode sugerir agendamentos.",
              status: "desconectado",
              cor: "#6B6B6B",
            },
            {
              nome: "ZapSign",
              descricao: "Geração e assinatura digital de contratos diretamente pela plataforma.",
              status: "desconectado",
              cor: "#6B6B6B",
            },
            {
              nome: "Instagram",
              descricao: "Análise de desempenho dos posts e ideias de conteúdo baseadas no RaioX.",
              status: "em breve",
              cor: "#F9A825",
            },
          ].map((integracao) => (
            <div
              key={integracao.nome}
              className="flex items-center justify-between p-5 rounded-2xl"
              style={{ background: "#fff", border: "1px solid #E8E8E8" }}
            >
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
                  >
                    {integracao.nome}
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: integracao.status === "conectado" ? "#E8F5E9" : integracao.status === "em breve" ? "#FFF8E1" : "#F5F5F5",
                      color: integracao.cor,
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {integracao.status === "conectado" ? "● conectado" : integracao.status === "em breve" ? "em breve" : "desconectado"}
                  </span>
                </div>
                <p
                  className="text-xs text-gray-500"
                  style={{ fontFamily: "var(--font-inter)", lineHeight: 1.6 }}
                >
                  {integracao.descricao}
                </p>
              </div>
              <button
                disabled={integracao.status === "em breve"}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: integracao.status === "conectado" ? "#F5F5F5" : "#FCE4EC",
                  color: integracao.status === "conectado" ? "#6B6B6B" : "#D81B60",
                  fontFamily: "var(--font-inter)",
                  flexShrink: 0,
                }}
              >
                {integracao.status === "conectado" ? "Desconectar" : "Conectar"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Plano */}
      {tab === "plano" && (
        <div className="max-w-lg">
          <div
            className="p-8 rounded-2xl mb-6"
            style={{ background: "#1A0010", border: "1px solid #D81B60", boxShadow: "0 0 30px rgba(216,27,96,0.12)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-inter)", color: "#D81B60" }}
                >
                  Plano ativo
                </p>
                <h2
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Diffy — Modo Estratégico
                </h2>
              </div>
              <RocketIcon size={32} />
            </div>
            <p
              className="text-gray-300 text-sm mb-4"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              R$ 88/mês · Próxima cobrança: 15/06/2026
            </p>
            <div className="space-y-2">
              {["RaioX ativado", "Chat ilimitado no WhatsApp", "Painel web completo", "Financeiro, clientes, agenda", "Suporte por WhatsApp"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span style={{ color: "#D81B60" }}>✓</span>
                  <span className="text-sm text-gray-300" style={{ fontFamily: "var(--font-inter)" }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Cancelar assinatura
          </button>
        </div>
      )}
    </div>
  );
}
