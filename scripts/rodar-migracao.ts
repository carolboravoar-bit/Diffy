/**
 * Roda a migração do schema v3 (campo whatsapp nos profiles)
 * via a API de admin do Supabase com service role.
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const env = dotenv.parse(fs.readFileSync(envPath));
  Object.assign(process.env, env);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const REF = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");

const SQL = `
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp text;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, nome, whatsapp)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'whatsapp'
  );
  RETURN NEW;
END;
$$;
`.trim();

async function runSql(sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: "api.supabase.com",
      path: `/v1/projects/${REF}/database/query`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        console.log("Status:", res.statusCode);
        console.log("Response:", data);
        if (res.statusCode && res.statusCode < 300) resolve();
        else reject(new Error(`HTTP ${res.statusCode}: ${data}`));
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log(`\nExecutando migração no projeto ${REF}...\n`);
  try {
    await runSql(SQL);
    console.log("\n✅  Migração concluída!");
  } catch (err) {
    console.error("\n❌  Erro:", err);
    console.log("\nO token de gerenciamento do Supabase (diferente do service role key)");
    console.log("é necessário para executar DDL via API. Opções:");
    console.log("1. Supabase Dashboard > SQL Editor > cole o supabase-schema-v3.sql");
    console.log("2. supabase.com > Account > Access Tokens > crie um token");
    console.log("   e adicione como SUPABASE_ACCESS_TOKEN no .env.local");
  }
})();
