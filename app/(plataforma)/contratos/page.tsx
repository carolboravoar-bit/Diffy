"use client";

import { useState } from "react";
import {
  Plus, FileText, Download, Eye, CheckCircle2,
  Clock, XCircle, Search, Filter, ExternalLink,
  Shield, Pen,
} from "lucide-react";

type StatusContrato = "ativo" | "aguardando" | "rascunho" | "encerrado";

const statusConfig: Record<StatusContrato, { label: string; cor: string; fundo: string; icon: React.ReactNode }> = {
  ativo:       { label: "Ativo",                cor: "#2E7D32", fundo: "#E8F5E9",  icon: <CheckCircle2 size={12} /> },
  aguardando:  { label: "Aguard. assinatura",   cor: "#F9A825", fundo: "#FFF8E1",  icon: <Clock size={12} /> },
  rascunho:    { label: "Rascunho",             cor: "#9E9E9E", fundo: "#F5F5F5",  icon: <Pen size={12} /> },
  encerrado:   { label: "Encerrado",            cor: "#6B6B6B", fundo: "#F5F5F5",  icon: <XCircle size={12} /> },
};

type Contrato = {
  id: string;
  cliente: string;
  pacote: string;
  valor: number;
  dataAssinatura: string | null;
  dataEnvio: string;
  dataEncerramento: string | null;
  status: StatusContrato;
  zapsign: boolean;
};

const contratos: Contrato[] = [
  {
    id: "c1",
    cliente: "Júlia Martins",
    pacote: "Mentoria Premium — 8 sessões",
    valor: 2400,
    dataAssinatura: "16/04/2026",
    dataEnvio: "14/04/2026",
    dataEncerramento: null,
    status: "ativo",
    zapsign: true,
  },
  {
    id: "c2",
    cliente: "Ana Lima",
    pacote: "Mentoria Intensiva — 12 sessões",
    valor: 4800,
    dataAssinatura: "10/03/2026",
    dataEnvio: "08/03/2026",
    dataEncerramento: null,
    status: "ativo",
    zapsign: true,
  },
  {
    id: "c3",
    cliente: "Beatriz Costa",
    pacote: "Mentoria Premium — 8 sessões",
    valor: 2400,
    dataAssinatura: null,
    dataEnvio: "13/05/2026",
    dataEncerramento: null,
    status: "aguardando",
    zapsign: true,
  },
  {
    id: "c4",
    cliente: "Fernanda Rocha",
    pacote: "Mentoria Express — 4 sessões",
    valor: 1200,
    dataAssinatura: "02/04/2026",
    dataEnvio: "01/04/2026",
    dataEncerramento: null,
    status: "ativo",
    zapsign: true,
  },
  {
    id: "c5",
    cliente: "Sofia Andrade",
    pacote: "Mentoria Premium — 6 sessões",
    valor: 3600,
    dataAssinatura: "05/05/2026",
    dataEnvio: "03/05/2026",
    dataEncerramento: null,
    status: "ativo",
    zapsign: true,
  },
  {
    id: "c6",
    cliente: "Carla Mendes",
    pacote: "Mentoria Premium — 8 sessões",
    valor: 3200,
    dataAssinatura: "15/01/2026",
    dataEnvio: "13/01/2026",
    dataEncerramento: "15/05/2026",
    status: "encerrado",
    zapsign: true,
  },
  {
    id: "c7",
    cliente: "Nova cliente",
    pacote: "Mentoria Express — 4 sessões",
    valor: 1200,
    dataAssinatura: null,
    dataEnvio: "—",
    dataEncerramento: null,
    status: "rascunho",
    zapsign: false,
  },
];

const modelos = [
  { id: "m1", nome: "Mentoria Premium — 8 sessões",   usos: 4 },
  { id: "m2", nome: "Mentoria Intensiva — 12 sessões", usos: 2 },
  { id: "m3", nome: "Mentoria Express — 4 sessões",    usos: 3 },
];

function ContratoCard({ c }: { c: Contrato }) {
  const st = statusConfig[c.status];
  return (
    <div className="flex items-center gap-5 px-6 py-4 bg-white hover:bg-gray-50 transition-colors"
      style={{ borderBottom: "1px solid #F5F5F5" }}>
      {/* Ícone */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "#F7F7F5" }}>
        <FileText size={18} style={{ color: "#9E9E9E" }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
            {c.cliente}
          </p>
          <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold"
            style={{ background: st.fundo, color: st.cor, fontFamily: "var(--font-inter)" }}>
            {st.icon}
            {st.label}
          </span>
          {c.zapsign && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "#F0FDF4", color: "#15803d", fontFamily: "var(--font-inter)", border: "1px solid #bbf7d0" }}>
              <Shield size={10} />
              ZapSign
            </span>
          )}
        </div>
        <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{c.pacote}</p>
      </div>

      {/* Valor */}
      <div className="text-right flex-shrink-0">
        <p className="text-base font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#D81B60" }}>
          R$ {c.valor.toLocaleString("pt-BR")}
        </p>
      </div>

      {/* Datas */}
      <div className="text-right flex-shrink-0 hidden lg:block">
        {c.dataAssinatura ? (
          <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2E7D32" }}>
            ✓ Assinado em {c.dataAssinatura}
          </p>
        ) : c.status === "aguardando" ? (
          <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#F9A825" }}>
            Enviado em {c.dataEnvio}
          </p>
        ) : (
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
            Não enviado
          </p>
        )}
        {c.dataEncerramento && (
          <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
            Encerrado em {c.dataEncerramento}
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Visualizar">
          <Eye size={14} style={{ color: "#9E9E9E" }} />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Baixar PDF">
          <Download size={14} style={{ color: "#9E9E9E" }} />
        </button>
        {c.status === "aguardando" && (
          <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
            style={{ background: "#D81B60", color: "#fff", fontFamily: "var(--font-inter)" }}>
            <ExternalLink size={11} /> Abrir no ZapSign
          </button>
        )}
        {c.status === "rascunho" && (
          <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
            style={{ background: "#F9A825", color: "#fff", fontFamily: "var(--font-inter)" }}>
            <ExternalLink size={11} /> Enviar pra assinar
          </button>
        )}
      </div>
    </div>
  );
}

export default function ContratosPage() {
  const [filtro, setFiltro] = useState<StatusContrato | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [abaSelecionada, setAbaSelecionada] = useState<"contratos" | "modelos">("contratos");

  const filtrados = contratos.filter((c) => {
    const matchBusca = c.cliente.toLowerCase().includes(busca.toLowerCase()) || c.pacote.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === "todos" || c.status === filtro;
    return matchBusca && matchFiltro;
  });

  const contagens = {
    todos:      contratos.length,
    ativo:      contratos.filter((c) => c.status === "ativo").length,
    aguardando: contratos.filter((c) => c.status === "aguardando").length,
    rascunho:   contratos.filter((c) => c.status === "rascunho").length,
    encerrado:  contratos.filter((c) => c.status === "encerrado").length,
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 flex-shrink-0 bg-white" style={{ borderBottom: "1px solid #EFEFEF" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}>
              Contratos
            </h1>
            <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              {contagens.ativo} ativos · {contagens.aguardando} aguardando assinatura
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#F7F7F5", border: "1px solid #EFEFEF" }}>
              <Search size={14} style={{ color: "#BDBDBD" }} />
              <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar contrato..." className="text-sm outline-none bg-transparent w-40"
                style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#D81B60", fontFamily: "var(--font-inter)" }}>
              <Plus size={15} />
              Novo contrato
            </button>
          </div>
        </div>

        {/* Abas principais */}
        <div className="flex gap-1 mb-0">
          {[
            { key: "contratos", label: "Contratos" },
            { key: "modelos",   label: "Modelos" },
          ].map((a) => {
            const active = abaSelecionada === a.key;
            return (
              <button key={a.key} onClick={() => setAbaSelecionada(a.key as "contratos" | "modelos")}
                className="px-4 py-2.5 text-sm font-medium border-b-2 transition-all"
                style={{
                  borderColor: active ? "#D81B60" : "transparent",
                  color: active ? "#D81B60" : "#9E9E9E",
                  fontFamily: "var(--font-inter)",
                }}>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {abaSelecionada === "contratos" && (
          <>
            {/* Filtros de status */}
            <div className="flex items-center gap-2 mb-4">
              <Filter size={13} style={{ color: "#BDBDBD" }} />
              {(["todos", "ativo", "aguardando", "rascunho", "encerrado"] as const).map((f) => {
                const active = filtro === f;
                const cfg = f === "todos" ? { cor: "#2C2C2C", fundo: "#F5F5F5" } : statusConfig[f];
                const count = contagens[f];
                return (
                  <button key={f} onClick={() => setFiltro(f)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                    style={{
                      background: active ? cfg.fundo : "transparent",
                      color: active ? cfg.cor : "#9E9E9E",
                      border: active ? `1px solid ${cfg.cor}30` : "1px solid transparent",
                      fontFamily: "var(--font-inter)",
                    }}>
                    {f === "todos" ? "Todos" : statusConfig[f].label}
                    <span className="font-bold">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Tabela / lista */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EFEFEF" }}>
              <div className="px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 bg-gray-50 hidden lg:grid"
                style={{ borderBottom: "1px solid #F5F5F5" }}>
                {["Cliente / Pacote", "Valor", "Status", "Ações"].map((col) => (
                  <span key={col} className="text-xs font-semibold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>{col}</span>
                ))}
              </div>
              {filtrados.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <FileText size={32} style={{ color: "#E0E0E0", margin: "0 auto 12px" }} />
                  <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                    Nenhum contrato encontrado
                  </p>
                </div>
              ) : (
                filtrados.map((c) => <ContratoCard key={c.id} c={c} />)
              )}
            </div>
          </>
        )}

        {abaSelecionada === "modelos" && (
          <div>
            <p className="text-sm mb-4" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
              Modelos de contrato salvos para reutilizar a cada novo fechamento.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {modelos.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl bg-white hover:shadow-sm transition-all cursor-pointer group"
                  style={{ border: "1px solid #EFEFEF" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "#FCE4EC" }}>
                    <FileText size={18} style={{ color: "#D81B60" }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                    {m.nome}
                  </p>
                  <p className="text-xs mb-4" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                    Usado {m.usos} vez{m.usos !== 1 ? "es" : ""}
                  </p>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: "#FCE4EC", color: "#D81B60", fontFamily: "var(--font-inter)" }}>
                      Usar modelo
                    </button>
                    <button className="text-xs font-medium"
                      style={{ color: "#9E9E9E", fontFamily: "var(--font-inter)" }}>
                      Editar
                    </button>
                  </div>
                </div>
              ))}
              {/* Adicionar modelo */}
              <button className="p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:border-pink-200"
                style={{ border: "2px dashed #E8E8E8", minHeight: "160px" }}>
                <Plus size={20} style={{ color: "#BDBDBD" }} />
                <span className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}>
                  Novo modelo
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
