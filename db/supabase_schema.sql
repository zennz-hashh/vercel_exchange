-- Supabase schema for ZixiEX demo
-- Run this in Supabase SQL editor or with psql connected to your Supabase Postgres


-- USERS TABLE
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  display_name text,
  sphynx_balance numeric default 0,
  created_at timestamptz default now()
);


-- TRANSACTIONS TABLE
create table if not exists public.transactions (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  type text,
  channel text,
  networkOrMethod text,
  amount numeric,
  currency text,
  status text,
  details text,
  date timestamptz default now()
);


-- INDEXES
create index if not exists idx_transactions_user_id on public.transactions(user_id);


-- ENABLE ROW LEVEL SECURITY
alter table public.users enable row level security;
alter table public.transactions enable row level security;

-- RLS POLICIES (Supabase Auth required)
-- Only allow users to access their own user row
create policy "Users: Self access" on public.users
  for all using (auth.uid() = id);

-- Only allow users to access their own transactions
create policy "Transactions: Self access" on public.transactions
  for all using (
    user_id = auth.uid()
  );

-- Optionally, allow insert for authenticated users
create policy "Users: Insert self" on public.users
  for insert with check (auth.uid() = id);
create policy "Transactions: Insert self" on public.transactions
  for insert with check (user_id = auth.uid());

-- Optionally, allow update for authenticated users
create policy "Users: Update self" on public.users
  for update using (auth.uid() = id);
create policy "Transactions: Update self" on public.transactions
  for update using (user_id = auth.uid());

-- Optionally, allow delete for authenticated users
create policy "Users: Delete self" on public.users
  for delete using (auth.uid() = id);
create policy "Transactions: Delete self" on public.transactions
  for delete using (user_id = auth.uid());
