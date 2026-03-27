

# Dynamic Services Section Overhaul

## Overview
Replace the hardcoded `SERVICES` array with a database-driven `services` table, add an admin CRUD page, redesign the Services page with core/other service sections, a CTA banner, and SEO improvements.

## Database

Create a `services` table:
```sql
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Stethoscope',
  category text NOT NULL DEFAULT 'core',  -- 'core' or 'other'
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```
- RLS: public read, admin CRUD (same pattern as other tables)
- Seed with 8 services: 6 core (Fertility Evaluation & Preconception Care, Ovulation Induction, IUI, IVF, Gynecological Evaluation, Female Comprehensive Wellness Packages) + 2 other (Holistic Female Care, Fertility to High-End Ultrasound Services)
- Add `updated_at` trigger

## Admin Panel — `src/pages/admin/AdminServices.tsx`
- CRUD for services (title, short_name, slug, description, icon selector, category dropdown: core/other, display_order)
- Follow the same pattern as `AdminClinicPhotos` / `AdminFAQs`
- Add route in `App.tsx` and nav item in `AdminLayout.tsx`

## Services Page Redesign — `src/pages/Services.tsx`
- Fetch services from database instead of `SERVICES` constant
- **Core Services section**: card grid (2 columns on desktop, stacked on mobile), each card with icon, title, short description, "Learn More" + "Book Consultation" buttons, hover shadow/scale effect
- **Other Services section**: visually distinct with a soft green/blue background (`bg-primary/5`), different card style
- **CTA Banner** at bottom: "Start Your Fertility Journey Today" with "Book Appointment" button
- SEO: update meta description and headings with target keywords

## ServiceDetail Page Update — `src/pages/ServiceDetail.tsx`
- Fetch from `services` table instead of `SERVICES` constant

## Index Page Update — `src/pages/Index.tsx`
- Replace `SERVICES` constant usage with database query for services preview

## Constants Cleanup
- Remove `SERVICES` and `ServiceItem` from `src/lib/constants.ts` (no longer needed once all consumers use the database)

## Files Changed
1. **New migration** — create `services` table + seed data + trigger
2. **New** `src/pages/admin/AdminServices.tsx`
3. **Edit** `src/pages/admin/AdminLayout.tsx` — add Services nav item
4. **Edit** `src/App.tsx` — add admin services route
5. **Edit** `src/pages/Services.tsx` — full redesign with DB query, two sections, CTA banner
6. **Edit** `src/pages/ServiceDetail.tsx` — use DB query
7. **Edit** `src/pages/Index.tsx` — use DB query for services
8. **Edit** `src/lib/constants.ts` — remove SERVICES array

