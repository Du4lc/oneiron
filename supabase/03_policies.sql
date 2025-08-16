-- === RLS Policies (robusto / idempotente) ===

-- Asegurar RLS en tablas de aplicación
alter table if exists public.profiles    enable row level security;
alter table if exists public.categories  enable row level security;
alter table if exists public.tags        enable row level security;

-- Perfiles: lectura pública
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='read_profiles_public'
  ) then
    create policy "read_profiles_public"
      on public.profiles for select
      using (true);
  end if;
end$$;

-- Perfiles: actualizar solo el dueño
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='update_own_profile'
  ) then
    create policy "update_own_profile"
      on public.profiles for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end$$;

-- Perfiles: insertar solo el dueño (user_id = auth.uid())
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='insert_own_profile'
  ) then
    create policy "insert_own_profile"
      on public.profiles for insert
      with check (auth.uid() = user_id);
  end if;
end$$;

-- Categorías: lectura pública
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='categories' and policyname='read_categories_public'
  ) then
    create policy "read_categories_public"
      on public.categories for select
      using (true);
  end if;
end$$;

-- Tags: lectura pública
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='tags' and policyname='read_tags_public'
  ) then
    create policy "read_tags_public"
      on public.tags for select
      using (true);
  end if;
end$$;
