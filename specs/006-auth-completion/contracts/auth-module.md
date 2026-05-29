# Contract: Auth Module

## Public Barrel — `src/modules/auth/index.ts`

```ts
// Components
export { AuthFormWrapper } from './components/AuthFormWrapper'
export { SignUpForm } from './components/SignUpForm'
export { ForgotPasswordForm } from './components/ForgotPasswordForm'
export { ResetPasswordForm } from './components/ResetPasswordForm'

// Types
export type { SignUpInput } from './types'
export type { ForgotPasswordInput } from './types'
export type { ResetPasswordInput } from './types'
```

---

## Component Props Contracts

### `AuthFormWrapper`

```ts
type AuthFormWrapperProps = {
  children: React.ReactNode
}
```

Renders: Dumbbell icon + "Gym Planner" heading + tagline + `max-w-sm w-full` container centred on screen. Consistent with existing login page brand header.

---

### `SignUpForm`

```ts
type SignUpFormProps = {
  // no props — self-contained; calls supabase client internally
}
```

- Uses `react-hook-form` + `zodResolver(signUpSchema)`
- On submit, call `supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })`
- Result branching:
  - `error` is not null → `setError('root', { message: t('authError') })`
  - `data.session !== null` → email confirmation disabled → `router.push('/onboarding')`
  - `data.session === null && data.user !== null` → email confirmation required → `router.push('/verify-email')`
- Renders: name, email, password, confirmPassword fields + terms checkbox + submit button

---

### `ForgotPasswordForm`

```ts
type ForgotPasswordFormProps = {
  // no props — self-contained
}
```

- Uses `react-hook-form` + `zodResolver(forgotPasswordSchema)`
- On submit: call `supabase.auth.resetPasswordForEmail(email, { redirectTo: (process.env.NEXT_PUBLIC_SITE_URL ?? '') + '/auth/callback?next=/reset-password' })`
  - `NEXT_PUBLIC_SITE_URL` guard: if undefined, the empty string produces a relative URL (`/auth/callback?next=/reset-password`) — works locally, requires the env var in production
- Always set `succeeded = true` after the call (success OR non-existent email — FR-007 no enumeration)
- On network/fetch failure (caught exception, not Supabase error): sets `root` error to `t('authNetworkError')`
- Renders: email field + submit button, then success state with "Back to sign in" link

---

### `ResetPasswordForm`

```ts
type ResetPasswordFormProps = {
  // no props — reads `code` from current URL via useSearchParams only if PKCE exchange already completed (session exists)
}
```

- Uses `react-hook-form` + `zodResolver(resetPasswordSchema)`
- On mount: call `supabase.auth.getSession()` — if `session` is null, skip the form and render invalid-link state (shows `t('resetLinkInvalid')` + link to `/forgot-password`)
- On submit: call `supabase.auth.updateUser({ password })`; on success → `router.push('/login')`
- On Supabase error: sets `root` error to `t('authError')`
- Renders: newPassword, confirmPassword fields + submit button

---

## Route Handler Contract

### `src/app/auth/callback/route.ts`

**Method**: `GET`
**Path**: `/auth/callback`
**Query params**:
- `code` (string) — Supabase PKCE auth code (required)
- `next` (string) — redirect path after exchange (e.g., `/reset-password`)

**Success**: exchanges `code` for session via `supabase.auth.exchangeCodeForSession(code)` then redirects to `next` (default `/`)

**Error**: redirects to `/login?error=auth` if exchange fails

**Security**: validates `next` is a relative path (starts with `/`) to prevent open redirect attacks

---

## Middleware Contract

### `src/lib/supabase/middleware.ts` — updated allowlist

Public paths (no auth required):
```ts
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/session-expired',
  '/auth/callback',
]
```

Any path not matching a `PUBLIC_PATHS` prefix while `user` is null → redirect to `/login`.
