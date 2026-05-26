import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { salvarDocumento, atualizarTexto } from "@/lib/db/documentos";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const formData = await request.formData();
  const arquivo = formData.get("arquivo") as File | null;

  if (!arquivo) {
    return NextResponse.json({ error: "Arquivo é obrigatório" }, { status: 400 });
  }

  if (arquivo.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo maior que 10MB" }, { status: 400 });
  }

  const ext = arquivo.name.split(".").pop()?.toLowerCase() ?? "";
  if (!["pdf", "txt", "md"].includes(ext)) {
    return NextResponse.json({ error: "Use PDF, TXT ou MD." }, { status: 400 });
  }

  const storage_path = `${user.id}/raiox-${Date.now()}.${ext}`;
  const admin = createAdminClient();
  const bytes = await arquivo.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("documentos-ineditas")
    .upload(storage_path, bytes, { contentType: arquivo.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: "Erro ao salvar arquivo: " + uploadError.message }, { status: 500 });
  }

  const doc = await salvarDocumento({
    inedita_id: user.id,
    nome: "raiox",
    tipo: ext,
    storage_path,
    texto_extraido: null,
    tamanho_bytes: arquivo.size,
  });

  if (!doc) {
    return NextResponse.json({ error: "Erro ao salvar metadados" }, { status: 500 });
  }

  extrairTexto(doc.id, arquivo, ext).catch(console.error);

  return NextResponse.json({ documento_id: doc.id });
}

async function extrairTexto(docId: string, arquivo: File, ext: string) {
  try {
    let texto = "";

    if (ext === "txt" || ext === "md") {
      texto = await arquivo.text();
    } else if (ext === "pdf") {
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
    console.error("Erro ao extrair texto do RaioX:", err);
  }
}
