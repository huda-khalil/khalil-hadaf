-- ============================================================
-- Add an admin user
-- Replace the UUID below with the one you copied from Auth → Users
-- ============================================================

insert into public.admins (user_id)
values ('PASTE-THE-UUID-HERE')
on conflict (user_id) do nothing;