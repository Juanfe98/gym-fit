# Implementation Plan: Plan → Session Bridge

**Branch**: `009-plan-session-bridge` | **Date**: 2026-05-29 | **Spec**: `specs/009-plan-session-bridge/spec.md`

---

## Summary

Bridges workout plans to live sessions. Home screen gains a `PlanWidget` that shows the active plan's days and highlights the suggested next day; tapping a day navigates to `/workout` with URL params that trigger an auto-start with plan exercises pre-loaded. Sessions capture plan/day name snapshots at start time for durable attribution. History list and detail views surface the plan attribution badge. Closes the Plan → Do → Track loop introduced in spec 008.

---

## Technical Context

**Language/Version**: TypeScript (strict) / Next.js 15+ App Router
**Primary Dependencies**: TanStack Query v5, Zustand, Dexie.js, Supabase JS, Tailwind CSS v4, lucide-react
**Storage**: Supabase Postgres (cloud) + IndexedDB via Dexie.js (offline primary for active session)
**Testing**: `npm run build` (TypeScript) + manual visual verification at 375px
**Target Platform**: Web, mobile-first (375px viewport)
**Project Type**: Next.js App Router web app
**Performance Goals**: Plan widget loads within same render pass as existing home widgets (shared TQ cache for `getActivePlan`)
**Constraints**: Offline-first for active sessions; plan data requires online for pre-load (plan is not cached offline); attribution must survive plan/day deletion via name snapshots
**Scale/Scope**: Single active plan per user; up to 7 days; modular arithmetic for next-day suggestion; 4–8 exercises typical per day

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. User-First Architecture | ✅ PASS | New DB columns behind existing `workout_sessions` RLS. No custom backend — Supabase only. |
| II. Mobile-First UI | ✅ PASS | `PlanWidget` day rows use min 44px tap targets. Inline warning does not navigate away. |
| III. Exercise Content Integrity | ✅ N/A | No changes to static exercise catalog. |
| IV. External Media Isolation | ✅ N/A | No ExerciseDB calls added. |
| V. Minimal, Reviewable Changes | ✅ PASS | No refactors of existing code. Two new components, one new hook. All other changes are additive (new fields, new selects). |
| VI. Offline-First Session Tracking | ✅ PASS | Session start + exercise pre-loading go through existing `startSession` + `addExercise` (Dexie-first). Attribution fields stored in Dexie. Plan data fetch happens before session start — if offline, plan widget degrades gracefully (hides widget, CTA shown alone). |

**Gate result: PASS. No violations.**

**Post-design re-check**: Plan context passed via URL params (not via store mutation) keeps `home` module decoupled from `workout-session`. All Dexie writes use existing paths. RLS unchanged.

---

## Project Structure

### Documentation (this feature)

```text
specs/009-plan-session-bridge/
├── plan.md              ← This file
├── research.md          ← Phase 0 decisions
├── data-model.md        ← Phase 1 schema + type changes
├── quickstart.md        ← Phase 1 manual test paths
├── contracts/
│   └── plan-session-bridge.md
└── tasks.md             ← Phase 2 output (/speckit-tasks command)
```

### Source Code Layout

```text
src/
  app/(app)/
    page.tsx                         ← Add <PlanWidget userId={userId} /> above StartWorkoutCTA
    workout/
      page.tsx                       ← Read planId/dayId params; auto-start plan-day session

  modules/
    home/
      components/
        PlanWidget.tsx               ← NEW: active plan widget with day list + next-up
        StartWorkoutCTA.tsx          ← Unchanged
      hooks/
        use-active-plan-widget.ts    ← NEW: active plan + days + next-day suggestion
      index.ts                       ← Add PlanWidget export

    workout-session/
      types/index.ts                 ← Add sourcePlanName?, sourceDayName? to ActiveSessionDraft; add target fields to SessionExerciseDraft
      stores/workout-session-store.ts ← Extend StartSessionOptions + ExerciseRef with target/name fields; recoverSession reads targets
      services/session-supabase.ts   ← Add source_plan_name, source_day_name to SyncSessionPayload
      utils/
        session-payload.ts           ← Map new snapshot fields in finishedSessionToPayload
        plan-targets.ts              ← NEW: formatPlanTarget(exercise) pure util
      components/
        ExerciseRow.tsx              ← Target hint row + pre-fill SetLogForm defaults from targets

    workout-plans/
      services/plans-service.ts      ← Add getLastCompletedPlanSession(userId, planId)

    workout-history/
      types/index.ts                 ← Add sourceWorkoutDayId, sourcePlanName, sourceDayName
      services/history-supabase.ts   ← Select new columns; map to types
      components/
        WorkoutHistoryCard.tsx        ← Plan attribution badge below title
        WorkoutHistoryDetail.tsx      ← Plan attribution section
      utils/format-session-name.ts   ← Use sourcePlanName snapshot; null-guard for pre-migration sessions

  lib/
    offline-db.ts                    ← Add sourcePlanName?, sourceDayName? to OfflineWorkoutSession; add target fields to OfflineSessionExercise

  i18n/
    ui.ts                            ← Add 5 new keys (en + es)

supabase/migrations/
  005_session_plan_attribution.sql   ← NEW: add source_plan_name, source_day_name to workout_sessions
```

---

## Complexity Tracking

> No Constitution violations requiring justification.

---

## Implementation Phases

### Phase A: Database Migration

**File**: `supabase/migrations/005_session_plan_attribution.sql`

```sql
ALTER TABLE workout_sessions
  ADD COLUMN source_plan_name TEXT,
  ADD COLUMN source_day_name  TEXT;
```

No RLS changes needed. No index needed (never filtered on).

---

### Phase B: Type + Offline DB Changes

**Files**: `src/lib/offline-db.ts`, `src/modules/workout-session/types/index.ts`, `src/modules/workout-history/types/index.ts`

Key additions:

```ts
// offline-db.ts — OfflineWorkoutSession
sourcePlanName?: string
sourceDayName?: string

// offline-db.ts — OfflineSessionExercise (new optional target fields)
targetSets?: number
targetReps?: number
targetRepRangeMin?: number
targetRepRangeMax?: number
targetWeight?: number

// workout-session/types — ActiveSessionDraft
sourcePlanName?: string
sourceDayName?: string

// workout-session/types — SessionExerciseDraft (new optional target fields)
targetSets?: number
targetReps?: number
targetRepRangeMin?: number
targetRepRangeMax?: number
targetWeight?: number

// workout-history/types — WorkoutHistorySummary + WorkoutHistoryDetail
sourceWorkoutDayId: string | null
sourcePlanName: string | null
sourceDayName: string | null
```

No Dexie version bump — all new fields are non-indexed.

---

### Phase C: Session Store + Sync Payload

**Files**: `stores/workout-session-store.ts`, `services/session-supabase.ts`, `utils/session-payload.ts`

1. `StartSessionOptions` gains `sourcePlanName?` and `sourceDayName?`.
2. `startSession` spreads these into the `ActiveSessionDraft` and the Dexie `workoutSessions.add` call.
3. `SyncSessionPayload.session` gains `source_plan_name: string | null` and `source_day_name: string | null`.
4. `finishedSessionToPayload` maps `session.sourcePlanName ?? null` → `source_plan_name` and `session.sourceDayName ?? null` → `source_day_name`.

---

### Phase D: History Attribution

**Files**: `history-supabase.ts`, `WorkoutHistoryCard.tsx`, `WorkoutHistoryDetail.tsx`, `format-session-name.ts`

1. `fetchHistoryList` select string gains `source_workout_day_id, source_plan_name, source_day_name`; mapper adds these to `WorkoutHistorySummary`.
2. `fetchHistoryDetail` same additions to `WorkoutHistoryDetail`.
3. `formatSessionName`: when `sourcePlanName` set AND non-null, return `"${sourcePlanName} — ${sourceDayName}"` (e.g., `"Push & Pull — Day 2: Upper Body"`). If `sourcePlanId` set but `sourcePlanName` null (old sessions pre-migration 005), fall back to `"Workout"`. Manual sessions keep `"Workout — {date}"` unchanged.
4. `WorkoutHistoryCard`: below title, when `sourcePlanName` + `sourceDayName` set, render a small tag `"{sourcePlanName} · {sourceDayName}"` in gym-muted text.
5. `WorkoutHistoryDetail`: after the stats row, when `sourcePlanName` set, render a plan attribution block:
   ```
   FROM PLAN
   Push & Pull · Day 2: Upper Body
   ```

---

### Phase E: `useActivePlanWidget` Hook + Service Function

**New service function** (add to `src/modules/workout-plans/services/plans-service.ts`):

```ts
export async function getLastCompletedPlanSession(
  userId: string,
  planId: string,
): Promise<{ sourceWorkoutDayId: string | null } | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('source_workout_day_id')
    .eq('user_id', userId)
    .eq('source_plan_id', planId)
    .eq('status', 'completed')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data ? { sourceWorkoutDayId: data.source_workout_day_id } : null
}
```

**File**: `src/modules/home/hooks/use-active-plan-widget.ts`

```ts
// Three TanStack Query calls:
// 1. getActivePlan(userId) — key: ['plans', 'active', userId]
// 2. getDaysWithCount(activePlan.id) — key: ['plans', 'days', activePlan.id], enabled when plan exists
// 3. getLastCompletedPlanSession(userId, activePlan.id) — key: ['plans', 'lastSession', activePlan.id], enabled when plan exists

// Next-day derivation:
// lastDayOrder = days.find(d => d.id === lastSession?.sourceWorkoutDayId)?.dayOrder ?? -1
// nextIndex = lastDayOrder === -1 ? 0 : (lastDayOrder + 1) % days.length
// suggestedDayId = days[nextIndex]?.id ?? null
```

---

### Phase F: `PlanWidget` Component

**File**: `src/modules/home/components/PlanWidget.tsx`

```tsx
'use client'
// Uses useActivePlanWidget, useRouter from next/navigation
// Returns null when !activePlan (no render, no layout shift)
// Structure:
//   <section> header: plan name
//   <ul> day list:
//     each <li>: day name, exerciseCount badge, "Next up" if suggestedDayId === day.id
//     onPress:
//       if exerciseCount === 0 → setEmptyDayWarning(day.id)  (inline warning, no nav)
//       else → router.push(`/workout?planId=...&dayId=...&planName=...&dayName=...`)
```

Empty day warning: shown as inline `<p>` under the tapped day row. Dismisses when another row is tapped.

---

### Phase G: Workout Page — Plan-Day Auto-Start

**File**: `src/app/(app)/workout/page.tsx`

**Suspense requirement**: `useSearchParams()` in Next.js 15 App Router requires a `<Suspense>` boundary. Extract the inner client logic to `WorkoutPageContent` and wrap it:

```tsx
export default function WorkoutPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <WorkoutPageContent />
    </Suspense>
  )
}

function WorkoutPageContent() {
  const searchParams = useSearchParams()
  // ... all existing logic
}
```

New state: `'plan_loading'` added to `PageStatus`.

Auto-start sequence (triggered when `planId`+`dayId`+`planName`+`dayName` params all present AND no in-progress session in Dexie):

```ts
const startedRef = useRef(false)  // guards against React Strict Mode double-fire

async function handlePlanDayStart(planId, dayId, planName, dayName) {
  if (startedRef.current) return
  startedRef.current = true
  const user = await getUser()
  if (!user) return
  const exercises = await getPlanExercises(dayId)
  if (exercises.length === 0) { setStatus('idle'); return }
  await startSession(user.id, { sourcePlanId: planId, sourceWorkoutDayId: dayId, sourcePlanName: planName, sourceDayName: dayName })
  for (const ex of exercises) {
    await addExercise({
      exerciseId: ex.exerciseId,
      exerciseNameSnapshot: EXERCISE_CATALOG[ex.exerciseId as ExerciseKey]?.displayName ?? ex.exerciseId,
      targetSets: ex.targetSets ?? undefined,
      targetReps: ex.targetReps ?? undefined,
      targetRepRangeMin: ex.targetRepRangeMin ?? undefined,
      targetRepRangeMax: ex.targetRepRangeMax ?? undefined,
      targetWeight: ex.targetWeight ?? undefined,
    })
  }
  // Clean URL params so back-button doesn't re-trigger
  router.replace('/workout')
  setStatus('active')
}
```

Called in `useEffect` when params present and status is `'checking'`.

---

### Phase H: Home Page + Barrel

**File**: `src/app/(app)/page.tsx`

```tsx
// Before StartWorkoutCTA:
<PlanWidget userId={userId} />
<StartWorkoutCTA userId={userId} />
```

**File**: `src/modules/home/index.ts`

Add: `export { PlanWidget } from './components/PlanWidget'`

---

### Phase I: `addExercise` + Session Store Target Fields

**Files**: `stores/workout-session-store.ts`, `src/lib/offline-db.ts`

Extend `ExerciseRef` to carry optional plan targets:

```ts
interface ExerciseRef {
  exerciseId: string
  exerciseNameSnapshot: string
  targetSets?: number
  targetReps?: number
  targetRepRangeMin?: number
  targetRepRangeMax?: number
  targetWeight?: number
}
```

`addExercise` writes these to `OfflineSessionExercise` (non-indexed, no Dexie version bump) and includes them in the Zustand `SessionExerciseDraft` state.

`recoverSession` reads these fields from `db.sessionExercises` and restores them onto each `SessionExerciseDraft` in the recovered session state.

---

### Phase J: Target Values in `ExerciseRow` UI

**File**: `src/modules/workout-session/components/ExerciseRow.tsx`

When any target field is present on the exercise, render a single hint line between the exercise name and the sets list:

```tsx
{(exercise.targetSets || exercise.targetReps || exercise.targetRepRangeMin) && (
  <p className="px-3 py-1 text-xs text-gym-muted">
    {formatPlanTarget(exercise)}
  </p>
)}
```

Add a pure util `formatPlanTarget(exercise: SessionExerciseDraft): string` in `src/modules/workout-session/utils/`:

```ts
// Examples of output:
// "4 × 8 @ 60 kg"
// "3 × 8–12"
// "4 sets"
// Returns '' if no targets (hint not rendered)
```

This util is new — place it in `src/modules/workout-session/utils/plan-targets.ts`.

**Pre-fill `SetLogForm` defaults**: when `targetWeight` is set, pass it as `defaultValues.weight` to `SetLogForm` for the first set of a plan-sourced exercise (i.e., when `exercise.sets.length === 0`). This saves the user from typing the target weight manually.

---

### Phase L: i18n Keys

**File**: `src/i18n/ui.ts`

Add to both `en` and `es` objects:

| Key | en | es |
|-----|----|----|
| `activePlanHeader` | `'Your Plan'` | `'Tu Plan'` |
| `nextUpLabel` | `'Next up'` | `'Siguiente'` |
| `emptyDayWarning` | `'This day has no exercises yet'` | `'Este día no tiene ejercicios aún'` |
| `planAttributionLabel` | `'Plan:'` | `'Plan:'` |
| `loadingPlanExercises` | `'Loading exercises…'` | `'Cargando ejercicios…'` |

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Plan context → workout page | URL query params (`planId`, `dayId`, `planName`, `dayName`) | Idiomatic Next.js; keeps `home` module decoupled from `workout-session` store |
| Exercise name snapshot for pre-loaded exercises | `EXERCISE_CATALOG[exerciseId]?.displayName ?? exerciseId` | Matches what `ExercisePicker` stores; static catalog is the source of truth |
| Name snapshots at session start | Two new nullable columns in `workout_sessions` | Only way to preserve attribution after plan deletion (JOIN fails on deleted rows) |
| Dexie version | No bump | All new fields are non-indexed; Dexie schema string unchanged |
| Exercise pre-loading method | Sequential `addExercise` calls with extended `ExerciseRef` | Reuses existing Dexie path; no new "bulk" method needed for 4–8 exercises |
| Target values in session | Add optional target fields to `SessionExerciseDraft` + `OfflineSessionExercise`; display as hint row in `ExerciseRow` | FR2 requires targets visible as reference; storing on exercise draft keeps them available after session recovery |
| Target display in `ExerciseRow` | New hint row + pre-fill `SetLogForm` defaults for first set | Single hint row is minimal; pre-fill reduces manual entry without enforcing values |
| `PlanWidget` visibility gating | `getActivePlan` result; `null` → no render | Shares TQ cache key with `StartWorkoutCTA`; no extra network request |
| Next-day suggestion | Modular arithmetic on `dayOrder` from last completed plan session via `getLastCompletedPlanSession` service | Spec explicitly calls this out; service function follows project pattern (all Supabase calls in services/) |
| Empty day guard location | `PlanWidget` (client-side check on `exerciseCount`) | `exerciseCount` already in `WorkoutDayWithCount`; no extra fetch needed |
| Workout page `useSearchParams` | Suspense wrapper — `WorkoutPageContent` child component | Required by Next.js 15 App Router for `useSearchParams()` in client components |
| Auto-start double-fire guard | `startedRef = useRef(false)` in `WorkoutPageContent` | React Strict Mode fires effects twice in dev; ref prevents second `startSession` throw |

---

## Risks and Follow-ups

| Risk | Mitigation |
|------|-----------|
| Plan exercises fetched in workout page — if offline when navigating from PlanWidget, fetch fails | Guard: if `getPlanExercises` throws, show error state and fall back to blank session start. Plan widget itself degrades gracefully (hides) if `getActivePlan` fails. |
| `EXERCISE_CATALOG` key not found for a plan exercise (exercise removed from catalog after being added to plan) | Fallback to `exerciseId` as display name (spec out-of-scope case: "Show exercise ID as fallback name") |
| URL param length for long plan/day names | `encodeURIComponent` handles special chars; names are capped at 100 chars (plan) and reasonable lengths (day) — no risk |
| Two queries for active plan (`StartWorkoutCTA` + `PlanWidget`) | Shared TQ cache key `['plans', 'active', userId]` — one network request |
| Attribution `sourceWorkoutDayId` not in existing history queries | Currently not selected — added to both `fetchHistoryList` and `fetchHistoryDetail` selects in Phase D |
| Old sessions pre-migration 005 have null `sourcePlanName`/`sourceDayName` but non-null `sourcePlanId` | `formatSessionName` null-guard: falls back to `"Workout"` when `sourcePlanName` is null, even if `sourcePlanId` is set |
| `useSearchParams()` without Suspense in Next.js 15 | Resolved in Phase G: `WorkoutPageContent` inner component + `<Suspense>` wrapper on page export |
| React Strict Mode double-fires auto-start `useEffect` | Resolved in Phase G: `startedRef` guard prevents second `startSession` call |
