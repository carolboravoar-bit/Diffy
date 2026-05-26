import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { salvarMensagem, buscarHistorico } from "@/lib/db/mensagens";
import { buscarContextoInedita } from "@/lib/db/documentos";
import { buscarContextoOperacional } from "@/lib/db/contexto-operacional";
import { createAdminClient } from "@/lib/supabase/admin";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── Helper TwiML ──────────────────────────────────────────────────────────────

function twiml(mensagem: string): Response {
  const segura = mensagem
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${segura}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}

// ── Identificação da inédita pelo número de WhatsApp ─────────────────────────

async function buscarInedita(
  from: string
): Promise<{ id: string; nome: string | null } | null> {
  const numero = from.replace("whatsapp:", "").trim();
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, nome")
    .eq("whatsapp", numero)
    .maybeSingle();
  return data ?? null;
}

// ── Definição das tools ───────────────────────────────────────────────────────

const TOOLS: Anthropic.Tool[] = [
  {
    name: "lancar_receita",
    description: "Registra uma receita no financeiro da inédita.",
    input_schema: {
      type: "object" as const,
      properties: {
        valor: { type: "number" as const },
        descricao: { type: "string" as const },
        cliente_nome: { type: "string" as const },
      },
      required: ["valor", "descricao"],
    },
  },
  {
    name: "lancar_despesa",
    description: "Registra uma despesa no financeiro.",
    input_schema: {
      type: "object" as const,
      properties: {
        valor: { type: "number" as const },
        descricao: { type: "string" as const },
        categoria: { type: "string" as const },
      },
      required: ["valor", "descricao"],
    },
  },
  {
    name: "criar_cliente",
    description: "Cadastra um novo cliente.",
    input_schema: {
      type: "object" as const,
      properties: {
        nome: { type: "string" as const },
        profissao: { type: "string" as const },
        email: { type: "string" as const },
        whatsapp: { type: "string" as const },
      },
      required: ["nome"],
    },
  },
  {
    name: "criar_agendamento",
    description: "Cria um compromisso ou sessão na agenda.",
    input_schema: {
      type: "object" as const,
      properties: {
        titulo: { type: "string" as const },
        data: { type: "string" as const, description: "YYYY-MM-DD" },
        hora: { type: "string" as const, description: "HH:MM (opcional)" },
        tipo: {
          type: "string" as const,
          description: "sessao, entrega, followup, pessoal ou lembrete",
        },
      },
      required: ["titulo", "data"],
    },
  },
];

// ── Execução das tools ────────────────────────────────────────────────────────

async function executarTool(
  name: string,
  input: Record<string, unknown>,
  inedita_id: string
): Promise<string> {
  const admin = createAdminClient();
  const hoje = new Date().toISOString().split("T")[0];

  if (name === "lancar_receita") {
    await admin.from("lancamentos").insert({
      inedita_id,
      tipo: "receita",
      descricao: input.descricao,
      valor: input.valor,
      data: hoje,
    });
    return `Receita de R$ ${input.valor} lançada: ${input.descricao}`;
  }

  if (name === "lancar_despesa") {
    await admin.from("lancamentos").insert({
      inedita_id,
      tipo: "despesa",
      descricao: input.descricao,
      valor: input.valor,
      data: hoje,
      categoria: input.categoria ?? null,
    });
    return `Despesa de R$ ${input.valor} lançada: ${input.descricao}`;
  }

  if (name === "criar_cliente") {
    await admin.from("clientes").insert({
      inedita_id,
      nome: input.nome,
      profissao: input.profissao ?? null,
      email: input.email ?? null,
      whatsapp: input.whatsapp ?? null,
      status: "ativa",
    });
    return `Cliente ${input.nome} cadastrada com sucesso.`;
  }

  if (name === "criar_agendamento") {
    await admin.from("agendamentos").insert({
      inedita_id,
      titulo: input.titulo,
      data: input.data,
      hora: input.hora ?? null,
      tipo: input.tipo ?? "lembrete",
    });
    const hora = input.hora ? ` às ${input.hora}` : "";
    return `Compromisso "${input.titulo}" criado para ${input.data}${hora}.`;
  }

  return `Tool ${name} não reconhecida.`;
}

// ── Handler principal ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const corpo = formData.get("Body")?.toString().trim() ?? "";
    const de = formData.get("From")?.toString() ?? "";
    const mediaType = formData.get("MediaContentType0")?.toString() ?? "";

    // Detecta áudio
    if (mediaType.startsWith("audio/")) {
      return twiml(
        "Recebi um áudio! Ainda não consigo ouvir, mas você pode digitar aqui ou no painel web em diffy-nine.vercel.app"
      );
    }

    if (!corpo || !de) {
      return twiml("Não entendi. Tenta de novo?");
    }

    // Identifica inédita pelo número de WhatsApp
    const inedita = await buscarInedita(de);

    // Busca histórico e contexto em paralelo
    const [historico, contextoRaiox, contextoOperacional] = await Promise.all([
      buscarHistorico(de, 20),
      inedita ? buscarContextoInedita(inedita.id) : Promise.resolve(""),
      inedita ? buscarContextoOperacional(inedita.id) : Promise.resolve(""),
    ]);

    // Salva a mensagem da usuária
    await salvarMensagem(de, "user", corpo);

    // Monta system prompt com 3 camadas
    const systemPrompt = buildSystemPrompt(contextoRaiox, contextoOperacional);

    type MessageParam = Parameters<typeof anthropic.messages.create>[0]["messages"][number];

    const messages: MessageParam[] = [
      ...historico,
      { role: "user" as const, content: corpo },
    ];

    let respostaFinal = "";

    if (inedita) {
      // Loop de tool use para inéditas identificadas
      let continuar = true;
      while (continuar) {
        const resp = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          system: systemPrompt,
          tools: TOOLS,
          messages,
        });

        if (resp.stop_reason === "tool_use") {
          messages.push({ role: "assistant" as const, content: resp.content });
          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (const block of resp.content) {
            if (block.type === "tool_use") {
              const resultado = await executarTool(
                block.name,
                block.input as Record<string, unknown>,
                inedita.id
              );
              toolResults.push({
                type: "tool_result" as const,
                tool_use_id: block.id,
                content: resultado,
              });
            }
          }
          messages.push({ role: "user" as const, content: toolResults });
        } else {
          const textBlock = resp.content.find((b) => b.type === "text");
          respostaFinal =
            textBlock && textBlock.type === "text"
              ? textBlock.text
              : "Não consegui processar agora.";
          continuar = false;
        }
      }
    } else {
      // Inédita não identificada — resposta simples sem tools
      const resp = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: systemPrompt,
        messages,
      });
      const textBlock = resp.content[0];
      respostaFinal =
        textBlock && textBlock.type === "text"
          ? textBlock.text
          : "Tive um problema técnico.";
    }

    // Salva a resposta da Diffy
    await salvarMensagem(de, "assistant", respostaFinal);

    return twiml(respostaFinal);
  } catch (error) {
    console.error("Erro no webhook WhatsApp:", error);
    return twiml("Tive um problema aqui. Tenta mandar de novo em instantes.");
  }
}
