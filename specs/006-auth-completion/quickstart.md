# Quickstart: Auth Completion (spec 006)

## Prerequisites

1. Supabase project running (local or hosted)
2. `.env.local` contains:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000   ← NEW: required for password reset email links
   ```
3. `npm install` already run — no new dependencies in this spec

## Password Reset Email Setup

Supabase sends the reset email link to `NEXT_PUBLIC_SITE_URL/auth/callback?next=/reset-password`.

In Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: set to `http://localhost:3000` (local) or your production domain
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

Without this, reset email links will be rejected by Supabase as unauthorized redirect URLs.

## Email Confirmation (Optional)

If you enable email confirmation in Supabase (Authentication → Providers → Email):
- Sign-up redirects to `/verify-email` instead of `/onboarding`
- The `/verify-email` screen shows a generic "check your inbox" message with a resend button

During local development, email confirmation is typically **off** — sign-up redirects directly to `/onboarding` (which will 404 until spec 010 is implemented).

## Running the Feature

```bash
npm run dev
# Navigate to http://localhost:3000/signup
```

### Test flows

| Flow | Steps |
|------|-------|
| Sign up | `/signup` → fill form → submit → should redirect to `/onboarding` (404 OK for now) |
| Sign up validation | Submit with weak password, unmatched confirm, unchecked terms — verify inline errors |
| Forgot password | `/forgot-password` → enter email → submit → verify success message always shown |
| Reset password | Send reset email → click link → land on `/reset-password` → set new password |
| Login links | `/login` → verify "Forgot password?" and "Sign up" links appear |
| 375px check | Open DevTools → set viewport to 375px → verify all 5 screens |

## DoD Checklist (per constitution)

- [ ] `npm run build` passes with zero TypeScript errors
- [ ] All 5 new screens visually verified at 375px
- [ ] All interactive elements ≥ 44px tap target
- [ ] Form errors appear inline (not page reload)
- [ ] Submit buttons show loading state and are disabled during request
- [ ] Supabase raw error messages never shown to user
- [ ] All i18n keys present in both `en` and `es`
- [ ] `/auth/callback` validates `next` param against relative paths (no open redirect)
- [ ] No new npm dependencies added
