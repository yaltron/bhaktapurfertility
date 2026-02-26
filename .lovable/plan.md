

# Comprehensive Website Content & Layout Update Plan

This is a large multi-part update. I'll break it into manageable implementation phases.

---

## Phase 1: Foundation Changes

### 1.1 Update Constants (`src/lib/constants.ts`)
- Change `CLINIC.name` to "Bhaktapur Fertility and Women Wellness Centre" (note: "Centre" not "Center")
- Update `CLINIC.address` to "Ground Floor, German Homes Building, Gatthaghar, Bhaktapur, Nepal"
- Update `CLINIC.tagline` to Nepali text: "अनेक बाधाका बीच देखेको सपना, आफ्नै सन्तान खेलाउने काखमा ।"
- Replace SERVICES array with new list: IVF, Menopause, Menstruation & PCOS, Ultrasound, Egg Freezing, Semen Freezing, Hormone Testing, Other Fertility & Women Wellness Services
- Add `shortName` kept as "Bhaktapur Fertility Centre"
- Add Noto Sans Nepali font import and update nav links to include FAQ and Success Stories

### 1.2 Font Updates (`src/index.css`)
- Replace Inter with Roboto/Lato for English
- Add Noto Sans Nepali for Nepali text
- Add a `.font-nepali` utility class

### 1.3 Navigation Updates (`src/lib/constants.ts`)
- Add "Success Stories" and "FAQ" to NAV_LINKS

---

## Phase 2: Database Changes

### 2.1 Add `success_stories` table
- `id`, `title`, `description`, `photo_url`, `video_url`, `is_featured`, `created_at`, `display_order`
- RLS: public read, admin write

### 2.2 Add `faqs` table
- `id`, `question`, `answer`, `category`, `display_order`, `created_at`
- RLS: public read, admin write

### 2.3 Update `doctors` table
- Add `qualification` (text, nullable)
- Add `nmc_number` (text, nullable)
- Add `short_bio` (text, nullable)

---

## Phase 3: Homepage Rebuild (`src/pages/Index.tsx`)

Replace current homepage sections with:

1. **Hero Section**: Nepali tagline text prominently displayed, soft gradient background (keep existing primary color scheme), Book Appointment + Call Now + WhatsApp buttons
2. **Services Preview**: Grid of 7-8 service cards with Lucide icons, each linking to `/services/{slug}`
3. **Success Stories Carousel**: Fetch from `success_stories` table, carousel using embla-carousel-react (already installed), fallback placeholder if none exist
4. **About Clinic Preview**: Short intro paragraph + "About Us" button linking to `/about`
5. **Contact & Address Strip**: Updated address, Phone CTA, WhatsApp CTA buttons
6. **Keep**: Doctors preview, Blog preview sections (reorder as needed)

---

## Phase 4: Services Page Updates

### 4.1 Update `src/pages/Services.tsx`
- Render updated SERVICES list with icons, short descriptions, photo placeholders
- Each card has "Book Appointment" button

### 4.2 Update `src/pages/ServiceDetail.tsx`
- Add "Book Appointment" button prominently
- Keep existing structure, update to match new service list

---

## Phase 5: Doctors Page Updates

### 5.1 Update `src/pages/Doctors.tsx` and `src/pages/DoctorDetail.tsx`
- Add qualification, NMC number, short bio fields to card layout
- Add "Book Appointment" button on each doctor card

---

## Phase 6: New Pages

### 6.1 Create `src/pages/SuccessStories.tsx`
- Grid/list of stories from `success_stories` table
- Photo/video thumbnails, short description, "Read More" expansion
- Book Appointment button

### 6.2 Create `src/pages/FAQ.tsx`
- Accordion-style FAQ from `faqs` table
- Grouped by category if available

### 6.3 Add routes in `src/App.tsx`
- `/success-stories` → SuccessStories
- `/faq` → FAQ

---

## Phase 7: About Page Updates (`src/pages/About.tsx`)
- Add placeholder sections for clinic environment photos (reception, treatment rooms, patient area)
- Keep existing mission/vision/values content

---

## Phase 8: Global Updates

### 8.1 Header (`src/components/layout/Header.tsx`)
- Use full clinic name "Bhaktapur Fertility and Women Wellness Centre"
- Updated nav links including Success Stories and FAQ

### 8.2 Footer (`src/components/layout/Footer.tsx`)
- Update address to new format
- Update services list to match new services
- Use full clinic name

### 8.3 WhatsApp Button
- Already exists and functional, no changes needed

---

## Files to Create
| File | Purpose |
|------|---------|
| `src/pages/SuccessStories.tsx` | Success stories list page |
| `src/pages/FAQ.tsx` | FAQ accordion page |

## Files to Modify
| File | Changes |
|------|---------|
| `src/lib/constants.ts` | Clinic name, address, tagline, services list, nav links |
| `src/index.css` | Font imports (Roboto + Noto Sans Nepali) |
| `src/App.tsx` | Add routes for success-stories, faq |
| `src/pages/Index.tsx` | Full homepage rebuild with new sections |
| `src/pages/Services.tsx` | Updated service cards with booking buttons |
| `src/pages/ServiceDetail.tsx` | Add booking button |
| `src/pages/Doctors.tsx` | Add qualification, NMC, bio, booking button |
| `src/pages/DoctorDetail.tsx` | Add new fields display |
| `src/pages/About.tsx` | Add clinic photos placeholder section |
| `src/components/layout/Header.tsx` | Full name usage |
| `src/components/layout/Footer.tsx` | Updated address and services |

## Database Migrations
1. Create `success_stories` table with RLS
2. Create `faqs` table with RLS
3. Add columns to `doctors` table (qualification, nmc_number, short_bio)

