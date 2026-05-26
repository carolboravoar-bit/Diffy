import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticada" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dataInicio = searchParams.get("data_inicio");
    const dataFim = searchParams.get("data_fim");

    let query = supabase
      .from("agendamentos")
      .select("*")
      .eq("inedita_id", user.id)
      .order("data", { ascending: true })
      .order("hora", { ascending: true });

    if (dataInicio) {
      query = query.gte("data", dataInicio);
    }

    if (dataFim) {
      query = query.lte("data", dataFim);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
    }

    return NextResponse.json({ agendamentos: data ?? [] });
  } catch (error) {
    console.error("Erro na rota GET /api/agendamentos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticada" }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, subtitulo, tipo, data, hora, cliente_id } = body;

    if (!titulo || !tipo || !data) {
      return NextResponse.json({ error: "Campos obrigatórios: titulo, tipo, data" }, { status: 400 });
    }

    const tiposValidos = ["sessao", "entrega", "followup", "pessoal", "lembrete"];
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json({ error: `tipo deve ser um de: ${tiposValidos.join(", ")}` }, { status: 400 });
    }

    const { data: agendamento, error } = await supabase
      .from("agendamentos")
      .insert({
        inedita_id: user.id,
        titulo: titulo.trim(),
        subtitulo: subtitulo?.trim() ?? null,
        tipo,
        data,
        hora: hora?.trim() ?? null,
        feito: false,
        cliente_id: cliente_id ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar agendamento:", error);
      return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
    }

    return NextResponse.json({ agendamento }, { status: 201 });
  } catch (error) {
    console.error("Erro na rota POST /api/agendamentos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
