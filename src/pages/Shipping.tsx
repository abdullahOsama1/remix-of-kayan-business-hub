import { Truck, Clock, MapPin, RefreshCw } from "lucide-react";

export default function Shipping() {
  return (
    <div className="container-kayan py-16 max-w-3xl">
      <h1 className="text-4xl font-bold">الشحن والتوصيل</h1>
      <p className="text-muted-foreground mt-3 leading-8">
        نلتزم في كيان بتوصيل طلبك بأمان وسرعة. هذه سياستنا الحالية للشحن.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        {[
          { Icon: Truck, t: "التوصيل لجميع المدن", d: "نوصل لجميع المحافظات، التكلفة تُحسب حسب الموقع." },
          { Icon: Clock, t: "وقت التوصيل", d: "1–3 أيام عمل داخل المدن الرئيسية." },
          { Icon: MapPin, t: "استلام من المعرض", d: "يمكنك استلام طلبك مجاناً من فرع كيان." },
          { Icon: RefreshCw, t: "الاستبدال والإرجاع", d: "خلال 7 أيام للأجهزة غير المستخدمة." },
        ].map(({ Icon, t, d }) => (
          <div key={t} className="rounded-2xl bg-surface p-6">
            <Icon className="h-6 w-6 text-foreground/80" strokeWidth={1.25} />
            <h3 className="mt-4 font-semibold">{t}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-7">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-sm text-muted-foreground leading-8">
        لأي استفسار حول طلبك أو الشحن، تواصل معنا مباشرة عبر واتساب وسنرد عليك بأقصى سرعة.
      </div>
    </div>
  );
}
