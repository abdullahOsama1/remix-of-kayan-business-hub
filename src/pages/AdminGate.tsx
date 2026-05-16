import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function AdminGate() {
  const { isAdmin, loading, signIn } = useAuth();
  const [username, setUsername] = useState("");
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

  if (isAdmin) return <Navigate to="/kayan-control/dashboard" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(username, password);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    nav("/kayan-control/dashboard");
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
        <p className="text-xs text-center text-muted-foreground mt-2">دخول الإدارة</p>

        <div className="mt-7 space-y-3">
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="w-full h-11 px-4 rounded-lg bg-surface border border-border focus:outline-none focus:border-foreground text-sm"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
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
          دخول
        </button>
      </form>
    </div>
  );
}
