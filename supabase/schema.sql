-- ============================================================
-- Dream Catcher — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the database
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- -------------------------------------------------------
-- ENUM TYPES
-- (Idempotent + safe to re-run when already in use)
-- -------------------------------------------------------
do $$
begin
  -- Only drop the type if it exists and is not referenced by any table column.
  if exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'subscription_status_enum'
  ) and not exists (
    select 1
    from pg_attribute a
    join pg_type t on t.oid = a.atttypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'subscription_status_enum'
      and a.attnum > 0
      and not a.attisdropped
  ) then
    execute 'drop type if exists public.subscription_status_enum';
  end if;

  begin
    create type public.subscription_status_enum as enum ('FREE', 'ACTIVE', 'TRIAL', 'EXPIRED');
  exception
    when duplicate_object then
      null;
  end;
end
$$;

-- -------------------------------------------------------
-- USERS TABLE
-- Extends Supabase auth.users with app-specific fields
-- -------------------------------------------------------
create table if not exists public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text unique,
  created_at      timestamptz not null default now(),
  is_active       boolean not null default true,
  free_insights_used  integer not null default 0 check (free_insights_used >= 0),
  subscription_status text not null default 'FREE'
                      check (subscription_status in ('FREE', 'ACTIVE', 'TRIAL', 'EXPIRED')),
  subscription_end_date timestamptz
);

-- Index for email lookups
create index if not exists users_email_idx on public.users(email);

-- -------------------------------------------------------
-- USERS TABLE COMPATIBILITY (for older schemas)
-- Ensures `public.users.id` exists for FKs/policies.
-- -------------------------------------------------------
do $$
begin
  if to_regclass('public.users') is not null then
    -- Some older versions used `user_id` as the primary key column.
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'users' and column_name = 'user_id'
    ) then
      -- Add `id` if missing, and backfill it from `user_id`.
      if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'users' and column_name = 'id'
      ) then
        alter table public.users add column id uuid;
      end if;

      update public.users
      set id = user_id
      where id is null;
    end if;

    -- Ensure `id` can be referenced by foreign keys.
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'users' and column_name = 'id'
    ) then
      execute 'create unique index if not exists users_id_unique_idx on public.users(id)';
    end if;
  end if;
end
$$;

-- -------------------------------------------------------
-- DREAM ENTRIES TABLE
-- -------------------------------------------------------
create table if not exists public.dream_entries (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references public.users(id) on delete cascade,
  record_date              date not null default current_date,
  title                    text,
  dream_content_encrypted  text not null,
  mood_upon_waking         text not null default 'Neutral'
                               check (mood_upon_waking in ('Happy', 'Anxious', 'Calm', 'Neutral', 'Excited')),
  is_lucid                 boolean not null default false,
  recorded_at              timestamptz not null default now()
);

-- Composite index for chronological user history + date filtering
create index if not exists dream_entries_user_date_idx on public.dream_entries(user_id, record_date desc);
create index if not exists dream_entries_user_id_idx   on public.dream_entries(user_id);

-- -------------------------------------------------------
-- DREAM TAGS TABLE (Many-to-Many junction)
-- -------------------------------------------------------
create table if not exists public.dream_tags (
  dream_tag_id  serial primary key,
  dream_id      uuid not null references public.dream_entries(id) on delete cascade,
  tag_text      text not null check (char_length(tag_text) <= 50)
);

-- Indexes for tag search and fetching per dream
create index if not exists dream_tags_dream_id_idx  on public.dream_tags(dream_id);
create index if not exists dream_tags_tag_text_idx  on public.dream_tags(tag_text);
create unique index if not exists dream_tags_unique on public.dream_tags(dream_id, tag_text);

-- -------------------------------------------------------
-- GEMINI INSIGHTS TABLE (1:1 with dream_entries)
-- -------------------------------------------------------
create table if not exists public.gemini_insights (
  id                    uuid primary key default gen_random_uuid(),
  dream_id              uuid unique not null references public.dream_entries(id) on delete cascade,
  insight_content       text not null,
  insight_generated_at  timestamptz not null default now(),
  analysis_type         text default 'Thematic'
);

create index if not exists gemini_insights_dream_id_idx on public.gemini_insights(dream_id);

-- -------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- Users can only read/write their own data
-- -------------------------------------------------------
alter table public.users          enable row level security;
alter table public.dream_entries  enable row level security;
alter table public.dream_tags     enable row level security;
alter table public.gemini_insights enable row level security;

-- Users: select/update own row only
-- Some older schemas used `user_id` instead of `id` in `public.users`.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'id'
  ) then
    execute 'drop policy if exists "users_select_own" on public.users';
    execute 'create policy "users_select_own" on public.users for select using (auth.uid() = id)';
    execute 'drop policy if exists "users_update_own" on public.users';
    execute 'create policy "users_update_own" on public.users for update using (auth.uid() = id)';
  elsif exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'user_id'
  ) then
    execute 'drop policy if exists "users_select_own" on public.users';
    execute 'create policy "users_select_own" on public.users for select using (auth.uid() = user_id)';
    execute 'drop policy if exists "users_update_own" on public.users';
    execute 'create policy "users_update_own" on public.users for update using (auth.uid() = user_id)';
  end if;
end
$$;

-- Dream entries: full CRUD for owner
drop policy if exists "dreams_select_own" on public.dream_entries;
create policy "dreams_select_own" on public.dream_entries for select using (auth.uid() = user_id);
drop policy if exists "dreams_insert_own" on public.dream_entries;
create policy "dreams_insert_own" on public.dream_entries for insert with check (auth.uid() = user_id);
drop policy if exists "dreams_update_own" on public.dream_entries;
create policy "dreams_update_own" on public.dream_entries for update using (auth.uid() = user_id);
drop policy if exists "dreams_delete_own" on public.dream_entries;
create policy "dreams_delete_own" on public.dream_entries for delete using (auth.uid() = user_id);

-- Dream tags: owner via dream join
drop policy if exists "tags_select_own" on public.dream_tags;
create policy "tags_select_own" on public.dream_tags for select
  using (exists (select 1 from public.dream_entries where id = dream_id and user_id = auth.uid()));
drop policy if exists "tags_insert_own" on public.dream_tags;
create policy "tags_insert_own" on public.dream_tags for insert
  with check (exists (select 1 from public.dream_entries where id = dream_id and user_id = auth.uid()));
drop policy if exists "tags_delete_own" on public.dream_tags;
create policy "tags_delete_own" on public.dream_tags for delete
  using (exists (select 1 from public.dream_entries where id = dream_id and user_id = auth.uid()));

-- Gemini insights: owner via dream join
drop policy if exists "insights_select_own" on public.gemini_insights;
create policy "insights_select_own" on public.gemini_insights for select
  using (exists (select 1 from public.dream_entries where id = dream_id and user_id = auth.uid()));
drop policy if exists "insights_insert_own" on public.gemini_insights;
create policy "insights_insert_own" on public.gemini_insights for insert
  with check (exists (select 1 from public.dream_entries where id = dream_id and user_id = auth.uid()));

-- -------------------------------------------------------
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- Trigger: when a new auth.users row is created, insert
-- a matching public.users row automatically.
-- -------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'id'
  ) then
    insert into public.users (id, email, free_insights_used, subscription_status)
    values (new.id, new.email, 0, 'FREE')
    on conflict (id) do nothing;
  elsif exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'user_id'
  ) then
    insert into public.users (user_id, email, free_insights_used, subscription_status)
    values (new.id, new.email, 0, 'FREE')
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------
-- MONTHLY INSIGHT COUNTER RESET
-- Resets free_insights_used to 0 on the 1st of each month.
-- Schedule via Supabase Cron (pg_cron extension):
--   select cron.schedule('reset-insights', '0 0 1 * *',
--     'update public.users set free_insights_used = 0 where subscription_status = ''FREE''');
-- -------------------------------------------------------
