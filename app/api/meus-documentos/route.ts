import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listarDocumentos, deletarDocumento } from "@/lib/db/documentos";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const documentos = await listarDocumentos(user.id);
  return NextResponse.json({ documentos });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  // Verifica que o documento pertence a ela antes de deletar
  const docs = await listarDocumentos(user.id);
  const pertence = docs.some((d) => d.id === id);
  if (!pertence) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  await deletarDocumento(id);
  return NextResponse.json({ ok: true });
}
