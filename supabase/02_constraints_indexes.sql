-- === Extensiones, ajustes de esquema e índices ===

-- 1) Extensión para búsquedas
create extension if not exists pg_trgm;

-- 2) Asegurar columna category_slug en public.tags (por si la tabla ya existía)
alter table public.tags
  add column if not exists category_slug text references public.categories(slug) on delete set null;

-- 3) Índices de perfiles (búsqueda y filtros)
create index if not exists idx_profiles_tsv         on public.profiles using gin (search_tsv);
create index if not exists idx_profiles_name_trgm   on public.profiles using gin (name gin_trgm_ops);
create index if not exists idx_profiles_country     on public.profiles (country);
create index if not exists idx_profiles_region      on public.profiles (region);

-- 4) Índices de categorías y tags
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_tags_slug       on public.tags(slug);
create index if not exists idx_tags_category   on public.tags(category_slug);
