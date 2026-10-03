-- ============================================================
-- Add spine_color to books
-- Palette matches the site: burgundy, ink, teal, brass, plus
-- a few deeper book-like tones for variety.
-- ============================================================

alter table public.books
  add column if not exists spine_color text
  default '#6E2639';

-- Optional but recommended: constrain to a set of known good colors
alter table public.books
  add constraint books_spine_color_check
  check (spine_color is null or spine_color in (
    '#6E2639',  -- burgundy
    '#521A29',  -- burgundy dark
    '#1C1A17',  -- ink
    '#1F4E4A',  -- teal deep
    '#B8894A',  -- brass
    '#3A2E28',  -- warm dark brown
    '#4A2C2A'   -- dark oxblood
  ));