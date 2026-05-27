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

const NOVA_SENHA = "Inédita#2026";

async function main() {
  const { data: { users } } = await supabase.auth.admin.listUsers();

  const ineditas = users.filter(u => u.email !== "carolboravoar@gmail.com");

  console.log(`Resetando senha de ${ineditas.length} inéditas para "${NOVA_SENHA}"...\n`);

  for (const user of ineditas) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: NOVA_SENHA,
    });
    if (error) console.log(`  ❌ ${user.email}: ${error.message}`);
    else console.log(`  ✅ ${user.email}`);
  }

  console.log("\nPronto!");
}

main();
