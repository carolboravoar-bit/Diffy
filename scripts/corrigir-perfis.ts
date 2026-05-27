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
  { email: "carolboravoar@gmail.com",  nome: "Carol Possani",        whatsapp: "+5545991259107", role: "admin"   },
  { email: "karen@diffy.app",          nome: "Karen Machado",         whatsapp: "+5511995420562", role: "inedita" },
  { email: "bruna@diffy.app",          nome: "Bruna Toledo",          whatsapp: "+5519993709389", role: "inedita" },
  { email: "aline@diffy.app",          nome: "Aline Ponce",           whatsapp: "+5511970654472", role: "inedita" },
  { email: "alessandra@diffy.app",     nome: "Alessandra Mossambani", whatsapp: "+5544999507797", role: "inedita" },
  { email: "luiz@diffy.app",           nome: "Luiz Hartmann",         whatsapp: "+5544999765323", role: "inedita" },
  { email: "mariele@diffy.app",        nome: "Mariele Gehlen",        whatsapp: "+5564999734168", role: "inedita" },
  { email: "marielegehlen@gmail.com",  nome: "Mariele Gehlen",        whatsapp: "+5564999734168", role: "inedita" },
];

async function main() {
  // Busca todos os usuários do auth
  const { data: { users } } = await supabase.auth.admin.listUsers();

  for (const beta of BETAS) {
    const user = users.find(u => u.email === beta.email);
    if (!user) { console.log(`  ⚠️  ${beta.email} não encontrada no auth`); continue; }

    // Upsert no profile
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: beta.email,
      nome: beta.nome,
      whatsapp: beta.whatsapp,
      role: beta.role,
    }, { onConflict: "id" });

    if (error) console.log(`  ❌ ${beta.nome}: ${error.message}`);
    else console.log(`  ✅ ${beta.nome} | ${beta.email} | ${beta.whatsapp}`);
  }

  console.log("\nPerfis finais:");
  const { data: profiles } = await supabase
    .from("profiles")
    .select("nome, email, role, whatsapp")
    .order("nome" as never);
  for (const p of profiles ?? []) {
    console.log(`  ${p.role === "admin" ? "👑" : "⭐"} ${p.nome} | ${p.whatsapp ?? "sem whatsapp"}`);
  }
}

main();
