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

  const hoje = new Date().toISOString().split("T")[0];
  const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const diaSemana = new Date().toLocaleDateString("pt-BR", { weekday: "long" });

  let enviados = 0;

  for (const inedita of ineditas) {
    try {
      const [contextoRaiox, contextoOperacional] = await Promise.all([
        buscarContextoInedita(inedita.id),
        buscarContextoOperacional(inedita.id),
      ]);

      // Busca dados específicos de hoje e amanhã
      const [agendaHoje, agendaAmanha, financeiroMes] = await Promise.all([
        admin.from("agendamentos").select("titulo, hora, tipo").eq("inedita_id", inedita.id).eq("data", hoje).eq("feito", false).order("hora"),
        admin.from("agendamentos").select("titulo, hora").eq("inedita_id", inedita.id).eq("data", amanha).eq("feito", false).order("hora"),
        admin.from("lancamentos").select("tipo, valor").eq("inedita_id", inedita.id).gte("data", hoje.slice(0, 7) + "-01"),
      ]);

      const sessaoHoje = agendaHoje.data?.map((a) => `${a.hora ? a.hora + " — " : ""}${a.titulo}`).join(", ") || "nenhum";
      const sessaoAmanha = agendaAmanha.data?.map((a) => `${a.hora ? a.hora + " — " : ""}${a.titulo}`).join(", ") || "nenhum";
      const receitaMes = (financeiroMes.data ?? []).filter((l) => l.tipo === "receita").reduce((s, l) => s + Number(l.valor), 0);

      const systemPrompt = buildSystemPrompt(contextoRaiox, contextoOperacional);

      const resp = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Manda o bom dia de ${diaSemana} pra mim. Dados reais de hoje: agenda hoje = ${sessaoHoje}; agenda amanhã = ${sessaoAmanha}; receita do mês até agora = R$ ${receitaMes.toFixed(2)}. Seja direta e específica com esses dados. Máximo 5 linhas. Sem "Bom dia" genérico — vai direto ao ponto do que importa hoje.`,
          },
        ],
      });

      const textBlock = resp.content[0];
      const texto = textBlock && textBlock.type === "text" ? textBlock.text : null;
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
