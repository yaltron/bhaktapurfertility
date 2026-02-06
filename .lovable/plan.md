

## Bhaktapur Fertility & Women Wellness Center — Phase 1 Plan

### 🎨 Design & Branding
- **Primary color palette** extracted from logo: Teal (#1A8A8A / #0E7B7B) with green accent (#4CAF50)
- Clean, minimal healthcare aesthetic with plenty of whitespace, soft shadows, and modern typography
- Mobile-first responsive design with smooth hover states and subtle fade/slide animations
- Professional, medically appropriate tone throughout

### 📄 Public Website Pages

**1. Home Page**
- Hero section with clinic tagline + "Book Appointment" and "Call Now" CTA buttons
- Quick service highlights (cards showing key services like IVF, ICSI, IUI)
- "Why Choose Us" section with 4-6 trust points
- Featured doctors preview (linked to Our Doctors page)
- Latest blog posts preview (3 posts)
- Contact strip with phone (+977-9761434655, 01-5912281), email (info@bhaktapurfertility.com.np), address (Ayu Bhawan, Gatthaghar, Bhaktapur), working hours (10:00AM - 5:00PM)

**2. About Us**
- Clinic introduction, mission, vision, and values
- Facility highlights section
- Trust elements layout for certifications/partners

**3. Our Services**
- All 10 services displayed: IVF, ICSI, PESA, TESA, TESE, PGT, Fertility Preservation, IUI, Ovulation Induction, Semen Analysis
- Each service with title, short description, and optional "Learn More" expandable section
- Clean card-based grid layout

**4. Our Doctors**
- Doctor directory grid pulling from database
- Doctor cards showing image, name, and position
- Detail view (modal or page) with full bio, experience, email, and phone

**5. Insights (Blog)**
- Blog listing with search and category filter
- Blog detail page with SEO-friendly slug URL, reading time, cover image, author, date
- Social share buttons (Facebook, Twitter/X, LinkedIn)

**6. Contact Us**
- Contact form (name, phone, email, message) — saves to database
- Google Maps embed placeholder for Ayu Bhawan, Gatthaghar, Bhaktapur
- Clinic contact details and working hours display

### 🔧 Core Features
- **Sticky header** with navigation + "Book Appointment" CTA button
- **Appointment Request form** (modal): name, phone, email, preferred date, message — saves to database + shows success message
- **WhatsApp floating button** on mobile linking to +977-9761434655
- **Email notification** for new appointment requests (using Resend via Supabase Edge Function — will need Resend API key setup)
- **Basic SEO**: meta titles/descriptions per page, OpenGraph tags, robots.txt

### 🗄️ Backend (Supabase)

**Database Tables:**
- `blogs` — title, slug, cover_image_url, category, excerpt, content, author, publish_date, status (draft/published)
- `doctors` — image_url, full_name, position, experience, description, email, phone
- `appointment_requests` — name, phone, email, preferred_date, message, created_at
- `contact_messages` — name, phone, email, message, created_at
- `user_roles` — for admin authentication (secure role-based access)

**Storage:**
- Supabase Storage bucket for blog cover images and doctor photos

**Edge Function:**
- `send-appointment-notification` — sends email via Resend when a new appointment request is submitted

### 🔐 Admin Panel (/admin)

**Authentication:**
- Admin login page with Supabase Auth
- Role-based access using `user_roles` table (only users with 'admin' role can access)

**Admin Sidebar & Pages:**
- **Dashboard** — Summary cards showing total blogs, doctors, appointment requests, and contact messages
- **Blogs Management** — Full CRUD: create, edit, delete blog posts with rich text editor, image upload, slug auto-generation, draft/published status
- **Doctors Management** — Full CRUD: add, edit, delete doctors with image upload
- **Appointment Requests** — Read-only list view of all submitted appointment forms
- **Contact Messages** — Read-only list view of all contact form submissions

### 📦 Seed Data
- 3 sample doctors with placeholder images and realistic bios
- 3 sample blog posts with fertility/wellness topics

### 🔗 Integrations Needed
- **Supabase** — Database, Auth, Storage (will prompt to connect)
- **Resend** — For appointment email notifications (will need API key from user)

