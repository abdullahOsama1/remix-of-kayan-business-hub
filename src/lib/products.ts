import iphone from "@/assets/product-iphone.jpg";
import samsung from "@/assets/product-samsung.jpg";
import airpods from "@/assets/product-airpods.jpg";
import cable from "@/assets/product-cable.jpg";
import watch from "@/assets/product-watch.jpg";
import phoneCase from "@/assets/product-case.jpg";

export type Condition = "جديد" | "مستعمل ممتاز" | "مستعمل جيد";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "phones" | "accessories" | "wearables" | "lab";
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  image: string;
  storage?: string[];
  colors?: string[];
  conditions?: Condition[];
  battery?: number;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export const categories = [
  { id: "phones", label: "الهواتف", count: 0 },
  { id: "accessories", label: "الإكسسوارات", count: 0 },
  { id: "wearables", label: "الساعات الذكية", count: 0 },
  { id: "lab", label: "كيان لاب", count: 0 },
] as const;

export const products: Product[] = [
  {
    id: "p1",
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "phones",
    categoryLabel: "هواتف",
    price: 3450,
    oldPrice: 3800,
    image: iphone,
    storage: ["128GB", "256GB", "512GB"],
    colors: ["تيتانيوم طبيعي", "تيتانيوم أسود", "تيتانيوم أزرق"],
    conditions: ["جديد", "مستعمل ممتاز"],
    battery: 100,
    description:
      "آيفون 15 برو بهيكل تيتانيوم خفيف، شريحة A17 Pro، وكاميرا احترافية. ضمان معتمد من كيان.",
    inStock: true,
    featured: true,
  },
  {
    id: "p2",
    slug: "iphone-14",
    name: "iPhone 14",
    brand: "Apple",
    category: "phones",
    categoryLabel: "هواتف",
    price: 2350,
    image: iphone,
    storage: ["128GB", "256GB"],
    colors: ["أسود", "أبيض", "أزرق"],
    conditions: ["مستعمل ممتاز", "مستعمل جيد"],
    battery: 92,
    description: "آيفون 14 بحالة ممتازة، بطارية 92%، فحص شامل من كيان لاب.",
    inStock: true,
    featured: true,
  },
  {
    id: "p3",
    slug: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "phones",
    categoryLabel: "هواتف",
    price: 3990,
    image: samsung,
    storage: ["256GB", "512GB", "1TB"],
    colors: ["تيتانيوم رمادي", "تيتانيوم أسود"],
    conditions: ["جديد"],
    description: "أحدث هواتف سامسونج الرائدة بقلم S Pen وكاميرا 200MP.",
    inStock: true,
    featured: true,
  },
  {
    id: "p4",
    slug: "airpods-pro-2",
    name: "AirPods Pro (2nd Gen)",
    brand: "Apple",
    category: "accessories",
    categoryLabel: "إكسسوارات",
    price: 720,
    image: airpods,
    colors: ["أبيض"],
    conditions: ["جديد"],
    description: "إلغاء الضوضاء النشط، صوت مكاني، وعلبة شحن MagSafe.",
    inStock: true,
    featured: true,
  },
  {
    id: "p5",
    slug: "braided-usbc-cable",
    name: "كابل USB-C مجدول 1.5م",
    brand: "KAYAN",
    category: "accessories",
    categoryLabel: "إكسسوارات",
    price: 45,
    image: cable,
    colors: ["رمادي", "أسود"],
    conditions: ["جديد"],
    description: "كابل شحن سريع ومتين بنسيج مجدول، مناسب للأجهزة الحديثة.",
    inStock: true,
  },
  {
    id: "p6",
    slug: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "wearables",
    categoryLabel: "ساعات",
    price: 2850,
    image: watch,
    colors: ["برتقالي", "أزرق", "أبيض"],
    conditions: ["جديد"],
    description: "ساعة احترافية للمغامرين، بطارية تدوم لأيام، وشاشة فائقة السطوع.",
    inStock: true,
    featured: true,
  },
  {
    id: "p7",
    slug: "clear-case-iphone",
    name: "كفر شفاف iPhone",
    brand: "KAYAN",
    category: "accessories",
    categoryLabel: "إكسسوارات",
    price: 60,
    image: phoneCase,
    colors: ["شفاف"],
    conditions: ["جديد"],
    description: "كفر سيليكون شفاف عالي الجودة، حماية ممتازة دون إخفاء جمال جهازك.",
    inStock: true,
  },
  {
    id: "p8",
    slug: "kayan-lab-screen-replace",
    name: "خدمة استبدال شاشة — كيان لاب",
    brand: "KAYAN LAB",
    category: "lab",
    categoryLabel: "خدمات",
    price: 350,
    image: phoneCase,
    description: "استبدال شاشات iPhone و Samsung بقطع أصلية أو OEM عالية الجودة، ضمان كامل.",
    inStock: true,
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const featuredProducts = () => products.filter((p) => p.featured);
