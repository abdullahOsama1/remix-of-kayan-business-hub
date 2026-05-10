import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { useState } from "react";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/lab", label: "كيان لاب" },
  { to: "/shipping", label: "الشحن" },
  { to: "/about", label: "عن كيان" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl hairline">
      <div className="container-kayan flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/shop"
            aria-label="بحث"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="السلة"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-0.5 -start-0.5 min-w-5 h-5 px-1 rounded-full bg-foreground text-background text-[11px] font-medium flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobile((v) => !v)}
            aria-label="القائمة"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          >
            {mobile ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="md:hidden hairline">
          <nav className="container-kayan py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setMobile(false)}
                className={({ isActive }) =>
                  `py-2 text-base ${isActive ? "text-foreground" : "text-muted-foreground"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
