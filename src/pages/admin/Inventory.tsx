import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { Plus, Trash2, Loader2, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

type Item = {
  id: string; product_id: string; imei: string | null; serial: string | null;
  storage: string | null; color: string | null; battery: number | null;
  condition: string | null; cost_price: number; status: string; notes: string | null;
};
type Product = { id: string; name_ar: string };

export default function AdminInventory() {
  const [list, setList] = useState<Item[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Item> | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: items }, { data: ps }] = await Promise.all([
      supabase.from("inventory_items").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("id,name_ar").order("name_ar"),
    ]);
    setList((items ?? []) as Item[]);
    setProducts(ps ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const productName = (id: string) => products.find((p) => p.id === id)?.name_ar ?? "—";
  const filtered = list.filter((i) => !q || (i.imei ?? "").includes(q) || (i.serial ?? "").includes(q) || productName(i.product_id).includes(q));

  const save = async () => {
    if (!editing?.product_id) return toast.error("اختر منتجاً");
    const payload = { ...editing, cost_price: Number(editing.cost_price) || 0, battery: editing.battery ? Number(editing.battery) : null };
    const { error } = editing.id
      ? await supabase.from("inventory_items").update(payload).eq("id", editing.id)
      : await supabase.from("inventory_items").insert(payload as any);
    if (error) return toast.error(error.message);
    setEditing(null);
    load();
  };
  const remove = async (id: string) => { if (!confirm("حذف؟")) return; await supabase.from("inventory_items").delete().eq("id", id); load(); };

  return (
    <PageContainer>
      <PageHeader
        title="المخزون"
        subtitle={`${list.length} وحدة`}
        action={
          <button onClick={() => setEditing({ status: "in_stock" })} className="h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> إضافة وحدة
          </button>
        }
      />

      <div className="relative mb-5">
        <Search className="absolute top-1/2 -translate-y-1/2 end-4 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث IMEI / Serial / منتج..." className="w-full h-11 pe-11 ps-4 rounded-full bg-background border border-border text-sm" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-background rounded-2xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-muted-foreground text-xs">
              <tr><th className="text-start p-4">المنتج</th><th className="text-start p-4">IMEI</th><th className="text-start p-4">السعة</th><th className="text-start p-4">اللون</th><th className="text-start p-4">البطارية</th><th className="text-start p-4">التكلفة</th><th className="text-start p-4">الحالة</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t border-border cursor-pointer" onClick={() => setEditing(i)}>
                  <td className="p-4">{productName(i.product_id)}</td>
                  <td className="p-4 text-muted-foreground" dir="ltr">{i.imei}</td>
                  <td className="p-4">{i.storage}</td>
                  <td className="p-4">{i.color}</td>
                  <td className="p-4">{i.battery ? `${i.battery}%` : "—"}</td>
                  <td className="p-4">{i.cost_price}</td>
                  <td className="p-4"><span className="text-xs px-2 py-1 rounded-full bg-muted">{i.status}</span></td>
                  <td className="p-4 text-end" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" strokeWidth={1.5} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">لا توجد وحدات.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle className="text-right">{editing?.id ? "تعديل" : "وحدة جديدة"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-6 space-y-3">
              <select value={editing.product_id ?? ""} onChange={(e) => setEditing({ ...editing, product_id: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm">
                <option value="">— المنتج —</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name_ar}</option>)}
              </select>
              <input placeholder="IMEI" value={editing.imei ?? ""} onChange={(e) => setEditing({ ...editing, imei: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
              <input placeholder="Serial" value={editing.serial ?? ""} onChange={(e) => setEditing({ ...editing, serial: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="السعة (128GB)" value={editing.storage ?? ""} onChange={(e) => setEditing({ ...editing, storage: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
                <input placeholder="اللون" value={editing.color ?? ""} onChange={(e) => setEditing({ ...editing, color: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="البطارية %" value={editing.battery ?? ""} onChange={(e) => setEditing({ ...editing, battery: e.target.value ? Number(e.target.value) : null })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
                <input type="number" placeholder="التكلفة" value={editing.cost_price ?? ""} onChange={(e) => setEditing({ ...editing, cost_price: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
              </div>
              <select value={editing.status ?? "in_stock"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm">
                <option value="in_stock">متوفر</option>
                <option value="reserved">محجوز</option>
                <option value="sold">مُباع</option>
                <option value="unavailable">غير متاح</option>
              </select>
              <textarea placeholder="ملاحظات" value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm" />
              <button onClick={save} className="w-full h-11 rounded-full bg-foreground text-background text-sm font-medium">حفظ</button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
