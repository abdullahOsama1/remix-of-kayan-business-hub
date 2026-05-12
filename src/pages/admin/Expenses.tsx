import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatPrice } from "@/lib/config";

type E = { id: string; title: string; amount: number; category: string | null; notes: string | null; occurred_at: string };

export default function AdminFinance() {
  const [list, setList] = useState<E[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<E> | null>(null);
  const [summary, setSummary] = useState({ revenue: 0, cost: 0, expenses: 0 });

  const load = async () => {
    setLoading(true);
    const [{ data }, { data: orders }, { data: items }] = await Promise.all([
      supabase.from("expenses").select("*").order("occurred_at", { ascending: false }),
      supabase.from("orders").select("total").eq("status", "delivered"),
      supabase.from("order_items").select("qty,cost_price,orders!inner(status)").eq("orders.status", "delivered"),
    ]);
    setList((data ?? []) as E[]);
    const exp = (data ?? []).reduce((s: number, e: any) => s + Number(e.amount), 0);
    const rev = (orders ?? []).reduce((s: number, o: any) => s + Number(o.total), 0);
    const cost = (items ?? []).reduce((s: number, i: any) => s + Number(i.cost_price) * Number(i.qty), 0);
    setSummary({ revenue: rev, cost, expenses: exp });
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title) return toast.error("الوصف مطلوب");
    const payload = { ...editing, amount: Number(editing.amount) || 0 };
    const { error } = editing.id
      ? await supabase.from("expenses").update(payload).eq("id", editing.id)
      : await supabase.from("expenses").insert(payload as any);
    if (error) return toast.error(error.message);
    setEditing(null);
    load();
  };
  const remove = async (id: string) => { if (!confirm("حذف؟")) return; await supabase.from("expenses").delete().eq("id", id); load(); };

  const net = summary.revenue - summary.cost - summary.expenses;
  const cards = [
    { l: "الإيرادات", v: summary.revenue },
    { l: "تكلفة البضاعة", v: summary.cost },
    { l: "المصروفات", v: summary.expenses },
    { l: "صافي الربح", v: net },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="المحاسبة"
        action={
          <button onClick={() => setEditing({ occurred_at: new Date().toISOString().slice(0, 10) })} className="h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> مصروف
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.l} className="bg-background rounded-2xl p-5 border border-border">
            <div className="text-xs text-muted-foreground">{c.l}</div>
            <div className="text-xl font-bold mt-2">{formatPrice(c.v)}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-muted-foreground text-xs">
              <tr><th className="text-start p-4">التاريخ</th><th className="text-start p-4">الوصف</th><th className="text-start p-4">التصنيف</th><th className="text-start p-4">المبلغ</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="p-4 text-muted-foreground" dir="ltr">{e.occurred_at}</td>
                  <td className="p-4">{e.title}</td>
                  <td className="p-4 text-muted-foreground">{e.category}</td>
                  <td className="p-4">{formatPrice(Number(e.amount))}</td>
                  <td className="p-4 text-end"><button onClick={() => remove(e.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" strokeWidth={1.5} /></button></td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">لا مصروفات.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle className="text-right">مصروف جديد</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-6 space-y-3">
              <input placeholder="الوصف" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
              <input type="number" placeholder="المبلغ" value={editing.amount ?? ""} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
              <input placeholder="التصنيف (شحن، تغليف، إيجار...)" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
              <input type="date" value={editing.occurred_at ?? ""} onChange={(e) => setEditing({ ...editing, occurred_at: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
              <textarea placeholder="ملاحظات" value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm" />
              <button onClick={save} className="w-full h-11 rounded-full bg-foreground text-background text-sm font-medium">حفظ</button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
