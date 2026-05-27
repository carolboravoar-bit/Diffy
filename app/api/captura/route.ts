import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { texto, categoria } = await request.json();
  if (!texto?.trim()) return NextResponse.json({ error: "Texto vazio" }, { status: 400 });

  const hoje = new Date().toISOString().split("T")[0];

  if (categoria === "lembrete" || categoria === "tarefa") {
    await supabase.from("agendamentos").insert({
      inedita_id: user.id,
      titulo: texto.trim(),
      data: hoje,
      tipo: "lembrete",
      feito: false,
    });
  }

  if (categoria === "ideia") {
    await supabase.from("conteudos").insert({
      inedita_id: user.id,
      titulo: texto.trim(),
      status: "ideia",
    });
  }

  if (categoria === "lancamento") {
    // Manda pra Diffy processar com as tools (extrai valor, tipo, etc.)
    await fetch(`${request.nextUrl.origin}/api/diffy/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: request.headers.get("cookie") ?? "" },
      body: JSON.stringify({ mensagem: `Captura rápida de lançamento: ${texto.trim()}` }),
    });
  }

  return NextResponse.json({ ok: true });
}
