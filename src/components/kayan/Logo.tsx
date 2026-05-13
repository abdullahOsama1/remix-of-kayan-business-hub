import { Link } from "react-router-dom";
import logo from "@/assets/kayan-logo.jpg";

export function Logo({ className = "", showTagline = false }: { className?: string; showTagline?: boolean }) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt="KAYAN"
        className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-cover ring-1 ring-border"
      />
      <div className="flex flex-col leading-tight">
        <span className="wordmark text-lg sm:text-xl text-foreground">KAYAN</span>
        {showTagline ? (
          <span className="tagline text-[10px] text-muted-foreground">Store Everything</span>
        ) : (
          <span className="text-[11px] text-muted-foreground">كيان</span>
        )}
      </div>
    </Link>
  );
}
