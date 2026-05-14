import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "product-images";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const upload = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    setBusy(true);
    const urls: string[] = [];
    for (const file of arr) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) {
        toast.error(error.message);
        continue;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    if (urls.length) {
      onChange([...(value || []), ...urls]);
      toast.success(`تم رفع ${urls.length} صورة`);
    }
    setBusy(false);
  };

  const remove = async (url: string) => {
    onChange(value.filter((u) => u !== url));
    // best-effort delete from storage if it's ours
    const m = url.match(/product-images\/(.+)$/);
    if (m) await supabase.storage.from(BUCKET).remove([m[1]]);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files) upload(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border border-dashed p-6 text-center text-sm transition-colors ${
          drag ? "border-foreground bg-surface" : "border-border hover:border-foreground/50"
        }`}
      >
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
        ) : (
          <>
            <Upload className="h-5 w-5 mx-auto mb-2 text-muted-foreground" strokeWidth={1.5} />
            <div className="font-medium">اسحب الصور هنا أو اضغط للاختيار</div>
            <div className="text-xs text-muted-foreground mt-1">
              يمكنك رفع عدة صور دفعة واحدة (JPG, PNG, WEBP)
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={url} className="group relative aspect-square rounded-lg overflow-hidden bg-surface border border-border">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 end-1 h-7 w-7 rounded-full bg-foreground/80 text-background inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                aria-label="حذف"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute top-1 start-1 text-[10px] px-2 py-0.5 rounded-full bg-foreground text-background">
                  رئيسية
                </span>
              )}
              <div className="absolute bottom-1 inset-x-1 flex justify-between opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  className="text-[10px] px-2 py-0.5 rounded bg-background/90"
                >
                  ←
                </button>
                <GripVertical className="h-3 w-3 text-background mt-1" />
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  className="text-[10px] px-2 py-0.5 rounded bg-background/90"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
