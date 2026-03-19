

# About Page Dynamic Photos + Appointment Email Notification

## Part 1: Dynamic "Our Centre" Photos on About Page

### Database
Create a new `clinic_photos` table:
```sql
CREATE TABLE public.clinic_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clinic_photos ENABLE ROW LEVEL SECURITY;
-- Public read, admin CRUD policies
```

### Admin Panel
- New page `src/pages/admin/AdminClinicPhotos.tsx` with CRUD for clinic photos (image upload via existing `ImageUpload` component, optional title, description, ordering)
- Add nav item "Clinic Photos" to `AdminLayout.tsx`
- Add route in `App.tsx`

### About Page Update
- Replace the static `CLINIC_PHOTOS` array with a query to `clinic_photos` table
- Render as a horizontal scrollable carousel instead of a grid — smooth scroll with overflow-x-auto and snap scrolling
- Each card shows: image, title (if provided), description

## Part 2: Appointment Email Notification

### Edge Function
Create `supabase/functions/notify-appointment/index.ts`:
- Receives appointment data via POST
- Sends a formatted HTML email to `admin@bhaktapurfertility.com.np` using the Lovable AI email capabilities
- Includes: patient name, phone, email, preferred date, message

### AppointmentModal Update
- After successful insert into `appointment_requests`, invoke the `notify-appointment` edge function with the appointment details

### Technical Notes
- The edge function will use the `LOVABLE_API_KEY` secret (already configured) for sending email
- Appointments are already stored and viewable in the admin dashboard — no changes needed there

