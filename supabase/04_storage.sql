-- Lectura pública (cualquiera puede leer)
create policy "read_public_banners"
  on storage.objects for select
  using (bucket_id = 'banners');

-- Insertar (subir) restringido a usuarios autenticados
create policy "insert_own_banners"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'banners');

-- Actualizar (necesario por upsert:true) restringido al dueño
create policy "update_own_banners"
  on storage.objects for update
  using (bucket_id = 'banners' and owner = auth.uid());

-- Borrar (opcional) restringido al dueño
create policy "delete_own_banners"
  on storage.objects for delete
  using (bucket_id = 'banners' and owner = auth.uid());
