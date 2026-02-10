-- Laemthong Website: Supabase Migration
-- Tables + RLS + Indexes (idempotent — safe to re-run)

-- ========================================
-- 1. Categories
-- ========================================
create table if not exists categories (
  slug text primary key,
  name jsonb not null,          -- {"th": "...", "en": "..."}
  description jsonb not null,
  image text not null,
  icon text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Brands
create table if not exists brands (
  slug text primary key,
  name text not null,
  logo text not null,
  description jsonb not null,
  website text,
  country text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Products
create table if not exists products (
  slug text primary key,
  category_slug text not null references categories(slug),
  brand_slug text not null references brands(slug),
  name jsonb not null,
  short_description jsonb not null,
  description jsonb not null,
  image text not null,
  gallery jsonb not null default '[]',
  specifications jsonb not null default '[]',   -- [{label: {th,en}, value: {th,en}}]
  features jsonb not null default '[]',          -- [{th,en}]
  documents jsonb not null default '[]',         -- [{name, url}]
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Services
create table if not exists services (
  slug text primary key,
  title jsonb not null,
  description jsonb not null,
  icon text not null,
  features jsonb not null default '[]',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Company Info
create table if not exists company_info (
  id integer primary key default 1 check (id = 1),  -- singleton
  name jsonb not null,
  tagline jsonb not null,
  description jsonb not null,
  year_established integer not null,
  address jsonb not null,
  phone text not null,
  email text not null,
  line_id text,
  map_url text not null,
  coordinates jsonb not null,  -- {lat, lng}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Contact Inquiries
create table if not exists contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text not null,
  phone text,
  product_interest text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ========================================
-- Indexes
-- ========================================
create index if not exists idx_products_category_slug on products(category_slug);
create index if not exists idx_products_brand_slug on products(brand_slug);
create index if not exists idx_products_featured on products(featured) where featured = true;
create index if not exists idx_products_sort_order on products(sort_order);

-- ========================================
-- RLS
-- ========================================
alter table categories enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table services enable row level security;
alter table company_info enable row level security;
alter table contact_inquiries enable row level security;

-- Public read on catalog tables (skip if policy already exists)
do $$ begin
  create policy "Public read categories" on categories for select using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Public read brands" on brands for select using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Public read products" on products for select using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Public read services" on services for select using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Public read company_info" on company_info for select using (true);
exception when duplicate_object then null;
end $$;

-- Public insert on contact_inquiries (no read)
do $$ begin
  create policy "Public insert contact_inquiries" on contact_inquiries for insert with check (true);
exception when duplicate_object then null;
end $$;

-- ========================================
-- Storage bucket for images
-- ========================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 5242880,
  array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml'])
on conflict (id) do nothing;
