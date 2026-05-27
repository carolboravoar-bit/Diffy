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

async function main() {
  // Testa criar usuária básica sem metadata
  const { data, error } = await supabase.auth.admin.createUser({
    email: `teste-${Date.now()}@diffy.app`,
    password: "Teste1234",
    email_confirm: true,
  });
  if (error) {
    console.error("❌ Falha ao criar usuária básica:", error.message);
    console.log("→ O trigger handle_new_user provavelmente está com erro.");
    console.log("  Cole isso no SQL Editor do Supabase e rode:");
    console.log(`
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, nome, whatsapp)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'whatsapp'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
    `);
  } else {
    console.log("✅ Criação básica funciona! ID:", data.user.id);
    // Remove o usuário de teste
    await supabase.auth.admin.deleteUser(data.user.id);
    console.log("   (usuária de teste removida)");
  }
}
main();
