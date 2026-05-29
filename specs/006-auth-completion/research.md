# Research: Auth Completion

## Decision 1 — Supabase Password Reset (PKCE Flow)

**Decision**: Use the Supabase PKCE auth callback pattern via a Next.js Route Handler at `src/app/auth/callback/route.ts`.

**How it works**:
1. `supabase.auth.resetPasswordForEmail(email, { redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback?next=/reset-password' })` — sends email with a `?code=XXX` URL
2. User clicks link → lands on `/auth/callback?code=XXX&next=/reset-password`
3. Route Handler calls `supabase.auth.exchangeCodeForSession(code)` — exchanges the one-time code for a session
4. Route Handler redirects to `/reset-password`
5. On `/reset-password`, user is now in an active recovery session → call `supabase.auth.updateUser({ password: newPassword })`

**Rationale**: The PKCE flow is Supabase's recommended approach for server-rendered apps. The `exchangeCodeForSession` call MUST happen server-side (Route Handler) because client-side code receives the code too late after the middleware runs. This is the same callback pattern documented in the Supabase Next.js quickstart.

**Alternatives considered**:
- **Hash fragment / implicit flow** (legacy): URL contains `#access_token=...&type=recovery`. Rejected — not the default in new Supabase projects and will be deprecated.
- **Handle code exchange in reset-password Client Component**: Works but requires the code to survive the redirect and be read client-side from `searchParams`. Fragile on page refresh. Rejected in favour of the server-side pattern.

**Required env var**: `NEXT_PUBLIC_SITE_URL` must be set to the app's base URL (e.g., `http://localhost:3000` for local dev). If not set, fall back to `/auth/callback?next=/reset-password` (relative — works locally, breaks in production email links). Document in quickstart.md.

---

## Decision 2 — Middleware Allowlist Expansion

**Decision**: Replace the single `/login` check in `src/lib/supabase/middleware.ts` with a set of public path prefixes.

**Current code**:
```ts
if (!user && !request.nextUrl.pathname.startsWith('/login')) {
  // redirect to /login
}
```

**Updated pattern**:
```ts
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/session-expired', '/auth/callback']

const isPublic = PUBLIC_PATHS.some(p => request.nextUrl.pathname.startsWith(p))

if (!user && !isPublic) {
  // redirect to /login
}
```

**Rationale**: Without this update, any request to `/signup` while unauthenticated gets redirected to `/login` — the new pages become inaccessible. Adding `/auth/callback` ensures the PKCE exchange can complete before any session exists.

---

## Decision 3 — Form Architecture (RHF + Zod)

**Decision**: Each form screen (`SignUpForm`, `ForgotPasswordForm`, `ResetPasswordForm`) is a `'use client'` component that uses `useForm` from `react-hook-form` with `zodResolver`. Pages are Server Components or thin Client Component wrappers.

**Zod v4 patterns** (project uses `zod ^4.4.3`):
```ts
// Password with custom rule
z.string()
  .min(8, 'Must be at least 8 characters')
  .refine(val => /\d/.test(val), 'Must contain at least one number')

// Cross-field confirm password — use .superRefine on object
z.object({ password: ..., confirmPassword: ... })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

// Terms checkbox
z.boolean().refine(val => val === true, { message: 'You must accept the terms to continue' })
```

**Rationale**: Consistent with existing validation in `src/modules/workout-session/validation/set-log.schema.ts`. The `@hookform/resolvers/zod` adapter is already installed.

---

## Decision 4 — Shared AuthFormWrapper Component

**Decision**: Create `src/modules/auth/components/AuthFormWrapper.tsx` — a shared layout wrapper that renders the Dumbbell brand logo, app name, and a `max-w-sm` centred container. All five auth screens import this to maintain visual consistency with the existing login page.

**Rationale**: The existing login page renders the brand header inline. Extracting it avoids duplicating ~15 lines of JSX across 5 new screens. This is not a premature abstraction — it exists in the login page already and will be used in ≥4 new screens.

---

## Decision 5 — Generic Error Message Strategy

**Decision**: All Supabase auth errors are swallowed and replaced with a single `t('authError')` i18n key (e.g., "Something went wrong. Please try again.").

**Implementation**:
```ts
const { error } = await supabase.auth.signUp(...)
if (error) {
  setError('root', { message: t('authError') })
  return
}
```

**Rationale**: FR-004 and FR-007 require no leakage of server error details. Supabase returns messages like "User already registered" or "Email rate limit exceeded" — these MUST NOT reach the UI. The single generic message is safe for all failure modes.

**Exception — Forgot Password**: The success message is always shown regardless of error, so no error state is needed (per FR-007). If the network call itself fails (no connectivity), show `t('authNetworkError')` — a distinct key from the auth error.

---

## Decision 6 — Verify Email Screen

**Decision**: Static informational screen with no email address displayed. Generic message: "Check your inbox and confirm your email to continue." Includes a "Resend email" button that calls `supabase.auth.resend({ type: 'signup', email })`.

**Email source for resend**: The email address is NOT passed in the URL (security concern — leaks PII in browser history). Instead, the resend button requires the user to input their email OR the resend is handled by Supabase's session (if user just signed up, an unconfirmed session may exist). 

**Practical approach**: Show a text input pre-populated with nothing. User enters their email to resend. This is simpler and avoids URL parameter concerns entirely.

---

## Decision 7 — Session Expired Screen

**Decision**: Static page at `/session-expired` accessible without auth. The `(app)` layout.tsx currently redirects to `/login` — it will NOT be changed to redirect to `/session-expired` in this spec (that would require knowing if a prior session existed, which is out of scope). The `/session-expired` page is reachable via:
1. Direct navigation (e.g., a future TanStack Query global 401 error handler)
2. Manual testing

**Rationale**: Implementing an "expired vs never logged in" distinction in the middleware requires additional session state tracking. That is spec 014 (Settings) territory. For now, the page exists and is reachable — wiring the redirect is deferred.
