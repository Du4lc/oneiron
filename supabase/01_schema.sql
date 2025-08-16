-- === Oneiron Schema (extended, versión SEGURA) ===
-- Crea/asegura categorías, tags, perfiles y el sistema de búsqueda (tsvector + trigger + RPC)

-- 1) Categorías (ramas genéricas)
create table if not exists public.categories (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  sort_order int not null default 100
);

-- 2) Tags (etiquetas específicas)
create table if not exists public.tags (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  category_slug text references public.categories(slug) on delete set null
);

-- 3) Perfiles (empresa)
create table if not exists public.profiles (
  user_id uuid primary key,
  email text,
  username text unique,
  name text unique,
  sectors text[] default '{}',       -- slugs de tags (ej: ['fotovoltaica','ia'])
  country text,
  region text,
  description text,
  banner_url text
);

-- 4) Columna de búsqueda 'search_tsv' como columna normal (NO generada)
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'profiles'
      and column_name  = 'search_tsv'
      and is_generated = 'ALWAYS'
  ) then
    alter table public.profiles drop column search_tsv;
  end if;
end$$;

alter table public.profiles
  add column if not exists search_tsv tsvector;

-- 5) Función trigger: mantiene 'search_tsv'
create or replace function public.profiles_search_tsv_update()
returns trigger
language plpgsql
as $$
begin
  new.search_tsv :=
      setweight(to_tsvector('spanish', coalesce(new.name,'')), 'A')
    || setweight(to_tsvector('spanish', coalesce(new.description,'')), 'B')
    || setweight(to_tsvector('simple',  array_to_string(coalesce(new.sectors, '{}'), ' ')), 'C');
  return new;
end;
$$;

-- 6) Trigger (se recrea si existe)
drop trigger if exists trg_profiles_search_tsv on public.profiles;
create trigger trg_profiles_search_tsv
before insert or update of name, description, sectors
on public.profiles
for each row execute function public.profiles_search_tsv_update();

-- 7) Backfill por si ya hay filas
update public.profiles p
set search_tsv =
    setweight(to_tsvector('spanish', coalesce(p.name,'')), 'A')
  || setweight(to_tsvector('spanish', coalesce(p.description,'')), 'B')
  || setweight(to_tsvector('simple',  array_to_string(coalesce(p.sectors, '{}'), ' ')), 'C')
where p.search_tsv is null;

-- 8) RPC de búsqueda (texto + filtros + AND de sectores + ranking)
create or replace function public.search_profiles_v1(
  q             text      default '',
  sector_slugs  text[]    default '{}',
  country_in    text      default null,
  region_in     text      default null,
  limit_in      int       default 20,
  offset_in     int       default 0
)
returns table (
  user_id uuid,
  username text,
  name text,
  country text,
  region text,
  banner_url text,
  description text,
  sectors text[],
  rank real
)
language sql
stable
as $$
  with base as (
    select
      p.*,
      ts_rank(
        p.search_tsv,
        websearch_to_tsquery('spanish', coalesce(nullif(q,''),'*'))
      ) as rnk
    from public.profiles p
    where
      (q is null or q = ''
        or p.search_tsv @@ websearch_to_tsquery('spanish', q)
        or p.name ilike q || '%')
      and (country_in is null or p.country = country_in)
      and (region_in  is null or p.region  = region_in)
  )
  select
    user_id, username, name, country, region,
    banner_url, description, sectors, rnk as rank
  from base
  where (sector_slugs = '{}'::text[] or sectors @> sector_slugs)  -- AND lógico de sectores
  order by rank desc nulls last, name asc
  limit limit_in offset offset_in;
$$;
