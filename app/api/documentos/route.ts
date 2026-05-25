import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listarDocumentos, deletarDocumento } from "@/lib/db/documentos";
import { getProfile } from "@/lib/db/profiles";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const inedita_id = request.nextUrl.searchParams.get("inedita_id");
  if (!inedita_id) return NextResponse.json({ error: "inedita_id obrigatório" }, { status: 400 });

  const documentos = await listarDocumentos(inedita_id);
  return NextResponse.json({ documentos });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  await deletarDocumento(id);
  return NextResponse.json({ ok: true });
}
