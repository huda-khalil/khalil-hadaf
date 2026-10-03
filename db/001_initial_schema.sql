-- ============================================================
-- Khalil Hadaf — Initial Schema
-- ============================================================

-- ------------------------------------------------------------
-- 1. BOOKS
-- ------------------------------------------------------------
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  title_fa text,
  subtitle text,
  subtitle_fa text,
  description text,
  description_fa text,
  cover_path text,              -- path inside 'media' bucket
  year int,
  publisher text,
  isbn text,
  language text,                -- 'fa', 'ar', 'en', etc.
  category text not null default 'authored',  -- authored | translated | edited
  original_author text,         -- for translated works
  original_title text,
  buy_url text,
  pdf_path text,                -- optional PDF inside 'media'
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists books_category_idx on public.books (category);
create index if not exists books_year_idx on public.books (year desc);
create index if not exists books_published_idx on public.books (published);

-- ------------------------------------------------------------
-- 2. ARTICLES
-- ------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  title_fa text,
  excerpt text,
  excerpt_fa text,
  body_md text,                 -- Markdown body
  body_md_fa text,
  cover_path text,
  published_in text,            -- journal / site name
  published_at date,
  language text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_tags_idx on public.articles using gin (tags);
create index if not exists articles_published_idx on public.articles (published);

-- ------------------------------------------------------------
-- 3. TRANSLATIONS
-- ------------------------------------------------------------
create table if not exists public.translations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  title_fa text,
  original_author text not null,
  original_title text not null,
  source_lang text not null,    -- 'ar', 'fa', 'en'
  target_lang text not null,
  description text,
  description_fa text,
  cover_path text,
  year int,
  publisher text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists translations_source_idx on public.translations (source_lang);
create index if not exists translations_target_idx on public.translations (target_lang);

-- ------------------------------------------------------------
-- 4. TIMELINE (career milestones, lectures, awards)
-- ------------------------------------------------------------
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  title_fa text,
  description text,
  description_fa text,
  kind text not null default 'milestone',  -- milestone | lecture | award | publication
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists timeline_year_idx on public.timeline_events (year desc, sort_order asc);

-- ------------------------------------------------------------
-- 5. PAGES (about, contact, custom)
-- ------------------------------------------------------------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,    -- 'about', 'contact', ...
  title text not null,
  title_fa text,
  body_md text,
  body_md_fa text,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. COMMENTS (moderated)
-- ------------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,    -- 'article' | 'book' | 'translation'
  target_id uuid not null,
  author_name text not null,
  author_email text,
  body text not null,
  status text not null default 'pending',  -- pending | approved | rejected
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists comments_target_idx on public.comments (target_type, target_id);
create index if not exists comments_status_idx on public.comments (status);

-- ------------------------------------------------------------
-- 7. SITE SETTINGS (singleton-ish, key/value)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 8. ADMINS (who can write)
-- ------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger books_updated_at before update on public.books
  for each row execute function public.set_updated_at();
create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();
create trigger translations_updated_at before update on public.translations
  for each row execute function public.set_updated_at();
create trigger pages_updated_at before update on public.pages
  for each row execute function public.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Helper: is current user an admin?
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$ language sql security definer stable;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.books enable row level security;
alter table public.articles enable row level security;
alter table public.translations enable row level security;
alter table public.timeline_events enable row level security;
alter table public.pages enable row level security;
alter table public.comments enable row level security;
alter table public.site_settings enable row level security;
alter table public.admins enable row level security;

-- BOOKS ------------------------------------------------------
create policy "books: public read published"
  on public.books for select
  using (published = true);

create policy "books: admin full access"
  on public.books for all
  using (public.is_admin())
  with check (public.is_admin());

-- ARTICLES ---------------------------------------------------
create policy "articles: public read published"
  on public.articles for select
  using (published = true);

create policy "articles: admin full access"
  on public.articles for all
  using (public.is_admin())
  with check (public.is_admin());

-- TRANSLATIONS -----------------------------------------------
create policy "translations: public read published"
  on public.translations for select
  using (published = true);

create policy "translations: admin full access"
  on public.translations for all
  using (public.is_admin())
  with check (public.is_admin());

-- TIMELINE ---------------------------------------------------
create policy "timeline: public read published"
  on public.timeline_events for select
  using (published = true);

create policy "timeline: admin full access"
  on public.timeline_events for all
  using (public.is_admin())
  with check (public.is_admin());

-- PAGES ------------------------------------------------------
create policy "pages: public read"
  on public.pages for select
  using (true);

create policy "pages: admin full access"
  on public.pages for all
  using (public.is_admin())
  with check (public.is_admin());

-- COMMENTS ---------------------------------------------------
-- Anyone can insert (submit a comment)
create policy "comments: public insert"
  on public.comments for insert
  with check (true);

-- Only approved comments are visible to the public
create policy "comments: public read approved"
  on public.comments for select
  using (status = 'approved');

-- Admins can read everything (including pending)
create policy "comments: admin read all"
  on public.comments for select
  using (public.is_admin());

-- Admins can update (approve/reject) and delete
create policy "comments: admin update"
  on public.comments for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "comments: admin delete"
  on public.comments for delete
  using (public.is_admin());

-- SITE SETTINGS ----------------------------------------------
create policy "settings: public read"
  on public.site_settings for select
  using (true);

create policy "settings: admin full access"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- ADMINS -----------------------------------------------------
-- Only admins can see the admins table
create policy "admins: admin read"
  on public.admins for select
  using (public.is_admin());

-- ============================================================
-- Done.
-- ============================================================