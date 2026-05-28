# Research: Workout History

**Phase**: 0 | **Date**: 2026-05-28 | **Plan**: [plan.md](./plan.md)

---

## 1. Existing Data Layer

### Decision: One migration required — add `total_volume` and `pr_count` to `workout_sessions`
**Rationale**: `WorkoutHistorySummary` needs `total_volume` (displayed on each history card)
and `pr_count` (displayed on card and detail header). Both values are computed at session
finish time and available in `FinishedSession`. The `workout_sessions` table (migration 001)
does not have these columns. Recomputing volume from `set_logs` on every history list load
requires a join across up to 200 sessions × many sets — expensive and wasteful when the value
is already known at write time. Storing them is the correct approach.

Migration 002 adds:
- `total_volume NUMERIC(10, 2)` to `workout_sessions`
- `pr_count INT NOT NULL DEFAULT 0` to `workout_sessions`

`finishedSessionToPayload` must be updated to write both values. `SyncSessionPayload` must
include them. No new tables, no new RLS policies.

**RLS**: Existing `"Users own their sessions"` policy covers SELECT and the updated INSERT/UPSERT.

**Alternatives considered**:
- Recompute client-side from `set_logs` on every list load. Rejected — O(sessions × sets)
  join for a value that is already known at write time; degrades with history size.
- A separate `workout_summaries` denormalised table. Rejected — unnecessary indirection;
  two columns on the existing table are sufficient.

---

## 2. Query Strategy — History List

### Decision: TanStack Query + Supabase join with aggregate computed client-side
**Rationale**: The history list needs: session metadata + total volume + total sets count.
Total volume and total sets can be derived from `set_logs` via a Supabase join or computed
client-side from nested data. For an MVP user with up to ~200 sessions, fetching joined
session + exercise + set data and computing aggregates client-side is acceptable and avoids
complex SQL aggregations in RLS-enabled tables.

For the list view (cards), fetch only `workout_sessions` + a count of `session_exercises`
and `set_logs`. For the detail view, fetch full nested data.

**Pattern**: Two separate queries:
- List: `workout_sessions` with `session_exercises(count)` and `set_logs(count)`
- Detail: Full nested fetch `workout_sessions → session_exercises → set_logs`

**Alternatives considered**: Postgres views or RPC functions. Rejected for MVP — adds
migration complexity. Can be introduced if query performance becomes measurable problem.

---

## 3. Filter & Search Strategy

### Decision: Client-side filter for date range + server-side filter for exercise name
**Rationale**:
- **Date filter**: Applied as a WHERE clause on `started_at` in the Supabase query. This
  reduces network payload and is trivially supported by Postgres.
- **Exercise name search**: Filtered server-side using `ilike` on `exercise_name_snapshot`
  in `session_exercises`. Returns matching `session_ids`, then the history list query is
  scoped to those IDs.

Combined filter: when both are active, the session list query includes both `started_at` range
and the `session_id IN (...)` constraint from exercise search.

**Alternatives considered**: Full client-side filtering of all history. Rejected because
users with hundreds of sessions would download unbounded data on every filter change.

---

## 4. Offline Behaviour

### Decision: Read from IndexedDB for sessions previously loaded; no special offline UI
**Rationale**: The spec assumes offline access relies on what's already cached. The Dexie.js
schema already stores `ActiveSessionDraft` during active sessions. Completed sessions are in
Supabase. If offline, TanStack Query serves stale data from its cache (default behaviour with
`staleTime` configured). No separate offline read path is needed for the history module.

**Alternatives considered**: Persisting all completed sessions to IndexedDB. Rejected — scope
creep. The session module already handles offline write; history is a secondary read concern.

---

## 5. Post-Workout Summary Screen

### Decision: Post-workout summary screen is out of scope; history detail is a new component
**Rationale**: The post-workout summary screen (`/workout/summary`) is already implemented
and is not touched by this module. `SessionSummary.tsx` is a write component — it calls
`syncCompletedSession()` and renders editable notes with a Save button. It takes
`FinishedSession` (an in-progress draft type from sessionStorage), not `WorkoutHistoryDetail`
(a Supabase read type). These are incompatible types with different data sources and
different intents. A "read-only flag" approach would require significant refactoring of
`SessionSummary` and blur the boundary between the two modules.

`WorkoutHistoryDetail.tsx` is a new read-only component that takes `WorkoutHistoryDetail`
and renders exercises + sets + PRs. `PrBadge.tsx` from the workout-session module is reused
for PR indicators within `ExerciseSetGroup.tsx`. This is the only cross-module component reuse.

**Alternatives considered**: Refactor `SessionSummary` to accept a read-only mode and a
union type. Rejected — increases complexity of an existing working component, violates
Principle V (minimal changes), and blurs module boundaries for marginal DRY benefit.

---

## 6. Pagination

### Decision: Cursor-based pagination with a page size of 20 sessions
**Rationale**: History grows unbounded. Fetching all sessions in a single query will
degrade at scale. Cursor-based pagination (using `started_at` as cursor) is idiomatic
in Supabase (`range()` or `lt/gt` on timestamp). TanStack Query's `useInfiniteQuery`
handles this cleanly with "load more" UX on scroll.

**Page size**: 20 sessions per page — enough to fill a mobile screen 3–4× over, minimising
round trips while keeping initial payload small.

**Alternatives considered**: Offset pagination. Rejected — unstable when new sessions are
added between pages.

---

## 7. Name Snapshot vs Live Exercise Name

### Decision: Display `exercise_name_snapshot` stored at log time, not live exercise catalog name
**Rationale**: Spec assumption confirmed: search matches snapshots, not current exercise
names. This preserves historical accuracy. The exercise catalog name may change or be
deleted; snapshots are immutable.
