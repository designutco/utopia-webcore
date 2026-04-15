-- ============================================================
-- Migration: API keys for external system access
-- Run this in the Supabase SQL Editor
-- ============================================================

create table if not exists public.api_keys (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  key         text not null unique,
  website     text not null,
  permissions text[] not null default '{read}',
  is_active   boolean not null default true,
  created_by  uuid references auth.users(id),
  last_used   timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists idx_api_keys_key on public.api_keys (key);
create index if not exists idx_api_keys_website on public.api_keys (website);

alter table public.api_keys enable row level security;
-- No public policies — admin reads via service role
