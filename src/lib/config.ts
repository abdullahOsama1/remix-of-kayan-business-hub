// KAYAN brand & runtime config
// TODO: replace WHATSAPP_NUMBER with the real number when provided.
export const KAYAN = {
  brand: "KAYAN",
  brandAr: "كيان",
  tagline: "Store Everything — Guaranteed & Fast Choices",
  taglineAr: "كل ما تحتاجه — اختيارات مضمونة وسريعة",
  // International format, digits only (no +). Used for wa.me links.
  whatsappNumber: "201000000000",
  instagram: "https://instagram.com/kayan",
  tiktok: "https://tiktok.com/@kayan",
  email: "hello@kayan.store",
  currency: "₪",
};

export const formatPrice = (n: number) =>
  `${KAYAN.currency} ${new Intl.NumberFormat("en-US").format(n)}`;
