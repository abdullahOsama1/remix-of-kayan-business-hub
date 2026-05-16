import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { Plus, Pencil, Trash2, Copy, Loader2, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatPrice } from "@/lib/config";
import { ImageUploader } from "@/components/admin/ImageUploader";

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
  status: "draft" | "published";
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
  status: "draft",
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
  const [tab, setTab] = useState<"all" | "published" | "draft">("all");
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
      (tab === "all" || p.status === tab) &&
      (!q ||
        p.name_ar.includes(q) ||
        (p.name_en ?? "").toLowerCase().includes(q.toLowerCase()) ||
        (p.brand ?? "").toLowerCase().includes(q.toLowerCase()))
  );

  const togglePublish = async (p: Product) => {
    const next = p.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("products").update({ status: next }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(next === "published" ? "تم النشر" : "تم التحويل إلى مسودة");
    load();
  };

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

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute top-1/2 -translate-y-1/2 end-4 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث..."
            className="w-full h-11 pe-11 ps-4 rounded-full bg-background border border-border text-sm focus:outline-none focus:border-foreground"
          />
        </div>
        <div className="inline-flex rounded-full bg-surface border border-border p-1 text-xs">
          {(["all", "published", "draft"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 h-9 rounded-full transition-colors ${tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t === "all" ? "الكل" : t === "published" ? "منشور" : "مسودات"}
            </button>
          ))}
        </div>
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
                      {p.status === "draft" ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600">مسودة</span>
                      ) : p.available ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">منشور</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">نفد</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => togglePublish(p)} className="text-muted-foreground hover:text-foreground text-xs px-3 h-8 rounded-full border border-border">
                          {p.status === "published" ? "إلى مسودة" : "نشر"}
                        </button>
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
        <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto p-0">
          <SheetHeader className="px-8 pt-8 pb-5 border-b border-border">
            <SheetTitle className="text-right text-xl font-semibold tracking-tight">
              {editing?.id ? "تعديل المنتج" : "منتج جديد"}
            </SheetTitle>
            <p className="text-right text-xs text-muted-foreground mt-1">
              املأ التفاصيل بعناية — تظهر للعملاء فوراً.
            </p>
          </SheetHeader>

          {editing && (
            <div className="px-8 py-7 space-y-9">
              <Section title="المعلومات الأساسية">
                <Field label="الاسم بالعربية" required>
                  <input
                    value={editing.name_ar ?? ""}
                    onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })}
                    placeholder="مثال: iPhone 15 Pro"
                    className={inputCls}
                  />
                </Field>
                <Field label="الاسم بالإنجليزية">
                  <input
                    value={editing.name_en ?? ""}
                    onChange={(e) => setEditing({ ...editing, name_en: e.target.value })}
                    placeholder="iPhone 15 Pro"
                    dir="ltr"
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="الماركة">
                    <input
                      value={editing.brand ?? ""}
                      onChange={(e) => setEditing({ ...editing, brand: e.target.value })}
                      placeholder="Apple"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="التصنيف">
                    <select
                      value={editing.category_id ?? ""}
                      onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                      className={inputCls}
                    >
                      <option value="">— اختر —</option>
                      {cats.map((c) => (
                        <option key={c.id} value={c.id}>{c.name_ar}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </Section>

              <Section title="التسعير والمخزون">
                <div className="grid grid-cols-3 gap-4">
                  <Field label="السعر" required>
                    <input
                      type="number"
                      value={editing.price ?? 0}
                      onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="السعر القديم" hint="اختياري">
                    <input
                      type="number"
                      value={editing.old_price ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, old_price: e.target.value ? Number(e.target.value) : null })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="التكلفة">
                    <input
                      type="number"
                      value={editing.cost_price ?? 0}
                      onChange={(e) => setEditing({ ...editing, cost_price: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="الكمية" hint="تتزامن تلقائياً مع المخزون">
                    <input
                      type="number"
                      value={editing.quantity ?? 0}
                      onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="الحالة">
                    <select
                      value={editing.condition ?? ""}
                      onChange={(e) => setEditing({ ...editing, condition: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">—</option>
                      <option value="جديد">جديد</option>
                      <option value="مستعمل">مستعمل</option>
                      <option value="مجدد">مجدد</option>
                    </select>
                  </Field>
                </div>
              </Section>

              <Section title="الصور" subtitle="اسحب وأفلت أو ارفع مباشرة من جهازك">
                <ImageUploader
                  value={editing.images ?? []}
                  onChange={(images) => setEditing({ ...editing, images })}
                />
              </Section>

              <Section title="الوصف">
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={4}
                  placeholder="وصف موجز يبرز مزايا المنتج..."
                  className={`${inputCls} h-auto py-3 leading-7`}
                />
              </Section>

              <label className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-surface">
                <div>
                  <div className="text-sm font-medium">متاح للبيع</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    يُخفى تلقائياً عندما تصل الكمية إلى صفر.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editing.available ?? true}
                  onChange={(e) => setEditing({ ...editing, available: e.target.checked })}
                  className="h-5 w-5 accent-foreground"
                />
              </label>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-background py-4 -mx-8 px-8 border-t border-border">
                <button
                  onClick={save}
                  className="flex-1 h-12 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  حفظ المنتج
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="h-12 px-6 rounded-full bg-surface text-foreground text-sm hover:bg-muted transition-colors"
                >
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

const inputCls =
  "w-full h-11 px-4 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/5 transition-all placeholder:text-muted-foreground/60";

function Section({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground/80 mt-1">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label, required, hint, children,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
