import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* ─── DB SCHEMA (run once in Supabase SQL editor) ─────────────────────────

-- COMPANIES (admin accounts)
create table companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  industry text,
  logo_url text,
  plan text default 'starter' check (plan in ('starter','growth','enterprise')),
  max_candidates int default 50,
  max_hrs int default 2,
  created_at timestamptz default now()
);

-- AUTH handled by Supabase Auth (auth.users)
-- Link company to auth user via company_id in user metadata

-- HRS
create table hrs (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade,
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text default 'hr',
  created_at timestamptz default now()
);

-- PLANS CONFIG
create table plans (
  id text primary key,
  name text not null,
  price_monthly numeric not null,
  max_candidates int not null,
  max_hrs int not null,
  features jsonb default '[]',
  is_popular boolean default false
);

insert into plans values
  ('starter', 'Starter', 0, 50, 2, '["5 interview rounds","Basic proctoring","Email reports"]', false),
  ('growth', 'Growth', 49, 200, 10, '["Unlimited rounds","Full proctoring","AI scoring","Bulk mail","Analytics"]', true),
  ('enterprise', 'Enterprise', 149, 99999, 99999, '["Everything in Growth","Custom branding","Priority support","API access","SLA guarantee"]', false);

-- Enable RLS
alter table companies enable row level security;
alter table hrs enable row level security;

-- Policies
create policy "Company sees own data" on companies for all using (
  id = (select raw_user_meta_data->>'company_id' from auth.users where id = auth.uid())::uuid
);

create policy "HR sees own company hrs" on hrs for all using (
  company_id = (select raw_user_meta_data->>'company_id' from auth.users where id = auth.uid())::uuid
);

*/
