import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/config";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export function CartDrawer() {
  const { open, setOpen, items, remove, setQty, total, whatsappUrl, clear } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 hairline">
          <SheetTitle className="text-right">السلة ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-muted-foreground">سلتك فارغة. ابدأ التسوق الآن.</p>
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center"
            >
              تصفّح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {items.map((i) => {
                const p = products.find((x) => x.id === i.productId);
                if (!p) return null;
                return (
                  <div key={i.id} className="flex gap-4">
                    <div className="h-20 w-20 rounded-lg bg-surface overflow-hidden shrink-0">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <h4 className="text-sm font-medium truncate">{p.name}</h4>
                        <button onClick={() => remove(i.id)} aria-label="حذف"
                          className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 space-x-2 rtl:space-x-reverse">
                        {i.storage && <span>{i.storage}</span>}
                        {i.color && <span>· {i.color}</span>}
                        {i.condition && <span>· {i.condition}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-border rounded-full">
                          <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="-"
                            className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted rounded-full">
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </button>
                          <span className="text-sm w-7 text-center">{i.qty}</span>
                          <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="+"
                            className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted rounded-full">
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(p.price * i.qty)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 hairline border-t space-y-4 bg-background">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الشحن</span>
                <span>يُحسب عند التواصل</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>الإجمالي</span>
                <span>{formatPrice(total)}</span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 rounded-full bg-whatsapp text-whatsapp-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-95"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                أكمل الطلب عبر واتساب
              </a>
              <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-foreground py-1">
                إفراغ السلة
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
