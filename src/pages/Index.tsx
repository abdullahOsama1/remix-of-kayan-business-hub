import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Truck, Sparkles, Wrench } from "lucide-react";
import heroComposition from "@/assets/hero-composition.jpg";
import { featuredProducts, categories } from "@/lib/products";
import { ProductCard } from "@/components/kayan/ProductCard";

const Index = () => {
  const featured = featuredProducts();

  return (
    <>
      {/* Hero — cinematic */}
      <section className="relative overflow-hidden bg-hero">
        {/* ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(closest-side, hsl(var(--accent) / 0.18), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, hsl(var(--brand) / 0.18), transparent)" }}
        />

        <div className="container-kayan relative grid lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-10 pb-16 lg:pt-20 lg:pb-28">
          {/* Copy */}
          <div className="order-2 lg:order-1 lg:col-span-5 animate-fade-up">
            <span className="inline-flex items-center gap-3 text-[10px] sm:text-xs tagline text-accent mb-7">
              <span className="h-px w-10 bg-accent/50" />
              KAYAN · STORE EVERYTHING
            </span>
            <h1 className="text-[2.5rem] sm:text-6xl lg:text-[4.25rem] font-bold leading-[1.05] tracking-tight">
              كل ما تحتاجه،
              <br />
              اختيارات
              <span className="relative inline-block ms-2">
                <span className="relative z-10">مضمونة</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-accent/25 -z-0 rounded-sm" />
              </span>
              <br />
              وسريعة.
            </h1>
            <p className="mt-7 text-base sm:text-lg text-muted-foreground max-w-md leading-8">
              إلكترونيات، ساعات، إكسسوارات وخدمات كيان لاب —
              تجربة شراء فاخرة وسريعة عبر واتساب.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="group h-13 px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2 shadow-elevated hover:shadow-soft hover:translate-y-[-1px] transition-all duration-300"
              >
                تسوّق الآن
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.75} />
              </Link>
              <Link
                to="/lab"
                className="h-13 px-8 py-3.5 rounded-full border border-foreground/15 text-sm font-medium inline-flex items-center hover:bg-foreground hover:text-background transition-all duration-300"
              >
                اكتشف كيان لاب
              </Link>
            </div>

            {/* tiny trust line */}
            <div className="mt-10 flex items-center gap-5 text-[11px] tagline text-muted-foreground/80">
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-accent" /> ضمان أصلي</span>
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-brand" /> توصيل سريع</span>
              <span className="hidden sm:flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-foreground" /> دفع عند الاستلام</span>
            </div>
          </div>

          {/* Cinematic visual */}
          <div className="order-1 lg:order-2 lg:col-span-7 animate-fade-up">
            <div className="relative">
              <div className="aspect-[16/11] lg:aspect-[16/12] rounded-[2rem] overflow-hidden bg-surface shadow-elevated ring-1 ring-foreground/5">
                <img
                  src={heroComposition}
                  alt="تشكيلة منتجات كيان الفاخرة"
                  width={1600}
                  height={1100}
                  fetchPriority="high"
                  className="h-full w-full object-cover scale-[1.02]"
                />
              </div>

              {/* Floating spec chip */}
              <div className="hidden sm:flex absolute -bottom-5 start-6 items-center gap-3 rounded-2xl bg-card/95 backdrop-blur px-4 py-3 shadow-elevated ring-1 ring-border">
                <div className="h-9 w-9 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] text-muted-foreground">تشكيلة هذا الأسبوع</div>
                  <div className="text-sm font-semibold">iPhone · Watch · AirPods</div>
                </div>
              </div>

              {/* Floating price chip */}
              <div className="hidden md:flex absolute -top-4 end-6 items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 shadow-elevated">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] tagline">NEW · موسم 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="hairline border-y bg-background">
        <div className="container-kayan grid grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {[
            { Icon: Shield, t: "ضمان حقيقي", s: "على جميع المنتجات" },
            { Icon: Truck, t: "توصيل سريع", s: "داخل وخارج المدن" },
            { Icon: Sparkles, t: "منتجات مختارة", s: "جودة بلا تنازل" },
            { Icon: Wrench, t: "كيان لاب", s: "صيانة احترافية" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-foreground/70" strokeWidth={1.25} />
              <div>
                <div className="text-sm font-medium">{t}</div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-kayan py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">تسوّق حسب الفئة</h2>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/shop?cat=${c.id}`}
              className="group relative aspect-[4/5] rounded-2xl bg-surface overflow-hidden p-6 flex flex-col justify-between hover:shadow-soft transition-shadow"
            >
              <span className="text-xs text-muted-foreground wordmark">
                {String(categories.findIndex((x) => x.id === c.id) + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold">{c.label}</h3>
                <span className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-1 group-hover:text-foreground transition-colors">
                  استكشف <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-kayan py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">منتجات مميزة</h2>
            <p className="text-sm text-muted-foreground mt-2">اختيارات الأسبوع من فريق كيان</p>
          </div>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* KAYAN LAB CTA */}
      <section className="container-kayan py-20">
        <div className="rounded-3xl bg-dark-gradient text-background p-10 sm:p-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs wordmark text-background/60">KΛYΛN LAB</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 leading-tight">
              صيانة احترافية لجهازك،
              <br /> بأيدٍ تثق بها.
            </h2>
            <p className="mt-5 text-background/70 leading-8 max-w-md">
              فحص شامل، استبدال شاشات وبطاريات، وضمان على كل خدمة. اطلب موعد سريع عبر واتساب.
            </p>
            <Link
              to="/lab"
              className="mt-7 h-12 px-7 rounded-full bg-background text-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90"
            >
              تعرّف على الخدمات <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["استبدال الشاشات", "أصلية وOEM"],
              ["استبدال البطاريات", "ضمان 6 أشهر"],
              ["فك التشفير", "iCloud / FRP"],
              ["فحص شامل", "قبل الشراء"],
            ].map(([t, s]) => (
              <div key={t} className="rounded-xl border border-background/15 p-5">
                <div className="font-semibold">{t}</div>
                <div className="text-background/60 text-xs mt-1">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
