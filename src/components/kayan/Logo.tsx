import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-baseline gap-2 ${className}`}>
      <span className="wordmark text-xl sm:text-2xl text-foreground">KΛYΛN</span>
      <span className="text-sm text-muted-foreground">كيان</span>
    </Link>
  );
}
