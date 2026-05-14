import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProduct } from "@/lib/products";
import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart";
import { Check, ShoppingBag, MessageCircle, ArrowRight, Loader2 } from "lucide-react";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const { product, loading } = useProduct(slug);
  const { add, setOpen, whatsappUrl } = useCart();
  const [storage, setStorage] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();

  if (loading) {
    return (
      <div className="container-kayan py-32 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-kayan py-32 text-center">
        <h1 className="text-2xl font-bold">المنتج غير موجود</h1>
        <Link to="/shop" className="text-sm text-muted-foreground mt-3 inline-block">العودة للمتجر</Link>
      </div>
    );
  }

  const storageOpts = product.storage;
  const colorOpts = product.colors;
  const activeStorage = storage ?? storageOpts[0];
  const activeColor = color ?? colorOpts[0];

  const onAdd = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      storage: activeStorage,
      color: activeColor,
    });
  };

  const onBuyNow = () => {
    onAdd();
    setOpen(false);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container-kayan py-10 lg:py-16">
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-foreground">الرئيسية</Link>
        <ArrowRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-foreground">المتجر</Link>
        <ArrowRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-square bg-surface rounded-3xl overflow-hidden">
          <img src={product.image} alt={product.name}
            className="h-full w-full object-cover" width={1024} height={1024} />
        </div>

        <div>
          <div className="text-xs text-muted-foreground">{product.brand}{product.categoryLabel ? ` · ${product.categoryLabel}` : ""}</div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          {product.description && <p className="mt-6 text-muted-foreground leading-8">{product.description}</p>}

          {storageOpts.length > 0 && (
            <Selector label="السعة" options={storageOpts} value={activeStorage} onChange={setStorage} />
          )}
          {colorOpts.length > 0 && (
            <Selector label="اللون" options={colorOpts} value={activeColor} onChange={setColor} />
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onAdd}
              className="h-12 px-7 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center justify-center gap-2 hover:opacity-90"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              أضف إلى السلة
            </button>
            <button
              onClick={onBuyNow}
              className="h-12 px-7 rounded-full bg-whatsapp text-whatsapp-foreground text-sm font-medium inline-flex items-center justify-center gap-2 hover:opacity-95"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              اطلب الآن عبر واتساب
            </button>
          </div>

          <div className="mt-10 hairline border-t pt-6 text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" strokeWidth={2} /> ضمان كيان على المنتج</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" strokeWidth={2} /> فحص شامل قبل التسليم</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" strokeWidth={2} /> توصيل لجميع المدن</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Selector({
  label, options, value, onChange,
}: { label: string; options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-6">
      <div className="text-sm font-medium mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`h-10 px-4 rounded-full text-sm border transition-colors ${
              value === o
                ? "bg-foreground text-background border-foreground"
                : "border-border text-foreground hover:border-foreground/40"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
