import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/config";
import { toast } from "sonner";

type Order = { id: string; code: string; status: string; payment_status: string; total: number; created_at: string; customer_id: string | null };

const STATUSES = ["new", "in_progress", "ready", "delivered", "cancelled"];
const STATUS_AR: Record<string, string> = { new: "جديد", in_progress: "قيد التنفيذ", ready: "جاهز", delivered: "تم التسليم", cancelled: "ملغي" };

export default function AdminOrders() {
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setList((data ?? []) as Order[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <PageContainer>
      <PageHeader title="الطلبات" subtitle={`${list.length} طلب`} />
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-background rounded-2xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-muted-foreground text-xs">
              <tr><th className="text-start p-4">الكود</th><th className="text-start p-4">التاريخ</th><th className="text-start p-4">الإجمالي</th><th className="text-start p-4">الدفع</th><th className="text-start p-4">الحالة</th></tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="p-4 font-mono">{o.code}</td>
                  <td className="p-4 text-muted-foreground" dir="ltr">{new Date(o.created_at).toLocaleString("en-GB")}</td>
                  <td className="p-4">{formatPrice(Number(o.total))}</td>
                  <td className="p-4 text-muted-foreground">{o.payment_status}</td>
                  <td className="p-4">
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="h-9 px-2 rounded-lg bg-surface border border-border text-sm">
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_AR[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">لا توجد طلبات بعد. الطلبات تأتي عبر واتساب وتُسجَّل من هنا لاحقاً.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
