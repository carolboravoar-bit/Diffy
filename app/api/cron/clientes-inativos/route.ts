import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";
import { createAdminClient } from "@/lib/supabase/admin";

const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Busca todas as inéditas com WhatsApp
  const { data: ineditas } = await admin
    .from("profiles")
    .select("id, nome, whatsapp")
    .eq("role", "inedita")
    .not("whatsapp", "is", null)
    .neq("whatsapp", "");

  if (!ineditas?.length) return NextResponse.json({ ok: true, alertas: 0 });

  const ha14dias = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  let alertas = 0;

  for (const inedita of ineditas) {
    try {
      // Clientes ativas sem agendamento nos últimos 14 dias
      const { data: clientes } = await admin
        .from("clientes")
        .select("id, nome")
        .eq("inedita_id", inedita.id)
        .eq("status", "ativa");

      if (!clientes?.length) continue;

      const inativos: string[] = [];

      for (const cliente of clientes) {
        const { data: sessoes } = await admin
          .from("agendamentos")
          .select("id")
          .eq("inedita_id", inedita.id)
          .eq("cliente_id", cliente.id)
          .gte("data", ha14dias)
          .limit(1);

        if (!sessoes?.length) {
          inativos.push(cliente.nome);
        }
      }

      if (inativos.length === 0) continue;

      const lista = inativos.slice(0, 3).join(", ");
      const resto = inativos.length > 3 ? ` e mais ${inativos.length - 3}` : "";
      const msg = `Semana passada sem agendamento: ${lista}${resto}. Quer que eu te ajude a entrar em contato com alguma?`;

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER!,
        to: `whatsapp:${inedita.whatsapp}`,
        body: msg,
      });

      alertas++;
    } catch (err) {
      console.error(`Erro ao checar clientes de ${inedita.nome}:`, err);
    }
  }

  return NextResponse.json({ ok: true, alertas });
}
