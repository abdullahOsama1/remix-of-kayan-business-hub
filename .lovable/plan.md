# KΛYΛN Business OS — Build Plan

A premium Arabic-first business operating system for the KΛYΛN brand: storefront + hidden admin + inventory + accounting + WhatsApp checkout + AI import.

This is a large system. I'll ship it in phases so you can review each milestone, instead of a single mega-build that's hard to validate.

---

## Phase 1 — Foundation & Storefront (this round)

**Design system**
- Black / white / light-gray base, accent green + warm brown/orange from KAYAN palette
- Cairo (Arabic) + Inter (English), thin line icons (lucide)
- RTL-first layout, semantic Tailwind tokens in `index.css` + `tailwind.config.ts`
- Mobile-first responsive grid (1 / 2 / 3 columns)

**Storefront pages**
- Home: hero (KΛYΛN / كيان), featured categories, featured products, KAYAN LAB services teaser, shipping policy strip
- Shop: product grid, live search, category + condition filters
- Product detail: gallery, storage/color/condition options, price, "أكمل الطلب عبر واتساب"
- Cart drawer: quantities, totals, WhatsApp checkout button that opens `wa.me` with a formatted Arabic order summary
- Static pages: shipping & delivery policy, KAYAN LAB services, about/contact
- Floating WhatsApp button + social links in footer

**Catalog data (phase 1)**
- Seeded local catalog (TypeScript) so the storefront is fully functional immediately, with a clean data layer that Phase 2 swaps for Lovable Cloud.

**Hidden admin entry**
- Secret route `/kayan-control` with a placeholder shell (locked until Phase 2 wires real auth).

Deliverable: a polished, production-looking Arabic storefront with working cart → WhatsApp checkout, on mobile and desktop.

---

## Phase 2 — Backend, Admin & Inventory

Enable Lovable Cloud and add:
- Auth (single-owner, hidden admin route, no public signup) using `user_roles` + `has_role` pattern
- Tables: `products`, `product_variants` (storage/color/condition), `inventory_items` (with IMEI), `orders`, `order_items`, `customers`, `expenses`, `categories`, `audit_logs`
- RLS: public read for published products; admin-only for everything else
- Admin dashboard: products CRUD, inventory + IMEI tracking, low-stock alerts, orders, customers, expenses, KPI cards (revenue, profit, stock value)
- Storefront switches from seed data to live Cloud data
- Audit logs for admin actions

---

## Phase 3 — Accounting, AI Import & Polish

- Accounting dashboard: revenue, COGS, gross profit, expenses, net profit, monthly charts
- AI smart import (Lovable AI Gateway, `google/gemini-3-flash-preview`):
  - Paste WhatsApp text OR upload screenshot (OCR via vision model)
  - Extracts product name, price, storage, color, battery %, condition, category
  - Editable draft review table → save to inventory
- Delivery/shipping policy CMS, KAYAN LAB services CMS
- PWA manifest + install support
- Final QA pass on mobile

---

## Tech notes

- Stack: React + Vite + Tailwind + shadcn (already in template), `react-router-dom`, `lucide-react` icons, `framer-motion` for subtle motion
- RTL: `dir="rtl"` + `lang="ar"` on `<html>`, mirrored layouts
- WhatsApp number: I'll use a placeholder `+970` number in Phase 1 — please send me the real WhatsApp number to wire in (and Instagram/TikTok handles for the footer)

---

## What I need from you to start Phase 1 now

1. Confirm: **start with Phase 1 (storefront + design system + WhatsApp checkout + hidden admin shell)**, then we move to Phase 2.
2. **WhatsApp number** for checkout (e.g. `+970599…`). I'll use a placeholder if you don't have it ready.
3. Any **real product categories** you sell (iPhones / Samsung / accessories / KAYAN LAB repair services / etc.) — otherwise I'll seed sensible defaults (هواتف، إكسسوارات، خدمات كيان لاب).
4. KAYAN **logo file** if you have one — otherwise I'll typeset "KΛYΛN / كيان" as a premium wordmark.

Reply with answers (or just "go" to start with defaults) and I'll build Phase 1.