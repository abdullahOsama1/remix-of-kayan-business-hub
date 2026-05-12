import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { Plus, Pencil, Trash2, Copy, Loader2, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatPrice } from "@/lib/config";

type Product = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string | null;
  brand: string | null;
  category_id: string | null;
  description: string | null;
  price: number;
  old_price: number | null;
  cost_price: number;
  quantity: number;
  available: boolean;
  images: string[];
  condition: string | null;
  notes: string | null;
};
type Category = { id: string; name_ar: string };

const empty: Partial<Product> = {
  name_ar: "",
  name_en: "",
  brand: "",
  price: 0,
  cost_price: 0,
  quantity: 1,
  available: true,
  images: [],
  description: "",
  condition: "",
  notes: "",
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\u0600-\u06FF]+/g, "-").replace(/^-|-$/g, "") || `p-${Date.now()}`;

export default function AdminProducts() {
  const [list, setList] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: ps }, { data: cs }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("id,name_ar").order("sort_order"),
    ]);
    setList(ps ?? []);
    setCats(cs ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = list.filter(
    (p) =>
      !q ||
      p.name_ar.includes(q) ||
      (p.name_en ?? "").toLowerCase().includes(q.toLowerCase()) ||
      (p.brand ?? "").toLowerCase().includes(q.toLowerCase())
  );

  const save = async () => {
    if (!editing) return;
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name_ar || editing.name_en || ""),
      price: Number(editing.price) || 0,
      old_price: editing.old_price ? Number(editing.old_price) : null,
      cost_price: Number(editing.cost_price) || 0,
      quantity: Number(editing.quantity) || 0,
      images: editing.images || [],
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload as any);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "تم التحديث" : "تمت الإضافة");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف المنتج؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    load();
  };

  const duplicate = (p: Product) => {
    const { id, slug, ...rest } = p;
    setEditing({ ...rest, name_ar: rest.name_ar + " (نسخة)", slug: slugify(rest.name_ar + "-copy") });
  };

  return (
    <PageContainer>
      <PageHeader
        title="المنتجات"
        subtitle={`${list.length} منتج`}
        action={
          <button
            onClick={() => setEditing(empty)}
            className="h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            منتج جديد
          </button>
        }
      />

      <div className="relative mb-5">
        <Search className="absolute top-1/2 -translate-y-1/2 end-4 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="بحث..."
          className="w-full h-11 pe-11 ps-4 rounded-full bg-background border border-border text-sm focus:outline-none focus:border-foreground"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-muted-foreground text-xs">
                <tr>
                  <th className="text-start p-4">المنتج</th>
                  <th className="text-start p-4">السعر</th>
                  <th className="text-start p-4">التكلفة</th>
                  <th className="text-start p-4">الكمية</th>
                  <th className="text-start p-4">الحالة</th>
                  <th className="text-end p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="font-medium">{p.name_ar}</div>
                      <div className="text-xs text-muted-foreground">{p.brand}</div>
                    </td>
                    <td className="p-4">{formatPrice(Number(p.price))}</td>
                    <td className="p-4 text-muted-foreground">{formatPrice(Number(p.cost_price))}</td>
                    <td className="p-4">{p.quantity}</td>
                    <td className="p-4">
                      {p.available ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">متاح</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">غير متاح</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditing(p)} className="text-muted-foreground hover:text-foreground" aria-label="تعديل">
                          <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button onClick={() => duplicate(p)} className="text-muted-foreground hover:text-foreground" aria-label="تكرار">
                          <Copy className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive" aria-label="حذف">
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                      لا توجد منتجات.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-right">
              {editing?.id ? "تعديل منتج" : "منتج جديد"}
            </SheetTitle>
          </SheetHeader>
          {editing && (
            <div className="mt-6 space-y-4">
              <Field label="الاسم بالعربية">
                <input value={editing.name_ar ?? ""} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} className={inputCls} />
              </Field>
              <Field label="الاسم بالإنجليزية">
                <input value={editing.name_en ?? ""} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="الماركة">
                  <input value={editing.brand ?? ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} className={inputCls} />
                </Field>
                <Field label="التصنيف">
                  <select value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className={inputCls}>
                    <option value="">—</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>{c.name_ar}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="السعر">
                  <input type="number" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={inputCls} />
                </Field>
                <Field label="السعر القديم">
                  <input type="number" value={editing.old_price ?? ""} onChange={(e) => setEditing({ ...editing, old_price: e.target.value ? Number(e.target.value) : null })} className={inputCls} />
                </Field>
                <Field label="التكلفة">
                  <input type="number" value={editing.cost_price ?? 0} onChange={(e) => setEditing({ ...editing, cost_price: Number(e.target.value) })} className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="الكمية">
                  <input type="number" value={editing.quantity ?? 0} onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })} className={inputCls} />
                </Field>
                <Field label="الحالة">
                  <select value={editing.condition ?? ""} onChange={(e) => setEditing({ ...editing, condition: e.target.value })} className={inputCls}>
                    <option value="">—</option>
                    <option value="جديد">جديد</option>
                    <option value="مستعمل">مستعمل</option>
                    <option value="مجدد">مجدد</option>
                  </select>
                </Field>
              </div>
              <Field label="رابط الصورة">
                <input
                  value={(editing.images ?? [])[0] ?? ""}
                  onChange={(e) => setEditing({ ...editing, images: e.target.value ? [e.target.value] : [] })}
                  placeholder="https://..."
                  className={inputCls}
                />
              </Field>
              <Field label="الوصف">
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className={inputCls}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.available ?? true}
                  onChange={(e) => setEditing({ ...editing, available: e.target.checked })}
                />
                متاح للبيع
              </label>

              <div className="flex gap-3 pt-4">
                <button onClick={save} className="flex-1 h-11 rounded-full bg-foreground text-background text-sm font-medium">
                  حفظ
                </button>
                <button onClick={() => setEditing(null)} className="flex-1 h-11 rounded-full bg-surface text-foreground text-sm">
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}

const inputCls = "w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-foreground";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {children}
    </div>
  );
}
