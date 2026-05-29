---
description: "Task list for Plan → Session Bridge feature"
---

# Tasks: Plan → Session Bridge

**Input**: Design documents from `/specs/009-plan-session-bridge/`
**Branch**: `009-plan-session-bridge`

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Apply the database migration that enables all attribution storage. Blocks everything.

- [x] T001 Create `supabase/migrations/005_session_plan_attribution.sql` with `ALTER TABLE workout_sessions ADD COLUMN source_plan_name TEXT, ADD COLUMN source_day_name TEXT;` then run `supabase db push` to apply

**Checkpoint**: `SELECT column_name FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name IN ('source_plan_name', 'source_day_name')` returns 2 rows.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type changes, store extensions, sync payload updates, and i18n keys that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 [P] Add `sourcePlanName?: string` and `sourceDayName?: string` to `OfflineWorkoutSession`; add `targetSets?: number`, `targetReps?: number`, `targetRepRangeMin?: number`, `targetRepRangeMax?: number`, `targetWeight?: number` to `OfflineSessionExercise` in `src/lib/offline-db.ts` (no Dexie version bump — non-indexed fields)
- [x] T003 [P] Add `sourcePlanName?: string` and `sourceDayName?: string` to `ActiveSessionDraft`; add `targetSets?: number`, `targetReps?: number`, `targetRepRangeMin?: number`, `targetRepRangeMax?: number`, `targetWeight?: number` to `SessionExerciseDraft` in `src/modules/workout-session/types/index.ts`
- [x] T004 [P] Add `sourceWorkoutDayId: string | null`, `sourcePlanName: string | null`, `sourceDayName: string | null` to both `WorkoutHistorySummary` and `WorkoutHistoryDetail` in `src/modules/workout-history/types/index.ts`
- [x] T005 [P] Add `source_plan_name: string | null` and `source_day_name: string | null` to `SyncSessionPayload['session']` in `src/modules/workout-session/services/session-supabase.ts`
- [x] T006 [P] Add all 5 i18n keys to both `en` and `es` objects in `src/i18n/ui.ts`: `activePlanHeader` ("Your Plan" / "Tu Plan"), `nextUpLabel` ("Next up" / "Siguiente"), `emptyDayWarning` ("This day has no exercises yet" / "Este día no tiene ejercicios aún"), `planAttributionLabel` ("Plan:" / "Plan:"), `loadingPlanExercises` ("Loading exercises…" / "Cargando ejercicios…")
- [x] T007 Extend `StartSessionOptions` with `sourcePlanName?: string` and `sourceDayName?: string`; update `startSession` to spread these into the `ActiveSessionDraft` object and include them in the `db.workoutSessions.add(...)` call in `src/modules/workout-session/stores/workout-session-store.ts` (depends on T003)
- [x] T008 Extend the internal `ExerciseRef` interface with `targetSets?: number`, `targetReps?: number`, `targetRepRangeMin?: number`, `targetRepRangeMax?: number`, `targetWeight?: number`; update `addExercise` to write these fields to `db.sessionExercises.add(...)` and include them in the Zustand state exercise object in `src/modules/workout-session/stores/workout-session-store.ts` (depends on T007, same file — implement sequentially after T007)
- [x] T009 Update `recoverSession` to read `targetSets`, `targetReps`, `targetRepRangeMin`, `targetRepRangeMax`, `targetWeight` from each `db.sessionExercises` record and include them on each `SessionExerciseDraft` in the recovered session state in `src/modules/workout-session/stores/workout-session-store.ts` (depends on T008, same file — implement sequentially after T008)
- [x] T010 Update `finishedSessionToPayload` to map `session.sourcePlanName ?? null → source_plan_name` and `session.sourceDayName ?? null → source_day_name` in the returned `SyncSessionPayload['session']` object in `src/modules/workout-session/utils/session-payload.ts` (depends on T003 + T005)

**Checkpoint**: `npm run build` passes with zero TypeScript errors before starting any user story work.

---

## Phase 3: User Story 1 — Start Workout from Plan Day (Priority: P1) 🎯 MVP

**Goal**: User with active plan sees day list on home screen, taps a day, session opens pre-loaded with plan exercises and target values visible.

**Independent Test**: Activate a plan with Day 1 containing 3 exercises (each with `targetSets` + `targetReps` set). Tap Day 1 in the plan widget on home screen → `/workout` opens → all 3 exercises pre-loaded in correct order → each shows target hint (e.g., "4 × 8–12") → `SetLogForm` pre-fills weight from `targetWeight` on first set → finish session → session saved with `sourcePlanId`, `sourceWorkoutDayId`, `sourcePlanName`, `sourceDayName` in Supabase.

### Implementation for User Story 1

- [x] T011 [P] [US1] Create pure util `formatPlanTarget(exercise: SessionExerciseDraft): string` in `src/modules/workout-session/utils/plan-targets.ts` — formats target fields into a readable hint string (e.g., `"4 × 8–12 @ 60 kg"`, `"3 × 10"`, `"4 sets"`, returns `""` when no target fields are set)
- [x] T012 [P] [US1] Create `useActivePlanWidget(userId: string)` hook in `src/modules/home/hooks/use-active-plan-widget.ts` using two TanStack Query calls: `getActivePlan(userId)` (key: `['plans', 'active', userId]`) and `getDaysWithCount(activePlan.id)` (key: `['plans', 'days', activePlan.id]`, enabled when plan exists); return `{ activePlan: WorkoutPlan | null, days: WorkoutDayWithCount[], isLoading: boolean }` (no next-day suggestion yet — added in US3/T022)
- [x] T013 [US1] Update `ExerciseRow` to render a plan target hint `<p>` (using `formatPlanTarget(exercise)`) between the exercise name header and the sets list when the returned string is non-empty; pass `exercise.targetWeight` as `defaultValues.weight` to `SetLogForm` when `exercise.sets.length === 0` and `targetWeight` is defined in `src/modules/workout-session/components/ExerciseRow.tsx` (depends on T011)
- [x] T014 [US1] Create `PlanWidget` client component in `src/modules/home/components/PlanWidget.tsx` — uses `useActivePlanWidget(userId)`, returns `null` when no active plan; renders plan name header + scrollable list of `WorkoutDayWithCount` rows (name + exercise count chip, min 44px tap target each); tapping a day with `exerciseCount === 0` sets local state to show inline `emptyDayWarning` text under that row without navigating; tapping a non-empty day calls `router.push('/workout?planId=…&dayId=…&planName=…&dayName=…')` with `encodeURIComponent` on name values; add `export { PlanWidget } from './components/PlanWidget'` to `src/modules/home/index.ts`; import and render `<PlanWidget userId={userId} />` above `<StartWorkoutCTA userId={userId} />` in the home page `div` in `src/app/(app)/page.tsx` (depends on T012)
- [x] T015 [US1] Restructure `src/app/(app)/workout/page.tsx` — extract ALL existing page logic into a `WorkoutPageContent` client component inside the same file that calls `useSearchParams()`; change the default page export to a thin shell that renders `<Suspense fallback={<div className="flex min-h-screen items-center justify-center"><span className="text-sm text-gym-muted">{t('loading')}</span></div>}><WorkoutPageContent /></Suspense>`; existing behavior must be byte-for-byte identical after this task — `npm run build` must pass
- [x] T016 [US1] Implement plan-day auto-start within `WorkoutPageContent` in `src/app/(app)/workout/page.tsx` — add `'plan_loading'` to `PageStatus`; add `startedRef = useRef(false)` guard; implement `handlePlanDayStart(planId, dayId, planName, dayName)` that: checks `startedRef.current` (return if true, else set true), gets user via `createClient().auth.getUser()`, calls `getPlanExercises(dayId)` (import from `@/modules/workout-plans/services/exercises-service`), guards empty exercises array (setStatus 'idle'), calls `startSession(user.id, { sourcePlanId: planId, sourceWorkoutDayId: dayId, sourcePlanName: planName, sourceDayName: dayName })`, loops `addExercise` for each exercise with `EXERCISE_CATALOG[ex.exerciseId as ExerciseKey]?.displayName ?? ex.exerciseId` as name snapshot + all five target fields, then calls `router.replace('/workout')`; add `useEffect` that reads `planId`/`dayId`/`planName`/`dayName` from `useSearchParams()` and triggers `handlePlanDayStart` when all four are present and status is `'checking'` (depends on T015 + Foundational phase complete; imports: `EXERCISE_CATALOG` from `@/data/exercises/catalog`, `ExerciseKey` from `@/types`)

**Checkpoint**: Full P1 story manually verified per quickstart.md Paths 1–5 and 9. `npm run build` passes.

---

## Phase 4: User Story 2 — Plan Attribution in Workout History (Priority: P2)

**Goal**: History list and detail show plan name + day name for plan-sourced sessions; attribution visible even after plan is deleted.

**Independent Test**: Open a history session started from a plan day → list card shows `"planName · dayName"` attribution below title → detail page shows "FROM PLAN / planName · dayName" section. Open a manual session → no attribution, layout unchanged.

### Implementation for User Story 2

- [x] T017 [US2] Update `fetchHistoryList` to add `source_workout_day_id, source_plan_name, source_day_name` to the Supabase select string and populate `sourceWorkoutDayId`, `sourcePlanName`, `sourceDayName` in the `WorkoutHistorySummary` mapper; update `fetchHistoryDetail` with the same select additions and map the same three fields onto `WorkoutHistoryDetail` in `src/modules/workout-history/services/history-supabase.ts` (depends on T004)
- [x] T018 [US2] Update `formatSessionName` to return `"${sourcePlanName} — ${sourceDayName}"` when `sourcePlanName` is non-null; fall back to `"Workout"` when `sourcePlanId` is set but `sourcePlanName` is null (pre-migration sessions without snapshot data); keep `"Workout — {date}"` for manual sessions in `src/modules/workout-history/utils/format-session-name.ts` (depends on T004 only — does not depend on T017)
- [x] T019 [P] [US2] Update `WorkoutHistoryCard` to render `<span className="text-xs text-gym-muted">{session.sourcePlanName} · {session.sourceDayName}</span>` below the session title when both `sourcePlanName` and `sourceDayName` are non-null in `src/modules/workout-history/components/WorkoutHistoryCard.tsx` (depends on T017 + T018)
- [x] T020 [P] [US2] Update `WorkoutHistoryDetail` to render a plan attribution block after the stats row — small-caps label "FROM PLAN" + `"{sourcePlanName} · {sourceDayName}"` — when `sourcePlanName` is non-null in `src/modules/workout-history/components/WorkoutHistoryDetail.tsx` (depends on T017)

**Checkpoint**: Full P2 story manually verified per quickstart.md Paths 6 and 7. Manual session layout unchanged.

---

## Phase 5: User Story 3 — Next Day Suggestion (Priority: P3)

**Goal**: Home screen plan widget highlights the suggested next day; cycles to Day 1 after the last day completes.

**Independent Test**: Complete Day 1 → return to home → Day 2 highlighted as "Next up". Complete last day → return to home → Day 1 highlighted. No prior sessions → Day 1 highlighted.

### Implementation for User Story 3

- [x] T021 [US3] Add `getLastCompletedPlanSession(userId: string, planId: string): Promise<{ sourceWorkoutDayId: string | null } | null>` to `src/modules/workout-plans/services/plans-service.ts` — query: `.from('workout_sessions').select('source_workout_day_id').eq('user_id', userId).eq('source_plan_id', planId).eq('status', 'completed').order('started_at', { ascending: false }).limit(1).maybeSingle()`; throw on error, return `null` when no row; no barrel export needed — `useActivePlanWidget` imports directly from the service file path (consistent with existing pattern in `StartWorkoutCTA`)
- [x] T022 [US3] Update `useActivePlanWidget` in `src/modules/home/hooks/use-active-plan-widget.ts` to add a third TanStack Query call: `getLastCompletedPlanSession(userId, activePlan.id)` (key: `['plans', 'lastSession', activePlan.id]`, enabled when plan exists); compute `suggestedDayId`: `lastDayOrder = days.find(d => d.id === lastSession?.sourceWorkoutDayId)?.dayOrder ?? -1`; `nextIndex = lastDayOrder === -1 ? 0 : (lastDayOrder + 1) % days.length`; `suggestedDayId = days[nextIndex]?.id ?? null`; add `suggestedDayId: string | null` to the returned object (depends on T021; hook signature from T012 is `{ activePlan, days, isLoading }` — this task extends it to `{ activePlan, days, suggestedDayId, isLoading }`)
- [x] T023 [US3] Update `PlanWidget` in `src/modules/home/components/PlanWidget.tsx` to consume `suggestedDayId` from `useActivePlanWidget`; render `nextUpLabel` i18n badge on the day row whose `id === suggestedDayId` (depends on T022)

**Checkpoint**: Full P3 story manually verified per quickstart.md Path 8. Suggestion advances correctly and cycles.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T024 Run `npm run build` — confirm zero TypeScript errors across all 16 modified/created files
- [x] T025 [P] Visual verification at 375px — PlanWidget day list layout, "Next up" badge, plan attribution badge in history card, target hint row in `ExerciseRow`, "FROM PLAN" section in history detail; confirm no horizontal overflow on any modified screen
- [x] T026 [P] Offline degradation check — disable network in DevTools; confirm `PlanWidget` hides gracefully and `StartWorkoutCTA` displays without error; confirm active session set-logging still works without network

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (T001 — Migration)
  └─→ Phase 2 (T002–T010 — Foundational) BLOCKS all stories
        ├─→ Phase 3 (T011–T016 — US1) 🎯 MVP
        ├─→ Phase 4 (T017–T020 — US2) [useful after US1 produces plan sessions]
        └─→ Phase 5 (T021–T023 — US3) [extends Phase 3 hook + component]
              └─→ Phase 6 (T024–T026 — Polish)
```

### Within Phase 2 (parallel groups)

```
Round 1 (all parallel): T002 ‖ T003 ‖ T004 ‖ T005 ‖ T006
Round 2 (sequential, same file): T007 → T008 → T009
Round 3: T010 (after T003 + T005)
```

### Within Phase 3 (US1)

```
Round 1 (parallel): T011 ‖ T012
Round 2: T013 (after T011) ‖ T014 (after T012)  ← parallel, different files
Round 3: T015 (after T014, structural refactor — must pass build alone)
Round 4: T016 (after T015, feature implementation)
```

### Within Phase 4 (US2)

```
T017 → T018 (T018 depends only on T004, not T017 — but same functional area; safe to do T017 first)
T019 ‖ T020 (parallel, different files — both after T017 + T018)
```

Note: T018 depends only on T004 (history types from Foundational), not T017. T019 depends on T017 + T018 (needs both the data and the title formatting).

### Within Phase 5 (US3)

```
Sequential: T021 → T022 → T023
```

US3 depends on US1 complete (T022 extends the hook from T012; T023 extends the component from T014).

---

## Parallel Execution Example: Phase 3 (US1)

```bash
# Round 1 — start together (different files, no deps):
Task T011: Create src/modules/workout-session/utils/plan-targets.ts
Task T012: Create src/modules/home/hooks/use-active-plan-widget.ts

# Round 2 — when T011 done start T013; when T012 done start T014 (parallel):
Task T013: Update src/modules/workout-session/components/ExerciseRow.tsx
Task T014: Create PlanWidget + export + home page render (3 files)

# Round 3 — when T014 done:
Task T015: Restructure workout page (structural only — verify build)

# Round 4 — when T015 done:
Task T016: Implement plan-day auto-start in workout page
```

---

## Implementation Strategy

### MVP (US1 Only)

1. Complete Phase 1 (T001): Migration
2. Complete Phase 2 (T002–T010): Foundational — run `npm run build` before continuing
3. Complete Phase 3 (T011–T016): US1
4. **STOP and VALIDATE** per quickstart.md Paths 1–5 and 9
5. Plan → Do loop closed. Ship or continue.

### Incremental Delivery

1. T001 + T002–T010 → foundation + types
2. T011–T016 (US1) → home widget + plan-day start + target values → MVP
3. T017–T020 (US2) → history attribution
4. T021–T023 (US3) → next-day suggestion → full feature
5. T024–T026 (Polish) → build + visual + offline checks

---

## Notes

- T002–T006 in Phase 2: all different files — genuinely parallel
- T007 → T008 → T009: all `workout-session-store.ts` — must be sequential; run `npm run build` after T009
- T015 must pass `npm run build` alone (structural refactor only) before T016 adds new behavior
- `ExercisePicker` → `addExercise` existing callers pass no target fields — backward-compatible (all new fields are optional)
- `EXERCISE_CATALOG` and `ExerciseKey` imports needed in T016 — available at `@/data/exercises/catalog` and `@/types`
- T021 (`getLastCompletedPlanSession`): no barrel export — consistent with existing pattern where `StartWorkoutCTA` imports `getActivePlan` directly from service path
- US3 (T022, T023) extends code created in US1 — implement US3 only after US1 is verified working
- `suggestedDayId` is `null` when no active plan or days array is empty — `PlanWidget` renders no badge (graceful)
