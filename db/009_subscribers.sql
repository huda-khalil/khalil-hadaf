create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists subscribers_email_idx on public.subscribers (email);
create index if not exists subscribers_active_idx on public.subscribers (unsubscribed_at);

alter table public.subscribers enable row level security;

-- Anyone can insert their own subscription
create policy "subscribers: public insert"
  on public.subscribers for insert
  with check (true);

-- Only admins can read the list
create policy "subscribers: admin read"
  on public.subscribers for select
  using (public.is_admin());

-- Only admins can delete (unsubscribe manually)
create policy "subscribers: admin delete"
  on public.subscribers for delete
  using (public.is_admin());