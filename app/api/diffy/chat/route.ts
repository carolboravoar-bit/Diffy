import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DIFFY_SYSTEM_PROMPT } from "@/lib/system-prompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { mensagem } = await request.json();

    if (!mensagem?.trim()) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: DIFFY_SYSTEM_PROMPT,
      messages: [
        { role: "user", content: mensagem },
      ],
    });

    const resposta = response.content[0].type === "text"
      ? response.content[0].text
      : "Não consegui processar isso agora. Tenta de novo?";

    return NextResponse.json({ resposta });
  } catch (error) {
    console.error("Erro na API da Diffy:", error);
    return NextResponse.json(
      { error: "Erro interno", resposta: "Tive um problema técnico. Tenta em instantes." },
      { status: 500 }
    );
  }
}
