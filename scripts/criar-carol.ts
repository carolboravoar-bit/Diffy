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
  const { data, error } = await supabase.auth.admin.createUser({
    email: "carolboravoar@gmail.com",
    password: "Inedita2026!",
    user_metadata: { nome: "Carol Possani" },
    email_confirm: true,
  });

  if (error) {
    console.error("Erro completo:", JSON.stringify(error, null, 2));
    return;
  }

  console.log("Usuária criada, id:", data.user.id);

  const { error: err2 } = await supabase
    .from("profiles")
    .update({ role: "admin", whatsapp: "+5545991259107" })
    .eq("id", data.user.id);

  if (err2) console.error("Erro ao atualizar profile:", err2.message);
  else console.log("✅ Carol Possani — admin, WhatsApp: +5545991259107");
}

main();
