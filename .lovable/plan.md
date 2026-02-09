

# Add Password Reset Flow for Admin Login

## Problem
The authentication system is returning "Invalid login credentials" for the admin account (`rizal.avash@gmail.com`). The stored password doesn't match what's being entered. Since passwords cannot be viewed or directly changed, we need a password reset flow.

## Solution
Add a "Forgot Password?" link to the admin login page and create a password reset page to handle the email callback.

## How It Will Work

1. On the admin login page, click "Forgot Password?"
2. Enter your email address (`rizal.avash@gmail.com`)
3. Receive a password reset email
4. Click the link in the email -- it redirects to `/admin/reset-password`
5. Enter and confirm your new password
6. Get redirected to the admin login page to sign in with your new password

## Changes

### 1. Update `src/pages/admin/AdminLogin.tsx`
- Add a "Forgot Password?" link below the sign-in button
- Add a toggle state to show a "Reset Password" form (email input + send reset link button)
- Use `supabase.auth.resetPasswordForEmail()` with `redirectTo` pointing to the reset password page

### 2. Create `src/pages/admin/AdminResetPassword.tsx`
- New page that handles the password reset callback
- Shows a form with "New Password" and "Confirm Password" fields
- Uses `supabase.auth.updateUser({ password })` to set the new password
- Redirects to `/admin/login` on success with a success toast

### 3. Update `src/App.tsx`
- Add a new route: `/admin/reset-password` pointing to the new `AdminResetPassword` component

## Technical Details

### Password Reset Email Flow
```text
User clicks "Forgot Password?"
  --> enters email
  --> supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin/reset-password'
      })
  --> user receives email with magic link
  --> clicks link, lands on /admin/reset-password with session token
  --> enters new password
  --> supabase.auth.updateUser({ password: newPassword })
  --> redirected to /admin/login
```

### Files to create:
| File | Purpose |
|------|---------|
| `src/pages/admin/AdminResetPassword.tsx` | New password reset page with form |

### Files to modify:
| File | Change |
|------|--------|
| `src/pages/admin/AdminLogin.tsx` | Add "Forgot Password?" toggle and reset email form |
| `src/App.tsx` | Add `/admin/reset-password` route |

### Security Considerations
- The reset link is sent only to the registered email
- The reset token is handled securely by the authentication system
- Password confirmation field prevents typos
- After successful reset, user must log in again with the new credentials
