import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { salvarMensagem, buscarHistorico } from "@/lib/db/mensagens";
import { buscarContextoInedita } from "@/lib/db/documentos";
import { buscarContextoOperacional } from "@/lib/db/contexto-operacional";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOOLS: Anthropic.Tool[] = [
  {
    name: "lancar_receita",
    description: "Registra uma receita (entrada de dinheiro) no sistema financeiro.",
    input_schema: {
      type: "object" as const,
      properties: {
        valor: { type: "number" as const, description: "Valor em reais" },
        descricao: { type: "string" as const, description: "O que foi recebido" },
        cliente_nome: { type: "string" as const, description: "Nome do cliente pagador (opcional)" },
      },
      required: ["valor", "descricao"],
    },
  },
  {
    name: "lancar_despesa",
    description: "Registra uma despesa (saída de dinheiro) no sistema financeiro.",
    input_schema: {
      type: "object" as const,
      properties: {
        valor: { type: "number" as const, description: "Valor em reais" },
        descricao: { type: "string" as const, description: "O que foi pago" },
        categoria: { type: "string" as const, description: "Categoria da despesa (opcional)" },
      },
      required: ["valor", "descricao"],
    },
  },
  {
    name: "criar_cliente",
    description: "Cadastra um novo cliente no sistema.",
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
    description: "Cria um compromisso, sessão ou lembrete na agenda.",
    input_schema: {
      type: "object" as const,
      properties: {
        titulo: { type: "string" as const, description: "Título do compromisso" },
        data: { type: "string" as const, description: "Data no formato YYYY-MM-DD" },
        hora: { type: "string" as const, description: "Hora no formato HH:MM (opcional)" },
        tipo: { type: "string" as const, description: "sessao, entrega, followup, pessoal ou lembrete" },
      },
      required: ["titulo", "data"],
    },
  },
  {
    name: "buscar_financeiro",
    description: "Retorna o resumo financeiro do mês atual da inédita.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

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
    return `Receita de R$ ${input.valor} registrada: ${input.descricao}`;
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
    return `Despesa de R$ ${input.valor} registrada: ${input.descricao}`;
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
      feito: false,
    });
    const hora = input.hora ? ` às ${input.hora}` : "";
    return `Compromisso "${input.titulo}" criado para ${input.data}${hora}.`;
  }

  if (name === "buscar_financeiro") {
    const inicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
    const fim = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split("T")[0];
    const { data } = await admin
      .from("lancamentos")
      .select("tipo, valor")
      .eq("inedita_id", inedita_id)
      .gte("data", inicio)
      .lt("data", fim);
    const receita = (data ?? []).filter((l) => l.tipo === "receita").reduce((s, l) => s + Number(l.valor), 0);
    const despesa = (data ?? []).filter((l) => l.tipo === "despesa").reduce((s, l) => s + Number(l.valor), 0);
    return `Financeiro do mês: Receitas R$ ${receita.toFixed(2)} | Despesas R$ ${despesa.toFixed(2)} | Saldo R$ ${(receita - despesa).toFixed(2)}`;
  }

  return `Ação ${name} não reconhecida.`;
}

export async function POST(request: NextRequest) {
  try {
    const { mensagem } = await request.json();
    if (!mensagem?.trim()) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const inedita_id = user?.id ?? "web";

    // Busca número de WhatsApp para mesclar histórico dos dois canais
    const admin = createAdminClient();
    const { data: profile } = user
      ? await admin.from("profiles").select("whatsapp").eq("id", user.id).maybeSingle()
      : { data: null };

    const [contextoRaiox, contextoOperacional, historico] = await Promise.all([
      user ? buscarContextoInedita(inedita_id) : Promise.resolve(""),
      user ? buscarContextoOperacional(inedita_id) : Promise.resolve(""),
      buscarHistorico(inedita_id, 20, profile?.whatsapp ?? null),
    ]);

    await salvarMensagem(inedita_id, "user", mensagem.trim());

    const systemPrompt = buildSystemPrompt(contextoRaiox, contextoOperacional);

    type MessageParam = Parameters<typeof anthropic.messages.create>[0]["messages"][number];
    const messages: MessageParam[] = [
      ...historico,
      { role: "user" as const, content: mensagem.trim() },
    ];

    let respostaFinal = "";
    let continuar = true;

    while (continuar) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: systemPrompt,
        tools: user ? TOOLS : [],
        messages,
      });

      if (response.stop_reason === "tool_use") {
        messages.push({ role: "assistant" as const, content: response.content });
        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const block of response.content) {
          if (block.type === "tool_use") {
            const resultado = await executarTool(
              block.name,
              block.input as Record<string, unknown>,
              inedita_id
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
        const textBlock = response.content.find((b) => b.type === "text");
        respostaFinal =
          textBlock && textBlock.type === "text"
            ? textBlock.text
            : "Não consegui processar isso agora. Tenta de novo?";
        continuar = false;
      }
    }

    await salvarMensagem(inedita_id, "assistant", respostaFinal);
    return NextResponse.json({ resposta: respostaFinal });
  } catch (error) {
    console.error("Erro na API da Diffy:", error);
    return NextResponse.json(
      { error: "Erro interno", resposta: "Tive um problema técnico. Tenta em instantes." },
      { status: 500 }
    );
  }
}
