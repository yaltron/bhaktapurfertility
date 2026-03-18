

# SEO Meta Tags for Blog Posts and Key Pages

## Overview
Add dynamic meta tags (title, description, OG image) to blog detail pages and static meta tags to key public pages using `react-helmet-async`.

## Changes

### 1. Install `react-helmet-async`
Add the library for managing document head tags in React.

### 2. `src/main.tsx`
Wrap the app with `<HelmetProvider>` from `react-helmet-async`.

### 3. `src/pages/BlogPost.tsx`
Add a `<Helmet>` block with dynamic meta tags from the blog post data:
- `<title>` — `{post.title} | {CLINIC.name}`
- `<meta name="description">` — `{post.excerpt}`
- `<meta property="og:title">`, `og:description`, `og:image` (from `cover_image_url`)
- `<meta property="og:type" content="article">`
- Twitter card meta tags

### 4. `src/pages/Index.tsx`
Add static `<Helmet>` with homepage title, description, and OG tags.

### 5. Other key pages
Add `<Helmet>` to: `About.tsx`, `Services.tsx`, `ServiceDetail.tsx`, `Doctors.tsx`, `DoctorDetail.tsx`, `Contact.tsx`, `Blog.tsx`, `SuccessStories.tsx`, `FAQ.tsx` — each with an appropriate title and description using `CLINIC.name`.

### 6. `src/pages/admin/AdminBlogs.tsx` — Add SEO fields
Add `meta_title` and `meta_description` fields to the blog form so admins can customize SEO per post. These override the defaults in `BlogPost.tsx` if provided.

### 7. Database migration
Add two nullable columns to `blogs` table:
```sql
ALTER TABLE public.blogs ADD COLUMN meta_title text;
ALTER TABLE public.blogs ADD COLUMN meta_description text;
```

## Technical Notes
- `react-helmet-async` is the maintained fork compatible with React 18
- Blog SEO fields are optional — falls back to `title` and `excerpt` if not set
- OG image falls back to a default site image if no cover image exists

