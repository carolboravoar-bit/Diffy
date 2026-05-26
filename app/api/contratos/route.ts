import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("contratos")
      .select("*")
      .eq("inedita_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar contratos:", error);
      return NextResponse.json({ error: "Erro ao buscar contratos" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, status, valor, validade, conteudo, cliente_id } = body;

    if (!titulo?.trim()) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("contratos")
      .insert({
        inedita_id: user.id,
        titulo: titulo.trim(),
        status: status ?? "rascunho",
        valor: valor ?? null,
        validade: validade ?? null,
        conteudo: conteudo ?? null,
        cliente_id: cliente_id ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar contrato:", error);
      return NextResponse.json({ error: "Erro ao criar contrato" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
