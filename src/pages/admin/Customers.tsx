import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/admin/Page";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

type C = { id: string; name: string; phone: string | null; address: string | null; pickup: string | null; map_link: string | null; notes: string | null };

export default function AdminCustomers() {
  const [list, setList] = useState<C[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<C> | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    setList((data ?? []) as C[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name) return toast.error("اسم العميل مطلوب");
    const { error } = editing.id
      ? await supabase.from("customers").update(editing).eq("id", editing.id)
      : await supabase.from("customers").insert(editing as any);
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف العميل؟")) return;
    await supabase.from("customers").delete().eq("id", id);
    load();
  };

  return (
    <PageContainer>
      <PageHeader
        title="العملاء"
        subtitle={`${list.length} عميل`}
        action={
          <button onClick={() => setEditing({})} className="h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> عميل جديد
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-muted-foreground text-xs">
              <tr><th className="text-start p-4">الاسم</th><th className="text-start p-4">الهاتف</th><th className="text-start p-4">العنوان</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-4 cursor-pointer" onClick={() => setEditing(c)}>{c.name}</td>
                  <td className="p-4 text-muted-foreground" dir="ltr">{c.phone}</td>
                  <td className="p-4 text-muted-foreground">{c.address}</td>
                  <td className="p-4 text-end">
                    <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" strokeWidth={1.5} /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">لا يوجد عملاء.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle className="text-right">{editing?.id ? "تعديل" : "عميل جديد"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-6 space-y-3">
              {(["name", "phone", "address", "pickup", "map_link", "notes"] as const).map((f) => (
                <div key={f}>
                  <label className="text-xs text-muted-foreground mb-1 block">{({name:"الاسم",phone:"الهاتف",address:"العنوان",pickup:"نقطة الاستلام",map_link:"رابط الخريطة",notes:"ملاحظات"} as any)[f]}</label>
                  <input
                    value={(editing as any)[f] ?? ""}
                    onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-foreground"
                  />
                </div>
              ))}
              <button onClick={save} className="w-full h-11 mt-3 rounded-full bg-foreground text-background text-sm font-medium">حفظ</button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
