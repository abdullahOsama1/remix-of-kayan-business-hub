
-- Create public bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public can view images
create policy "public read product-images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Admins can upload
create policy "admin upload product-images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- Admins can update
create policy "admin update product-images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- Admins can delete
create policy "admin delete product-images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
