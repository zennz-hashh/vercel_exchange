-- Supabase schema for ZixiEX (full, production-ready)

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


-- DEMO POLICY: Allow all access (non-auth, for testing only)
create policy "Users: All access (demo)" on public.users
  for all using (true);

create policy "Transactions: All access (demo)" on public.transactions
  for all using (true);
