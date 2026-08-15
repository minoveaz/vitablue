insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'document-intelligence-temp',
  'document-intelligence-temp',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "document intelligence users can upload own files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'document-intelligence-temp'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "document intelligence users can read own files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'document-intelligence-temp'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "document intelligence users can delete own files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'document-intelligence-temp'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);