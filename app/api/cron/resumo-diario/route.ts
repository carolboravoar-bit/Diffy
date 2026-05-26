import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { buscarContextoOperacional } from "@/lib/db/contexto-operacional";
import { buscarContextoInedita } from "@/lib/db/documentos";
import Anthropic from "@anthropic-ai/sdk";

const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(request: NextRequest) {
  // Verifica header de segurança do Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: ineditas } = await admin
    .from("profiles")
    .select("id, nome, whatsapp")
    .eq("role", "inedita")
    .not("whatsapp", "is", null)
    .neq("whatsapp", "");

  if (!ineditas || ineditas.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0 });
  }

  let enviados = 0;

  for (const inedita of ineditas) {
    try {
      const [contextoRaiox, contextoOperacional] = await Promise.all([
        buscarContextoInedita(inedita.id),
        buscarContextoOperacional(inedita.id),
      ]);

      const systemPrompt = buildSystemPrompt(contextoRaiox, contextoOperacional);

      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      const dataFormatada = amanha.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      const resp = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Mande o resumo de amanhã (${dataFormatada}) pra mim. Máximo 5 linhas. O que tenho na agenda, alertas financeiros importantes, e uma sugestão rápida de conteúdo ou tarefa se relevante. Direto, sem enrolação.`,
          },
        ],
      });

      const textBlock = resp.content[0];
      const texto =
        textBlock && textBlock.type === "text" ? textBlock.text : null;
      if (!texto) continue;

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER!,
        to: `whatsapp:${inedita.whatsapp}`,
        body: texto,
      });

      enviados++;
    } catch (err) {
      console.error(`Erro ao enviar resumo para ${inedita.nome}:`, err);
    }
  }

  return NextResponse.json({ ok: true, enviados });
}
