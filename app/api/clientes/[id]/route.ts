import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/clientes/[id] — atualiza cliente
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Remove campos que não devem ser atualizados diretamente
    const { id: _id, inedita_id: _ined, created_at: _cat, ...campos } = body;

    const { data, error } = await supabase
      .from("clientes")
      .update(campos)
      .eq("id", id)
      .eq("inedita_id", user.id) // garante RLS extra no filtro
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar cliente:", error);
      return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Cliente não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ cliente: data });
  } catch (error) {
    console.error("Erro inesperado PATCH /api/clientes/[id]:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/clientes/[id] — remove cliente
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id)
      .eq("inedita_id", user.id);

    if (error) {
      console.error("Erro ao deletar cliente:", error);
      return NextResponse.json({ error: "Erro ao deletar cliente" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro inesperado DELETE /api/clientes/[id]:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
