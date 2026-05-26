import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Confirma que o lançamento pertence à inédita logada antes de deletar
    const { error } = await supabase
      .from("lancamentos")
      .delete()
      .eq("id", id)
      .eq("inedita_id", user.id);

    if (error) {
      console.error("Erro ao deletar lançamento:", error);
      return NextResponse.json({ error: "Erro ao deletar lançamento" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro na rota DELETE /api/lancamentos/[id]:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
