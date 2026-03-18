

# Add Two Admin User Accounts

## Approach
Create a one-time edge function using the Supabase Admin Auth API to safely create the two accounts and assign them admin roles. This handles duplicate prevention, secure password hashing (handled automatically by the auth system), and role assignment.

## Steps

### 1. Create edge function `supabase/functions/create-admin-users/index.ts`
- Uses `supabase.auth.admin.createUser()` to create each account with confirmed email
- Inserts corresponding `admin` role in `user_roles` table
- Checks for existing users first to prevent duplicates
- Protected by service role key (server-side only)

### 2. Deploy and invoke the edge function
- Call it once to create both accounts
- Verify success in response

### 3. Clean up
- Delete the edge function after use (it's a one-time setup task)

## Accounts to create
| Email | Role |
|---|---|
| yaltron.team@gmail.com | admin |
| admin@bhaktapurfertility.com.np | admin |

Passwords are hashed automatically by the auth system — never stored in plain text.

