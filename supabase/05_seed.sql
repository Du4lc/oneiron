-- === Seeds: categorías y tags iniciales (idempotente con ON CONFLICT) ===

-- Categorías
insert into public.categories (slug, name, sort_order) values
  ('salud','Salud', 10),
  ('energia','Energía', 20),
  ('software','Software', 30),
  ('electronica','Electrónica', 40),
  ('industria','Industria', 50),
  ('construccion','Construcción', 60),
  ('finanzas','Finanzas', 70),
  ('marketing','Marketing', 80),
  ('logistica','Logística', 90),
  ('educacion','Educación', 100),
  ('agroalimentacion','Agroalimentación', 110),
  ('medios_creatividad','Medios & Creatividad', 120),
  ('servicios_profesionales','Servicios Profesionales', 130),
  ('turismo','Turismo', 140),
  ('gobierno_ong','Gobierno & ONG', 150)
on conflict (slug) do update set name=excluded.name, sort_order=excluded.sort_order;

-- Tags
insert into public.tags (slug, name, category_slug) values
  ('biomedicina','Biomedicina','salud'),
  ('farmaceutica','Farmacéutica','salud'),
  ('dispositivos_medicos','Dispositivos médicos','salud'),
  ('salud_digital','Salud digital','salud'),
  ('biotecnologia','Biotecnología','salud'),

  ('fotovoltaica','Fotovoltaica','energia'),
  ('eolica','Eólica','energia'),
  ('hidraulica','Hidráulica','energia'),
  ('hidrogeno','Hidrógeno','energia'),
  ('redes_energia','Redes eléctricas','energia'),
  ('eficiencia','Eficiencia energética','energia'),

  ('ia','IA','software'),
  ('saas','SaaS','software'),
  ('ciberseguridad','Ciberseguridad','software'),
  ('datos_bigdata','Datos / Big Data','software'),
  ('mlops','MLOps','software'),
  ('blockchain','Blockchain','software'),
  ('devtools','DevTools','software'),
  ('ar_vr','AR/VR','software'),

  ('iot','IoT','electronica'),
  ('semiconductores','Semiconductores','electronica'),
  ('electronica_potencia','Electrónica de potencia','electronica'),
  ('robotica','Robótica','electronica'),
  ('sensores','Sensores','electronica'),

  ('automocion','Automoción','industria'),
  ('aeroespacial','Aeroespacial','industria'),
  ('quimica','Química','industria'),
  ('metalurgia','Metalurgia','industria'),
  ('textil','Textil','industria'),
  ('impresion_3d','Impresión 3D','industria'),

  ('obra_civil','Obra civil','construccion'),
  ('edificacion','Edificación','construccion'),
  ('materiales','Materiales','construccion'),
  ('bim','BIM','construccion'),

  ('fintech','Fintech','finanzas'),
  ('banca','Banca','finanzas'),
  ('seguros','Seguros','finanzas'),
  ('inversion','Inversión','finanzas'),

  ('publicidad','Publicidad','marketing'),
  ('social_media','Social Media','marketing'),
  ('seo_sem','SEO/SEM','marketing'),
  ('analitica_marketing','Analítica de marketing','marketing'),

  ('transporte','Transporte','logistica'),
  ('ultimo_km','Última milla','logistica'),
  ('almacen','Almacén','logistica'),
  ('maritimo','Marítimo','logistica'),
  ('aereo','Aéreo','logistica'),

  ('edtech','EdTech','educacion'),
  ('formacion_empresarial','Formación empresarial','educacion'),
  ('contenidos','Contenidos educativos','educacion'),

  ('alimentacion','Alimentación','agroalimentacion'),
  ('agrotech','Agrotech','agroalimentacion'),
  ('ganaderia','Ganadería','agroalimentacion'),
  ('pesca','Pesca','agroalimentacion'),

  ('audiovisual','Audiovisual','medios_creatividad'),
  ('diseno','Diseño','medios_creatividad'),
  ('videojuegos','Videojuegos','medios_creatividad'),
  ('musica','Música','medios_creatividad'),

  ('legal','Legal','servicios_profesionales'),
  ('consultoria','Consultoría','servicios_profesionales'),
  ('rrhh','RRHH','servicios_profesionales'),
  ('inmobiliario','Inmobiliario','servicios_profesionales'),

  ('hoteles','Hoteles','turismo'),
  ('viajes','Viajes','turismo'),
  ('ocio','Ocio','turismo'),

  ('sector_publico','Sector público','gobierno_ong'),
  ('ong','ONG','gobierno_ong'),
  ('smart_cities','Smart Cities','gobierno_ong')
on conflict (slug) do update set name=excluded.name, category_slug=excluded.category_slug;
