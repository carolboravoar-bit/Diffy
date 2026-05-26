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
      .from("conteudos")
      .select("*")
      .eq("inedita_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar conteúdos:", error);
      return NextResponse.json({ error: "Erro ao buscar conteúdos" }, { status: 500 });
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
    const { titulo, formato, status, data_publicacao, destaque } = body;

    if (!titulo?.trim()) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("conteudos")
      .insert({
        inedita_id: user.id,
        titulo: titulo.trim(),
        formato: formato ?? "Post",
        status: status ?? "ideia",
        data_publicacao: data_publicacao ?? null,
        destaque: destaque ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar conteúdo:", error);
      return NextResponse.json({ error: "Erro ao criar conteúdo" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
