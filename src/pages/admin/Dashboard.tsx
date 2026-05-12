import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { formatPrice } from "@/lib/config";
import { TrendingUp, AlertTriangle, Sparkles, Wallet } from "lucide-react";

type KPI = { sales: number; netProfit: number; lowStock: number; pendingDrafts: number };

export default function AdminDashboard() {
  const [kpi, setKpi] = useState<KPI>({ sales: 0, netProfit: 0, lowStock: 0, pendingDrafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [orders, items, expenses, products, drafts] = await Promise.all([
        supabase.from("orders").select("total,status").eq("status", "delivered"),
        supabase.from("order_items").select("qty,unit_price,cost_price,order_id, orders!inner(status)").eq("orders.status", "delivered"),
        supabase.from("expenses").select("amount"),
        supabase.from("products").select("id,quantity").lt("quantity", 3),
        supabase.from("ai_drafts").select("id").eq("status", "pending"),
      ]);
      const sales = (orders.data ?? []).reduce((s, o: any) => s + Number(o.total || 0), 0);
      const grossProfit = (items.data ?? []).reduce(
        (s, it: any) => s + (Number(it.unit_price) - Number(it.cost_price)) * Number(it.qty),
        0
      );
      const exp = (expenses.data ?? []).reduce((s, e: any) => s + Number(e.amount || 0), 0);
      setKpi({
        sales,
        netProfit: grossProfit - exp,
        lowStock: (products.data ?? []).length,
        pendingDrafts: (drafts.data ?? []).length,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "إجمالي المبيعات", value: formatPrice(kpi.sales), icon: TrendingUp },
    { label: "صافي الربح", value: formatPrice(kpi.netProfit), icon: Wallet },
    { label: "تنبيهات المخزون", value: String(kpi.lowStock), icon: AlertTriangle },
    { label: "مسودات AI معلقة", value: String(kpi.pendingDrafts), icon: Sparkles },
  ];

  return (
    <PageContainer>
      <PageHeader title="لوحة التحكم" subtitle="نظرة عامة على متجر كيان" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-background rounded-2xl p-5 shadow-soft hairline border-b-0 border border-border"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold mt-3">{loading ? "—" : c.value}</div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
