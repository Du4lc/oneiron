-- ============================
-- RLS (Row-Level Security)
-- ============================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- Lectura pública (directorio visible)
create policy if not exists "profiles_select_public"
  on public.profiles for select
  using (true);

create policy if not exists "projects_select_public"
  on public.projects for select
  using (true);

-- El dueño puede crear/editar su perfil
create policy if not exists "profiles_insert_owner"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy if not exists "profiles_update_owner"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- El dueño del perfil puede gestionar sus proyectos
create policy if not exists "projects_crud_owner"
  on public.projects for all
  using (
    exists(select 1 from public.profiles p
           where p.id = projects.profile_id
             and p.user_id = auth.uid())
  )
  with check (
    exists(select 1 from public.profiles p
           where p.id = projects.profile_id
             and p.user_id = auth.uid())
  );
