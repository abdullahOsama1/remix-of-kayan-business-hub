import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function AdminGate() {
  const { session, isAdmin, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "bootstrap">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (session && isAdmin) return <Navigate to="/kayan-control/dashboard" replace />;
  if (session && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-bold">غير مصرح</h1>
          <p className="text-sm text-muted-foreground mt-3">
            هذا الحساب لا يملك صلاحية الإدارة.
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "bootstrap" ? signUp : signIn;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (mode === "bootstrap") {
      toast.success("تم إنشاء حساب المالك. سجّل الدخول الآن.");
      setMode("signin");
    } else {
      nav("/kayan-control/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <form
        onSubmit={onSubmit}
        className="max-w-sm w-full bg-background rounded-2xl shadow-elevated p-8"
      >
        <div className="h-12 w-12 mx-auto rounded-full bg-foreground text-background inline-flex items-center justify-center">
          <Lock className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-center mt-5">KΛYΛN Control</h1>
        <p className="text-xs text-center text-muted-foreground mt-2">
          {mode === "bootstrap" ? "تهيئة حساب المالك" : "دخول الإدارة"}
        </p>

        <div className="mt-7 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="w-full h-11 px-4 rounded-lg bg-surface border border-border focus:outline-none focus:border-foreground text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full h-11 px-4 rounded-lg bg-surface border border-border focus:outline-none focus:border-foreground text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full h-11 mt-5 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "bootstrap" ? "إنشاء حساب المالك" : "دخول"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "bootstrap" : "signin")}
          className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin"
            ? "أول استخدام؟ إنشاء حساب المالك"
            : "لديك حساب؟ سجّل الدخول"}
        </button>
      </form>
    </div>
  );
}
