-- ============================================================
-- Migration: Audit trail for phone numbers and blog posts
-- Run this in the Supabase SQL Editor
-- ============================================================

create table if not exists public.audit_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  user_name    text not null default '',
  user_role    text not null default '',
  entity_type  text not null check (entity_type in ('phone_number', 'blog_post')),
  entity_id    uuid,
  action       text not null check (action in ('create', 'update', 'delete')),
  website      text,
  label        text,
  changes      jsonb,
  metadata     jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);
create index if not exists idx_audit_logs_entity on public.audit_logs (entity_type, entity_id);
create index if not exists idx_audit_logs_user on public.audit_logs (user_id);
create index if not exists idx_audit_logs_website on public.audit_logs (website);

alter table public.audit_logs enable row level security;

-- No authenticated read policy: admin reads via service role in API routes
