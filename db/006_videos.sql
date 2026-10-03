create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_fa text,
  description text,
  description_fa text,
  youtube_id text not null,
  thumbnail_path text,
  kind text not null default 'interview',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists videos_published_idx on public.videos (published);
create index if not exists videos_sort_idx on public.videos (sort_order);

alter table public.videos enable row level security;

create policy "videos: public read published"
  on public.videos for select
  using (published = true);

create policy "videos: admin full access"
  on public.videos for all
  using (public.is_admin())
  with check (public.is_admin());