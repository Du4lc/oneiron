alter table public.profiles enable row level security;
alter table public.projects enable row level security;

create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "projects_select_public"
  on public.projects for select
  using (true);

create policy "profiles_insert_owner"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles_update_owner"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "projects_crud_owner"
  on public.projects for all
  using (
    exists(
      select 1 from public.profiles p
       where p.id = projects.profile_id
         and p.user_id = auth.uid()
    )
  )
  with check (
    exists(
      select 1 from public.profiles p
       where p.id = projects.profile_id
         and p.user_id = auth.uid()
    )
  );

