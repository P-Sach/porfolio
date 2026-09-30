-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

-- 1. Content: one row per section (profile, experience, projects, skills, assets).
create table if not exists public.site_content (
  key        text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read content" on public.site_content;
create policy "Public can read content"
  on public.site_content for select
  using (true);
-- No insert/update/delete policies on purpose: all writes go through the
-- Next.js server with the service-role key, after an owner-only auth check.

-- 2. One-step undo: the previous value of a section is stored before each save.
create table if not exists public.site_content_history (
  id       bigint generated always as identity primary key,
  key      text not null,
  data     jsonb not null,
  saved_at timestamptz not null default now()
);

create index if not exists site_content_history_key_idx
  on public.site_content_history (key, id desc);

alter table public.site_content_history enable row level security;
-- No policies: only the service role can read or write history.

-- 3. Storage bucket for the resume PDF and profile photo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets', 'site-assets', true, 5242880,
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
-- Public bucket = files are readable by URL. No storage.objects write policies,
-- so only the service role can upload or delete.
