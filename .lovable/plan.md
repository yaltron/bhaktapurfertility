

# Fix: Uncaught AbortError in Auth Hook

## Problem

The red console error `Uncaught (in promise) AbortError: signal is aborted without reason` appears on **every page** (not just the admin login). It originates from the `useAuth.tsx` hook, which wraps the entire app.

The yellow `postMessage` warnings are from the Lovable preview environment itself and are harmless — they are not related to your code.

## Root Cause

In `src/hooks/useAuth.tsx`, the `supabase.auth.getSession()` call on line 42 uses `.then()` but has **no `.catch()` handler**. When the component unmounts (e.g., during navigation or preview environment re-rendering), the cleanup function calls `subscription.unsubscribe()`, which can abort in-flight auth requests. The aborted promise has nowhere to go, so it surfaces as an uncaught error in the console.

## Solution

Wrap the auth initialization logic in `useAuth.tsx` with proper error handling to silently catch `AbortError` exceptions. This is a safe and correct fix because abort errors during cleanup are expected behavior — they just mean "this request is no longer needed."

## Changes

### File: `src/hooks/useAuth.tsx`

**1. Add `.catch()` to the `getSession()` promise chain** (around line 42):
- Add a `.catch()` that silently ignores `AbortError` and errors containing "abort" or "signal"
- Log non-abort errors to the console for debugging
- Set `loading` to `false` even on error so the app doesn't hang

**2. Wrap the `checkAdmin` call inside `onAuthStateChange`** (around line 59):
- Add a try-catch around the `checkAdmin()` call inside the auth state change handler
- Silently ignore abort errors there too, since the subscription can be unsubscribed while admin check is in-flight

### What the code will look like:

```typescript
// Before (line 42-51):
supabase.auth.getSession().then(async ({ data: { session } }) => {
  // ... logic ...
});

// After:
supabase.auth.getSession().then(async ({ data: { session } }) => {
  // ... same logic ...
}).catch((err) => {
  // Silently ignore abort errors from cleanup/unmount
  if (err?.name === "AbortError" || 
      err?.message?.includes("abort") || 
      err?.message?.includes("signal")) {
    return;
  }
  console.error("Auth session error:", err);
  if (mountedRef.current) setLoading(false);
});
```

```typescript
// Before (line 53-67):
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (_event, session) => {
    // ... logic with checkAdmin ...
  }
);

// After: wrap inner logic in try-catch
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (_event, session) => {
    try {
      // ... same logic ...
    } catch (err: any) {
      if (err?.name === "AbortError" || 
          err?.message?.includes("abort") || 
          err?.message?.includes("signal")) {
        return;
      }
      console.error("Auth state change error:", err);
      if (mountedRef.current) setLoading(false);
    }
  }
);
```

### Files to modify:

| File | Change |
|------|--------|
| `src/hooks/useAuth.tsx` | Add `.catch()` to `getSession()` promise and try-catch around `onAuthStateChange` handler |

### What this fixes:
- Eliminates the red `AbortError` from appearing in the console on every page
- Does not change any auth behavior — login, admin checks, and session management all work exactly the same
- Only suppresses expected abort errors that occur during normal component lifecycle

