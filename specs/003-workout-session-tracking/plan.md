# Implementation Plan: Workout Session Tracking

**Branch**: `003-workout-session-tracking` | **Date**: 2026-05-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/003-workout-session-tracking/spec.md`

---

## Summary

Build the core workout session tracking module for the Gym Planner web app. Users start a
session, add exercises from the library, log sets (weight + reps), use a rest timer, and finish
with a summary. All session data is persisted to IndexedDB (Dexie.js) immediately on every
change — Supabase sync is background and non-blocking. Personal records are detected mid-session
against the user's history stored in Supabase. The module is a Client Component subtree within
the Next.js App Router `(app)` route group, auth-gated via middleware.

---

## Technical Context

**Language/Version**: TypeScript 5.x — strict mode (locked by constitution)  
**Framework**: Next.js 15+ App Router — dynamic routing, middleware auth guard, Server Actions  
**Styling**: Tailwind CSS v4 — `@theme` tokens in `src/styles/global.css`, 375px-first  
**Auth**: Supabase Auth — session verified in `src/lib/supabase/middleware.ts`  
**Database**: Supabase (Postgres) — RLS on all user tables; `@supabase/ssr` for Next.js  
**Offline Storage**: Dexie.js v4 (IndexedDB) — active session only; not a full offline DB  
**Server State**: TanStack Query v5 — exercise library + PR history reads  
**Client State**: Zustand v5 — active session draft, timer state, offline queue  
**Forms**: React Hook Form v7 + Zod v3 — set input validation  
**Notifications**: Web Notifications API + `navigator.serviceWorker` — rest timer alerts  
**Testing**: `npm run build` (TypeScript) + manual at 375px — per Definition of Done  
**Target Platform**: Mobile-first PWA (375px primary), Vercel deployment  
**Performance Goals**: Log a set in <5s (SC-001); first set within 30s of start (SC-002)  
**Constraints**: Offline-capable, no data loss on disconnect, 44px min tap targets (Principle II)  
**Scale/Scope**: Per-user sessions; up to 20 exercises × 10 sets per session (SC-005)

---

## Constitution Check

*GATE: v2.0.0 — All principles checked before Phase 0.*

| Principle | Requirement | Status |
|---|---|---|
| I. User-First Architecture | Next.js App Router + Supabase, no custom server | ✅ Pass |
| I. User-First Architecture | All user tables have RLS policies | ✅ Pass — defined in data-model.md |
| I. User-First Architecture | BaaS-only backend (no Express/Fastify) | ✅ Pass — Server Actions only |
| II. Mobile-First UI | 375px design-first, 44px tap targets | ✅ Pass — set logger row design accounts for this |
| II. Mobile-First UI | No hover-only interactions | ✅ Pass — all actions are tap/click |
| III. Content Integrity | Exercise catalog in `src/data/`, not Supabase | ✅ Pass — session tracking only references exercises |
| IV. External Media Isolation | ExerciseDB not used in session tracking | ✅ Pass — exercise GIFs shown from cached data only |
| V. Minimal Changes | No scope outside session tracking | ✅ Pass — auth, plans, progress are separate modules |
| VI. Offline-First Session Tracking | IndexedDB primary save path | ✅ Pass — Dexie.js write before Supabase mutation |
| VI. Offline-First Session Tracking | No blocking spinner during active session writes | ✅ Pass — optimistic UI, Supabase is background |

**Result: ✅ GATE PASSED — Proceed to Phase 0**

---

## Project Structure

### Documentation (this feature)

```text
specs/003-workout-session-tracking/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── session-store.ts      # Zustand store interface
│   ├── offline-db.ts         # Dexie schema types
│   ├── supabase-types.ts     # DB table row types
│   └── server-actions.ts     # Server Action signatures
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (this feature's files within the Next.js project)

```text
src/
  app/
    (app)/
      workout/
        page.tsx                  ← Active workout screen (Client Component root)
        layout.tsx                ← Workout layout (back nav guard)
        summary/
          page.tsx                ← Session summary screen
  modules/
    workout-session/
      components/
        ActiveWorkoutScreen.tsx   ← Main session UI shell
        ExerciseList.tsx          ← Ordered list of session exercises
        ExerciseRow.tsx           ← Single exercise card with set list
        SetLogRow.tsx             ← Single set row (weight + reps + type)
        SetLogForm.tsx            ← Inline form for logging/editing a set
        RestTimer.tsx             ← Countdown timer overlay/bottom sheet
        SessionTimer.tsx          ← Elapsed time display in header
        ExercisePicker.tsx        ← Search modal for adding exercises
        SessionSummary.tsx        ← Post-workout summary card
        PrBadge.tsx               ← Personal record indicator chip
        SyncStatusBar.tsx         ← Offline/syncing/synced indicator
        CancelSessionDialog.tsx   ← Confirm discard dialog
      hooks/
        use-workout-session.ts    ← Zustand store selector hooks
        use-session-timer.ts      ← Elapsed timer (requestAnimationFrame)
        use-rest-timer.ts         ← Rest countdown + notification trigger
        use-pr-detection.ts       ← Compare set weight against PR history
        use-offline-sync.ts       ← Online event listener + drain queue
        use-exercise-search.ts    ← TanStack Query for exercise library
        use-pr-history.ts         ← TanStack Query for user PR records
      services/
        session-supabase.ts       ← Supabase upserts for completed sessions
        pr-supabase.ts            ← Read + write personal_records table
      stores/
        workout-session-store.ts  ← Zustand slice (session draft)
        timer-store.ts            ← Zustand slice (rest timer + session timer)
        offline-queue-store.ts    ← Zustand slice (pending sync ops)
      types/
        index.ts                  ← Module-specific TypeScript types
      validation/
        set-log.schema.ts         ← Zod schema for set input validation
      utils/
        volume.ts                 ← Total volume calculation
        unit-conversion.ts        ← kg ↔ lbs conversion
        idempotency.ts            ← Client-side UUID generation for sync keys
      index.ts                    ← Public exports
  lib/
    offline-db.ts                 ← Dexie.js schema definition + instance
    supabase/
      client.ts                   ← Browser Supabase client
      server.ts                   ← Server Supabase client (RSC / Server Actions)
      middleware.ts               ← Session refresh + auth redirect
```

---

## Complexity Tracking

> No constitution violations requiring justification.
