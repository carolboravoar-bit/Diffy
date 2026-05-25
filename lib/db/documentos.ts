import { createAdminClient } from "@/lib/supabase/admin";

export interface Documento {
  id: string;
  inedita_id: string;
  nome: string;
  tipo: string | null;
  storage_path: string;
  texto_extraido: string | null;
  tamanho_bytes: number | null;
  created_at: string;
}

export async function listarDocumentos(inedita_id: string): Promise<Documento[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("documentos")
    .select("*")
    .eq("inedita_id", inedita_id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function salvarDocumento(doc: Omit<Documento, "id" | "created_at">): Promise<Documento | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("documentos")
    .insert(doc)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function atualizarTexto(id: string, texto_extraido: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("documentos")
    .update({ texto_extraido })
    .eq("id", id);
}

export async function deletarDocumento(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("documentos")
    .select("storage_path, tipo")
    .eq("id", id)
    .single();

  // Só remove do storage se for arquivo (não URL)
  if (data?.storage_path && data?.tipo !== "url") {
    await supabase.storage.from("documentos-ineditas").remove([data.storage_path]);
  }

  await supabase.from("documentos").delete().eq("id", id);
}

export async function buscarContextoInedita(inedita_id: string): Promise<string> {
  const supabase = createAdminClient();

  // Busca documentos e contexto pessoal em paralelo
  const [docsResult, profileResult] = await Promise.all([
    supabase
      .from("documentos")
      .select("nome, texto_extraido, tipo")
      .eq("inedita_id", inedita_id)
      .not("texto_extraido", "is", null),
    supabase
      .from("profiles")
      .select("nome, contexto_pessoal")
      .eq("id", inedita_id)
      .single(),
  ]);

  const partes: string[] = [];

  // Contexto pessoal escrito pela própria inédita
  const perfil = profileResult.data;
  if (perfil?.contexto_pessoal?.trim()) {
    partes.push(`## Sobre ${perfil.nome ?? "a inédita"} (em suas próprias palavras)\n\n${perfil.contexto_pessoal}`);
  }

  // Documentos e links subidos
  if (docsResult.data && docsResult.data.length > 0) {
    for (const d of docsResult.data) {
      const label = d.tipo === "url" ? `Link: ${d.nome}` : d.nome;
      partes.push(`## ${label}\n\n${d.texto_extraido}`);
    }
  }

  return partes.join("\n\n---\n\n");
}
