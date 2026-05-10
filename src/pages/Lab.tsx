import { Wrench, Battery, Smartphone, ShieldCheck, MessageCircle } from "lucide-react";
import { KAYAN } from "@/lib/config";

const services = [
  { Icon: Smartphone, t: "استبدال الشاشات", d: "شاشات أصلية وOEM لمعظم موديلات iPhone و Samsung، مع ضمان." },
  { Icon: Battery, t: "استبدال البطاريات", d: "بطاريات أصلية بكفاءة عالية، خدمة سريعة في نفس اليوم." },
  { Icon: Wrench, t: "صيانة شاملة", d: "إصلاح اللوحات، منافذ الشحن، الكاميرات والسماعات." },
  { Icon: ShieldCheck, t: "فحص ما قبل الشراء", d: "تقرير فحص مفصّل قبل شراء أي جهاز مستعمل." },
];

export default function Lab() {
  return (
    <div>
      <section className="bg-dark-gradient text-background">
        <div className="container-kayan py-20 lg:py-28">
          <span className="wordmark text-xs text-background/60">KΛYΛN LAB</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 leading-tight max-w-2xl">
            صيانة احترافية لجهازك، بأيدٍ تثق بها.
          </h1>
          <p className="mt-5 text-background/70 max-w-xl leading-8">
            فريق فني متخصص، قطع غيار عالية الجودة، وضمان حقيقي على كل خدمة. احجز موعدك عبر واتساب.
          </p>
          <a href={`https://wa.me/${KAYAN.whatsappNumber}?text=${encodeURIComponent("مرحباً، أرغب بحجز خدمة صيانة في كيان لاب.")}`}
            target="_blank" rel="noreferrer"
            className="mt-8 h-12 px-7 rounded-full bg-background text-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90">
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> احجز موعدك
          </a>
        </div>
      </section>

      <section className="container-kayan py-20">
        <div className="grid md:grid-cols-2 gap-5">
          {services.map(({ Icon, t, d }) => (
            <div key={t} className="rounded-2xl bg-surface p-7 hover:shadow-soft transition-shadow">
              <Icon className="h-7 w-7 text-foreground/80" strokeWidth={1.25} />
              <h3 className="text-lg font-semibold mt-5">{t}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-7">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
