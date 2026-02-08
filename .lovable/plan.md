

# Fix: Call Now Button Visibility and Auth Stability

## Summary

There are two remaining issues to fix:

1. **The "Call Now" button is invisible on the Service Detail pages** (like the TESA page in your screenshot). This specific page was missed in previous updates. The button has white text on a white background because a background style (`bg-primary-foreground/10`) is missing.

2. **The Doctor Detail page** also has an outdated hero section that needs updating to match the rest of the site.

3. **The admin login "signal is aborted" error** needs a more robust fix -- the current approach still allows a race condition where the component unmounts mid-request.

Regarding login credentials: I'm unable to provide login credentials as I don't have access to view or create passwords. Your admin account was set up with the email `rizal.avash@gmail.com`. If you've forgotten the password, you can reset it through the authentication system, or I can help set up a password reset flow.

---

## What Will Change

### 1. ServiceDetail.tsx -- Fix the invisible "Call Now" button

The button on line 62 is missing the semi-transparent background that makes it visible on the teal hero. It currently has:
```
border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10
```

It needs to match the homepage style:
```
border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20
```

### 2. DoctorDetail.tsx -- Update hero section

The Doctor Detail page still uses `bg-secondary` (light background) for its hero. This will be updated to use `bg-primary text-primary-foreground` for consistency. The "Back to Doctors" link and text colors will be updated accordingly.

### 3. AdminLogin.tsx -- More robust abort error handling

The current fix still has a gap. The login handler will be updated to:
- Wrap the auth call with an AbortController tied to the component lifecycle
- Silently ignore any `AbortError` without showing error messages
- Remove the `loginAttempted` flag complexity in favor of a simpler flow

### 4. useAuth.tsx -- Defensive state updates

Ensure the `mountedRef` guard is applied consistently to all state-setting paths, preventing "state update on unmounted component" warnings that can cascade into visible errors.

---

## Technical Details

### Files to modify:

| File | Change |
|------|--------|
| `src/pages/ServiceDetail.tsx` | Add `bg-primary-foreground/10` to the Call Now button, update border opacity to `/40` |
| `src/pages/DoctorDetail.tsx` | Change hero from `bg-secondary` to `bg-primary text-primary-foreground`, update link/text colors |
| `src/pages/admin/AdminLogin.tsx` | Simplify login handler with proper AbortController, remove race-prone useEffect |
| `src/hooks/useAuth.tsx` | Add safety guards to prevent state updates after unmount |

### Button style reference (homepage):
```
variant="outline"
className="border-primary-foreground/40 bg-primary-foreground/10
           text-primary-foreground hover:bg-primary-foreground/20"
```

This creates a semi-transparent glass-like button that is clearly visible against the dark teal hero background.
