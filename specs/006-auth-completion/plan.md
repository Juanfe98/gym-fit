# Implementation Plan: Auth Completion

**Branch**: `006-auth-completion` | **Date**: 2026-05-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/006-auth-completion/spec.md`

---

## Summary

Extend the existing email/password authentication to include sign-up, forgot-password, reset-password, verify-email, and session-expired screens. All new screens live in the `(auth)` route group with no app shell. Forms use React Hook Form + Zod. Password reset uses the Supabase PKCE flow via a new `/auth/callback` Route Handler. Middleware is updated to allow unauthenticated access to all new auth routes.

---

## Technical Context

**Language/Version**: TypeScript 5, Next.js 15 App Router
**Primary Dependencies**: `@supabase/ssr`, `react-hook-form ^7`, `zod ^4`, `@hookform/resolvers ^5`
**Storage**: Supabase Auth only — no new database tables
**Testing**: Manual 375px viewport check + `npm run build` (constitution DoD)
**Target Platform**: Mobile-first web, 375px primary
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Form validation client-side before any network call; no skeleton needed for auth screens
**Constraints**: No new npm dependencies; no custom backend; RLS not applicable (no user tables in this spec)
**Scale/Scope**: 5 new screens + 1 route handler + 3 file modifications

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — User-First Architecture | ✅ PASS | Supabase Auth only; no custom server; no new tables |
| II — Mobile-First UI | ✅ PASS | 44px tap targets required per FR-019; 375px check in DoD |
| III — Exercise Content Integrity | ✅ N/A | No exercise data touched |
| IV — External Media Isolation | ✅ N/A | No media fetching |
| V — Minimal, Reviewable Changes | ✅ PASS | No new deps; login page change is additive only |
| VI — Offline-First Session Tracking | ✅ N/A | Auth screens have no active workout state |

**Post-Design Re-check**: No violations introduced. Auth callback route (`/auth/callback`) is a standard Next.js Route Handler — no custom server. Middleware allowlist expansion is additive.

---

## Project Structure

### Documentation (this feature)

```text
specs/006-auth-completion/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── auth-module.md   ← Phase 1 output
└── tasks.md             ← /speckit-tasks output (not yet created)
```

### Source Code

```text
src/
  app/
    (auth)/
      login/page.tsx            ← MODIFY: add Sign Up + Forgot Password links only
      signup/page.tsx           ← NEW
      forgot-password/page.tsx  ← NEW
      reset-password/page.tsx   ← NEW
      verify-email/page.tsx     ← NEW
      session-expired/page.tsx  ← NEW
    auth/
      callback/route.ts         ← NEW (PKCE exchange Route Handler)
  modules/
    auth/
      components/
        AuthFormWrapper.tsx     ← NEW
        SignUpForm.tsx          ← NEW
        ForgotPasswordForm.tsx  ← NEW
        ResetPasswordForm.tsx   ← NEW
      validation/
        sign-up.schema.ts       ← NEW
        forgot-password.schema.ts ← NEW
        reset-password.schema.ts  ← NEW
      types/
        index.ts                ← NEW
      index.ts                  ← NEW (barrel)
  i18n/
    ui.ts                       ← MODIFY: add auth i18n keys (en + es)
  lib/
    supabase/
      middleware.ts             ← MODIFY: expand unauthenticated allowlist
```

**Structure Decision**: Single Next.js project, feature module pattern matching existing `workout-session` and `workout-history` modules. Auth pages are thin wrappers; logic lives in `src/modules/auth/`.

---

## Complexity Tracking

No constitution violations — no complexity justification required.
