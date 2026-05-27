import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buscarMensagensUsuario } from "@/lib/db/mensagens";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ mensagens: [] });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("whatsapp")
    .eq("id", user.id)
    .maybeSingle();

  const mensagens = await buscarMensagensUsuario(
    user.id,
    profile?.whatsapp ?? null,
    100
  );

  return NextResponse.json({ mensagens });
}
