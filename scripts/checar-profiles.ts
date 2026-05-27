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

async function main() {
  const { data } = await supabase
    .from("profiles")
    .select("id, nome, email, role, whatsapp")
    .order("created_at" as never);
  console.log(JSON.stringify(data, null, 2));

  // Testa se carolboravoar@gmail.com já existe no auth
  const { data: users } = await supabase.auth.admin.listUsers();
  console.log("\nUsuárias no Auth:");
  for (const u of users?.users ?? []) {
    console.log(`  ${u.email} — id: ${u.id}`);
  }
}

main();
