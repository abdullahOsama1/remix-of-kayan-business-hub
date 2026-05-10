import { Link } from "react-router-dom";
import { type Product } from "@/lib/products";
import { formatPrice } from "@/lib/config";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block animate-fade-up"
    >
      <div className="aspect-square bg-surface rounded-2xl overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
      </div>
      <div className="mt-4 px-1">
        <div className="text-xs text-muted-foreground">{product.brand} · {product.categoryLabel}</div>
        <h3 className="text-sm font-medium mt-1 line-clamp-1">{product.name}</h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
