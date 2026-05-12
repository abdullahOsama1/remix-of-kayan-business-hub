
-- =========================================================
-- KAYAN BUSINESS OS — core schema
-- =========================================================

-- Roles -----------------------------------------------------
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- First-user-becomes-admin bootstrap
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.user_roles where role = 'admin') = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create policy "user can view own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

create policy "admin manage roles"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- updated_at helper ----------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- Categories -----------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;

create policy "public read categories" on public.categories
for select to anon, authenticated using (true);
create policy "admin write categories" on public.categories
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Products --------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text,
  brand text,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  price numeric(12,2) not null default 0,
  old_price numeric(12,2),
  cost_price numeric(12,2) not null default 0,
  quantity int not null default 0,
  available boolean not null default true,
  images text[] not null default '{}',
  storage_options text[] not null default '{}',
  color_options text[] not null default '{}',
  condition text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_products_updated before update on public.products
for each row execute function public.touch_updated_at();
alter table public.products enable row level security;

create policy "public read available products" on public.products
for select to anon, authenticated using (available = true or public.has_role(auth.uid(),'admin'));
create policy "admin write products" on public.products
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Inventory items (per-unit, with IMEI) --------------------
create type public.inventory_status as enum ('in_stock','reserved','sold','unavailable');

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  imei text,
  serial text,
  storage text,
  color text,
  battery int,
  condition text,
  cost_price numeric(12,2) not null default 0,
  status public.inventory_status not null default 'in_stock',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_inv_updated before update on public.inventory_items
for each row execute function public.touch_updated_at();
create index idx_inv_product on public.inventory_items(product_id);
create index idx_inv_imei on public.inventory_items(imei);
alter table public.inventory_items enable row level security;
create policy "admin all inventory" on public.inventory_items
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Customers -------------------------------------------------
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  pickup text,
  map_link text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_cust_updated before update on public.customers
for each row execute function public.touch_updated_at();
alter table public.customers enable row level security;
create policy "admin all customers" on public.customers
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Orders ----------------------------------------------------
create type public.order_status as enum ('new','in_progress','ready','delivered','cancelled');
create type public.payment_status as enum ('unpaid','partial','paid');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('K-' || to_char(now(),'YYMMDD') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,5)),
  customer_id uuid references public.customers(id) on delete set null,
  status public.order_status not null default 'new',
  payment_status public.payment_status not null default 'unpaid',
  subtotal numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  packaging_fee numeric(12,2) not null default 0,
  service_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_orders_updated before update on public.orders
for each row execute function public.touch_updated_at();
alter table public.orders enable row level security;
create policy "admin all orders" on public.orders
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  inventory_item_id uuid references public.inventory_items(id) on delete set null,
  name_snapshot text not null,
  qty int not null default 1,
  unit_price numeric(12,2) not null default 0,
  cost_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);
alter table public.order_items enable row level security;
create policy "admin all order items" on public.order_items
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Expenses --------------------------------------------------
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric(12,2) not null default 0,
  category text,
  notes text,
  occurred_at date not null default current_date,
  created_at timestamptz not null default now()
);
alter table public.expenses enable row level security;
create policy "admin all expenses" on public.expenses
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- AI Drafts -------------------------------------------------
create type public.draft_status as enum ('pending','approved','rejected');

create table public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'text', -- 'text' | 'image'
  raw_input text,
  parsed jsonb not null default '[]'::jsonb,
  status public.draft_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_drafts_updated before update on public.ai_drafts
for each row execute function public.touch_updated_at();
alter table public.ai_drafts enable row level security;
create policy "admin all drafts" on public.ai_drafts
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Settings (key/value CMS) ---------------------------------
create table public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger trg_settings_updated before update on public.settings
for each row execute function public.touch_updated_at();
alter table public.settings enable row level security;
create policy "public read settings" on public.settings
for select to anon, authenticated using (true);
create policy "admin write settings" on public.settings
for all to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Audit logs ------------------------------------------------
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  payload jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;
create policy "admin read logs" on public.audit_logs
for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin insert logs" on public.audit_logs
for insert to authenticated with check (public.has_role(auth.uid(),'admin'));

-- Seed default categories
insert into public.categories (slug, name_ar, name_en, sort_order) values
  ('phones','هواتف','Phones',1),
  ('accessories','إكسسوارات','Accessories',2),
  ('lab','خدمات كيان لاب','KAYAN Lab',3)
on conflict do nothing;
