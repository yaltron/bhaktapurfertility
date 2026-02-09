

# Fix: Password Reset Page Stuck on "Verifying"

## Problem

When you click the password reset link from your email, the page redirects to `/admin/reset-password` but gets permanently stuck showing "Verifying your reset link..." and never shows the password form.

## Root Cause

There is a timing/race condition:

1. The reset link redirects to `/admin/reset-password#access_token=...&type=recovery`
2. The Supabase client starts processing the URL hash fragments asynchronously
3. The `AuthProvider` (which wraps the entire app) registers its `onAuthStateChange` listener first
4. The `PASSWORD_RECOVERY` event fires and is received by `AuthProvider`
5. By the time the `AdminResetPassword` component mounts and registers its own listener, the event has already fired and been consumed
6. The `getSession()` fallback might also be called before the hash processing finishes, returning `null`
7. Result: `sessionReady` never becomes `true`, form never appears

## Solution

Make the reset password page more robust by:

1. Listening for ALL relevant auth events (not just `PASSWORD_RECOVERY` -- also `SIGNED_IN` and `TOKEN_REFRESHED`)
2. Adding a polling/retry mechanism for `getSession()` to handle async hash processing
3. Checking the URL hash for `type=recovery` as an immediate signal
4. Adding a timeout fallback that shows the form if a session exists after a short delay

## Changes

### File: `src/pages/admin/AdminResetPassword.tsx`

Replace the current `useEffect` logic with a more robust approach:

- On mount, immediately check if the URL hash contains `type=recovery` -- if so, we know we're in a recovery flow
- Listen for `PASSWORD_RECOVERY`, `SIGNED_IN`, and `TOKEN_REFRESHED` events on `onAuthStateChange`
- Implement a retry loop (polling `getSession()` every 500ms for up to 5 seconds) to catch the session even if it's established after the first check
- Add a clear error state with a "Go back to login" button if the session truly can't be established after the timeout
- Add a loading spinner for better UX during verification

### Technical Implementation

```text
Component mounts
  |
  +--> Check URL hash for "type=recovery" or "access_token"
  |      (immediate signal we're in recovery flow)
  |
  +--> Register onAuthStateChange listener
  |      Listen for: PASSWORD_RECOVERY, SIGNED_IN, TOKEN_REFRESHED
  |      Any of these with a valid session -> sessionReady = true
  |
  +--> Start polling getSession() every 500ms
  |      If session found -> sessionReady = true, stop polling
  |      After 5 seconds with no session -> show error with
  |      "Go back to login" button
  |
  +--> Once sessionReady = true:
         Show the new password form
```

### Key Differences from Current Code

| Current | Fixed |
|---------|-------|
| Only listens for `PASSWORD_RECOVERY` event | Listens for multiple auth events |
| Single `getSession()` check that may be too early | Polls `getSession()` with retries |
| Gets stuck forever if event is missed | Shows error after 5-second timeout with actionable guidance |
| No loading indicator | Shows a spinner during verification |

