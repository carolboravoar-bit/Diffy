import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, listarIneditas, criarInedita, deletarInedita } from "@/lib/db/profiles";

async function verificarAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfile(user.id);
  return profile?.role === "admin" ? user : null;
}

export async function GET() {
  const user = await verificarAdmin();
  if (!user) return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const ineditas = await listarIneditas();
  return NextResponse.json({ ineditas });
}

export async function POST(request: NextRequest) {
  const user = await verificarAdmin();
  if (!user) return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const { email, senha, nome } = await request.json();
  if (!email || !senha || !nome) {
    return NextResponse.json({ error: "email, senha e nome são obrigatórios" }, { status: 400 });
  }

  const result = await criarInedita(email, senha, nome);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ id: result.id });
}

export async function DELETE(request: NextRequest) {
  const user = await verificarAdmin();
  if (!user) return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  await deletarInedita(id);
  return NextResponse.json({ ok: true });
}
