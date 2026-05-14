import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "@/lib/products";
import { ProductCard } from "@/components/kayan/ProductCard";
import { Search, Loader2 } from "lucide-react";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") ?? "all";
  const [q, setQ] = useState("");
  const { products, loading } = useProducts();
  const categories = useCategories();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat !== "all" && p.categorySlug !== cat) return false;
      if (q) {
        const needle = q.toLowerCase();
        if (!p.name.toLowerCase().includes(needle) && !(p.brand ?? "").toLowerCase().includes(needle))
          return false;
      }
      return true;
    });
  }, [cat, q, products]);

  const setCat = (c: string) => {
    if (c === "all") params.delete("cat");
    else params.set("cat", c);
    setParams(params, { replace: true });
  };

  return (
    <div className="container-kayan py-12">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold">المتجر</h1>
        <p className="text-muted-foreground mt-2">{filtered.length} منتج</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 end-4 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن منتج أو ماركة..."
            className="w-full h-12 pe-11 ps-4 rounded-full bg-surface border border-transparent focus:border-border focus:outline-none text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          {[{ slug: "all", label: "الكل" }, ...categories].map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className={`h-10 px-5 rounded-full text-sm whitespace-nowrap transition-colors ${
                cat === c.slug ? "bg-foreground text-background" : "bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">لا توجد منتجات.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
