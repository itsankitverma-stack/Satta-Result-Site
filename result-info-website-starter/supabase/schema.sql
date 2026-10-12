-- Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  result_time text not null default '02:00 PM',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  result_date date not null,
  result_value text not null,
  note text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (game_id, result_date)
);

create index if not exists results_date_idx on public.results(result_date desc);
create index if not exists results_game_date_idx on public.results(game_id, result_date desc);

alter table public.admins enable row level security;
alter table public.games enable row level security;
alter table public.results enable row level security;

-- Public may read active game definitions and published results only.
create policy "Public reads active games" on public.games
  for select using (is_active = true or exists (
    select 1 from public.admins where user_id = auth.uid()
  ));

create policy "Admins manage games" on public.games
  for all using (exists (select 1 from public.admins where user_id = auth.uid()))
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

create policy "Public reads published results" on public.results
  for select using (published = true or exists (
    select 1 from public.admins where user_id = auth.uid()
  ));

create policy "Admins manage results" on public.results
  for all using (exists (select 1 from public.admins where user_id = auth.uid()))
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

-- Admin roster is private; admins can only read their own row.
create policy "Admin reads own membership" on public.admins
  for select using (user_id = auth.uid());

insert into public.games (name, result_time, sort_order) values
 ('Delhi Bazar', '02:50 PM', 1),
 ('Shri Ganesh', '04:20 PM', 2),
 ('Faridabad', '05:50 PM', 3),
 ('Lalkila Bazar', '06:55 PM', 4),
 ('Ghaziabad', '09:20 PM', 5),
 ('Gali', '11:25 PM', 6),
 ('Disawar', '01:30 AM', 7)
on conflict (name) do nothing;
