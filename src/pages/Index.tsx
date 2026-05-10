import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Truck, Sparkles, Wrench } from "lucide-react";
import heroDevice from "@/assets/hero-device.jpg";
import { featuredProducts, categories } from "@/lib/products";
import { ProductCard } from "@/components/kayan/ProductCard";

const Index = () => {
  const featured = featuredProducts();

  return (
    <>
      {/* Hero */}
      <section className="bg-hero">
        <div className="container-kayan grid lg:grid-cols-2 gap-10 items-center pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="order-2 lg:order-1 animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 wordmark">
              <span className="h-px w-8 bg-foreground/30" /> KΛYΛN · كيان
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              تجربة فاخرة.
              <br />
              <span className="text-muted-foreground">طلب بضغطة واحدة.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md leading-8">
              أحدث الهواتف، إكسسوارات مختارة بعناية، وخدمات كيان لاب — كل شيء في مكان واحد،
              بتجربة شراء سلسة عبر واتساب.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="h-12 px-7 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                تسوّق الآن
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              </Link>
              <Link
                to="/lab"
                className="h-12 px-7 rounded-full border border-border text-sm font-medium inline-flex items-center hover:bg-muted transition-colors"
              >
                خدمات كيان لاب
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 animate-fade-up">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted shadow-elevated">
              <img
                src={heroDevice}
                alt="جهاز فاخر من كيان"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
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
