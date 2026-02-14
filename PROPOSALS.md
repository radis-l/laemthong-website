# Laemthong Website — Optimization Proposals

> Created: 2026-02-14
> Status: Pending review — go through each item with the developer one by one.
> Workflow: Pick an item → plan thoroughly → implement → verify → mark done.

---

## How to use this document

Each proposal has a status:
- `PENDING` — Not yet reviewed
- `APPROVED` — Ready to implement
- `IN PROGRESS` — Currently being worked on
- `DONE` — Implemented and verified
- `SKIPPED` — Decided not to do

When starting a new conversation, reference this file so Claude can continue where you left off.

---

## Priority 1 — High (directly affects business)

### P1.1 — Connect email notifications for contact form
**Status:** `PENDING`

**Problem:** Resend (email service) is installed as a dependency but never wired up. When a customer submits the contact form, the inquiry is saved to the database, but no email is sent. You have to manually check the database to see new messages.

**What needs to happen:**
- Wire up Resend in the contact form server action (`src/app/[locale]/contact/actions.ts`)
- Send notification email to business owner when a new inquiry arrives
- Optionally send confirmation email to the customer
- Requires a valid `RESEND_API_KEY` in `.env.local` and a verified sender domain

**Files involved:**
- `src/app/[locale]/contact/actions.ts` — server action (main change)
- `.env.local` / `.env.example` — API key

**Risk:** Low — additive change, doesn't modify existing functionality.

---

### P1.2 — Add analytics tracking
**Status:** `PENDING`

**Problem:** Zero visibility into site traffic. No way to know how many visitors, which products are popular, where traffic comes from, or whether SEO is working.

**Options:**
- **Vercel Analytics** — Simplest for this stack, one-line install, includes Web Vitals
- **Google Analytics 4** — More powerful, free, industry standard for marketing insights
- **Both** — Vercel for technical performance, GA4 for marketing/business metrics

**Files involved:**
- `src/app/[locale]/layout.tsx` — add analytics script/component
- `package.json` — add `@vercel/analytics` and/or GA4 script

**Risk:** Low — additive, no existing code modified.

---

### P1.3 — Fix N+1 query on Brands page
**Status:** `DONE`

**Problem:** The Brands page (`src/app/[locale]/brands/page.tsx:50-52`) fires one database query per brand to count products. With 20 brands, that's 20+ queries instead of 1. Gets slower as the catalog grows.

**What needs to happen:**
- Create a new `getProductCountsByBrand()` function in `src/lib/db/brands.ts` that returns all counts in a single query
- Update the Brands page to use it

**Files involved:**
- `src/lib/db/brands.ts` — new function
- `src/app/[locale]/brands/page.tsx` — use new function

**Risk:** Low — replaces inefficient code with efficient code, same output.

---

## Priority 2 — Medium (security & performance)

### P2.1 — Add security headers
**Status:** `DONE`

**Problem:** Missing standard browser security headers (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, Content-Security-Policy). These are baseline protections against clickjacking, XSS, and content sniffing.

**What needs to happen:**
- Add `headers()` configuration in `next.config.ts`

**Files involved:**
- `next.config.ts`

**Risk:** Low-Medium — CSP headers need careful testing to not block legitimate resources (Supabase, Google Fonts, etc.).

---

### P2.2 — Add rate limiting to contact form
**Status:** `PENDING`

**Problem:** The contact form uses a honeypot to catch bots, but there's no limit on submission frequency. A determined spammer could flood the database.

**Options:**
- **Upstash Redis rate limiter** — serverless, works with Vercel
- **Simple in-memory rate limiter** — basic but resets on deploy
- **Turnstile/reCAPTCHA** — visible CAPTCHA challenge

**Files involved:**
- `src/app/[locale]/contact/actions.ts` — add rate limit check
- `package.json` — add rate limiting dependency (if using Upstash)

**Risk:** Low — additive check before existing logic.

---

### P2.3 — Add page caching (revalidation)
**Status:** `DONE`

**Problem:** Public pages re-fetch from the database on every visit. Product data doesn't change frequently, so pages can safely cache for a period.

**What needs to happen:**
- Add `export const revalidate = 3600` (1 hour) to public page files
- Already-working `revalidatePath()` in admin actions ensures edits appear immediately

**Files involved:**
- `src/app/[locale]/page.tsx` — homepage
- `src/app/[locale]/products/page.tsx` — product listing
- `src/app/[locale]/brands/page.tsx` — brands listing
- `src/app/[locale]/products/[slug]/page.tsx` — product detail
- `src/app/[locale]/brands/[slug]/page.tsx` — brand detail
- `src/app/[locale]/categories/[slug]/page.tsx` — category detail

**Risk:** Low — `revalidatePath()` already handles cache busting when admin makes changes.

---

## Priority 3 — Low (polish & best practices)

### P3.1 — Replace console.error with error monitoring
**Status:** `PENDING`

**Problem:** 9 places in the codebase use `console.error()`. Errors happen silently in production with no notification. If the database connection fails or image uploads break, nobody knows.

**Options:**
- **Sentry** — industry standard error monitoring, free tier available
- **Vercel Log Drain** — simpler, forwards logs to external service

**Locations to update:**
- `src/lib/storage.ts` (2 instances)
- `src/lib/db/admin.ts` (3 instances)
- `src/app/admin/actions/brands.ts` (1 instance)
- `src/app/admin/actions/products.ts` (1 instance)
- `src/app/admin/actions/categories.ts` (1 instance)
- `src/app/admin/(authenticated)/bulk-upload/page.tsx` (1 instance)

**Risk:** Low — replaces logging, doesn't change logic.

---

### P3.2 — Improve accessibility
**Status:** `PENDING`

**Problem:** Missing "skip to content" link, some images lack alt text fallbacks, mobile menu doesn't trap focus for keyboard users.

**What needs to happen:**
- Add skip-to-content link in site header
- Add proper alt text fallbacks in brand showcase
- Add focus trapping in mobile menu
- Verify color contrast meets WCAG AA

**Files involved:**
- `src/components/layout/site-header.tsx`
- `src/components/home/brand-showcase.tsx`
- `src/app/[locale]/layout.tsx`

**Risk:** Low — UI additions, no logic changes.

---

### P3.3 — Use environment variable for site URL
**Status:** `PENDING`

**Problem:** Site URL is hardcoded in `src/lib/seo.ts:11`. If you switch to a custom domain, you'd need to find and update it in multiple places.

**What needs to happen:**
- Add `NEXT_PUBLIC_SITE_URL` to `.env.local` and `.env.example`
- Update `src/lib/seo.ts` to read from env
- Update any other hardcoded references

**Files involved:**
- `src/lib/seo.ts`
- `.env.local` / `.env.example`

**Risk:** Very low — string replacement.

---

## Notes

- No testing framework exists in the project. For any medium+ risk change, manual verification steps should be defined before implementation.
- The site is deployed on Vercel with auto-deploy from git. Changes go live on push.
- Admin panel is at `/admin` — always verify admin functionality after changes.
- Bilingual (Thai/English) — verify both languages after any UI change.
