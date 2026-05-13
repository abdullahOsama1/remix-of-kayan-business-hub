import { Link } from "react-router-dom";
import { Instagram, Music2, Mail } from "lucide-react";
import { KAYAN } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-surface mt-24 hairline">
      <div className="container-kayan py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="wordmark text-2xl">KAYAN</div>
          <div className="tagline text-[11px] text-muted-foreground mt-1">
            Store Everything · Guaranteed & Fast Choices
          </div>
          <p className="text-sm text-muted-foreground mt-4 max-w-sm leading-7">
            متجر كيان — إلكترونيات، عطور، وخدمات كيان لاب البرمجية. تجربة سلسة، طلب مباشر عبر واتساب،
            وضمان حقيقي على كل ما نقدّمه.
          </p>
          <div className="flex gap-2 mt-5">
            <a href={KAYAN.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:bg-foreground hover:text-background transition-colors">
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href={KAYAN.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:bg-foreground hover:text-background transition-colors">
              <Music2 className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href={`mailto:${KAYAN.email}`} aria-label="Email"
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:bg-foreground hover:text-background transition-colors">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">المتجر</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">جميع المنتجات</Link></li>
            <li><Link to="/shop?cat=phones" className="hover:text-foreground">الهواتف</Link></li>
            <li><Link to="/shop?cat=accessories" className="hover:text-foreground">الإكسسوارات</Link></li>
            <li><Link to="/shop?cat=wearables" className="hover:text-foreground">الساعات</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">المساعدة</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shipping" className="hover:text-foreground">الشحن والتوصيل</Link></li>
            <li><Link to="/lab" className="hover:text-foreground">خدمات كيان لاب</Link></li>
            <li><Link to="/about" className="hover:text-foreground">عن كيان</Link></li>
          </ul>
        </div>
      </div>
      <div className="hairline">
        <div className="container-kayan py-5 text-xs text-muted-foreground flex justify-between items-center">
          <span>© {new Date().getFullYear()} KAYAN. جميع الحقوق محفوظة.</span>
          <Link
            to="/kayan-control"
            className="opacity-40 hover:opacity-100 hover:text-foreground transition-opacity font-en"
            aria-label="Admin"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
