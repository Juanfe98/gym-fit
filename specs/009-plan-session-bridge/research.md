# Research: Plan → Session Bridge

**Branch**: `009-plan-session-bridge` | **Date**: 2026-05-29

---

## Decision: Name Snapshot Fields in DB

**Decision**: Add `source_plan_name TEXT` and `source_day_name TEXT` to `workout_sessions` (migration 005).

**Rationale**: FR3 and acceptance scenario 3 (history attribution survives plan/day deletion) require the name to be durable — it cannot be looked up at read time if the plan is deleted. A snapshot captured at session start time is the only correct approach.

**Alternatives Considered**:
- Look up plan/day name at history read time via JOIN — fails when plan is deleted.
- Store only IDs and look up via a separate name archive table — overengineered; snapshot is simpler and sufficient for this MVP.

---

## Decision: Exercise Name Lookup for Pre-loaded Exercises

**Decision**: Use `EXERCISE_CATALOG[exerciseId]?.displayName ?? exerciseId` to populate `exerciseNameSnapshot` for plan exercises when starting a plan session.

**Rationale**: `PlanExercise.exerciseId` references the static catalog key (e.g., `"barbell-bench-press"`). The catalog is already imported in the frontend (`src/data/exercises/catalog.ts`). The same display name is what `ExercisePicker` stores as the snapshot when a user manually adds an exercise. Using the same source keeps snapshots consistent.

**Alternatives Considered**:
- Fetching exercise names from ExerciseDB at start time — ExerciseDB is media-only (Constitution IV); exercise names come from the catalog, not ExerciseDB.
- Storing `displayName` on `plan_exercises` — redundant; the static catalog is the source of truth.

---

## Decision: Plan Context Passed via URL Query Params

**Decision**: `PlanWidget` navigates to `/workout?planId=X&dayId=Y&planName=...&dayName=...`. The workout page reads these params to auto-start the session.

**Rationale**: Clean separation — `PlanWidget` is a home-module component and has no business calling the session store directly. URL params are the idiomatic Next.js App Router way to carry intent across a navigation boundary. All four values (IDs + names) are short strings that fit in a URL safely.

**Alternatives Considered**:
- Zustand "pending plan start" store — works but adds cross-module coupling and requires cleanup logic.
- Server action / redirect with session state — no advantage over client-side navigation here; session start happens client-side anyway (Dexie-first).

---

## Decision: Next-Day Suggestion Derivation

**Decision**: `useActivePlanWidget` queries Supabase for the most recent completed session with `source_plan_id = activePlan.id`, gets its `source_workout_day_id`, finds that day's `dayOrder` in the active day list, and returns the day at `(dayOrder + 1) % totalDays` as the suggestion. Day 0 (`dayOrder = 0`) is the fallback when no prior session exists.

**Rationale**: Modular arithmetic on `dayOrder` is exactly what the spec calls out. No ML, no scheduling — just "next in sequence." The Supabase query is a single row fetch (LIMIT 1) with a WHERE filter and ORDER BY; it is fast and can be done in the same TanStack Query batch as the plan + days fetch.

**Alternatives Considered**:
- Computing next day from IndexedDB sessions — IndexedDB only stores in-progress sessions; completed sessions are in Supabase.
- Using `created_at` of the workout plan days — irrelevant; only the `dayOrder` determines sequence.

---

## Decision: Exercise Pre-loading via Sequential `addExercise` Calls

**Decision**: After `startSession(userId, attribution)`, the workout page calls `addExercise` for each plan exercise in `displayOrder` sequence. No new `bulkAddExercises` method needed.

**Rationale**: The existing `addExercise` flow handles Dexie writes and state updates correctly. Adding a bulk path adds surface area for bugs. The number of exercises per day is typically 4–8; sequential async calls complete in milliseconds. The session store is already set up to handle multiple sequential `addExercise` calls.

**Alternatives Considered**:
- New `startSessionWithExercises(userId, exercises, opts)` method — cleaner but violates Constitution V (YAGNI for MVP).
- Batch Dexie transaction in a single call — marginally faster but not measurably so for 4–8 exercises.

---

## Decision: Dexie Schema Version

**Decision**: No Dexie version bump needed. `sourcePlanName` and `sourceDayName` are non-indexed fields on `OfflineWorkoutSession`. Dexie only requires a version bump when the indexed column string changes. Adding non-indexed properties to the TypeScript interface is transparent to Dexie.

**Rationale**: The Dexie schema string for `workoutSessions` is `'id, userId, status, syncStatus'` — no new index columns are needed for attribution names. Existing sessions will simply have `undefined` for these fields (treated as `null` downstream).

---

## Decision: `StartWorkoutCTA` — No Change Required

**Decision**: `StartWorkoutCTA` remains unchanged. The plan widget is a separate `PlanWidget` component rendered above it in the home page layout.

**Rationale**: `StartWorkoutCTA` already shows the active plan name as a subtitle (from its existing `getActivePlan` query). The widget adds the day picker above it. Merging them would complicate the CTA component without benefit. Two clean components is better than one complex one (Constitution V).

**Note**: The `StartWorkoutCTA` already queries `getActivePlan` and the `PlanWidget` hook will also query it. These share the TanStack Query cache (`['plans', 'active', userId]`), so no duplicate network request is made.

---

## Resolved: `sourcePlanName`/`sourceDayName` Not in Existing Schema

**Confirmed**: The `workout_sessions` table in migration 001 has `source_plan_id UUID` and `source_workout_day_id UUID` only. No name snapshot columns. Migration 005 adds them.

The TypeScript types (`ActiveSessionDraft`, `SyncSessionPayload`) also lack these fields — they must be added.

---

## Resolved: History Attribution Currently Incomplete

**Confirmed**: `WorkoutHistorySummary` has `sourcePlanId: string | null` but no `sourceWorkoutDayId`, `sourcePlanName`, or `sourceDayName`. `formatSessionName` returns hardcoded `"Workout"` for plan sessions (no plan name used). History shows no visible attribution beyond the session title. All of this is addressed by FR4 and the history attribution tasks.
