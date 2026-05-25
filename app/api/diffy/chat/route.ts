import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { salvarMensagem, buscarHistorico } from "@/lib/db/mensagens";
import { buscarContextoInedita } from "@/lib/db/documentos";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { mensagem } = await request.json();

    if (!mensagem?.trim()) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    // Identifica a inédita logada
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const inedita_id = user?.id ?? "web";

    // Busca contexto dos documentos e histórico em paralelo
    const [contexto, historico] = await Promise.all([
      user ? buscarContextoInedita(inedita_id) : Promise.resolve(""),
      buscarHistorico(inedita_id, 20),
    ]);

    await salvarMensagem(inedita_id, "user", mensagem.trim());

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: buildSystemPrompt(contexto),
      messages: [
        ...historico,
        { role: "user", content: mensagem.trim() },
      ],
    });

    const resposta =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Não consegui processar isso agora. Tenta de novo?";

    await salvarMensagem(inedita_id, "assistant", resposta);

    return NextResponse.json({ resposta });
  } catch (error) {
    console.error("Erro na API da Diffy:", error);
    return NextResponse.json(
      { error: "Erro interno", resposta: "Tive um problema técnico. Tenta em instantes." },
      { status: 500 }
    );
  }
}
