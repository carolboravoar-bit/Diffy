import { createAdminClient } from "@/lib/supabase/admin";

export type Role = "inedita" | "admin";

export interface Profile {
  id: string;
  nome: string | null;
  email: string | null;
  whatsapp: string | null;
  role: Role;
  contexto_pessoal: string | null;
  created_at: string;
}

export async function getProfile(id: string): Promise<Profile | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function listarIneditas(): Promise<Profile[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "inedita")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function criarInedita(
  email: string,
  senha: string,
  nome: string,
  whatsapp?: string
): Promise<{ id: string } | { error: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    user_metadata: { nome, whatsapp },
    email_confirm: true,
  });
  if (error) return { error: error.message };
  return { id: data.user.id };
}

export async function atualizarNome(id: string, nome: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ nome }).eq("id", id);
}

export async function atualizarContextoPessoal(id: string, contexto_pessoal: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ contexto_pessoal }).eq("id", id);
}

export async function atualizarWhatsapp(id: string, whatsapp: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ whatsapp }).eq("id", id);
}

export async function atualizarEmail(id: string, email: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ email }).eq("id", id);
}

export async function deletarInedita(id: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.auth.admin.deleteUser(id);
}
