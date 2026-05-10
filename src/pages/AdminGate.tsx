import { Lock } from "lucide-react";

export default function AdminGate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full text-center">
        <div className="h-14 w-14 mx-auto rounded-full bg-foreground text-background inline-flex items-center justify-center">
          <Lock className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold mt-6">KΛYΛN Control</h1>
        <p className="text-sm text-muted-foreground mt-3 leading-7">
          لوحة الإدارة الخاصة. تتطلب تسجيل دخول. ستُفعَّل في المرحلة التالية مع نظام الحسابات
          والمخزون والطلبات والمحاسبة.
        </p>
        <div className="mt-8 text-xs text-muted-foreground wordmark">PHASE 2 · COMING NEXT</div>
      </div>
    </div>
  );
}
