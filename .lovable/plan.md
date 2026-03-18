

# Image Upload System for Admin Panels

Replace all image URL text inputs with a file upload component across the admin CMS. The existing `clinic-images` storage bucket is already set up and public.

## Overview

Create a reusable `ImageUpload` component that handles file selection, preview, upload to storage, and deletion. Then integrate it into all four admin panels that use images.

## Storage Setup

**RLS policies needed** on `storage.objects` for the `clinic-images` bucket:
- Allow authenticated admins (via `has_role`) to INSERT, UPDATE, DELETE files
- Allow public SELECT (bucket is already public, but policy needed for RLS)

## New Component

### `src/components/admin/ImageUpload.tsx`
Reusable image upload component with:
- File input (accept images only) with drag-and-drop area
- Image preview (shows current image or newly selected file)
- Upload button that stores file to `clinic-images/{folder}/{timestamp}-{filename}`
- Delete/replace functionality (trash icon to clear)
- Props: `value` (current URL), `onChange` (callback with new URL), `folder` (subfolder like "doctors", "blogs", etc.)
- Upload happens on file select, returns the public URL via `onChange`

## Admin Panel Changes

### `src/pages/admin/AdminDoctors.tsx`
- Replace `Image URL` text input with `<ImageUpload folder="doctors" value={form.image_url} onChange={...} />`

### `src/pages/admin/AdminBlogs.tsx`
- Replace `Cover Image URL` text input with `<ImageUpload folder="blogs" value={form.cover_image_url} onChange={...} />`

### `src/pages/admin/AdminSuccessStories.tsx`
- Replace `Photo URL` text input with `<ImageUpload folder="stories" value={form.photo_url} onChange={...} />`

## Database Migration
- Add RLS policies on `storage.objects` for admin upload/delete access to the `clinic-images` bucket

## Technical Details
- Uses `supabase.storage.from('clinic-images').upload()` for uploading
- Uses `supabase.storage.from('clinic-images').getPublicUrl()` for retrieving URLs
- Files organized in subfolders: `doctors/`, `blogs/`, `stories/`
- Existing URL-based images continue to work (component shows any valid URL)

