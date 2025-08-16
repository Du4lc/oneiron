-- ============================
-- STORAGE: crear buckets y políticas
-- ============================

-- Crea buckets públicos (banner y fotos de proyectos)
select storage.create_bucket('banners', public => true);
select storage.create_bucket('project-photos', public => true);

-- Políticas de lectura pública
create policy if not exists "read_public_banners"
  on storage.objects for select
  using (bucket_id = 'banners');

create policy if not exists "read_public_project_photos"
  on storage.objects for select
  using (bucket_id = 'project-photos');

-- Subida por usuarios autenticados
create policy if not exists "upload_banners_auth"
  on storage.objects for insert
  with check (
    bucket_id = 'banners'
    and auth.role() = 'authenticated'
  );

create policy if not exists "upload_project_photos_auth"
  on storage.objects for insert
  with check (
    bucket_id = 'project-photos'
    and auth.role() = 'authenticated'
  );

-- (Opcional) Actualizar/Eliminar sólo propios si usas prefijos con user_id
-- Por simplicidad, permitimos update/delete a autenticados. Ajusta si quieres.
create policy if not exists "update_banners_auth"
  on storage.objects for update
  using (bucket_id = 'banners' and auth.role() = 'authenticated')
  with check (bucket_id = 'banners' and auth.role() = 'authenticated');

create policy if not exists "delete_banners_auth"
  on storage.objects for delete
  using (bucket_id = 'banners' and auth.role() = 'authenticated');

create policy if not exists "update_project_photos_auth"
  on storage.objects for update
  using (bucket_id = 'project-photos' and auth.role() = 'authenticated')
  with check (bucket_id = 'project-photos' and auth.role() = 'authenticated');

create policy if not exists "delete_project_photos_auth"
  on storage.objects for delete
  using (bucket_id = 'project-photos' and auth.role() = 'authenticated');
