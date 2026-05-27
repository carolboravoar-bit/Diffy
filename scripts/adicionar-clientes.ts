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

const NOVAS_INEDITAS = [
  { email: "paty@diffy.app",          nome: "Paty Valcarenghi",    whatsapp: "+5545998303566" },
  { email: "bruna.bondi@diffy.app",   nome: "Bruna Bondi",         whatsapp: "+5545999182881" },
  { email: "renata@diffy.app",        nome: "Renata Micaela",      whatsapp: "+5511961785684" },
  { email: "fernanda@diffy.app",      nome: "Fernanda Rodrigues",  whatsapp: "+5511998213193" },
  { email: "samantha@diffy.app",      nome: "Samantha Bezerra",    whatsapp: "+5582996494296" },
  { email: "hortencia@diffy.app",     nome: "Hortência Carvalho",  whatsapp: "+5564999642775" },
  { email: "tatiani@diffy.app",       nome: "Tatiani Santos",      whatsapp: "+5549999027512" },
  { email: "claudia.sartori@diffy.app", nome: "Claudia Sartori",   whatsapp: "+5549999027589" },
  { email: "claudia.toledo@diffy.app",  nome: "Claudia Toledo",    whatsapp: "+5511994606749" },
  { email: "luiza@diffy.app",         nome: "Luiza Franco",        whatsapp: "+5541999224772" },
];

const SENHA = "Inedita2026!";

async function main() {
  for (const inedita of NOVAS_INEDITAS) {
    // Verifica se já existe
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existe = users.find(u => u.email === inedita.email);

    let userId: string;

    if (existe) {
      console.log(`  ⚠️  ${inedita.nome} já existe, atualizando perfil...`);
      userId = existe.id;
    } else {
      // Cria o usuário no auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: inedita.email,
        password: SENHA,
        email_confirm: true,
      });

      if (error || !data.user) {
        console.log(`  ❌ Erro ao criar ${inedita.nome}: ${error?.message}`);
        continue;
      }
      userId = data.user.id;
      console.log(`  ✅ Usuário criado: ${inedita.nome}`);
    }

    // Upsert no profile
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      email: inedita.email,
      nome: inedita.nome,
      whatsapp: inedita.whatsapp,
      role: "inedita",
    }, { onConflict: "id" });

    if (profileError) console.log(`  ❌ Perfil ${inedita.nome}: ${profileError.message}`);
    else console.log(`  ✅ ${inedita.nome} | ${inedita.email} | ${inedita.whatsapp}`);
  }

  console.log("\n📋 Todas as inéditas cadastradas:");
  const { data: profiles } = await supabase
    .from("profiles")
    .select("nome, email, role, whatsapp")
    .eq("role", "inedita")
    .order("nome" as never);
  for (const p of profiles ?? []) {
    console.log(`  ⭐ ${p.nome} | ${p.email} | ${p.whatsapp ?? "sem whatsapp"}`);
  }
}

main();
