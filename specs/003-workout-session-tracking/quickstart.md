# Quickstart: Workout Session Tracking Module

**Date**: 2026-05-27 | **Plan**: [plan.md](./plan.md)

This guide covers what must exist before implementing this module and
the order in which files should be created.

---

## Prerequisites

### 1. Project Must Be Scaffolded as Next.js 15+

The current repo uses Astro. Before this module can be implemented,
the project must be re-scaffolded as Next.js. This is a separate task
tracked in the `003-workout-session-tracking` tasks file.

Required scaffold:
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

### 2. Required Dependencies

These must be approved and installed per constitution Principle V:

```bash
# Core
npm install @supabase/ssr @supabase/supabase-js

# Offline storage
npm install dexie dexie-react-hooks

# State management
npm install zustand @tanstack/react-query

# Forms
npm install react-hook-form zod @hookform/resolvers

# UI utilities (drag-and-drop for exercise reorder)
npm install @dnd-kit/core @dnd-kit/sortable
```

### 3. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Supabase Setup

Run migrations to create tables (from data-model.md):

```bash
supabase init                             # first time only
supabase start                            # local dev Docker
supabase migration new workout_sessions   # create migration file
# paste SQL from data-model.md section 1
supabase db push                          # apply to local
```

### 5. Auth Guard (prerequisite for this module)

`src/middleware.ts` must exist and redirect unauthenticated users:

```ts
// src/middleware.ts
import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|signup).*)'],
}
```

---

## Implementation Order

Build in this order. Each step is independently testable.

### Step 1 — Offline DB (`src/lib/offline-db.ts`)

No dependencies. Test by importing in a Client Component and verifying
Dexie opens without error in the browser.

### Step 2 — Zustand Stores

Build `workout-session-store.ts` first — this is where all session
mutations live. Timer and offline queue stores depend on it for state context.

Test: write a unit test that calls `startSession`, `logSet`, `finishSession`
and verifies Dexie records are created correctly.

### Step 3 — Supabase Service Layer

`session-supabase.ts` and `pr-supabase.ts`. These call Supabase from
Server Actions. Test with the local Supabase instance (`supabase start`).

### Step 4 — TanStack Query Hooks

`use-exercise-search.ts` and `use-pr-history.ts`. These read from Supabase
via the browser client. Test by verifying the hooks return data in a
simple test component.

### Step 5 — Core UI Components (bottom-up)

Build in this order:
1. `SetLogRow.tsx` + `SetLogForm.tsx` — smallest unit
2. `ExerciseRow.tsx` — wraps set rows
3. `ExerciseList.tsx` — wraps exercise rows, handles reorder
4. `SessionTimer.tsx` + `RestTimer.tsx` — independent timers
5. `ExercisePicker.tsx` — search modal (uses `use-exercise-search`)
6. `ActiveWorkoutScreen.tsx` — top-level assembly
7. `SessionSummary.tsx` — post-finish screen

### Step 6 — Pages

```
src/app/(app)/workout/page.tsx         → mounts ActiveWorkoutScreen
src/app/(app)/workout/summary/page.tsx → mounts SessionSummary
```

### Step 7 — Offline Sync

`use-offline-sync.ts` — listens to `navigator.onLine`, drains queue.
Test by logging sets with DevTools offline, re-enabling, verifying sync.

### Step 8 — PR Detection

`use-pr-detection.ts` — compare set weights against PR map.
Test by logging a set above previous max, verifying `isPr: true` on the set.

---

## Key File Locations

| File | Purpose |
|---|---|
| `src/lib/offline-db.ts` | Dexie schema + singleton instance |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client (RSC + Server Actions) |
| `src/lib/supabase/middleware.ts` | Auth session refresh |
| `src/modules/workout-session/stores/workout-session-store.ts` | Zustand session store |
| `src/modules/workout-session/stores/timer-store.ts` | Zustand timer store |
| `src/modules/workout-session/stores/offline-queue-store.ts` | Zustand sync queue |
| `src/modules/workout-session/services/session-supabase.ts` | Supabase upserts |
| `src/app/(app)/workout/page.tsx` | Active workout screen route |
| `src/app/(app)/workout/summary/page.tsx` | Session summary route |

---

## Definition of Done (this module)

Per constitution:

1. `npm run build` passes with zero TypeScript errors
2. Active workout screen verified at 375px viewport
3. All four Supabase tables have RLS policies (verified in Supabase Studio)
4. Offline test: log sets with network disabled → re-enable → verify sync
5. No new dependency added without prior approval
6. No TODO or placeholder content committed
