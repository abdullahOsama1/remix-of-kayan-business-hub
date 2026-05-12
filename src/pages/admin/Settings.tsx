import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const FIELDS: { key: string; label: string; type?: string }[] = [
  { key: "store_name", label: "اسم المتجر" },
  { key: "hero_title", label: "عنوان الواجهة" },
  { key: "hero_subtitle", label: "نص الواجهة الفرعي" },
  { key: "whatsapp_number", label: "رقم واتساب (دولي بدون +)" },
  { key: "instagram", label: "Instagram URL" },
  { key: "facebook", label: "Facebook URL" },
  { key: "tiktok", label: "TikTok URL" },
  { key: "shipping_policy", label: "سياسة الشحن" },
  { key: "footer_text", label: "نص الفوتر" },
  { key: "seo_title", label: "SEO Title" },
  { key: "seo_description", label: "SEO Description" },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("settings").select("key,value");
      const v: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { v[r.key] = typeof r.value === "string" ? r.value : (r.value?.v ?? ""); });
      setValues(v);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const rows = FIELDS.map((f) => ({ key: f.key, value: { v: values[f.key] ?? "" } }));
    const { error } = await supabase.from("settings").upsert(rows as any, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <PageContainer>
      <PageHeader title="الإعدادات" subtitle="إدارة المحتوى والروابط" />
      <div className="bg-background rounded-2xl border border-border p-6 space-y-4 max-w-2xl">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            {f.key.includes("policy") || f.key.includes("description") ? (
              <textarea rows={3} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm" />
            ) : (
              <input value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm" />
            )}
          </div>
        ))}
        <button onClick={save} disabled={saving} className="h-11 px-8 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          حفظ الإعدادات
        </button>
      </div>
    </PageContainer>
  );
}
