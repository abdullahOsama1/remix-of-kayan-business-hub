import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  categorySlug: string | null;
  categoryLabel: string | null;
  price: number;
  oldPrice: number | null;
  image: string;
  images: string[];
  storage: string[];
  colors: string[];
  description: string | null;
  quantity: number;
  available: boolean;
}

export interface Category {
  id: string;
  slug: string;
  label: string;
}

const PLACEHOLDER = "/placeholder.svg";

function mapRow(r: any): Product {
  const images: string[] = Array.isArray(r.images) ? r.images.filter(Boolean) : [];
  return {
    id: r.id,
    slug: r.slug,
    name: r.name_ar || r.name_en || "—",
    brand: r.brand,
    categorySlug: r.categories?.slug ?? null,
    categoryLabel: r.categories?.name_ar ?? null,
    price: Number(r.price) || 0,
    oldPrice: r.old_price != null ? Number(r.old_price) : null,
    image: images[0] || PLACEHOLDER,
    images: images.length ? images : [PLACEHOLDER],
    storage: Array.isArray(r.storage_options) ? r.storage_options : [],
    colors: Array.isArray(r.color_options) ? r.color_options : [],
    description: r.description,
    quantity: Number(r.quantity) || 0,
    available: !!r.available,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("*, categories(slug, name_ar)")
        .eq("available", true)
        .gt("quantity", 0)
        .order("created_at", { ascending: false });
      if (!alive) return;
      setProducts((data ?? []).map(mapRow));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { products, loading };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("*, categories(slug, name_ar)")
        .eq("slug", slug)
        .maybeSingle();
      if (!alive) return;
      setProduct(data ? mapRow(data) : null);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  return { product, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, slug, name_ar")
        .order("sort_order");
      if (!alive) return;
      setCategories(
        (data ?? []).map((c) => ({ id: c.id, slug: c.slug, label: c.name_ar })),
      );
    })();
    return () => {
      alive = false;
    };
  }, []);
  return categories;
}
