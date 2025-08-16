-- ============================
-- UNICIDAD (insensible a mayúsculas)
-- ============================
create unique index if not exists profiles_email_unique_ci
  on public.profiles ((lower(email)));

create unique index if not exists profiles_name_unique_ci
  on public.profiles ((lower(name)));

create unique index if not exists profiles_username_unique_ci
  on public.profiles ((lower(username)));

-- (Opcional) Asegurar formato slug en username
alter table public.profiles
  add constraint profiles_username_slug_chk
  check (username ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

-- ============================
-- ÍNDICES de rendimiento
-- ============================
-- Búsqueda por prefijo / ILIKE rápido
create index if not exists profiles_name_trgm
  on public.profiles using gin (name gin_trgm_ops);

-- Filtros por sector (contains/AND)
create index if not exists profiles_sectors_gin
  on public.profiles using gin (sectors);

-- Filtros por país y provincia
create index if not exists profiles_country_idx on public.profiles (country);
create index if not exists profiles_region_idx  on public.profiles (region);

-- Proyectos por perfil y año desc
create index if not exists projects_profile_id_idx on public.projects (profile_id);
create index if not exists projects_year_idx       on public.projects (year);
