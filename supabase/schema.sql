-- FNJ Marketplace waitlist schema
-- Paste this entire file into the Supabase SQL Editor and run it.
-- Project → SQL Editor → New query → Run.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null
    check (char_length(btrim(full_name)) between 2 and 120),
  email text not null,
  user_type text not null
    check (user_type in ('builder', 'creator', 'freelancer', 'agency', 'developer', 'other')),
  portfolio_url text,
  framer_profile_url text,
  template_count integer
    check (template_count is null or (template_count >= 0 and template_count <= 10000)),
  description text
    check (description is null or char_length(description) <= 800),
  marketing_consent boolean not null default false,
  source text not null
    check (source in ('waitlist', 'creator')),
  referral_code text not null,
  referred_by text,
  status text not null default 'waitlisted'
    check (status in ('waitlisted', 'invited', 'converted', 'rejected')),
  creator_status text
    check (creator_status is null or creator_status in ('new', 'reviewing', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint waitlist_users_creator_status_consistency check (
    (source = 'creator' and creator_status is not null)
    or (source = 'waitlist')
  )
);

-- Case-insensitive unique email. Application also stores emails lowercased.
create unique index if not exists waitlist_users_email_unique
  on public.waitlist_users (lower(email));

create unique index if not exists waitlist_users_referral_code_unique
  on public.waitlist_users (referral_code);

create index if not exists waitlist_users_created_at_idx
  on public.waitlist_users (created_at desc);

create index if not exists waitlist_users_source_idx
  on public.waitlist_users (source);

create index if not exists waitlist_users_status_idx
  on public.waitlist_users (status);

create index if not exists waitlist_users_user_type_idx
  on public.waitlist_users (user_type);

create index if not exists waitlist_users_creator_status_idx
  on public.waitlist_users (creator_status);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists waitlist_users_set_updated_at on public.waitlist_users;
create trigger waitlist_users_set_updated_at
before update on public.waitlist_users
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public clients cannot read or write this table.
-- Inserts go through the Next.js API using the service-role key.
-- Authenticated admins (JWT app_metadata.role = 'admin') can manage rows
-- as a second layer of protection.
-- ---------------------------------------------------------------------------
alter table public.waitlist_users enable row level security;

revoke all on public.waitlist_users from anon;
grant select, insert, update, delete on public.waitlist_users to authenticated;
grant all on public.waitlist_users to service_role;

drop policy if exists "admins_select_waitlist" on public.waitlist_users;
drop policy if exists "admins_insert_waitlist" on public.waitlist_users;
drop policy if exists "admins_update_waitlist" on public.waitlist_users;
drop policy if exists "admins_delete_waitlist" on public.waitlist_users;

create policy "admins_select_waitlist"
  on public.waitlist_users
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admins_insert_waitlist"
  on public.waitlist_users
  for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admins_update_waitlist"
  on public.waitlist_users
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admins_delete_waitlist"
  on public.waitlist_users
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
