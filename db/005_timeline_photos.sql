alter table public.timeline_events
  add column if not exists photo_path text;