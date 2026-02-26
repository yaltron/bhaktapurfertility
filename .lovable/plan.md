

# Add Admin CRUD Pages for Success Stories and FAQs

## Files to Create

### 1. `src/pages/admin/AdminSuccessStories.tsx`
- Follow exact same pattern as AdminDoctors/AdminBlogs
- Table columns: Title, Featured, Order, Actions
- Dialog form fields: title, description (textarea), photo_url, video_url, is_featured (checkbox), display_order
- Query key: `admin-success-stories`, invalidate `success-stories` on mutations

### 2. `src/pages/admin/AdminFAQs.tsx`
- Same CRUD pattern
- Table columns: Question, Category, Order, Actions
- Dialog form fields: question, answer (textarea), category, display_order
- Query key: `admin-faqs`, invalidate `faqs` on mutations

## Files to Modify

### 3. `src/pages/admin/AdminLayout.tsx`
- Add two nav items to `NAV_ITEMS` array:
  - `{ to: "/admin/success-stories", icon: Star, label: "Success Stories", end: false }`
  - `{ to: "/admin/faqs", icon: HelpCircle, label: "FAQs", end: false }`
- Import `Star` and `HelpCircle` from lucide-react

### 4. `src/App.tsx`
- Import `AdminSuccessStories` and `AdminFAQs`
- Add two nested routes under the `/admin` layout:
  - `<Route path="success-stories" element={<AdminSuccessStories />} />`
  - `<Route path="faqs" element={<AdminFAQs />} />`

### 5. `src/pages/admin/AdminDoctors.tsx`
- Add `qualification`, `nmc_number`, `short_bio` to `DoctorForm` interface and `emptyForm`
- Add corresponding form fields in the dialog
- Include these fields in `openEdit` mapping

No database changes needed -- tables and RLS policies already exist.

