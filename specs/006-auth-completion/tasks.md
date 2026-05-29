# Tasks: Auth Completion

**Input**: Design documents from `specs/006-auth-completion/`
**Branch**: `006-auth-completion`
**Tests**: Not requested — validation via `npm run build` + manual 375px visual check per constitution DoD.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared state dependencies)
- **[Story]**: User story label (US1–US5 maps to spec.md user stories)
- Exact file paths in every description

---

## Phase 1: Setup

**Purpose**: Module directory, types stub, and i18n keys. No auth behaviour changes.

- [ ] T001 Create `src/modules/auth/` directory structure: `components/`, `validation/`, `types/` — empty dirs only; create stub `src/modules/auth/index.ts` with a single comment `// barrel — exports added per phase`
- [ ] T002 [P] Add all 32 i18n keys to `src/i18n/ui.ts` in both `en` and `es` blocks (values from `specs/006-auth-completion/data-model.md` i18n table): `signUp`, `signingUp`, `name`, `confirmPassword`, `termsLabel`, `signUpTitle`, `alreadyHaveAccount`, `authError`, `authNetworkError`, `forgotPassword`, `forgotPasswordTitle`, `forgotPasswordSubtitle`, `sendResetLink`, `sendingResetLink`, `resetLinkSent`, `resetLinkSentBody`, `backToSignIn`, `resetPasswordTitle`, `newPassword`, `savePassword`, `savingPassword`, `resetLinkInvalid`, `requestNewLink`, `verifyEmailTitle`, `verifyEmailBody`, `resendEmail`, `resendingEmail`, `emailResentConfirm`, `sessionExpiredTitle`, `sessionExpiredBody`, `signInAgain`, `dontHaveAccount`, `passwordRequirements`
- [ ] T003 ⚠️ DEFERRED to after T016 — Create `src/modules/auth/types/index.ts` — re-export types from all three schemas (which must exist first): `export type { SignUpInput } from '../validation/sign-up.schema'` / `export type { ForgotPasswordInput } from '../validation/forgot-password.schema'` / `export type { ResetPasswordInput } from '../validation/reset-password.schema'`. Implement after T016 is complete.

**Checkpoint**: Module dirs exist; all i18n keys available in en + es.

---

## Phase 2: Foundational — Middleware Allowlist

**Purpose**: Expand middleware so unauthenticated users can access all new auth routes. Blocks ALL new screens — nothing is reachable without this.

**⚠️ CRITICAL**: No user story screen can be manually tested until T004 is complete.

- [ ] T004 Update `src/lib/supabase/middleware.ts` — replace the single `!request.nextUrl.pathname.startsWith('/login')` guard with a `PUBLIC_PATHS` array check. New logic:
  ```ts
  const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/session-expired', '/auth/callback']
  const isPublic = PUBLIC_PATHS.some(p => request.nextUrl.pathname.startsWith(p))
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  ```
  Keep all other middleware logic (cookie handling, `supabaseResponse`) unchanged.

**Checkpoint**: Navigate to `http://localhost:3000/signup` while unauthenticated → page loads (may 404 until T009, but NO redirect to `/login`). Existing behaviour for unauthenticated access to `/workout` still redirects to `/login`.

---

## Phase 3: User Story 1 — New User Sign Up (Priority: P1) 🎯 MVP

**Goal**: New user can create an account with email/password, see field-level validation errors, and be redirected to `/onboarding` (or `/verify-email` if email confirmation is enabled).

**Independent Test**: Navigate to `/signup` → fill name, valid email, password `Test1234`, matching confirm, check terms → submit → redirects to `/onboarding` (404 is OK). Re-test: mismatched passwords → inline error on confirmPassword field. Weak password (no number) → inline error on password field. Uncheck terms → inline error on terms field. Already-registered email → generic error shown (not "user already registered").

- [ ] T005 [P] [US1] Create `src/modules/auth/validation/sign-up.schema.ts` — export `signUpSchema` using Zod v4 and `SignUpInput` type:
  ```ts
  import { z } from 'zod'
  export const signUpSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string()
      .min(8, 'At least 8 characters')
      .refine(val => /\d/.test(val), 'Must contain at least one number'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the terms to continue' }),
  }).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Passwords do not match', path: ['confirmPassword'] })
    }
  })
  export type SignUpInput = z.infer<typeof signUpSchema>
  ```

- [ ] T006 [P] [US1] Create `src/modules/auth/components/AuthFormWrapper.tsx` — `'use client'`; props: `{ children: React.ReactNode }`; renders the same brand header as the existing login page:
  ```tsx
  // Dumbbell icon (h-16 w-16, rounded-2xl, bg-gym-accent glow-accent) + h-8 w-8 white icon
  // "Gym Planner" h1 heading class="heading text-3xl tracking-wide text-gym-text"
  // tagline p class="text-sm text-gym-muted" showing t('loginTagline')
  // outer: <main className="flex min-h-screen items-center justify-center px-4">
  // inner: <div className="flex w-full max-w-sm flex-col gap-8">{children}</div>
  ```
  Copy the brand block verbatim from `src/app/(auth)/login/page.tsx` lines 39–47 and wrap with `useI18n`.

- [ ] T007 [US1] Create `src/modules/auth/components/SignUpForm.tsx` — `'use client'`; imports `useForm` from `react-hook-form`, `zodResolver` from `@hookform/resolvers/zod`, `signUpSchema` from `../validation/sign-up.schema`, `createClient` from `@/lib/supabase/client`, `useI18n` from `@/i18n/client`, `useRouter` from `next/navigation`. Form fields: name (type="text"), email (type="email"), password (type="password"), confirmPassword (type="password"), termsAccepted (type="checkbox"). Submit handler:
  ```ts
  const { error, data } = await supabase.auth.signUp({
    email, password, options: { data: { full_name: name } }
  })
  if (error) { setError('root', { message: t('authError') }); return }
  if (data.session !== null) { router.push('/onboarding') }
  else if (data.user !== null) { router.push('/verify-email') }
  ```
  Loading state: `isSubmitting` from `formState` disables the submit button and shows `t('signingUp')`. Each field shows `{errors.<field>?.message}` as `<p className="text-xs text-red-400">` below the input. Root error shown as a `<p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">`. All inputs use `className="h-11 rounded-lg border border-gym-border bg-gym-surface px-3 text-sm focus:border-gym-border-strong focus:outline-none"`. Submit button: `className="glow-accent h-11 rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"`. Terms checkbox: `<input type="checkbox" {...register('termsAccepted')} className="h-5 w-5 accent-gym-accent" aria-required="true">`. Add `aria-describedby` pointing to the error element id on each input when an error exists. Add `aria-required="true"` on all required inputs.

- [ ] T008 [US1] Update `src/modules/auth/index.ts` barrel — add exports:
  ```ts
  export { AuthFormWrapper } from './components/AuthFormWrapper'
  export { SignUpForm } from './components/SignUpForm'
  ```

- [ ] T009 [US1] Create `src/app/(auth)/signup/page.tsx` — Server Component (no `'use client'`); imports `AuthFormWrapper` and `SignUpForm` from `@/modules/auth`; renders:
  ```tsx
  import { AuthFormWrapper } from '@/modules/auth'
  import { SignUpForm } from '@/modules/auth'
  export default function SignUpPage() {
    return <AuthFormWrapper><SignUpForm /></AuthFormWrapper>
  }
  ```

- [ ] T010 [US1] Update `src/app/(auth)/login/page.tsx` — add two navigation links below the form `</form>` closing tag (inside the outer `flex flex-col gap-8` div):
  ```tsx
  import Link from 'next/link'
  // Add after </form>:
  <div className="flex flex-col items-center gap-2 text-sm text-gym-muted">
    <Link href="/forgot-password" className="hover:text-gym-text transition-colors min-h-[44px] flex items-center">
      {t('forgotPassword')}
    </Link>
    <span>{t('dontHaveAccount')} <Link href="/signup" className="text-gym-accent hover:underline">{t('signUp')}</Link></span>
  </div>
  ```
  No other changes to login page.

**Checkpoint**: `/signup` renders with brand header + form. Field errors appear inline. Submit with valid data redirects to `/onboarding` (404). Login page shows "Forgot password?" and "Sign up" links.

---

## Phase 4: User Story 2 — Forgot Password (Priority: P2)

**Goal**: User can request a password reset email from `/forgot-password`. Success confirmation always shown regardless of whether email exists.

**Independent Test**: Navigate to `/forgot-password` → enter any email → submit → verify success message appears (not redirect, not error). Enter invalid email format → verify inline field error. Network down → verify network error message shown. Back to sign in link returns to `/login`.

- [ ] T011 [P] [US2] Create `src/app/auth/callback/route.ts` (NOT inside `(auth)` — this is a Route Handler at `src/app/auth/callback/route.ts`):
  ```ts
  import { createClient } from '@/lib/supabase/server'
  import { NextResponse, type NextRequest } from 'next/server'
  export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    // Security: only allow relative paths to prevent open redirect
    const safePath = next.startsWith('/') ? next : '/'
    if (code) {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${safePath}`)
      }
    }
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }
  ```

- [ ] T012 [P] [US2] Create `src/modules/auth/validation/forgot-password.schema.ts`:
  ```ts
  import { z } from 'zod'
  export const forgotPasswordSchema = z.object({
    email: z.string().email('Enter a valid email'),
  })
  export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
  ```

- [ ] T013 [US2] Create `src/modules/auth/components/ForgotPasswordForm.tsx` — `'use client'`; imports `useForm`, `zodResolver`, `forgotPasswordSchema`, `createClient`, `useI18n`, `useRouter`, `useState`. Local state: `const [succeeded, setSucceeded] = useState(false)`. Submit handler:
  ```ts
  try {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: (process.env.NEXT_PUBLIC_SITE_URL ?? '') + '/auth/callback?next=/reset-password',
    })
    setSucceeded(true) // always show success — FR-007 no enumeration
  } catch {
    setError('root', { message: t('authNetworkError') })
  }
  ```
  When `succeeded`: render success state — `<p className="text-gym-text font-semibold">{t('resetLinkSent')}</p>` + `<p className="text-sm text-gym-muted">{t('resetLinkSentBody')}</p>` + `<Link href="/login" className="text-gym-accent text-sm hover:underline">{t('backToSignIn')}</Link>`. When not succeeded: render email input + submit button with loading state `t('sendingResetLink')` / `t('sendResetLink')`. Add accessible label and error display matching SignUpForm pattern.

- [ ] T014 [US2] Update `src/modules/auth/index.ts` barrel — add:
  ```ts
  export { ForgotPasswordForm } from './components/ForgotPasswordForm'
  ```

- [ ] T015 [US2] Create `src/app/(auth)/forgot-password/page.tsx`:
  ```tsx
  import { AuthFormWrapper, ForgotPasswordForm } from '@/modules/auth'
  export default function ForgotPasswordPage() {
    return <AuthFormWrapper><ForgotPasswordForm /></AuthFormWrapper>
  }
  ```

**Checkpoint**: `/forgot-password` renders. Submit any email → success message shown. Invalid email format → inline error. `/login` "Forgot password?" link navigates here.

---

## Phase 5: User Story 3 — Reset Password (Priority: P2)

**Goal**: User arriving via Supabase reset email link can set a new password. Invalid/expired link shows a user-friendly error instead of the form.

**Independent Test**: Send reset email → click link → land on `/reset-password` → enter `NewPass1` + confirm → submit → redirect to `/login`. Navigate to `/reset-password` directly (no active session) → verify invalid-link state shown with "Request a new link" → link points to `/forgot-password`.

- [ ] T016 [P] [US3] Create `src/modules/auth/validation/reset-password.schema.ts`:
  ```ts
  import { z } from 'zod'
  export const resetPasswordSchema = z.object({
    password: z.string()
      .min(8, 'At least 8 characters')
      .refine(val => /\d/.test(val), 'Must contain at least one number'),
    confirmPassword: z.string(),
  }).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Passwords do not match', path: ['confirmPassword'] })
    }
  })
  export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
  ```

- [ ] T017 [US3] Create `src/modules/auth/components/ResetPasswordForm.tsx` — `'use client'`; imports `useForm`, `zodResolver`, `resetPasswordSchema`, `createClient`, `useI18n`, `useRouter`, `useState`, `useEffect`. On mount, call `supabase.auth.getSession()` — if `session` is null, set `isInvalidLink = true`. Render:
  - If `isInvalidLink`: show `<p className="text-sm text-red-400">{t('resetLinkInvalid')}</p>` + `<Link href="/forgot-password" className="text-gym-accent text-sm hover:underline">{t('requestNewLink')}</Link>` — no form
  - If session valid: render password + confirmPassword fields + submit button (`t('savePassword')` / `t('savingPassword')`). Submit: `await supabase.auth.updateUser({ password })` → on success `router.push('/login')` → on error `setError('root', { message: t('authError') })`. Show `t('passwordRequirements')` as hint text `<p className="text-xs text-gym-muted">` below password field.

- [ ] T018 [US3] Update `src/modules/auth/index.ts` barrel — add:
  ```ts
  export { ResetPasswordForm } from './components/ResetPasswordForm'
  ```

- [ ] T019 [US3] Create `src/app/(auth)/reset-password/page.tsx`:
  ```tsx
  import { AuthFormWrapper, ResetPasswordForm } from '@/modules/auth'
  export default function ResetPasswordPage() {
    return <AuthFormWrapper><ResetPasswordForm /></AuthFormWrapper>
  }
  ```

**Checkpoint**: Direct navigation to `/reset-password` (no session) shows invalid-link state. After PKCE callback, form shown and new password can be saved.

---

## Phase 6: User Story 4 — Email Verification Screen (Priority: P3)

**Goal**: Informational screen shown after sign-up when email confirmation is required. Includes a resend button with email input.

**Independent Test**: Navigate to `/verify-email` → page loads with heading + body text + email input + resend button. Enter an email and tap resend → confirm message appears. Screen renders at 375px without overflow.

- [ ] T020 [US4] Create `src/app/(auth)/verify-email/page.tsx` — `'use client'`; imports `useState`, `createClient` from `@/lib/supabase/client`, `useI18n`, `AuthFormWrapper` from `@/modules/auth`. Local state: `email`, `resendStatus: 'idle' | 'sending' | 'sent' | 'error'`. Render inside `<AuthFormWrapper>`:
  ```tsx
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-2 text-center">
      <h2 className="text-xl font-semibold text-gym-text">{t('verifyEmailTitle')}</h2>
      <p className="text-sm text-gym-muted">{t('verifyEmailBody')}</p>
    </div>
    <div className="flex flex-col gap-3">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder={t('email')} aria-label={t('email')}
        className="h-11 rounded-lg border border-gym-border bg-gym-surface px-3 text-sm focus:border-gym-border-strong focus:outline-none" />
      <button type="button" disabled={resendStatus === 'sending' || !email}
        onClick={handleResend}
        className="h-11 rounded-lg bg-gym-accent font-semibold text-white disabled:opacity-50">
        {resendStatus === 'sending' ? t('resendingEmail') : t('resendEmail')}
      </button>
      {resendStatus === 'sent' && <p role="alert" className="text-sm text-center text-gym-muted">{t('emailResentConfirm')}</p>}
      {resendStatus === 'error' && <p role="alert" className="text-sm text-center text-red-400">{t('authNetworkError')}</p>}
    </div>
    <Link href="/login" className="text-center text-sm text-gym-accent hover:underline">{t('backToSignIn')}</Link>
  </div>
  ```
  `handleResend`: `setResendStatus('sending')` → `await supabase.auth.resend({ type: 'signup', email })` → on success `setResendStatus('sent')` → on error `setResendStatus('error')`.

**Checkpoint**: `/verify-email` renders without crash. Resend flow works. 375px — no overflow.

---

## Phase 7: User Story 5 — Session Expired Screen (Priority: P3)

**Goal**: Static informational screen reachable at `/session-expired` with link back to `/login`.

**Independent Test**: Navigate directly to `/session-expired` while unauthenticated → page loads (not redirected). Page shows session expired message and "Sign in again" link → link navigates to `/login`. Renders at 375px without overflow.

- [ ] T021 [US5] Create `src/app/(auth)/session-expired/page.tsx` — Server Component (no `'use client'`); imports `Link` from `next/link`. No i18n hook needed (Server Component can't use `useI18n` client hook — render hardcoded English OR create a tiny client wrapper). Use a `'use client'` wrapper component for i18n:
  ```tsx
  'use client'
  import { useI18n } from '@/i18n/client'
  import Link from 'next/link'
  export default function SessionExpiredPage() {
    const { t } = useI18n()
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-gym-text">{t('sessionExpiredTitle')}</h1>
            <p className="text-sm text-gym-muted">{t('sessionExpiredBody')}</p>
          </div>
          <Link href="/login"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-gym-accent font-semibold text-white">
            {t('signInAgain')}
          </Link>
        </div>
      </main>
    )
  }
  ```

**Checkpoint**: `/session-expired` accessible without auth, renders correctly, link goes to `/login`.

---

## Phase 8: Polish & DoD Validation

**Purpose**: Build verification and final visual check.

- [ ] T022 Run `npm run build` — verify zero TypeScript errors; fix any type errors before marking done
- [ ] T023 Manual 375px DoD check — verify all acceptance scenarios in `specs/006-auth-completion/quickstart.md` DoD Checklist: (1) `/signup` renders + field errors work + submit redirects; (2) `/forgot-password` always shows success regardless of email; (3) `/reset-password` direct nav shows invalid-link state; (4) `/verify-email` resend flow; (5) `/session-expired` accessible; (6) `/login` has both new links; (7) all screens at 375px without overflow; (8) submit buttons ≥ 44px and disabled during loading; (9) `NEXT_PUBLIC_SITE_URL` documented in local `.env.local`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately; T002 and T003 are parallel
- **Phase 2 (Foundational)**: Depends on Phase 1 — T004 BLOCKS all screen testing
- **Phase 3 (US1)**: T005 and T006 parallel; T007 depends on T005+T006; T008 depends on T007; T009 depends on T008; T010 parallel with T007–T009
- **Phase 4 (US2)**: T011 and T012 parallel; T013 depends on T012; T014 depends on T013; T015 depends on T014; Phase 4 independent of Phase 3 except it uses `AuthFormWrapper` (from T006/T008)
- **Phase 5 (US3)**: T016 parallel; T017 depends on T016; T018 depends on T017; T019 depends on T018; depends on T011 (PKCE callback route must exist for end-to-end reset test)
- **Phase 6 (US4)**: T020 depends on T006/T008 (AuthFormWrapper) — otherwise independent
- **Phase 7 (US5)**: T021 fully independent
- **Phase 8**: Depends on all phases complete

### Parallel Opportunities

```
Phase 1:  T001 → [T002 ‖ T003]
Phase 3:  [T005 ‖ T006] → T007 → T008 → T009
          T010 can run in parallel with T007–T009
Phase 4:  [T011 ‖ T012] → T013 → T014 → T015
Phase 5:  T016 → T017 → T018 → T019
Phase 6 and Phase 7 can run in parallel after T006/T008 are done
```

---

## Implementation Strategy

### MVP (US1 only)
1. Phase 1 (T001–T003)
2. Phase 2 (T004)
3. Phase 3 (T005–T010)
4. T022 build check
5. **VALIDATE**: Sign up flow end-to-end at 375px

### Full delivery order
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8

Each phase is independently testable and adds a complete auth screen.
