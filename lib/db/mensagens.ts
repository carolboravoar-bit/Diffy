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

export async function buscarHistorico(
  numero_whatsapp: string,
  limite = 20
): Promise<{ role: Role; content: string }[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("mensagens")
    .select("role, conteudo")
    .eq("numero_whatsapp", numero_whatsapp)
    .order("created_at", { ascending: true })
    .limit(limite);

  return (data ?? []).map((m) => ({ role: m.role, content: m.conteudo }));
}

export async function buscarTodas(limite = 100): Promise<MensagemDB[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("mensagens")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limite);

  return data ?? [];
}
