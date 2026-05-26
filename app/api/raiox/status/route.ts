import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const admin = createAdminClient();
  const { data } = await admin
    .from("documentos")
    .select("id, texto_extraido, created_at")
    .eq("inedita_id", user.id)
    .eq("nome", "raiox")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ status: "sem_raiox", texto_extraido: null, documento_id: null });
  }

  if (!data.texto_extraido) {
    return NextResponse.json({ status: "processando", texto_extraido: null, documento_id: data.id });
  }

  return NextResponse.json({ status: "ativo", texto_extraido: data.texto_extraido, documento_id: data.id });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const admin = createAdminClient();
  const { data } = await admin
    .from("documentos")
    .select("id, storage_path")
    .eq("inedita_id", user.id)
    .eq("nome", "raiox")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data) {
    if (data.storage_path) {
      await admin.storage.from("documentos-ineditas").remove([data.storage_path]);
    }
    await admin.from("documentos").delete().eq("id", data.id);
  }

  return NextResponse.json({ ok: true });
}
