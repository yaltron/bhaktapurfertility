

# Popup Banner System

## Database

Create a `popup_banners` table:
- `id` (uuid, PK)
- `name` (text, not null)
- `image_url` (text, not null) — stored via ImageUpload component
- `display_seconds` (integer, default 5)
- `is_active` (boolean, default false)
- `created_at`, `updated_at` (timestamps)

RLS: Public SELECT for active banners, admin INSERT/UPDATE/DELETE.

## Admin Panel

### `src/pages/admin/AdminPopupBanners.tsx`
- CRUD interface for popup banners (similar to other admin pages)
- Fields: Banner Name, Banner Image (using existing `ImageUpload` component), Display Time (seconds), Active toggle
- Only one banner can be active at a time — toggling one active deactivates others

### `src/pages/admin/AdminLayout.tsx`
- Add "Popup Banners" nav item with an `Image` icon

### `src/App.tsx`
- Add route `/admin/popup-banners` under the admin layout

## Frontend Popup

### `src/components/PopupBanner.tsx`
- On mount, fetch the active banner from the database
- Show a centered modal overlay with:
  - The banner image
  - A close button (X) in top-right corner
  - Clicking outside the image closes it
  - Darkened backdrop (`bg-black/50`)
- Auto-dismiss after `display_seconds` if not manually closed
- Store dismissal in `sessionStorage` so it only shows once per session

### `src/pages/Index.tsx`
- Add `<PopupBanner />` component to the homepage

