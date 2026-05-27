import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
const env = dotenv.parse(fs.readFileSync(".env.local"));
Object.assign(process.env, env);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const BETAS = [
  { email: "carolboravoar@gmail.com",       nome: "Carol Possani",         whatsapp: "+5545991259107", role: "admin" },
  { email: "karen@diffy.app",               nome: "Karen Machado",          whatsapp: "+5511995420562", role: "inedita" },
  { email: "bruna@diffy.app",               nome: "Bruna Toledo",           whatsapp: "+5519993709389", role: "inedita" },
  { email: "aline@diffy.app",               nome: "Aline Ponce",            whatsapp: "+5511970654472", role: "inedita" },
  { email: "alessandra@diffy.app",          nome: "Alessandra Mossambani",  whatsapp: "+5544999507797", role: "inedita" },
  { email: "luiz@diffy.app",                nome: "Luiz Hartmann",          whatsapp: "+5544999765323", role: "inedita" },
  { email: "mariele@diffy.app",             nome: "Mariele Gehlen",         whatsapp: "+5564999734168", role: "inedita" },
];

async function main() {
  console.log("Criando contas das betas...\n");

  for (const beta of BETAS) {
    process.stdout.write(`  ${beta.nome}... `);

    const { data, error } = await supabase.auth.admin.createUser({
      email: beta.email,
      password: "Inedita2026!",
      user_metadata: { nome: beta.nome, whatsapp: beta.whatsapp },
      email_confirm: true,
    });

    if (error) {
      console.log(`❌ ${error.message}`);
      continue;
    }

    await supabase
      .from("profiles")
      .update({ role: beta.role, whatsapp: beta.whatsapp })
      .eq("id", data.user.id);

    console.log(`✅ ${beta.email}`);
  }

  // Atualiza Mariele que já existia
  await supabase
    .from("profiles")
    .update({ whatsapp: "+5564999734168" })
    .eq("email", "marielegehlen@gmail.com");
  console.log("  ✅ Mariele Gehlen (existente) → WhatsApp atualizado");

  console.log("\nTodos os perfis:");
  const { data: profiles } = await supabase
    .from("profiles")
    .select("nome, email, role, whatsapp")
    .order("nome" as never);
  for (const p of profiles ?? []) {
    console.log(`  ${p.role === "admin" ? "👑" : "⭐"} ${p.nome} | ${p.email} | ${p.whatsapp ?? "sem whatsapp"}`);
  }
}

main();
