import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DIFFY_SYSTEM_PROMPT_BASE as DIFFY_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { salvarMensagem, buscarHistorico } from "@/lib/db/mensagens";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function twiml(mensagem: string): Response {
  // Escapa caracteres XML para não quebrar o TwiML
  const segura = mensagem
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${segura}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const corpo = formData.get("Body")?.toString().trim() ?? "";
    const de = formData.get("From")?.toString() ?? "";

    if (!corpo || !de) {
      return twiml("Não entendi a mensagem. Tenta de novo?");
    }

    // Busca histórico dessa conversa no Supabase (últimas 20 mensagens)
    const historico = await buscarHistorico(de, 20);

    // Salva a mensagem da usuária
    await salvarMensagem(de, "user", corpo);

    // Chama Claude com histórico completo
    const resposta = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: DIFFY_SYSTEM_PROMPT,
      messages: [
        ...historico,
        { role: "user", content: corpo },
      ],
    });

    const texto =
      resposta.content[0].type === "text"
        ? resposta.content[0].text
        : "Tive um problema técnico agora. Tenta de novo?";

    // Salva a resposta da Diffy
    await salvarMensagem(de, "assistant", texto);

    return twiml(texto);
  } catch (error) {
    console.error("Erro no webhook WhatsApp:", error);
    return twiml("Tive um problema aqui. Tenta mandar de novo em instantes.");
  }
}
