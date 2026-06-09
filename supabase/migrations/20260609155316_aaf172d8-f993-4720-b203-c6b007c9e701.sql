-- Drop legacy admin-only write policies that required auth.uid()/has_role
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname='public'
      AND tablename IN ('products','categories','ai_drafts','inventory_items','settings','customers','orders','order_items','expenses')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.products, public.categories, public.ai_drafts, public.inventory_items,
  public.settings, public.customers, public.orders, public.order_items, public.expenses
TO anon, authenticated;

-- PRODUCTS: public can read only published+available; admin (anon) can write
CREATE POLICY "kayan_products_public_read" ON public.products
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND available = true);
CREATE POLICY "kayan_products_admin_read_all" ON public.products
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "kayan_products_write" ON public.products
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "kayan_categories_read" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "kayan_categories_write" ON public.categories
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "kayan_drafts_all" ON public.ai_drafts
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "kayan_inventory_all" ON public.inventory_items
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "kayan_settings_read" ON public.settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "kayan_settings_write" ON public.settings
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "kayan_customers_all" ON public.customers
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "kayan_orders_all" ON public.orders
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "kayan_order_items_all" ON public.order_items
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "kayan_expenses_all" ON public.expenses
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Storage policies for product-images (drop legacy, create open admin policies)
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND (policyname ILIKE '%product-images%' OR policyname LIKE 'kayan_pi_%')
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "kayan_pi_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "kayan_pi_insert" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "kayan_pi_update" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "kayan_pi_delete" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Smart pricing engine
CREATE OR REPLACE FUNCTION public.compute_selling_price(_wholesale numeric)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  margin_raw text;
  pack_raw text;
  margin numeric;
  packaging numeric;
BEGIN
  SELECT (value->>'v') INTO margin_raw FROM public.settings WHERE key = 'default_profit_margin';
  SELECT (value->>'v') INTO pack_raw FROM public.settings WHERE key = 'packaging_fee';
  margin := COALESCE(NULLIF(margin_raw,'')::numeric, 0);
  packaging := COALESCE(NULLIF(pack_raw,'')::numeric, 0);
  RETURN COALESCE(_wholesale,0) + margin + packaging;
END;
$$;

GRANT EXECUTE ON FUNCTION public.compute_selling_price(numeric) TO anon, authenticated, service_role;

-- Seed default pricing settings if missing
INSERT INTO public.settings(key, value) VALUES
  ('default_profit_margin', jsonb_build_object('v','500')),
  ('packaging_fee',          jsonb_build_object('v','50'))
ON CONFLICT (key) DO NOTHING;