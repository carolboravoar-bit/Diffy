import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowed = ["titulo", "status", "valor", "validade", "conteudo", "cliente_id"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("contratos")
      .update(updates)
      .eq("id", id)
      .eq("inedita_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar contrato:", error);
      return NextResponse.json({ error: "Erro ao atualizar contrato" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("contratos")
      .delete()
      .eq("id", id)
      .eq("inedita_id", user.id);

    if (error) {
      console.error("Erro ao deletar contrato:", error);
      return NextResponse.json({ error: "Erro ao deletar contrato" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
