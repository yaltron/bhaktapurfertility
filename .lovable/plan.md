# Reversible Maintenance Mode

## Goal
Hide the entire site behind a single "Under Maintenance" page, while keeping the change easy to revert later.

## Approach
Add a single boolean toggle at the top of `src/App.tsx`. When enabled, the app renders only a maintenance page instead of the normal router tree. This will block all public pages and the admin panel.

## Changes

### 1. Create `src/pages/Maintenance.tsx`
- Centered layout with the clinic logo, "Site Under Maintenance" heading, and a short message.
- Include contact options (phone and email) so visitors can still reach the clinic.
- Use the green brand color as the primary accent.

### 2. Update `src/App.tsx`
- Add a top-level constant: `const MAINTENANCE_MODE = true;`.
- If `MAINTENANCE_MODE` is true, render only the `<Maintenance />` component (plus global providers like `QueryClientProvider`, `TooltipProvider`, `Toaster`, and `Sonner`).
- If `MAINTENANCE_MODE` is false, render the full `BrowserRouter` and routes as before.
- This makes restoring the site as simple as changing one flag back to `false`.

## No Data Changes
No database, content, or files will be deleted. Routes, admin pages, and all data stay intact.
