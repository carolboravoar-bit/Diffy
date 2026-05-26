import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticada" }, { status: 401 });
    }

    const body = await request.json();
    const { feito } = body;

    if (typeof feito !== "boolean") {
      return NextResponse.json({ error: "Campo feito deve ser boolean" }, { status: 400 });
    }

    const { data: agendamento, error } = await supabase
      .from("agendamentos")
      .update({ feito })
      .eq("id", id)
      .eq("inedita_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar agendamento:", error);
      return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
    }

    return NextResponse.json({ agendamento });
  } catch (error) {
    console.error("Erro na rota PATCH /api/agendamentos/[id]:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticada" }, { status: 401 });
    }

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id)
      .eq("inedita_id", user.id);

    if (error) {
      console.error("Erro ao deletar agendamento:", error);
      return NextResponse.json({ error: "Erro ao deletar agendamento" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro na rota DELETE /api/agendamentos/[id]:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
