import { MessageCircle } from "lucide-react";
import { KAYAN } from "@/lib/config";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${KAYAN.whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-5 start-5 z-50 inline-flex items-center gap-2 h-14 px-5 rounded-full bg-whatsapp text-whatsapp-foreground shadow-elevated hover:scale-[1.03] transition-transform"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
      <span className="text-sm font-medium">تواصل واتساب</span>
    </a>
  );
}
