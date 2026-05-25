import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { salvarDocumento, atualizarTexto } from "@/lib/db/documentos";
import { getProfile } from "@/lib/db/profiles";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const formData = await request.formData();
  const arquivo = formData.get("arquivo") as File | null;
  const inedita_id = formData.get("inedita_id") as string | null;

  if (!arquivo || !inedita_id) {
    return NextResponse.json({ error: "arquivo e inedita_id são obrigatórios" }, { status: 400 });
  }

  const LIMITE_MB = 10;
  if (arquivo.size > LIMITE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Arquivo maior que ${LIMITE_MB}MB` }, { status: 400 });
  }

  const ext = arquivo.name.split(".").pop()?.toLowerCase() ?? "";
  const tiposPermitidos = ["pdf", "txt", "md"];
  if (!tiposPermitidos.includes(ext)) {
    return NextResponse.json({ error: "Tipo não suportado. Use PDF, TXT ou MD." }, { status: 400 });
  }

  // Upload no Storage
  const storage_path = `${inedita_id}/${Date.now()}-${arquivo.name}`;
  const admin = createAdminClient();
  const bytes = await arquivo.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("documentos-ineditas")
    .upload(storage_path, bytes, { contentType: arquivo.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: "Erro ao salvar arquivo: " + uploadError.message }, { status: 500 });
  }

  // Salva metadados
  const doc = await salvarDocumento({
    inedita_id,
    nome: arquivo.name,
    tipo: ext,
    storage_path,
    texto_extraido: null,
    tamanho_bytes: arquivo.size,
  });

  if (!doc) {
    return NextResponse.json({ error: "Erro ao salvar metadados" }, { status: 500 });
  }

  // Extrai texto em background (não bloqueia a resposta)
  extrairTexto(doc.id, arquivo, ext).catch(console.error);

  return NextResponse.json({ documento: doc });
}

async function extrairTexto(docId: string, arquivo: File, ext: string) {
  try {
    let texto = "";

    if (ext === "txt" || ext === "md") {
      texto = await arquivo.text();
    } else if (ext === "pdf") {
      // Envia o PDF diretamente para o Claude extrair o conteúdo
      const bytes = await arquivo.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64,
                },
              },
              {
                type: "text",
                text: "Extraia todo o conteúdo textual deste documento de forma fiel. Preserve a estrutura (títulos, seções, listas). Não adicione comentários, apenas o conteúdo.",
              },
            ],
          },
        ],
      });

      texto = response.content[0].type === "text" ? response.content[0].text : "";
    }

    if (texto.trim()) {
      await atualizarTexto(docId, texto.trim());
    }
  } catch (err) {
    console.error("Erro ao extrair texto do documento:", err);
  }
}
