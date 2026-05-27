import { createAdminClient } from "@/lib/supabase/admin";

export type Role = "user" | "assistant";

export interface MensagemDB {
  id: string;
  numero_whatsapp: string;
  role: Role;
  conteudo: string;
  created_at: string;
}

export async function salvarMensagem(
  numero_whatsapp: string,
  role: Role,
  conteudo: string
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("mensagens").insert({ numero_whatsapp, role, conteudo });
}

// Busca histórico mesclando dois identificadores (UUID da web + número WhatsApp)
// Garante que a Diffy vê toda a conversa independente do canal
export async function buscarHistorico(
  id1: string,
  limite = 20,
  id2: string | null = null
): Promise<{ role: Role; content: string }[]> {
  const supabase = createAdminClient();

  let query = supabase.from("mensagens").select("role, conteudo, created_at");

  if (id2) {
    query = query.or(`numero_whatsapp.eq.${id1},numero_whatsapp.eq.${id2}`);
  } else {
    query = query.eq("numero_whatsapp", id1);
  }

  const { data } = await query
    .order("created_at", { ascending: true })
    .limit(limite);

  return (data ?? []).map((m) => ({ role: m.role, content: m.conteudo }));
}

// Busca mensagens completas de uma usuária (web + WhatsApp mesclados)
export async function buscarMensagensUsuario(
  id1: string,
  id2: string | null,
  limite = 100
): Promise<MensagemDB[]> {
  const supabase = createAdminClient();

  let query = supabase.from("mensagens").select("*");

  if (id2) {
    query = query.or(`numero_whatsapp.eq.${id1},numero_whatsapp.eq.${id2}`);
  } else {
    query = query.eq("numero_whatsapp", id1);
  }

  const { data } = await query
    .order("created_at", { ascending: true })
    .limit(limite);

  return data ?? [];
}
