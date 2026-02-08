
# Fix Plan: Admin Login, Call Now Buttons, and Doctors Section

## Issues Identified

### 1. Admin Login "Signal is Aborted" Error
The "signal is aborted without reason" error occurs due to a race condition in React's Strict Mode. When the component mounts twice (React Strict Mode behavior), the first authentication request gets aborted when the component unmounts. The current code doesn't handle `AbortError` gracefully, so it shows the raw error message to the user.

Additionally, there's a problematic pattern in `AdminLogin.tsx` where a `useEffect` watches for `user && !isAdmin` and immediately signs the user out -- but `isAdmin` might not be resolved yet because the `checkAdmin` async call in `useAuth.tsx` is still in progress. This causes:
- User logs in -> session is set -> `loading` becomes true -> `onAuthStateChange` fires -> admin check starts -> brief moment where `user` exists but `isAdmin` is still false -> the useEffect fires and signs the user out.

**Fix:**
- In `AdminLogin.tsx`: Remove the problematic "sign out non-admins" useEffect that races with admin check. Instead, handle the admin check result more carefully after loading completes.
- Add proper error handling to ignore `AbortError` in the login catch block.
- In `useAuth.tsx`: Use a mounted ref to prevent state updates after unmount.

### 2. "Call Now" Button Not Visible on Sub-Pages
The sub-page hero sections (About, Services, Doctors, Blog, Contact) use `bg-secondary` (a very light mint background). The "Call Now" button uses the default button variant which renders as teal (`bg-primary`) with white text. The user wants these buttons to look exactly like the homepage hero's "Call Now" button.

The homepage hero has a **dark teal background** (`bg-primary`) with the "Call Now" styled as a semi-transparent outline button. The sub-pages have a **light background** (`bg-secondary`), creating an inconsistent look.

**Fix:**
Change all sub-page hero sections to use the same dark `bg-primary text-primary-foreground` background as the homepage hero. Then style the "Call Now" buttons with the same transparent outline treatment used on the homepage:
```
variant="outline"
className="border-primary-foreground/40 bg-primary-foreground/10
           text-primary-foreground hover:bg-primary-foreground/20"
```

### 3. Doctors Section Empty
The database has 3 doctors and the RLS policy (`qual: true`) allows public reads. In my browser test, the doctors loaded correctly. The issue the user sees is likely caused by the "signal aborted" error cascading -- when the auth system aborts and throws errors, it can disrupt other queries on the same page. Once the auth issue is fixed, doctor queries should work reliably.

As an additional safeguard, I'll add explicit error handling and `staleTime` configuration to the doctors query to prevent unnecessary refetches.

## Files to Modify

### `src/hooks/useAuth.tsx`
- Add a `mounted` ref to prevent state updates after component unmount
- Wrap `checkAdmin` calls with the mounted guard to avoid setting state on unmounted components

### `src/pages/admin/AdminLogin.tsx`
- Remove the second `useEffect` that prematurely signs out users before admin check completes
- Consolidate logic into a single effect that waits for `authLoading` to be false before making any decisions
- Handle `AbortError` and `AuthApiError` with name "AbortError" in the catch block

### `src/pages/About.tsx`
- Change hero `bg-secondary` to `bg-primary text-primary-foreground`
- Update paragraph text color from `text-muted-foreground` to `text-primary-foreground/80`
- Update "Call Now" button to use the homepage's outline style

### `src/pages/Services.tsx`
- Same hero background and button changes as About

### `src/pages/Doctors.tsx`
- Same hero background and button changes as About
- Add error handling to doctors query

### `src/pages/Blog.tsx`
- Same hero background and button changes as About
- Update search input styling for contrast on dark background

### `src/pages/Contact.tsx`
- Same hero background and button changes as About

## Implementation Order
1. Fix `useAuth.tsx` (root cause of auth issues)
2. Fix `AdminLogin.tsx` (remove race condition)
3. Update all 5 sub-page hero sections (About, Services, Doctors, Blog, Contact) with dark backgrounds and matching button styles
