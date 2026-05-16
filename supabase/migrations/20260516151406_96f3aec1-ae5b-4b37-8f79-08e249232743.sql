
DO $$ BEGIN
  CREATE TYPE public.product_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS status public.product_status NOT NULL DEFAULT 'draft';

-- Mark existing available products as published so storefront keeps working
UPDATE public.products SET status = 'published' WHERE available = true;

-- Tighten public read policy: only published items visible to anon
DROP POLICY IF EXISTS "public read available products" ON public.products;
CREATE POLICY "public read published products"
ON public.products
FOR SELECT
TO anon, authenticated
USING (
  (status = 'published' AND available = true)
  OR has_role(auth.uid(), 'admin'::app_role)
);
