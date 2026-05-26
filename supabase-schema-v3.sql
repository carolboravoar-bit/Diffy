-- Adiciona campo whatsapp em profiles
alter table profiles add column if not exists whatsapp text;

-- Atualiza o trigger para salvar whatsapp do metadata do cadastro
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, nome, whatsapp)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'whatsapp'
  );
  return new;
end;
$$;
