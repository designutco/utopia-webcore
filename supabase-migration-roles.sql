-- ============================================================
-- Migration: Add Indoor Sales Executive & Manager roles
-- with company-scoped access
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Update user_profiles role check constraint to allow new roles
alter table public.user_profiles drop constraint if exists user_profiles_role_check;
alter table public.user_profiles add constraint user_profiles_role_check
  check (role in ('admin', 'designer', 'writer', 'indoor_sales', 'manager'));

-- 2. Create user_companies junction table (many-to-many)
create table if not exists public.user_companies (
  user_id    uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, company_id)
);

create index if not exists idx_user_companies_user on public.user_companies (user_id);
create index if not exists idx_user_companies_company on public.user_companies (company_id);

alter table public.user_companies enable row level security;

-- Users can read their own company assignments
create policy "Users can read own user_companies"
  on public.user_companies for select
  to authenticated
  using (user_id = auth.uid());
