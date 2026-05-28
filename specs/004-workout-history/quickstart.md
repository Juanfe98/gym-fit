# Quickstart: Workout History

**Phase**: 1 | **Date**: 2026-05-28 | **Plan**: [plan.md](./plan.md)

---

## What This Module Does

Read-only view of a user's completed workout sessions. No new Supabase tables — reads from
tables created in module 003 (workout-session-tracking). Two primary screens:

1. **History List** (`/history`) — paginated, filterable, searchable list of completed sessions
2. **History Detail** (`/history/[sessionId]`) — full session breakdown with exercises, sets, PRs

---

## Running the App

```bash
npm run dev
```

Navigate to `/history` after logging in. Requires at least one completed workout session
(finish a session from `/workout` first).

---

## Module Location

```
src/modules/workout-history/
```

Follows the same layout as `src/modules/workout-session/`.

---

## Key Data Flow

```
Supabase (workout_sessions + session_exercises + set_logs)
  → history-supabase.ts (Server Action / server-side query)
  → TanStack Query (useInfiniteQuery for list, useQuery for detail)
  → React components (WorkoutHistoryList, WorkoutHistoryDetail)
```

Exercise name search adds a pre-filter step:
```
search term → searchSessionsByExercise() → session IDs → scoped history list query
```

---

## No New Migrations Required

All Supabase tables and RLS policies were created in the workout-session-tracking module.
Run the existing migrations if setting up fresh:

```bash
supabase db push
```

---

## Adding a History Card to the Home Screen

The `WorkoutHistoryCard` component is exported from `src/modules/workout-history/index.ts`
and can be imported anywhere in the `(app)` route group.

---

## i18n Keys

All user-facing strings for this module are added to:
- `src/i18n/ui.ts` — UI labels (screen titles, empty state copy, filter labels)

Follow the existing pattern in `ui.ts`. Key prefix: `history.*`.
