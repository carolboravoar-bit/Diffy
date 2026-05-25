-- ============================================================
-- DIFFY — Schema completo
-- Rodar no Supabase > SQL Editor
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
create table if not exists profiles (
  id                uuid references auth.users(id) on delete cascade primary key,
  nome              text,
  email             text,
  role              text default 'inedita' check (role in ('inedita', 'admin')),
  contexto_pessoal  text,   -- escrito pela própria inédita: quem é, o que constrói, como quer ser ajudada
  created_at        timestamptz default now()
);

-- Trigger: cria profile automaticamente ao criar usuária no Auth
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── 2. DOCUMENTOS ────────────────────────────────────────────
create table if not exists documentos (
  id             uuid default gen_random_uuid() primary key,
  inedita_id     uuid references profiles(id) on delete cascade not null,
  nome           text not null,
  tipo           text,              -- 'pdf', 'txt', 'md', 'url'
  storage_path   text not null,     -- path no bucket (ou a URL original se tipo='url')
  texto_extraido text,              -- conteúdo processado pela IA
  tamanho_bytes  bigint,
  created_at     timestamptz default now()
);

create index if not exists documentos_inedita_id on documentos(inedita_id);

-- ── 3. MENSAGENS ─────────────────────────────────────────────
create table if not exists mensagens (
  id               uuid default gen_random_uuid() primary key,
  numero_whatsapp  text not null,
  role             text not null check (role in ('user', 'assistant')),
  conteudo         text not null,
  created_at       timestamptz default timezone('utc', now())
);

create index if not exists mensagens_numero_created on mensagens (numero_whatsapp, created_at);

-- ── 4. RLS ───────────────────────────────────────────────────
alter table profiles   enable row level security;
alter table documentos enable row level security;
alter table mensagens  enable row level security;

-- Profiles: inédita lê e atualiza o próprio; admin faz tudo
create policy "Perfil próprio: select" on profiles
  for select using (auth.uid() = id);

create policy "Perfil próprio: update" on profiles
  for update using (auth.uid() = id);

create policy "Admin: tudo em profiles" on profiles
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Documentos: inédita lê + insere os dela; admin faz tudo
create policy "Inédita: lê seus docs" on documentos
  for select using (auth.uid() = inedita_id);

create policy "Inédita: insere seus docs" on documentos
  for insert with check (auth.uid() = inedita_id);

create policy "Inédita: deleta seus docs" on documentos
  for delete using (auth.uid() = inedita_id);

create policy "Admin: tudo em documentos" on documentos
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Mensagens: acesso só via service role (server-side)
create policy "Sem acesso direto a mensagens" on mensagens
  for all using (false);

-- ── 5. STORAGE ───────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('documentos-ineditas', 'documentos-ineditas', false)
on conflict (id) do nothing;

-- Uploads e leituras feitos via service role no servidor

-- ── FIM ──────────────────────────────────────────────────────
