-- Public read access to media bucket
drop policy if exists "Public can read media" on storage.objects;
create policy "Public can read media"
  on storage.objects for select
  using (bucket_id = 'media');

-- Admins can upload
drop policy if exists "Admins can upload to media" on storage.objects;
create policy "Admins can upload to media"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and public.is_admin()
  );

-- Admins can update
drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media"
  on storage.objects for update
  using (
    bucket_id = 'media'
    and public.is_admin()
  );

-- Admins can delete
drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and public.is_admin()
  );