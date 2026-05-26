import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, atualizarContextoPessoal, atualizarNome, atualizarWhatsapp } from "@/lib/db/profiles";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const profile = await getProfile(user.id);
  return NextResponse.json({
    contexto_pessoal: profile?.contexto_pessoal ?? "",
    nome: profile?.nome ?? "",
    email: profile?.email ?? user.email ?? "",
    whatsapp: profile?.whatsapp ?? "",
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();

  if (typeof body.contexto_pessoal === "string") {
    await atualizarContextoPessoal(user.id, body.contexto_pessoal.trim());
  }
  if (typeof body.nome === "string") {
    await atualizarNome(user.id, body.nome.trim());
  }
  if (typeof body.whatsapp === "string") {
    await atualizarWhatsapp(user.id, body.whatsapp.trim());
  }

  return NextResponse.json({ ok: true });
}
