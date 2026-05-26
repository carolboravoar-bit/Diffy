-- ============================================================
-- DIFFY — Schema v2: módulos da plataforma
-- Rodar no Supabase > SQL Editor (após o schema v1)
-- ============================================================

-- ── CLIENTES ────────────────────────────────────────────────
create table if not exists clientes (
  id                  uuid default gen_random_uuid() primary key,
  inedita_id          uuid references profiles(id) on delete cascade not null,
  nome                text not null,
  profissao           text,
  email               text,
  whatsapp            text,
  status              text default 'ativa' check (status in ('ativa', 'pausada', 'renovando', 'encerrada')),
  fase_pipeline       text check (fase_pipeline in ('prospect', 'contato', 'proposta', 'contrato')),
  total_sessoes       int default 0,
  sessoes_realizadas  int default 0,
  valor_pacote        numeric(10,2),
  observacoes         text,
  created_at          timestamptz default now()
);

create index if not exists clientes_inedita_id on clientes(inedita_id);
create index if not exists clientes_status on clientes(inedita_id, status);

-- ── AGENDAMENTOS ─────────────────────────────────────────────
create table if not exists agendamentos (
  id          uuid default gen_random_uuid() primary key,
  inedita_id  uuid references profiles(id) on delete cascade not null,
  cliente_id  uuid references clientes(id) on delete set null,
  titulo      text not null,
  subtitulo   text,
  tipo        text default 'sessao' check (tipo in ('sessao', 'entrega', 'followup', 'pessoal', 'lembrete')),
  hora        text,
  data        date not null,
  feito       boolean default false,
  created_at  timestamptz default now()
);

create index if not exists agendamentos_inedita_data on agendamentos(inedita_id, data);

-- ── LANÇAMENTOS FINANCEIROS ──────────────────────────────────
create table if not exists lancamentos (
  id          uuid default gen_random_uuid() primary key,
  inedita_id  uuid references profiles(id) on delete cascade not null,
  tipo        text not null check (tipo in ('receita', 'despesa')),
  descricao   text not null,
  valor       numeric(10,2) not null,
  data        date not null,
  cliente_id  uuid references clientes(id) on delete set null,
  categoria   text,
  created_at  timestamptz default now()
);

create index if not exists lancamentos_inedita_data on lancamentos(inedita_id, data desc);

-- ── CONTEÚDOS (MARKETING) ────────────────────────────────────
create table if not exists conteudos (
  id                uuid default gen_random_uuid() primary key,
  inedita_id        uuid references profiles(id) on delete cascade not null,
  titulo            text not null,
  formato           text,
  status            text default 'ideia' check (status in ('ideia', 'rascunho', 'agendado', 'publicado')),
  data_publicacao   date,
  destaque          boolean default false,
  created_at        timestamptz default now()
);

create index if not exists conteudos_inedita_id on conteudos(inedita_id);

-- ── CONTRATOS ────────────────────────────────────────────────
create table if not exists contratos (
  id          uuid default gen_random_uuid() primary key,
  inedita_id  uuid references profiles(id) on delete cascade not null,
  cliente_id  uuid references clientes(id) on delete set null,
  titulo      text not null,
  status      text default 'rascunho' check (status in ('rascunho', 'enviado', 'assinado', 'cancelado')),
  valor       numeric(10,2),
  validade    date,
  conteudo    text,
  created_at  timestamptz default now()
);

create index if not exists contratos_inedita_id on contratos(inedita_id);

-- ── RLS ─────────────────────────────────────────────────────
alter table clientes     enable row level security;
alter table agendamentos enable row level security;
alter table lancamentos  enable row level security;
alter table conteudos    enable row level security;
alter table contratos    enable row level security;

-- CLIENTES
create policy "Inédita: seus clientes" on clientes
  for all using (auth.uid() = inedita_id) with check (auth.uid() = inedita_id);

create policy "Admin: todos clientes" on clientes
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- AGENDAMENTOS
create policy "Inédita: seus agendamentos" on agendamentos
  for all using (auth.uid() = inedita_id) with check (auth.uid() = inedita_id);

create policy "Admin: todos agendamentos" on agendamentos
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- LANÇAMENTOS
create policy "Inédita: seus lançamentos" on lancamentos
  for all using (auth.uid() = inedita_id) with check (auth.uid() = inedita_id);

create policy "Admin: todos lançamentos" on lancamentos
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- CONTEÚDOS
create policy "Inédita: seus conteúdos" on conteudos
  for all using (auth.uid() = inedita_id) with check (auth.uid() = inedita_id);

create policy "Admin: todos conteúdos" on conteudos
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- CONTRATOS
create policy "Inédita: seus contratos" on contratos
  for all using (auth.uid() = inedita_id) with check (auth.uid() = inedita_id);

create policy "Admin: todos contratos" on contratos
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ── FIM ──────────────────────────────────────────────────────
