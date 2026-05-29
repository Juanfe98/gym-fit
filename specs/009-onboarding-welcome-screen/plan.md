# Implementation Plan: Onboarding Welcome Screen

**Branch**: `009-onboarding-welcome-screen` | **Date**: 2026-05-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/009-onboarding-welcome-screen/spec.md`

## Summary

Build a premium web onboarding welcome screen at `/onboarding/welcome`. The screen introduces the value of setup, lists three benefits, shows a responsive weekly workout/progress preview card, and provides two actions: Start setup routes to `/onboarding/goal`; Skip for now persists the user's onboarding status as skipped and redirects to `/dashboard`. Implementation uses the existing Next.js App Router, Tailwind token system, Supabase auth metadata, and no new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.8, Next.js 15 App Router, React 19  
**Primary Dependencies**: `@supabase/ssr`, `@supabase/supabase-js`, Tailwind CSS v4, `lucide-react`  
**Storage**: Supabase Auth user metadata for `onboarding_status: 'skipped'`; no new database tables  
**Testing**: Manual responsive verification at 320px, 375px, and desktop widths + `npm run build`  
**Target Platform**: Mobile-first responsive web deployed through Next.js/Vercel  
**Project Type**: Web application  
**Performance Goals**: First meaningful render should be immediate for a static mostly-presentational screen; skip action should provide visible pending state and complete without duplicate navigation  
**Constraints**: No new npm dependencies; use existing design tokens; 44px minimum tap targets; no custom backend; no Supabase schema migration  
**Scale/Scope**: 1 route page, 3 onboarding components, small auth metadata update flow, illustrative preview content only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — User-First Architecture | ✅ PASS | Uses Next.js App Router and Supabase auth metadata; no custom backend or API server added |
| II — Mobile-First UI | ✅ PASS | Mobile stacked layout planned first; 320px/375px checks; CTAs use >=44px targets |
| III — Exercise Content Integrity | ✅ N/A | Does not modify the exercise catalog |
| IV — External Media Isolation | ✅ N/A | No external media provider usage |
| V — Minimal, Reviewable Changes | ✅ PASS | Adds only the requested route/components plus small metadata update; no dependencies |
| VI — Offline-First Session Tracking | ✅ N/A | Does not touch active workout session tracking |

**Post-Design Re-check**: PASS. Design artifacts preserve the same scope: no new tables, no custom backend, no new dependencies, mobile-first responsive UI, and no active-session/offline changes.

## Project Structure

### Documentation (this feature)

```text
specs/009-onboarding-welcome-screen/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── onboarding-welcome-ui.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
  app/
    onboarding/
      welcome/
        page.tsx                      # NEW: server route for /onboarding/welcome
  components/
    onboarding/
      WelcomeHero.tsx                 # NEW: headline, supporting copy, benefit slot
      WelcomeBenefitList.tsx          # NEW: benefit list + typed benefit item data
      WelcomeActions.tsx              # NEW: client CTA component; skip persistence + redirect
  i18n/
    ui.ts                             # MODIFY if implementation keeps all user-facing copy in i18n
```

**Structure Decision**: Use the explicit route/component paths requested by the feature, mapped under the existing `src/` source root. The page remains a Server Component for auth gating and layout composition; `WelcomeActions` is the only Client Component because it needs pending state, Supabase browser client access, and client-side redirects. The preview card can be composed inside `page.tsx` or `WelcomeHero.tsx` without creating extra files unless task generation chooses to split it for readability.

## Complexity Tracking

No constitution violations — no complexity justification required.
