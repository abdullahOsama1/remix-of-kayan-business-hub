import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { KAYAN, formatPrice } from "./config";

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  storage?: string;
  color?: string;
  condition?: string;
}

interface CartContextValue {
  items: CartItem[];
  add: (item: Omit<CartItem, "id" | "qty"> & { qty?: number }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  whatsappUrl: string;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "kayan_cart_v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add: CartContextValue["add"] = (data) => {
    const qty = data.qty ?? 1;
    setItems((cur) => {
      const matchIdx = cur.findIndex(
        (i) =>
          i.productId === data.productId &&
          i.storage === data.storage &&
          i.color === data.color &&
          i.condition === data.condition,
      );
      if (matchIdx >= 0) {
        const copy = [...cur];
        copy[matchIdx] = { ...copy[matchIdx], qty: copy[matchIdx].qty + qty };
        return copy;
      }
      return [
        ...cur,
        {
          id: `${data.productId}-${Date.now()}`,
          productId: data.productId,
          slug: data.slug,
          name: data.name,
          image: data.image,
          price: data.price,
          qty,
          storage: data.storage,
          color: data.color,
          condition: data.condition,
        },
      ];
    });
    setOpen(true);
  };

  const remove = (id: string) => setItems((c) => c.filter((i) => i.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );
  const count = items.reduce((s, i) => s + i.qty, 0);

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return `https://wa.me/${KAYAN.whatsappNumber}`;
    const lines: string[] = [];
    lines.push("*طلب جديد من متجر KΛYΛN — كيان*");
    lines.push("");
    items.forEach((i, idx) => {
      lines.push(`${idx + 1}. ${i.name}`);
      const opts: string[] = [];
      if (i.storage) opts.push(`السعة: ${i.storage}`);
      if (i.color) opts.push(`اللون: ${i.color}`);
      if (i.condition) opts.push(`الحالة: ${i.condition}`);
      if (opts.length) lines.push(`   • ${opts.join(" — ")}`);
      lines.push(`   • الكمية: ${i.qty}`);
      lines.push(`   • السعر: ${formatPrice(i.price * i.qty)}`);
      lines.push("");
    });
    lines.push(`*الإجمالي: ${formatPrice(total)}*`);
    lines.push("");
    lines.push("الاسم الكامل:");
    lines.push("العنوان:");
    lines.push("ملاحظات:");
    return `https://wa.me/${KAYAN.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [items, total]);

  return (
    <CartContext.Provider
      value={{ items, add, remove, setQty, clear, count, total, open, setOpen, whatsappUrl }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
