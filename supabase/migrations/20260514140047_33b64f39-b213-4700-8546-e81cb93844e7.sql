-- Auto-mark product as unavailable when quantity is 0
CREATE OR REPLACE FUNCTION public.products_sync_availability()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.quantity <= 0 THEN
    NEW.available := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_sync_availability_trg ON public.products;
CREATE TRIGGER products_sync_availability_trg
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.products_sync_availability();

-- Recount product quantity from inventory_items
CREATE OR REPLACE FUNCTION public.recount_product_quantity(_pid uuid)
RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.products
  SET quantity = (
    SELECT count(*) FROM public.inventory_items
    WHERE product_id = _pid AND status = 'in_stock'
  )
  WHERE id = _pid;
END;
$$;

CREATE OR REPLACE FUNCTION public.inventory_sync_product()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recount_product_quantity(OLD.product_id);
    RETURN OLD;
  END IF;
  PERFORM public.recount_product_quantity(NEW.product_id);
  IF TG_OP = 'UPDATE' AND OLD.product_id <> NEW.product_id THEN
    PERFORM public.recount_product_quantity(OLD.product_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inventory_sync_product_trg ON public.inventory_items;
CREATE TRIGGER inventory_sync_product_trg
AFTER INSERT OR UPDATE OR DELETE ON public.inventory_items
FOR EACH ROW EXECUTE FUNCTION public.inventory_sync_product();

-- Re-sync existing rows that have inventory items
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT DISTINCT product_id FROM public.inventory_items LOOP
    PERFORM public.recount_product_quantity(r.product_id);
  END LOOP;
END $$;