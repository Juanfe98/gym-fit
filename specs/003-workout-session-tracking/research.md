# Research: Workout Session Tracking

**Phase**: 0 | **Date**: 2026-05-27 | **Plan**: [plan.md](./plan.md)

All decisions below resolve the technical unknowns identified in the Technical Context.
No NEEDS CLARIFICATION markers remain.

---

## 1. Next.js App Router + Supabase SSR Auth

**Decision**: Use `@supabase/ssr` with Next.js middleware for session refresh on every request.
Browser client for Client Components; server client for Server Components and Server Actions.

**Rationale**: Supabase provides an official Next.js integration guide for App Router. The
`@supabase/ssr` package handles cookie-based session management correctly in both Server
Components (read-only cookies) and middleware (read/write cookies for refresh). This is the
only pattern that avoids auth race conditions in RSC.

**Key pattern**:
```ts
// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}
```

**Alternatives considered**: Using `@supabase/supabase-js` directly — does not handle
cookie refresh in RSC; session expires silently. Rejected.

---

## 2. Dexie.js Integration Pattern for Next.js App Router

**Decision**: Instantiate Dexie as a module-level singleton in `src/lib/offline-db.ts`.
Import only in Client Components (`"use client"` boundary). Use `useLiveQuery` hook for
reactive reads inside React components.

**Rationale**: IndexedDB is browser-only. Importing Dexie in Server Components causes
a build error. The singleton pattern ensures one DB instance per browser tab (Dexie handles
concurrent tab access internally). `useLiveQuery` re-renders the component whenever the
queried data changes — perfect for the set list updating as the user logs sets.

**Key pattern**:
```ts
// src/lib/offline-db.ts
import Dexie, { type EntityTable } from 'dexie'

export interface ActiveSession { /* ... */ }
export interface OfflineSetLog { /* ... */ }

export class GymPlannerDB extends Dexie {
  activeSessions!: EntityTable<ActiveSession, 'id'>
  setLogs!: EntityTable<OfflineSetLog, 'id'>
  offlineQueue!: EntityTable<OfflineQueueItem, 'id'>

  constructor() {
    super('GymPlannerDB')
    this.version(1).stores({
      activeSessions: '++id, userId, status',
      setLogs: '++id, sessionId, sessionExerciseId',
      offlineQueue: '++id, table, operation, createdAt',
    })
  }
}

export const db = typeof window !== 'undefined' ? new GymPlannerDB() : null!
```

**Alternatives considered**: Creating Dexie inside a React context — causes multiple
instances on re-render. Raw IndexedDB API — verbose and error-prone. Neither chosen.

---

## 3. Zustand Store Pattern for Active Session

**Decision**: Use Zustand with the slice pattern. Separate stores for session data, timer
state, and offline queue. Each slice is defined in its own file and combined in a root store
only if needed. Session store writes to Dexie.js in every action that mutates session state.

**Rationale**: The active session has ~50 actions (add exercise, log set, edit set, delete
set, etc.). Keeping them in one flat Zustand store with co-located Dexie writes ensures every
mutation is persisted immediately without additional side effects or hooks.

**Key pattern**:
```ts
// modules/workout-session/stores/workout-session-store.ts
import { create } from 'zustand'
import { db } from '@/lib/offline-db'

interface WorkoutSessionStore {
  session: ActiveSessionDraft | null
  startSession: (userId: string) => Promise<void>
  logSet: (exerciseId: string, set: SetInput) => Promise<void>
  editSet: (setId: string, set: SetInput) => Promise<void>
  deleteSet: (setId: string) => Promise<void>
  finishSession: () => Promise<FinishedSession>
  discardSession: () => Promise<void>
}

export const useWorkoutSessionStore = create<WorkoutSessionStore>((set, get) => ({
  session: null,
  startSession: async (userId) => {
    const session = createNewSession(userId)
    await db.activeSessions.add(session)   // IndexedDB first
    set({ session })                        // Then in-memory
  },
  logSet: async (exerciseId, input) => {
    const setLog = createSetLog(exerciseId, input)
    await db.setLogs.add(setLog)            // IndexedDB first
    set(state => ({ session: appendSet(state.session!, setLog) }))
  },
  // ... other actions follow same pattern
}))
```

**Alternatives considered**: Using React Context + useReducer — fine for simple state, causes
excessive re-renders at the granularity needed (per-set updates). Using TanStack Query mutations
for session state — server state library, not appropriate for in-flight local state. Neither chosen.

---

## 4. Optimistic UI for Set Logging + Supabase Background Sync

**Decision**: Zustand + Dexie provide the optimistic UI (instant, no network dependency).
Supabase mutations are queued via a background sync service triggered by `navigator.onLine`.
TanStack Query is NOT used for the active session write path — only for reads (PR history).

**Rationale**: TanStack Query's optimistic update pattern requires a server round-trip to confirm.
During an active workout this introduces latency and risk of failure UX. The correct pattern:
write to Dexie (instant), update UI from Dexie/Zustand (instant), queue Supabase write (async).

**Sync flow**:
```
User logs set
  → Zustand update (in-memory, instant)
  → Dexie write (IndexedDB, <10ms)
  → Enqueue to offline_queue with UUID idempotency key
  → If online: drain queue immediately
  → If offline: queue persists until online
  
navigator.onLine fires
  → useOfflineSync hook drains offline_queue
  → Each item: Supabase upsert with idempotency key
  → On success: mark as 'synced' in Dexie, remove from queue
  → On failure: increment attempt count; show sync error after 3 failures
```

**Alternatives considered**: Supabase Realtime for bidirectional sync — overkill for single-user
session tracking; adds WebSocket cost. Firebase Firestore offline cache — requires switching BaaS.
Neither chosen.

---

## 5. Personal Record Detection Strategy

**Decision**: Load the user's current PR map (exerciseId → maxWeight) into memory at session start
via a single TanStack Query fetch from `personal_records` table. Compare each logged set weight
against this in-memory map. Detection is O(1) per set. PRs are written to Supabase only when
the session is successfully completed (not during the session).

**Rationale**: Fetching PRs from Supabase on every set log would add ~200ms latency to the most
performance-critical action in the app. Loading the full PR map at session start is inexpensive
(one row per exercise the user has ever done — typically <200 rows) and makes detection instant.
PR writes happen at session completion to honour the spec requirement (FR-036: no PRs from
cancelled sessions).

**Key pattern**:
```ts
// modules/workout-session/hooks/use-pr-detection.ts
export function usePrDetection(session: ActiveSessionDraft) {
  const { data: prMap } = usePrHistory()  // TanStack Query — loaded once at session start
  
  return useCallback((exerciseId: string, weight: number): boolean => {
    if (!prMap) return false
    const currentPr = prMap[exerciseId]
    return currentPr !== undefined && weight > currentPr
  }, [prMap])
}
```

**Alternatives considered**: Computing PRs from full session history on every set — too slow,
O(n) query. Writing PRs to Supabase mid-session — violates FR-036 (cancelled sessions would
leave orphan PRs). Neither chosen.

---

## 6. Rest Timer + Web Notifications

**Decision**: Implement rest timer as a `setInterval` in a Zustand store action.
Use the Web Notifications API (`Notification.requestPermission()`) for backgrounded alerts.
Timer state survives page re-renders via Zustand; app-close survival is handled by recording
the timer start timestamp and recomputing remaining time on mount.

**Rationale**: Service Worker-based timers are more reliable when the app is backgrounded but
add significant complexity. For MVP, `setInterval` + the Page Visibility API to detect
backgrounding is sufficient. If the user backgrounds the app, the notification fires via
`Notification` API. The timer start timestamp in Zustand allows re-computing remaining time
when the user returns to the tab.

**Key pattern**:
```ts
// On timer start: store { startedAt, durationSeconds } in Zustand
// On mount/visibility change: compute remaining = duration - (now - startedAt)
// On expiry: new Notification('Rest complete', { body: 'Time to lift!' })
```

**Alternatives considered**: Web Push Notifications (requires service worker + push server) —
too complex for MVP; requires server-side push subscription management. `setInterval` + Dexie
for persistence — only needed if the app closes entirely; `sessionStorage` suffices for tab
refresh survival. Deferred for post-MVP if user research shows timer reliability is a complaint.

---

## 7. Unit Conversion (kg ↔ lbs)

**Decision**: Store all weights in the unit the user entered. Do NOT convert to a canonical
unit at storage time. Display conversion is applied at render time using the user's current
unit preference from their profile. Store the unit alongside each set log.

**Rationale**: Converting to canonical units at storage time (e.g., always kg) means that
if a user changes their unit preference, historical data re-renders correctly. However, it
introduces floating-point rounding errors on round-trip (lbs → kg → lbs). Storing the entered
unit and converting for display is simpler, lossless, and matches how most gym apps work.

**Implementation**: `SetLog.weightUnit: 'kg' | 'lbs'` field. `unit-conversion.ts` exports
`toDisplayUnit(weight, storedUnit, displayUnit)`.

---

## 8. Session Crash Recovery

**Decision**: On app mount, query Dexie for any session with `status: 'in_progress'`. If found,
offer the user to resume it or discard it. This is handled in the `(app)/workout/page.tsx`
Server Component's client shell.

**Rationale**: Force-quit or browser crash leaves the Dexie session in `in_progress` state.
On next launch, the session is recoverable. The user must make an explicit choice (resume/discard)
rather than silently losing the session or silently auto-resuming (which could confuse users).

---

## 9. Supabase RLS Policy Pattern

**Decision**: Every user table uses a standard RLS policy:
- `SELECT`: `auth.uid() = user_id`
- `INSERT`: `auth.uid() = user_id`
- `UPDATE`: `auth.uid() = user_id`
- `DELETE`: `auth.uid() = user_id`

The Supabase anon key is used in the browser client. RLS is the only data isolation boundary.
No application-layer filtering is relied upon for security.

**Rationale**: This is the Supabase recommended pattern. RLS at the DB layer means a buggy
query that omits a `WHERE user_id = ?` filter cannot leak another user's data. It is the
strongest isolation guarantee available without a custom backend.

---

## 10. Idempotency for Sync

**Decision**: Each `SetLog` and `WorkoutSession` gets a client-generated `UUID v4` assigned
at creation time (in Zustand/Dexie). This UUID is used as the Supabase row `id`. Supabase
upserts use `ON CONFLICT (id) DO UPDATE` semantics — re-syncing the same record is safe.

**Rationale**: Without idempotency keys, a partial sync followed by a retry creates duplicate
rows. Using the client-generated UUID as the primary key ensures upserts are idempotent.
`crypto.randomUUID()` is available in all modern browsers and in Next.js Server Actions.
