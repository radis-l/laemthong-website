# CLAUDE.md - AI Operating Manual

> **Optimized for AI Agent Context Usage** - Quick reference for maximum development efficiency

## Quick Reference

### Essential Commands
```bash
npm run dev         # Development server (http://localhost:3000)
npm run build       # Production build
npm run start       # Start production server
npm run lint        # ESLint check
```

### Key File Paths
- **Pages**: `src/app/[locale]/` (Next.js App Router with i18n)
- **Admin Panel**: `src/app/admin/` (outside i18n, English-only)
- **Components**: `src/components/` (home, contact, products, admin, shared, layout, ui)
- **UI Library**: `src/components/ui/` (shadcn/ui new-york style, 25 components)
- **Supabase Client**: `src/lib/supabase.ts` (4 client factories: anon, browser, server, admin)
- **Data Access Layer**: `src/lib/db/` (products, brands, categories, services, company, contact, admin)
- **Validations**: `src/lib/validations/` (Zod schemas: product, brand, category, auth)
- **Types**: `src/data/types.ts` (Product, Brand, Category, Service, CompanyInfo, Db* row types)
- **SEO**: `src/lib/seo.ts` (JSON-LD builders, OG helpers, hreflang)
- **i18n Config**: `src/i18n/` (routing.ts, request.ts, navigation.ts)
- **Translations**: `messages/en.json`, `messages/th.json`
- **Utils**: `src/lib/utils.ts` (cn class merge utility)
- **Contact Action**: `src/app/[locale]/contact/actions.ts` (server action with zod validation)
- **Admin Actions**: `src/app/admin/actions/` (products.ts, brands.ts, categories.ts, auth.ts)
- **Proxy**: `src/proxy.ts` (composite: admin auth + next-intl routing, Next.js 16 convention)
- **Image Storage**: `src/lib/storage.ts` (upload, delete, folder cleanup via Supabase Storage)
- **Image Crop**: `src/lib/crop-image.ts` + `src/components/admin/image-crop-dialog.tsx`
- **Bulk Upload**: `src/lib/bulk-upload/` (CSV parser, validator, importer, ZIP handler, image-only import)

---

## Project Architecture

### Core Concept
**Laemthong Syndicate corporate website** - Industrial welding equipment importer & distributor. Bilingual (Thai default / English), product catalog, brand showcase, services, contact form. Established 1963.

### Tech Stack
- **Framework**: Next.js 16.1.6 + React 19.2.3 + TypeScript 5.x (strict)
- **Styling**: Tailwind CSS 4.0 + shadcn/ui (new-york style, neutral base, lucide icons)
- **i18n**: next-intl 4.x (locales: th [default], en)
- **Forms**: react-hook-form + zod validation + server actions
- **Email**: Resend (dependency installed, not yet integrated)
- **Database**: Supabase (PostgreSQL with RLS, JSONB for bilingual data)
- **Deployment**: Vercel
- **Carousel**: embla-carousel-react
- **Theme**: next-themes (dark/light mode)
- **Toasts**: sonner

### Directory Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Root redirect to /th
│   ├── globals.css             # Tailwind + shadcn theme (oklch colors)
│   ├── robots.ts               # SEO robots.txt
│   ├── sitemap.ts              # Dynamic sitemap generation
│   └── [locale]/               # i18n route segment
│       ├── layout.tsx          # Locale layout (Inter font, header, footer)
│       ├── page.tsx            # Homepage
│       ├── about/              # About page
│       ├── products/           # Product listing + [slug] detail + ?category=&brand= filters
│       ├── brands/             # Brand discovery listing
│       ├── services/           # Services listing
│       ├── contact/            # Contact page + server action
│       └── not-found.tsx       # Locale-specific 404
├── components/
│   ├── home/                   # Homepage sections (hero, USP, featured, brands, CTA)
│   ├── contact/                # ContactForm (react-hook-form + server action)
│   ├── products/               # ProductCard
│   ├── shared/                 # LocaleSwitcher, Logo, SectionHeading
│   ├── layout/                 # SiteHeader, SiteFooter
│   └── ui/                     # shadcn/ui (25 components)
├── data/
│   └── types.ts                # TypeScript interfaces (app + Db* row types)
├── i18n/
│   ├── routing.ts              # defineRouting({ locales: ["th", "en"], defaultLocale: "th" })
│   ├── request.ts              # Server-side locale resolution
│   └── navigation.ts           # Typed Link, redirect, usePathname, useRouter, getPathname
├── lib/
│   ├── supabase.ts             # Supabase client factory
│   ├── db/                     # Data access layer (async, returns app types)
│   │   ├── index.ts            # Barrel re-exports
│   │   ├── products.ts         # getAllProducts, getProductBySlug, etc.
│   │   ├── brands.ts           # getAllBrands, getBrandBySlug, etc.
│   │   ├── categories.ts       # getAllCategories, getCategoryBySlug, etc.
│   │   ├── services.ts         # getAllServices
│   │   ├── company.ts          # getCompanyInfo
│   │   ├── contact.ts          # saveContactInquiry
│   │   └── admin.ts            # Admin CRUD (service role, bypasses RLS)
│   ├── validations/            # Zod schemas (product, brand, category, auth)
│   ├── storage.ts              # Supabase Storage: upload, delete, folder cleanup
│   ├── crop-image.ts           # Canvas-based image crop with white fill
│   ├── seo.ts                  # JSON-LD builders, OG helpers, hreflang
│   ├── bulk-upload/            # CSV parser, validator, importer, ZIP handler
│   └── utils.ts                # cn() class merge (clsx + tailwind-merge)
└── proxy.ts                    # Composite: admin auth + next-intl routing (Next.js 16)
```

### Admin Panel Architecture
- **Routes**: `src/app/admin/` (outside `[locale]` — English-only UI)
- **Auth**: Supabase Auth (email/password), proxy protects `/admin/*`
- **Route group**: `(authenticated)` wraps shell (sidebar + header), login sits outside
- **CRUD**: Products (tabbed form), Brands, Categories — full create/edit/delete
- **DB layer**: `src/lib/db/admin.ts` uses `createSupabaseAdminClient()` (service role, bypasses RLS)
- **Server actions**: `src/app/admin/actions/` — Zod validate → DB op → revalidatePath → redirect
- **Components**: `src/components/admin/` — forms, tables, sidebar, header, bilingual inputs, image upload/crop, bulk upload
- **Image storage**: `src/lib/storage.ts` — upload/delete via Supabase Storage (bucket: `images`)
- **Bulk upload**: CSV/ZIP import (either or both) with preview, validation, streaming progress (`src/lib/bulk-upload/`)
- **Bulk operations**: Product list export as CSV, bulk delete with selection on products table

---

## Implementation Patterns

### 1. Bilingual Data (LocalizedString)
```typescript
interface LocalizedString { th: string; en: string; }

// Access in components
const name = product.name[locale as "th" | "en"];
```

### 2. Page Component (App Router + i18n)
```typescript
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function PageName({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ... page content
}
```

### 3. Client Component
```typescript
'use client'
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ComponentName({ className }: { className?: string }) {
  const t = useTranslations("namespace");
  return <div className={cn("base-styles", className)}>{t("key")}</div>;
}
```

### 4. Navigation (always use next-intl wrappers)
```typescript
import { Link, redirect, usePathname, useRouter } from "@/i18n/navigation";
// NEVER use next/link or next/navigation directly
```

### 5. Server Actions (zod validation)
```typescript
"use server";
import { z } from "zod";

export async function actionName(_prevState: State, formData: FormData): Promise<State> {
  const validated = schema.safeParse(Object.fromEntries(formData));
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };
  // ... action logic
  return { success: true };
}
```

---

## Critical Rules

### Code Quality
- **TypeScript strict** mode (no `any` types)
- **Bilingual** - all user-facing text must have both `th` and `en` versions
- **Thai is default locale** - `th` is primary, routes default to `/th/...`
- **next-intl navigation** - always use `@/i18n/navigation` for Link, redirect, usePathname
- **shadcn/ui** - use existing `src/components/ui/`; add via `npx shadcn@latest add <component>`
- **Server components by default** - only add `'use client'` when needed

### Styling
- **Tailwind CSS 4.0** with `@tailwindcss/postcss` plugin
- **oklch color system** defined in `src/app/globals.css`
- **shadcn/ui new-york style** with neutral base, lucide-react icons
- **tw-animate-css** for animations

### SEO
- Dynamic sitemap at `src/app/sitemap.ts`
- robots.txt at `src/app/robots.ts`
- Metadata base URL: `https://laemthong-website.vercel.app`

---

## MCP Tools

This project has a `.mcp.json` that provides **Supabase MCP** at the project level. This gives Claude Code direct access to the Supabase project (SQL queries, table management, migrations, edge functions) via OAuth.

### Available MCP Servers
- **Supabase** (project-level via `.mcp.json`) - Database operations, migrations, edge functions
- **GitHub** (global) - Repository operations, PRs, issues
- **Stripe** (global) - Payment integrations (future use)
- **Vercel** (global) - Deployments, domains, environment variables
- **shadcn** (global) - UI component registry, search, installation
- **context7** (global) - Library documentation lookup (Next.js, React, next-intl, etc.)

### Supabase Notes
- Project credentials in `.env.local` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- MCP auth is handled via OAuth (no tokens in `.mcp.json`)
- Data is stored in Supabase tables (categories, brands, products, services, company_info, contact_inquiries)
- All bilingual fields stored as JSONB `{"th": "...", "en": "..."}`
- RLS: public SELECT on catalog tables, public INSERT on contact_inquiries
- Data access layer at `src/lib/db/` maps DB rows (snake_case) to app types (camelCase)
- SQL migrations at `supabase/migrations/` (init + unify_product_images + add_fk_cascade)
- Mock data: `supabase/mock-data-seed.sql` + scripts in `scripts/` (see `npm run mock-data:seed`)
- Storage bucket: `images` (public, 5MB limit, folders: `products/`, `brands/`, `categories/`)

---

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=...       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # Supabase anon key (safe to expose, respects RLS)
SUPABASE_SERVICE_ROLE_KEY=...      # Service role key (admin panel, bypasses RLS)
RESEND_API_KEY=...                 # Resend email service (not yet active)
```
