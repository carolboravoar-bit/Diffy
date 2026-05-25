import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, atualizarContextoPessoal } from "@/lib/db/profiles";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const profile = await getProfile(user.id);
  return NextResponse.json({ contexto_pessoal: profile?.contexto_pessoal ?? "" });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { contexto_pessoal } = await request.json();
  if (typeof contexto_pessoal !== "string") {
    return NextResponse.json({ error: "contexto_pessoal deve ser texto" }, { status: 400 });
  }

  await atualizarContextoPessoal(user.id, contexto_pessoal.trim());
  return NextResponse.json({ ok: true });
}
