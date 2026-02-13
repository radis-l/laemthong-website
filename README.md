# Laemthong Syndicate Website

Corporate website for **Laemthong Syndicate** - Thailand's leading importer and distributor of industrial welding and cutting equipment since 1963.

## Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york)
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl (Thai default, English)
- **Deployment**: Vercel

## Features

- Bilingual public site (Thai/English) with SEO metadata + JSON-LD structured data
- Product catalog with categories and brand filtering
- Brand showcase with detail pages
- Services listing
- Contact form with Zod validation (saves to database)
- Admin panel with full CRUD for Products, Brands, and Categories
- Dynamic sitemap generation
- Dark/light theme support

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project with tables created (see `supabase/migrations/`)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in your Supabase credentials in `.env.local`
5. Run the database migration (`supabase/migrations/`) and seed data (`supabase/seed.sql`)
6. Start the dev server:
   ```bash
   npm run dev
   ```

### Admin Panel

The admin panel is at `/admin` and requires:

1. `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (Supabase Dashboard > Settings > API)
2. A user created in Supabase Auth (Dashboard > Authentication > Users > Add User)
3. Navigate to `/admin` and log in with your credentials

## Project Structure

```
src/
  app/
    [locale]/          # Public pages (i18n routed)
    admin/             # Admin panel (English only)
  components/          # React components
  lib/db/              # Data access layer
  i18n/                # Internationalization config
  data/types.ts        # TypeScript interfaces
messages/              # Translation files (th.json, en.json)
supabase/              # Database migration + seed SQL
```

## Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint
```
