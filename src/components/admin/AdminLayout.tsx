import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Wallet,
  Sparkles,
  Settings as SettingsIcon,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/kayan-control/dashboard", icon: LayoutDashboard, label: "لوحة" },
  { to: "/kayan-control/products", icon: Package, label: "المنتجات" },
  { to: "/kayan-control/inventory", icon: Boxes, label: "المخزون" },
  { to: "/kayan-control/orders", icon: ShoppingCart, label: "الطلبات" },
  { to: "/kayan-control/customers", icon: Users, label: "العملاء" },
  { to: "/kayan-control/finance", icon: Wallet, label: "المحاسبة" },
  { to: "/kayan-control/drafts", icon: Sparkles, label: "AI" },
  { to: "/kayan-control/settings", icon: SettingsIcon, label: "الإعدادات" },
];

export default function AdminLayout() {
  const { isAdmin, loading, signOut } = useAuth();
  const navTo = useNavigate();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  if (!isAdmin) return <Navigate to="/kayan-control" replace />;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-background border-l border-border">
        <div className="h-16 flex items-center justify-center hairline">
          <span className="wordmark text-base">KΛYΛN · CONTROL</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 h-10 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <n.icon className="h-4 w-4" strokeWidth={1.5} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={async () => {
            await signOut();
            navTo("/kayan-control");
          }}
          className="m-3 flex items-center gap-2 px-3 h-10 rounded-lg text-sm text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          تسجيل خروج
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden h-14 bg-background border-b border-border flex items-center justify-between px-4">
          <span className="wordmark text-sm">KΛYΛN · CONTROL</span>
          <button
            onClick={async () => {
              await signOut();
              navTo("/kayan-control");
            }}
            className="text-muted-foreground"
            aria-label="خروج"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-background border-t border-border grid grid-cols-5 z-40">
          {nav.slice(0, 5).map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 h-16 text-[10px] ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <n.icon className="h-5 w-5" strokeWidth={1.5} />
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
