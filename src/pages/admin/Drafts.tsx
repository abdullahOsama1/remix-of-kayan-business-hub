import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { Loader2, Sparkles, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Parsed = { name: string; brand?: string; specs?: string; storage?: string; color?: string; condition?: string; battery?: number; price?: number; cost_price?: number; notes?: string; category?: string };
type Draft = { id: string; raw_input: string | null; parsed: Parsed[]; status: string; created_at: string };

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\u0600-\u06FF]+/g, "-").replace(/^-|-$/g, "") || `p-${Date.now()}`;

export default function AdminDrafts() {
  const [list, setList] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Parsed[] | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("ai_drafts").select("*").order("created_at", { ascending: false });
    setList((data ?? []) as unknown as Draft[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const parse = async () => {
    if (!raw.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("ai-parse-products", { body: { text: raw } });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data?.products?.length) return toast.error("لم يُستخرج أي منتج");
    setPreview(data.products);
    toast.success(`تم استخراج ${data.products.length} منتج — راجع ثم احفظ`);
  };

  const updatePreview = (idx: number, patch: Partial<Parsed>) => {
    setPreview((p) => (p ? p.map((x, i) => (i === idx ? { ...x, ...patch } : x)) : p));
  };
  const removePreview = (idx: number) => setPreview((p) => (p ? p.filter((_, i) => i !== idx) : p));

  const savePreview = async () => {
    if (!preview?.length) return;
    const { error } = await supabase.from("ai_drafts").insert({ raw_input: raw, parsed: preview, source: "text" } as any);
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ كمسودة");
    setRaw(""); setPreview(null);
    load();
  };

  const updateItem = async (draft: Draft, idx: number, patch: Partial<Parsed>) => {
    const next = draft.parsed.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    await supabase.from("ai_drafts").update({ parsed: next as any }).eq("id", draft.id);
    setList((l) => l.map((d) => (d.id === draft.id ? { ...d, parsed: next } : d)));
  };

  const approve = async (draft: Draft) => {
    // Load pricing rules from settings
    const { data: rules } = await supabase.from("settings").select("key,value").in("key", ["default_profit_margin","packaging_fee"]);
    const ruleMap = Object.fromEntries((rules ?? []).map((r: any) => [r.key, Number((r.value?.v ?? r.value) || 0)]));
    const margin = ruleMap["default_profit_margin"] || 0;
    const packaging = ruleMap["packaging_fee"] || 0;

    const rows = draft.parsed.map((p) => {
      const cost = Number(p.cost_price) || 0;
      const sellingPrice = Number(p.price) > 0 ? Number(p.price) : cost + margin + packaging;
      return {
        slug: slugify(`${p.name}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`),
        name_ar: p.name,
        brand: p.brand ?? null,
        price: sellingPrice,
        cost_price: cost,
        quantity: 1,
        available: true,
        status: "published" as const,
        condition: p.condition ?? null,
        notes: [p.specs, p.storage, p.color, p.battery ? `بطارية ${p.battery}%` : "", p.notes].filter(Boolean).join(" · "),
        images: [],
      };
    });
    const { error } = await supabase.from("products").insert(rows as any);
    if (error) return toast.error(error.message);
    await supabase.from("ai_drafts").update({ status: "approved" as any }).eq("id", draft.id);
    toast.success(`تم نشر ${rows.length} منتج`);
    load();
  };

  const reject = async (draft: Draft) => {
    const { error } = await supabase.from("ai_drafts").update({ status: "rejected" as any }).eq("id", draft.id);
    if (error) return toast.error(error.message);
    toast.success("تم الرفض");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف المسودة؟")) return;
    await supabase.from("ai_drafts").delete().eq("id", id);
    load();
  };

  return (
    <PageContainer>
      <PageHeader title="الاستيراد الذكي" subtitle="الصق رسائل واتساب — يستخرج المنتجات تلقائياً" />

      <div className="bg-background rounded-2xl border border-border p-5 mb-6">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          placeholder="ألصق رسائل واتساب هنا (يمكن لصق عدة منتجات)..."
          className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-foreground"
        />
        <div className="flex justify-between items-center mt-3 gap-3">
          <p className="text-xs text-muted-foreground">سيقوم Gemini بتنظيف التوقيتات والأسماء والإيموجي ثم استخراج المنتجات وتعبئة الحقول تلقائياً.</p>
          <button onClick={parse} disabled={busy || !raw.trim()} className="h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60 shrink-0">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" strokeWidth={1.75} />}
            تحليل بالذكاء الاصطناعي
          </button>
        </div>
      </div>

      {preview && (
        <div className="bg-background rounded-2xl border-2 border-foreground/20 overflow-hidden mb-6">
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
            <div className="text-sm font-medium">معاينة ({preview.length}) — حقول تم تعبئتها تلقائياً</div>
            <div className="flex gap-2">
              <button onClick={savePreview} className="h-9 px-4 rounded-full bg-foreground text-background text-xs font-medium inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> حفظ كمسودة</button>
              <button onClick={() => setPreview(null)} className="h-9 px-4 rounded-full border border-border text-xs">إلغاء</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-muted-foreground text-xs">
                <tr><th className="text-start p-3">الاسم</th><th className="text-start p-3">الماركة</th><th className="text-start p-3">السعة</th><th className="text-start p-3">اللون</th><th className="text-start p-3">البطارية</th><th className="text-start p-3">الحالة</th><th className="text-start p-3">التكلفة</th><th className="text-start p-3">السعر</th><th></th></tr>
              </thead>
              <tbody>
                {preview.map((p, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2"><input value={p.name ?? ""} onChange={(e) => updatePreview(i, { name: e.target.value })} className="w-44 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                    <td className="p-2"><input value={p.brand ?? ""} onChange={(e) => updatePreview(i, { brand: e.target.value })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                    <td className="p-2"><input value={p.storage ?? ""} onChange={(e) => updatePreview(i, { storage: e.target.value })} className="w-20 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                    <td className="p-2"><input value={p.color ?? ""} onChange={(e) => updatePreview(i, { color: e.target.value })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                    <td className="p-2"><input type="number" value={p.battery ?? ""} onChange={(e) => updatePreview(i, { battery: Number(e.target.value) })} className="w-16 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                    <td className="p-2"><input value={p.condition ?? ""} onChange={(e) => updatePreview(i, { condition: e.target.value })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                    <td className="p-2"><input type="number" value={p.cost_price ?? ""} onChange={(e) => updatePreview(i, { cost_price: Number(e.target.value) })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                    <td className="p-2"><input type="number" value={p.price ?? ""} onChange={(e) => updatePreview(i, { price: Number(e.target.value) })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                    <td className="p-2"><button onClick={() => removePreview(i)} className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-destructive inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : list.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">لا توجد مسودات بعد.</div>
      ) : (
        <div className="space-y-6">
          {list.map((d) => (
            <div key={d.id} className="bg-background rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString("ar-EG")} · <span className="px-2 py-0.5 rounded-full bg-muted">{d.status}</span></div>
                <div className="flex gap-2">
                  {d.status === "pending" && (
                    <>
                      <button onClick={() => approve(d)} className="h-9 px-4 rounded-full bg-foreground text-background text-xs font-medium inline-flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> نشر
                      </button>
                      <button onClick={() => reject(d)} className="h-9 px-4 rounded-full border border-border text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                        رفض
                      </button>
                    </>
                  )}
                  <button onClick={() => remove(d.id)} className="h-9 w-9 rounded-full hover:bg-muted text-muted-foreground hover:text-destructive inline-flex items-center justify-center"><Trash2 className="h-4 w-4" strokeWidth={1.5} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface text-muted-foreground text-xs">
                    <tr><th className="text-start p-3">الاسم</th><th className="text-start p-3">السعة</th><th className="text-start p-3">اللون</th><th className="text-start p-3">البطارية</th><th className="text-start p-3">الحالة</th><th className="text-start p-3">السعر</th><th className="text-start p-3">التكلفة</th></tr>
                  </thead>
                  <tbody>
                    {d.parsed.map((p, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-2"><input value={p.name ?? ""} onChange={(e) => updateItem(d, i, { name: e.target.value })} className="w-44 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                        <td className="p-2"><input value={p.storage ?? ""} onChange={(e) => updateItem(d, i, { storage: e.target.value })} className="w-20 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                        <td className="p-2"><input value={p.color ?? ""} onChange={(e) => updateItem(d, i, { color: e.target.value })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                        <td className="p-2"><input type="number" value={p.battery ?? ""} onChange={(e) => updateItem(d, i, { battery: Number(e.target.value) })} className="w-16 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                        <td className="p-2"><input value={p.condition ?? ""} onChange={(e) => updateItem(d, i, { condition: e.target.value })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                        <td className="p-2"><input type="number" value={p.price ?? ""} onChange={(e) => updateItem(d, i, { price: Number(e.target.value) })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                        <td className="p-2"><input type="number" value={p.cost_price ?? ""} onChange={(e) => updateItem(d, i, { cost_price: Number(e.target.value) })} className="w-24 h-9 px-2 rounded-lg bg-surface border border-border text-sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
