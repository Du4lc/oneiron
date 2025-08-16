-- Extensiones útiles
create extension if not exists pg_trgm;

-- ============================
-- TABLAS
-- ============================
create table if not exists public.profiles (
  id          bigserial primary key,
  user_id     uuid unique references auth.users(id) on delete cascade,
  email       text not null,
  username    text not null,
  name        text not null,
  sectors     text[] not null default '{}',  -- etiquetas de sector
  country     text,                          -- por ahora "España"
  region      text,                          -- provincia
  description text,
  banner_url  text,                          -- URL pública (storage u otra)
  tags        text[] not null default '{}',  -- libre (compatibilidad futura)
  created_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id          bigserial primary key,
  profile_id  bigint not null references public.profiles(id) on delete cascade,
  title       text not null,
  place       text,
  year        int,
  description text,
  photos      text[] not null default '{}',  -- URLs a imágenes
  created_at  timestamptz not null default now()
);

create table if not exists public.tags (
  id    bigserial primary key,
  slug  text unique not null,
  name  text unique not null
);
