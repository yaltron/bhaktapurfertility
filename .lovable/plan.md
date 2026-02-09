

# Fix: Password Reset Page Stuck on Loading (Root Cause Fix)

## Problem

The password reset page (`/admin/reset-password`) stays stuck on "Verifying your reset link..." and never shows the password form, even though the authentication logs confirm the recovery link is processed successfully.

## Root Cause (Revised)

There are TWO interacting bugs:

### Bug 1: `useAuth.tsx` sets `loading = true` during ongoing auth changes

In the `onAuthStateChange` callback (line 67), whenever a session is detected, it sets `loading = true` before calling `checkAdmin()`. This is problematic because:
- It triggers unnecessary re-renders across the entire app
- It can cause a brief "loading" state flicker that disrupts child components
- It violates the pattern of separating initial auth load from ongoing changes

### Bug 2: `AdminResetPassword` has a redundant, fragile session detection mechanism

The component creates its own `onAuthStateChange` listener and polling loop, duplicating what `AuthProvider` already does. This is fragile because:
- In Supabase v2, `onAuthStateChange` fires an `INITIAL_SESSION` event when a listener is registered, but the component doesn't check for this event
- The `PASSWORD_RECOVERY` event may have already fired by the time this component's listener is registered
- While polling should theoretically catch this, having two independent listeners on the same auth client creates unpredictable behavior

## Solution

Apply the proven fix from the stack overflow solution: restructure the auth flow so that:

1. **`useAuth.tsx`**: Separate initial load from ongoing changes. Register `onAuthStateChange` BEFORE `getSession()`. Only the initial `getSession()` controls the `loading` state. Ongoing auth changes update session/role without toggling `loading`.

2. **`AdminResetPassword.tsx`**: Remove the redundant listener and polling. Instead, use `useAuth()` directly -- once `loading` is `false` and a session exists, show the password form. This eliminates the race condition entirely.

## Changes

### File 1: `src/hooks/useAuth.tsx`

Restructure the `useEffect` to follow the recommended pattern:

- Register `onAuthStateChange` FIRST (before `getSession`)
- The `onAuthStateChange` handler updates `session` and `isAdmin` but does NOT set `loading` to `true` or `false` -- it just fires `checkAdmin` as fire-and-forget
- The initial `getSession()` call is the ONLY thing that controls `loading`
- `loading` starts as `true` and is set to `false` once (and only once) after the initial session + admin check completes

```text
Current flow (buggy):
  getSession() -> set session -> check admin -> loading = false
  onAuthStateChange -> set session -> loading = TRUE -> check admin -> loading = false
                                      ^^^^^^^^^^^^^^
                                      This causes re-renders and disrupts child components

Fixed flow:
  onAuthStateChange -> set session -> check admin (fire and forget)
  getSession() -> set session -> await check admin -> loading = false (once)
```

### File 2: `src/pages/admin/AdminResetPassword.tsx`

Simplify dramatically:

- Remove the entire custom `useEffect` with `onAuthStateChange`, polling, and timeouts
- Remove `sessionReady`, `timedOut`, `sessionFoundRef` state
- Import and use `useAuth()` hook instead
- Check: if `auth.loading` is true, show spinner
- Check: if `auth.loading` is false and no session, show "link expired" message
- Check: if `auth.loading` is false and session exists, show the password form

This reduces the component from ~195 lines to ~100 lines and eliminates all timing issues.

## Technical Details

### `useAuth.tsx` - New useEffect structure:

```typescript
useEffect(() => {
  let isMounted = true;

  // 1. Register listener FIRST (catches events during hash processing)
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (!isMounted) return;
      setSession(session);
      // Fire and forget - do NOT control loading
      if (session?.user) {
        checkAdmin(session.user.id).catch(() => {});
      } else {
        setIsAdmin(false);
      }
    }
  );

  // 2. Initial load - this is the ONLY thing that controls loading
  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(session);
      if (session?.user) {
        await checkAdmin(session.user.id);
      }
    } catch (err: any) {
      if (err?.name === "AbortError" || ...) return;
      console.error("Auth session error:", err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  initializeAuth();

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, []);
```

### `AdminResetPassword.tsx` - Simplified logic:

```typescript
const AdminResetPassword = () => {
  const { session, loading: authLoading } = useAuth();
  // ... password state, navigate, etc.

  // If auth is still loading, show spinner
  if (authLoading) {
    return <VerifyingSpinner />;
  }

  // If no session after auth loaded, link is invalid/expired
  if (!session) {
    return <LinkExpiredCard />;
  }

  // Session exists - show password form
  return <PasswordForm />;
};
```

### Files to modify:

| File | Change |
|------|--------|
| `src/hooks/useAuth.tsx` | Restructure useEffect: listener before getSession, only initial load controls loading state |
| `src/pages/admin/AdminResetPassword.tsx` | Remove custom session detection, use `useAuth()` hook instead |

### Why this fixes the issue:

1. `AuthProvider` registers its listener before `getSession()`, so it catches ALL events including those fired during hash processing
2. The `loading` state is only set to `false` once, after the initial load completes -- no more toggling
3. `AdminResetPassword` simply reads the auth state instead of trying to independently detect the session
4. No more race conditions, no more duplicate listeners, no more polling

