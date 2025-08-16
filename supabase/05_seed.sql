-- Poblado inicial de sectores
insert into public.tags (slug, name) values
  ('fotovoltaica','Fotovoltaica'),
  ('farmaceutica','Farmacéutica'),
  ('biomedicina','Biomedicina'),
  ('ia','IA')
on conflict do nothing;
