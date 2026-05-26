import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/clientes — lista clientes da inédita logada
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("inedita_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar clientes:", error);
      return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 });
    }

    return NextResponse.json({ clientes: data ?? [] });
  } catch (error) {
    console.error("Erro inesperado GET /api/clientes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST /api/clientes — cria nova cliente
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, profissao, email, whatsapp, status, fase_pipeline, valor_pacote, total_sessoes, observacoes } = body;

    if (!nome?.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        inedita_id: user.id,
        nome: nome.trim(),
        profissao: profissao?.trim() || null,
        email: email?.trim() || null,
        whatsapp: whatsapp?.trim() || null,
        status: status || "ativa",
        fase_pipeline: fase_pipeline || null,
        valor_pacote: valor_pacote ? Number(valor_pacote) : null,
        total_sessoes: total_sessoes ? Number(total_sessoes) : null,
        sessoes_realizadas: 0,
        observacoes: observacoes?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar cliente:", error);
      return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 });
    }

    return NextResponse.json({ cliente: data }, { status: 201 });
  } catch (error) {
    console.error("Erro inesperado POST /api/clientes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
