import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const env = dotenv.parse(fs.readFileSync(envPath));
  Object.assign(process.env, env);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const NUMEROS: Record<string, string> = {
  "cinara":      "+5543988247003",
  "karen":       "+5511995420562",
  "bruna":       "+5519993709389",
  "aline":       "+5511970654472",
  "alessandra":  "+5544999507797",
  "luiz":        "+5544999765323",
  "carol":       "+5545991259107",
};

async function atualizar() {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, nome, email, whatsapp");

  if (error) { console.error("Erro:", error); return; }

  console.log("\nProfiles encontrados:");
  for (const p of profiles ?? []) {
    console.log(`  ${p.nome} (${p.email}) — whatsapp: ${p.whatsapp ?? "vazio"}`);
  }

  console.log("\nAtualizando...");
  for (const p of profiles ?? []) {
    const nomeLower = (p.nome ?? "").toLowerCase();
    for (const [chave, numero] of Object.entries(NUMEROS)) {
      if (nomeLower.includes(chave)) {
        const { error: err } = await supabase
          .from("profiles")
          .update({ whatsapp: numero })
          .eq("id", p.id);
        if (err) console.error(`  ❌ ${p.nome}:`, err.message);
        else console.log(`  ✅ ${p.nome} → ${numero}`);
      }
    }
  }
  console.log("\nPronto!");
}

atualizar();
