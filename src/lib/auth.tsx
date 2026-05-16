import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type AdminUser = { id: string; username: string };

type Ctx = {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "kayan_admin_session";

type StoredSession = { token: string; user: AdminUser };

function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = loadSession();
    if (s?.user) setUser(s.user);
    setLoading(false);
  }, []);

  const value: Ctx = {
    user,
    isAdmin: !!user,
    loading,
    signIn: async (username, password) => {
      const { data, error } = await supabase.functions.invoke("admin-login", {
        body: { username, password },
      });
      if (error) return { error: error.message || "تعذر تسجيل الدخول" };
      if (!data?.ok) return { error: data?.error || "بيانات الدخول غير صحيحة" };
      const session: StoredSession = { token: data.token, user: data.user };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(data.user);
      return {};
    },
    signOut: async () => {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    },
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
