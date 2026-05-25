/**
 * Script para criar as contas iniciais da Diffy.
 *
 * Pré-requisito: .env.local com NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY preenchidos.
 *
 * Como rodar:
 *   npx tsx scripts/criar-contas.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Carrega .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const env = dotenv.parse(fs.readFileSync(envPath));
  Object.assign(process.env, env);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || SUPABASE_URL.includes("SEU_PROJETO")) {
  console.error("❌  Configure NEXT_PUBLIC_SUPABASE_URL no .env.local antes de rodar este script.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SENHA_PADRAO = "Inédita#2026";

const CONTAS = [
  // Admin da Carol
  { email: "carolboravoar@gmail.com", nome: "Carol Possani", role: "admin" },
  // Inéditas
  { email: "cinara@inedita.com.br",  nome: "Cinara Bastos",  role: "inedita" },
  { email: "karen@inedita.com.br",   nome: "Karen Machado",  role: "inedita" },
  { email: "bruna@inedita.com.br",   nome: "Bruna Toledo",   role: "inedita" },
  { email: "aline@inedita.com.br",   nome: "Aline Ponce",    role: "inedita" },
];

async function criarContas() {
  console.log("🚀  Criando contas na Diffy...\n");

  for (const conta of CONTAS) {
    process.stdout.write(`  ${conta.nome} (${conta.email})... `);

    // Cria usuária no Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: conta.email,
      password: SENHA_PADRAO,
      user_metadata: { nome: conta.nome },
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes("already been registered")) {
        console.log("já existe, pulando.");
      } else {
        console.log(`❌ Erro: ${error.message}`);
      }
      continue;
    }

    // Define a role (o trigger já cria o profile com role 'inedita')
    if (conta.role === "admin") {
      await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", data.user.id);
    }

    console.log("✅ criada");
  }

  console.log("\n✨  Pronto! Senha de todas: " + SENHA_PADRAO);
  console.log("\nEmails das inéditas para enviar:");
  CONTAS.filter((c) => c.role === "inedita").forEach((c) => {
    console.log(`  ${c.nome}: ${c.email} / ${SENHA_PADRAO}`);
  });
  console.log(`\nAdmin Carol: ${CONTAS[0].email} / ${SENHA_PADRAO}`);
  console.log("\n⚠️  Peça pra cada inédita trocar a senha no primeiro acesso.");
}

criarContas().catch(console.error);
