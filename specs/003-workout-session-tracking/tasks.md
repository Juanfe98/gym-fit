# Tasks: Workout Session Tracking

**Input**: Design documents from `specs/003-workout-session-tracking/`  
**Branch**: `003-workout-session-tracking`  
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (no dependency on an incomplete parallel task)
- **[Story]**: User story this task serves (US1–US6)
- No tests generated — not requested in spec

---

## Phase 1: Setup

**Purpose**: Replace Astro scaffold with Next.js 15+, install locked dependencies, configure tooling.

> ⚠️ Current repo is Astro. These tasks create the Next.js project foundation before any feature work.

- [ ] T001 Scaffold Next.js 15+ project with `--typescript --tailwind --app --src-dir --import-alias "@/*"`, preserving `src/data/` and `src/services/exercisedb.ts` from the existing Astro project
- [ ] T002 Install locked dependencies: `@supabase/ssr @supabase/supabase-js dexie dexie-react-hooks zustand @tanstack/react-query @hookform/resolvers react-hook-form zod @dnd-kit/core @dnd-kit/sortable`
- [ ] T003 [P] Configure TypeScript strict mode in `tsconfig.json` (strict: true, paths alias `@/*`)
- [ ] T004 [P] Configure Tailwind CSS v4 in `src/styles/global.css` with `@theme` tokens (colors, spacing, typography) matching mobile-first design system
- [ ] T005 [P] Create `.env.local` template and `.env.example` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Checkpoint**: `npm run build` passes on empty Next.js project

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infrastructure that EVERY user story depends on. No US work begins until this phase is complete.

> ⚠️ CRITICAL: Supabase clients, Dexie schema, Zustand stores, and auth middleware are shared foundations.

### Supabase Infrastructure

- [ ] T006 Create `src/lib/supabase/client.ts` — browser Supabase client using `createBrowserClient` from `@supabase/ssr`
- [ ] T007 Create `src/lib/supabase/server.ts` — server Supabase client using `createServerClient` from `@supabase/ssr` for use in Server Components and Server Actions
- [ ] T008 Create `src/lib/supabase/middleware.ts` — `updateSession()` function that refreshes auth cookie on every request and redirects unauthenticated users to `/login`
- [ ] T009 Create `src/middleware.ts` — Next.js middleware entry point calling `updateSession`, matching all `(app)` routes

### Database

- [ ] T010 Create Supabase migration `supabase/migrations/001_workout_sessions.sql` — creates `workout_sessions`, `session_exercises`, `set_logs`, `personal_records` tables with RLS policies exactly as defined in `data-model.md` section 1
- [ ] T011 Apply migration to local Supabase instance with `supabase db push` and verify all 4 tables exist with RLS enabled in Supabase Studio

### Offline DB

- [ ] T012 Create `src/lib/offline-db.ts` — Dexie `GymPlannerDB` class with schema v1 exactly as defined in `data-model.md` section 2; export singleton `db` guarded by `typeof window !== 'undefined'`

### Domain Types

- [ ] T013 [P] Create `src/modules/workout-session/types/index.ts` — all TypeScript domain types from `data-model.md` section 3: `SetType`, `WeightUnit`, `SessionStatus`, `SyncStatus`, `SetInput`, `SetLogDraft`, `SessionExerciseDraft`, `ActiveSessionDraft`, `FinishedSession`, `PrMap`
- [ ] T014 [P] Create `src/modules/workout-session/validation/set-log.schema.ts` — Zod schema validating `SetInput` (weight > 0, reps integer > 0, setType enum, rpe 1–10 optional)

### Utilities

- [ ] T015 [P] Create `src/modules/workout-session/utils/volume.ts` — `calculateTotalVolume()` function (excludes warmup sets, converts units, matches spec assumption)
- [ ] T016 [P] Create `src/modules/workout-session/utils/unit-conversion.ts` — `toDisplayUnit(weight, storedUnit, displayUnit)` for kg ↔ lbs conversion
- [ ] T017 [P] Create `src/modules/workout-session/utils/idempotency.ts` — `generateId()` wrapper around `crypto.randomUUID()` for client-side UUID generation

### Zustand Stores

- [ ] T018 Create `src/modules/workout-session/stores/workout-session-store.ts` — Zustand store implementing full `WorkoutSessionStore` interface from `contracts/session-store.ts`; every mutating action writes to Dexie before updating in-memory state; all session and exercise IDs are `generateId()` UUIDs
- [ ] T019 Create `src/modules/workout-session/stores/timer-store.ts` — Zustand store implementing `TimerStore` interface: elapsed session timer (`setInterval` at 1s) and rest timer state with `startedAt` timestamp for crash recovery
- [ ] T020 Create `src/modules/workout-session/stores/offline-queue-store.ts` — Zustand store implementing `OfflineQueueStore` interface; wraps `drainQueue` (stubbed — implemented in US2)

### Next.js Route Structure

- [ ] T021 Create `src/app/(auth)/login/page.tsx` — minimal login page stub (email + password form, redirects to `/` on success); required for middleware redirect target
- [ ] T022 Create `src/app/(app)/layout.tsx` — authenticated layout shell with bottom navigation placeholder and TanStack Query provider wrapping children

**Checkpoint**: `npm run build` passes; `supabase start` shows 4 tables with RLS; Dexie opens without error in browser console

---

## Phase 3: User Story 1 — Log a Free Workout Session (Priority: P1) 🎯 MVP

**Goal**: User starts a session, adds exercises, logs sets with weight/reps, finishes, sees summary.

**Independent Test**: Start session → add 3 exercises → log 3 sets each → finish → verify summary shows correct duration, volume, exercise count. No plan or history required.

### Exercise Search Hook

- [ ] T023 Create `src/modules/workout-session/hooks/use-exercise-search.ts` — TanStack Query hook that reads exercises from `src/data/exercises/catalog.ts` (static catalog); filters by name/muscle/equipment; returns paginated results; no Supabase call needed for base catalog

### Active Workout Screen

- [ ] T024 Create `src/modules/workout-session/components/SessionTimer.tsx` — displays elapsed session time (HH:MM:SS) reading from `timer-store`; updates every second; 44px tap target for pause/resume
- [ ] T025 [P] [US1] Create `src/modules/workout-session/components/SetLogForm.tsx` — inline form with weight input, reps input, set type selector (Normal/Warm-up/Drop Set), optional notes; uses Zod schema from T014 for validation; shows field-level errors; submits by tapping "Add Set"; minimum 44px input height
- [ ] T026 [P] [US1] Create `src/modules/workout-session/components/SyncStatusBar.tsx` — thin indicator bar showing sync status ('synced' = hidden, 'pending_sync' = amber dot + "Saving…", 'sync_failed' = red + "Sync failed"); reads from `offline-queue-store`
- [ ] T027 [US1] Create `src/modules/workout-session/components/SetLogRow.tsx` — displays a single logged set (set number, weight + unit, reps, set type badge); includes edit and delete actions (swipe or button menu); calls `editSet` / `deleteSet` on store; 44px tap target
- [ ] T028 [US1] Create `src/modules/workout-session/components/ExercisePicker.tsx` — full-screen search modal; uses `use-exercise-search` hook; search input with debounce; muscle group filter chips; exercise list with tap-to-select; closes modal and calls `addExercise` on store
- [ ] T029 [US1] Create `src/modules/workout-session/components/ExerciseRow.tsx` — card for one session exercise; shows exercise name, set list (using `SetLogRow`), add-set button (opens `SetLogForm`), exercise notes input, reorder handle, replace/remove menu; reads from session store
- [ ] T030 [US1] Create `src/modules/workout-session/components/ExerciseList.tsx` — ordered list of `ExerciseRow` components; implements drag-and-drop reorder using `@dnd-kit/sortable`; calls `reorderExercises` on store on drop
- [ ] T031 [US1] Create `src/modules/workout-session/components/ActiveWorkoutScreen.tsx` — top-level session UI shell; header with `SessionTimer` and finish/cancel buttons; `SyncStatusBar`; `ExerciseList`; floating "Add Exercise" button that opens `ExercisePicker`; reads active session from store; empty state when no exercises added yet
- [ ] T032 [US1] Create `src/app/(app)/workout/page.tsx` — Client Component; on mount checks Dexie for in-progress session (crash recovery — offers resume or discard dialog if found); otherwise shows "Start Workout" button which calls `startSession` and renders `ActiveWorkoutScreen`

### Session Summary

- [ ] T033 [US1] Create `src/modules/workout-session/services/session-supabase.ts` — `syncCompletedSession(payload)` Server Action implementing contract in `contracts/server-actions.ts`; upserts `workout_sessions`, `session_exercises`, `set_logs`, and `personal_records` rows in a single Supabase transaction; uses server Supabase client
- [ ] T034 [US1] Create `src/modules/workout-session/components/SessionSummary.tsx` — displays finished session data: duration, total volume (using `calculateTotalVolume`), exercise count, per-exercise set counts, PR count; session notes textarea; "Save & Done" button that calls `syncCompletedSession` then navigates to history
- [ ] T035 [US1] Create `src/app/(app)/workout/summary/page.tsx` — renders `SessionSummary` with finished session data passed via router state or Dexie lookup; redirects to `/workout` if no finished session found

**Checkpoint**: Full session loop works end-to-end. Session appears in Supabase `workout_sessions` table after "Save & Done".

---

## Phase 4: User Story 2 — Log Sets While Offline (Priority: P1)

**Goal**: Full session tracking works with no internet; data auto-syncs on reconnect.

**Independent Test**: DevTools → offline; start session, log 3 exercises; DevTools → online; verify all sets appear in `set_logs` table in Supabase.

- [ ] T036 [US2] Create `src/modules/workout-session/hooks/use-offline-sync.ts` — listens to `window` `online`/`offline` events; calls `offline-queue-store.setOnline()` on change; on `online`, calls `drainQueue()`; on mount, sets initial `isOnline` from `navigator.onLine`
- [ ] T037 [US2] Implement `drainQueue()` in `src/modules/workout-session/stores/offline-queue-store.ts` — reads all `OfflineQueueItem` rows from Dexie with `syncStatus !== 'synced'`; calls `upsertSetLog` or `deleteSetLog` Server Actions per item (from `contracts/server-actions.ts`); uses idempotency key (UUID) per item; marks as `synced` on success; increments `attempts` on failure; sets `sync_failed` after 3 attempts
- [ ] T038 [US2] Implement `upsertSetLog(setLog)` Server Action in `src/modules/workout-session/services/session-supabase.ts` — upserts a single `set_logs` row using server Supabase client with `ON CONFLICT (id) DO UPDATE`
- [ ] T039 [US2] Implement `deleteSetLog(setLogId)` Server Action in `src/modules/workout-session/services/session-supabase.ts` — deletes row from `set_logs` by id using server Supabase client
- [ ] T040 [US2] Mount `use-offline-sync` in `ActiveWorkoutScreen.tsx` (T031) — add hook call at top of component; no UI change required; `SyncStatusBar` (T026) already reads `offline-queue-store` state
- [ ] T041 [US2] Enqueue Supabase writes from `workout-session-store.ts` — in `logSet`, `editSet`, `deleteSet` actions, after Dexie write, add `OfflineQueueItem` to Dexie `offlineQueue` table; increment `pendingCount` in `offline-queue-store`

**Checkpoint**: Session logged offline shows SyncStatusBar "Saving…". After reconnect, data appears in Supabase. Re-syncing same session is idempotent.

---

## Phase 5: User Story 3 — Rest Timer Between Sets (Priority: P2)

**Goal**: After logging a set, a configurable countdown starts; user can skip or wait for a notification.

**Independent Test**: Log a set → timer starts at 90s → skip → no disruption. Log another set → wait 90s → receive notification (in-app + browser notification if permitted).

- [ ] T042 [US3] Implement `startRestTimer` and `skipRestTimer` in `src/modules/workout-session/stores/timer-store.ts` — `startRestTimer(durationSeconds)` stores `{ durationSeconds, startedAt: Date.now() }` in state; `skipRestTimer` clears timer state
- [ ] T043 [US3] Create `src/modules/workout-session/hooks/use-rest-timer.ts` — derives remaining seconds from `startedAt + duration - Date.now()` recomputed on visibility change and app focus; calls `Notification` API when countdown reaches 0 (requests permission on first use); calls `skipRestTimer` after firing notification
- [ ] T044 [US3] Create `src/modules/workout-session/components/RestTimer.tsx` — bottom sheet or overlay showing countdown circle, remaining seconds, "Skip Rest" button; mounts when `restTimer !== null`; uses `use-rest-timer` hook; 44px "Skip" tap target
- [ ] T045 [US3] Wire rest timer into `ExerciseRow.tsx` (T029) — after `logSet` resolves, call `startRestTimer` with the user's configured rest duration (read from user profile; fallback to 90s); mount `RestTimer` component in `ActiveWorkoutScreen`

**Checkpoint**: Log a set → RestTimer appears with 90s countdown → skip works → notification fires at 0 when backgrounded.

---

## Phase 6: User Story 4 — Personal Record Detection (Priority: P2)

**Goal**: Logging a set that beats a previous best shows a PR badge and celebration; PRs are saved on session completion.

**Independent Test**: Log a session with bench press 100kg. In a new session, log bench press 105kg → PR badge appears on that set. Cancel the session → no PR persisted. In a new session log 105kg and finish → PR appears in `personal_records` table.

- [ ] T046 [US4] Create `src/modules/workout-session/hooks/use-pr-history.ts` — TanStack Query hook that fetches all `personal_records` rows for the current user from Supabase; returns a `PrMap` keyed by `exerciseId`; fetched once when session starts; stale time: 5 minutes
- [ ] T047 [US4] Create `src/modules/workout-session/hooks/use-pr-detection.ts` — `isPr(exerciseId, weight, weightUnit)` function derived from `use-pr-history` PR map; returns `true` if weight (normalized to kg) exceeds current max; returns `false` for exercises with no history (first-ever set is not a PR)
- [ ] T048 [P] [US4] Create `src/modules/workout-session/components/PrBadge.tsx` — small "PR 🏆" chip rendered inline on a `SetLogRow` when `isPr` is true; also renders a brief celebration toast message (1 set visible toast, auto-dismiss 3s)
- [ ] T049 [US4] Wire PR detection into `workout-session-store.ts` `logSet` action — after creating `SetLogDraft`, call `isPr()` (hook result passed as parameter or via store context) and set `isPr` field on `SetLogDraft`; mark in Dexie `set_logs` record accordingly
- [ ] T050 [US4] Persist PRs on session completion — in `syncCompletedSession` Server Action (T033), upsert `personal_records` rows for each set where `is_pr = true`; use `ON CONFLICT (user_id, exercise_id) DO UPDATE` with new `max_weight` and `achieved_at` only if new weight exceeds stored value
- [ ] T051 [US4] Display PRs in `SessionSummary.tsx` (T034) — count `isPr` sets in finished session; show "X Personal Records" summary line; list exercise names that hit PRs

**Checkpoint**: PR badge appears mid-session. PRs from cancelled sessions are NOT in `personal_records`. Finishing saves PRs correctly.

---

## Phase 7: User Story 5 — Replace or Remove an Exercise Mid-Session (Priority: P2)

**Goal**: User can swap or remove an exercise without losing other exercises' sets; requires confirmation.

**Independent Test**: Add exercise A (2 sets) + exercise B (3 sets). Replace exercise A → confirm dialog → new exercise A' with 0 sets. Exercise B still has 3 sets. Remove exercise A' → confirm → session has only exercise B.

- [ ] T052 [US5] Create `src/modules/workout-session/components/CancelSessionDialog.tsx` — reusable confirmation dialog component accepting `title`, `message`, `confirmLabel`, `onConfirm`, `onCancel` props; used for replace, remove, and cancel flows; 44px buttons; "Destructive" confirm button style
- [ ] T053 [US5] Implement `replaceExercise(sessionExerciseId, newExercise)` in `workout-session-store.ts` — removes old exercise and all its sets from Dexie and in-memory state; adds new exercise with empty set list; sets `wasReplaced: true` and `originalExerciseId`
- [ ] T054 [US5] Implement `removeExercise(sessionExerciseId)` in `workout-session-store.ts` — removes exercise and all its sets from Dexie and in-memory state; enqueues delete operations in offline queue for any already-synced sets
- [ ] T055 [US5] Wire replace/remove into `ExerciseRow.tsx` (T029) — "Replace" action opens `ExercisePicker` modal (T028) pre-configured for replace mode; shows `CancelSessionDialog` for confirmation before calling `replaceExercise`; "Remove" action shows `CancelSessionDialog` then calls `removeExercise`

**Checkpoint**: Replace exercise A with A': A's sets gone, B's sets intact. Remove A': session has only B. Offline sync removes deleted sets from Supabase on reconnect.

---

## Phase 8: User Story 6 — Cancel a Session (Priority: P2)

**Goal**: User can discard an active session with confirmation; sessions with no sets skip confirmation; cancelled sessions don't appear in history.

**Independent Test**: Start session → tap cancel (no sets) → session discarded instantly, no dialog. Start session → log 1 set → tap cancel → confirmation dialog appears → confirm → session not in Supabase. Navigate away mid-session → same confirmation dialog appears.

- [ ] T056 [US6] Implement `discardSession()` in `workout-session-store.ts` — if session has 0 sets: discard immediately without confirmation; if session has sets: status set to `cancelled`; remove from Dexie; clear in-memory state; no Supabase write
- [ ] T057 [US6] Wire cancel flow into `ActiveWorkoutScreen.tsx` (T031) — "Cancel" button in header: if session has 0 sets, calls `discardSession()` directly; if session has sets, shows `CancelSessionDialog` (T052) with "Discard Workout?" message; on confirm calls `discardSession()` and navigates to home
- [ ] T058 [US6] Guard navigation away from active session — in `src/app/(app)/workout/layout.tsx`, use Next.js router `beforePopState` or `useBeforeUnload` to detect navigation away from `/workout`; if session is active, show `CancelSessionDialog` before allowing navigation

**Checkpoint**: Cancel with no sets = instant discard. Cancel with sets = dialog. Cancelled session not in Supabase. Back navigation triggers dialog.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Completeness, mobile UX, and Definition of Done verification.

- [ ] T059 [P] Add empty state to `ActiveWorkoutScreen.tsx` — when session has no exercises: show illustrated prompt "Add your first exercise" with large "Add Exercise" button; 375px verified
- [ ] T060 [P] Add empty state to `ExerciseRow.tsx` — when exercise has no sets: show "Log your first set" inline prompt above `SetLogForm`
- [ ] T061 Guard "Finish Workout" against empty session — in `ActiveWorkoutScreen.tsx`, disable or hide "Finish" button when total set count is 0; show inline message "Add at least one set to finish" (FR-005)
- [ ] T062 Add unit switching to `SetLogRow.tsx` and `SetLogForm.tsx` — read user unit preference from profile (Supabase or localStorage); convert display weight using `toDisplayUnit`; store `weightUnit` on each `SetLogDraft` (FR-015)
- [ ] T063 [P] Verify all interactive elements meet 44×44px tap target requirement at 375px viewport (constitution Principle II) — review `SetLogRow`, `ExerciseRow`, `RestTimer`, `ExercisePicker` buttons
- [ ] T064 Run full Definition of Done checklist — `npm run build` zero errors; manual smoke test at 375px; offline test (DevTools network disable); RLS verification in Supabase Studio; no TODO comments; no placeholder content

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user story phases
- **Phase 3 (US1)**: Depends on Phase 2 — core loop; prerequisite for all other phases
- **Phase 4 (US2)**: Depends on Phase 3 — offline queue wires into existing store actions
- **Phase 5 (US3)**: Depends on Phase 3 — rest timer wires into `logSet` flow
- **Phase 6 (US4)**: Depends on Phase 3 — PR detection wires into `logSet` + `syncCompletedSession`
- **Phase 7 (US5)**: Depends on Phase 3 — replace/remove actions extend existing store
- **Phase 8 (US6)**: Depends on Phase 3 — cancel extends existing store + screen
- **Phase 9 (Polish)**: Depends on all user story phases

### User Story Dependencies

- **US1 (P1)**: Core loop — must complete before US2–US6
- **US2 (P1)**: Adds offline drain to US1's store actions — can start after US1
- **US3–US6 (P2)**: All extend US1's store/components — can run in parallel after US1

---

## Parallel Opportunities

### Phase 2 (Foundational) — run together after T005

```
T006, T007, T008  → Supabase clients (all independent files)
T012              → Dexie schema
T013, T014        → Types + Zod schema
T015, T016, T017  → Utility functions
T018, T019, T020  → Zustand stores (sequential: types must exist first)
```

### Phase 3 (US1) — after Phase 2 complete

```
T025, T026        → SetLogForm + SyncStatusBar (independent components)
T027, T028        → SetLogRow + ExercisePicker (independent components)
T029 depends on T027, T028
T030 depends on T029
T031 depends on T024, T026, T030
```

### Phases 5–8 — run in parallel after Phase 3

```
Phase 5 (rest timer)  ← independent of US4, US5, US6
Phase 6 (PR detection) ← independent of US3, US5, US6
Phase 7 (replace)     ← independent of US3, US4, US6
Phase 8 (cancel)      ← independent of US3, US4, US5
```

---

## Implementation Strategy

### MVP (US1 only — Phases 1–3)

1. Phase 1: Scaffold + deps
2. Phase 2: All foundational infrastructure
3. Phase 3: Core session loop
4. **Stop and validate**: Full session start → log → finish → verify in Supabase
5. This delivers a working gym tracker with online session logging

### Full P1 Delivery (add Phase 4)

1. MVP complete +
2. Phase 4: Offline sync
3. Delivers 100% data-safe session tracking

### Full Module Delivery (all phases)

1. P1 complete +
2. Phases 5–8 in parallel (US3–US6)
3. Phase 9: Polish + DoD verification

---

## Summary

| Phase | User Story | Tasks | Parallelizable |
|---|---|---|---|
| Phase 1 | Setup | T001–T005 | T003, T004, T005 |
| Phase 2 | Foundation | T006–T022 | T006–T009, T013–T017 |
| Phase 3 | US1 — Core Loop | T023–T035 | T025, T026, T027, T028 |
| Phase 4 | US2 — Offline | T036–T041 | — |
| Phase 5 | US3 — Rest Timer | T042–T045 | — |
| Phase 6 | US4 — PRs | T046–T051 | T048 |
| Phase 7 | US5 — Replace/Remove | T052–T055 | — |
| Phase 8 | US6 — Cancel | T056–T058 | — |
| Phase 9 | Polish | T059–T064 | T059, T060, T063 |
| **Total** | | **64 tasks** | **~20 parallelizable** |
