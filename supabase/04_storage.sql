-- === Storage (buckets + policies) — versión robusta ===
-- Nota: el esquema "storage" y la tabla "storage.objects" existen en Supabase.

-- 1) Buckets públicos para imágenes (si no existen)
insert into storage.buckets (id, name, public)
values
  ('banners','banners', true),
  ('projects','projects', true)
on conflict (id) do nothing;

-- 2) Policies sobre storage.objects
--    Usamos comprobaciones para evitar "policy already exists".
--    OJO: schemaname = 'storage', tablename = 'objects'.

-- Lectura pública de banners
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects' and policyname='read_public_banners'
  ) then
    create policy "read_public_banners"
      on storage.objects for select
      using (bucket_id = 'banners');
  end if;
end$$;

-- Lectura pública de projects
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects' and policyname='read_public_projects'
  ) then
    create policy "read_public_projects"
      on storage.objects for select
      using (bucket_id = 'projects');
  end if;
end$$;

-- Subida por usuarios autenticados (banners)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects' and policyname='upload_auth_banners'
  ) then
    create policy "upload_auth_banners"
      on storage.objects for insert
      with check (bucket_id = 'banners' and auth.role() = 'authenticated');
  end if;
end$$;

-- Subida por usuarios autenticados (projects)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects' and policyname='upload_auth_projects'
  ) then
    create policy "upload_auth_projects"
      on storage.objects for insert
      with check (bucket_id = 'projects' and auth.role() = 'authenticated');
  end if;
end$$;

-- Actualizar / borrar solo el dueño (banners)
-- Permitimos dos vías: owner = auth.uid() OR metadata->>'user_id' = auth.uid()
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects' and policyname='update_delete_own_banners'
  ) then
    create policy "update_delete_own_banners"
      on storage.objects for all
      using (
        bucket_id = 'banners' and (
          owner = auth.uid()
          or (metadata ? 'user_id' and (metadata->>'user_id')::uuid = auth.uid())
        )
      )
      with check (
        bucket_id = 'banners' and (
          owner = auth.uid()
          or (metadata ? 'user_id' and (metadata->>'user_id')::uuid = auth.uid())
        )
      );
  end if;
end$$;

-- Actualizar / borrar solo el dueño (projects)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects' and policyname='update_delete_own_projects'
  ) then
    create policy "update_delete_own_projects"
      on storage.objects for all
      using (
        bucket_id = 'projects' and (
          owner = auth.uid()
          or (metadata ? 'user_id' and (metadata->>'user_id')::uuid = auth.uid())
        )
      )
      with check (
        bucket_id = 'projects' and (
          owner = auth.uid()
          or (metadata ? 'user_id' and (metadata->>'user_id')::uuid = auth.uid())
        )
      );
  end if;
end$$;
