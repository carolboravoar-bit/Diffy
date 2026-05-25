import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { salvarDocumento, atualizarTexto } from "@/lib/db/documentos";
import { getProfile } from "@/lib/db/profiles";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function extrairTextoDeUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Diffy/1.0)" },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();

  // Remove scripts, styles e tags HTML, mantém o texto
  const textoLimpo = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{3,}/g, "\n\n")
    .trim();

  if (textoLimpo.length <= 200) {
    throw new Error("Página com conteúdo insuficiente para extrair");
  }

  // Se o texto for muito longo, usa o Claude para resumir/estruturar
  if (textoLimpo.length > 8000) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Extraia e estruture as informações relevantes desta página. Preserve o conteúdo importante sobre a pessoa, seu negócio, ofertas, método e estratégia. Descarte menus, rodapés e elementos de navegação.\n\nConteúdo:\n${textoLimpo.slice(0, 20000)}`,
        },
      ],
    });
    return response.content[0].type === "text" ? response.content[0].text : textoLimpo.slice(0, 8000);
  }

  return textoLimpo;
}

// Rota usada pelo admin para adicionar URL de entrega de uma inédita
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const profile = await getProfile(user.id);
  const isAdmin = profile?.role === "admin";
  const body = await request.json();
  const { url, inedita_id: bodyIneditaId, nome } = body;

  if (!url) return NextResponse.json({ error: "url é obrigatório" }, { status: 400 });

  // Admin especifica inedita_id; inédita usa o próprio id
  const inedita_id = isAdmin ? bodyIneditaId : user.id;
  if (!inedita_id) return NextResponse.json({ error: "inedita_id obrigatório" }, { status: 400 });

  try {
    new URL(url); // valida formato
  } catch {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  const nomeDoc = nome?.trim() || new URL(url).hostname;

  // Salva com storage_path = a URL (para URLs não há arquivo)
  const doc = await salvarDocumento({
    inedita_id,
    nome: nomeDoc,
    tipo: "url",
    storage_path: url,
    texto_extraido: null,
    tamanho_bytes: null,
  });

  if (!doc) return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });

  // Extrai texto em background
  extrairTextoDeUrl(url)
    .then((texto) => atualizarTexto(doc.id, texto))
    .catch(console.error);

  return NextResponse.json({ documento: doc });
}
