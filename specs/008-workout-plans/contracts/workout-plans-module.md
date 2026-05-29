# Module Contract: workout-plans

**Branch**: `008-workout-plans` | **Date**: 2026-05-29

---

## Public Barrel (`src/modules/workout-plans/index.ts`)

The barrel exports everything downstream consumers need. No internal files should be imported directly from outside the module.

### Components

| Export | Props summary | Consumers |
|--------|---------------|-----------|
| `PlanCard` | `{ plan: WorkoutPlan; onClick?: () => void }` | `/plans/page.tsx` |
| `PlanForm` | `{ defaultValues?: Partial<PlanFormValues>; onSubmit: (v: PlanFormValues) => void; isLoading: boolean }` | `/plans/new/page.tsx`, `/plans/[id]/edit/page.tsx` |
| `TemplatePicker` | `{ onSelect: (goal: Goal) => void }` | `/plans/new/page.tsx` |
| `PlanDayList` | `{ planId: string; days: WorkoutDayWithCount[]; onAddDay: () => void; onEditDay: (dayId: string) => void; onRemoveDay: (dayId: string) => void }` | `/plans/[id]/page.tsx` |
| `WorkoutDayEditor` | `{ day: WorkoutDay; exercises: PlanExercise[]; onBack: () => void }` | `/plans/[id]/days/[dayId]/page.tsx` |
| `PlanExerciseRow` | `{ exercise: PlanExercise; exerciseName: string; canMoveUp: boolean; canMoveDown: boolean; onMoveUp: () => void; onMoveDown: () => void; onRemove: () => void; onEdit: () => void }` | `WorkoutDayEditor` |
| `ActivateButton` | `{ planId: string; isActive: boolean; hasValidStructure: boolean }` | `/plans/[id]/page.tsx` |
| `PlanActions` | `{ planId: string; isActive: boolean }` | `/plans/[id]/page.tsx` |

### Hooks

| Export | Returns | Purpose |
|--------|---------|---------|
| `usePlans(userId)` | `{ plans: WorkoutPlan[]; isLoading: boolean }` | Plans list |
| `usePlan(planId)` | `{ plan: WorkoutPlan \| null; isLoading: boolean }` | Single plan |
| `usePlanDays(planId)` | `{ days: WorkoutDayWithCount[]; isLoading: boolean }` | Days + exercise counts |
| `usePlanExercises(dayId)` | `{ exercises: PlanExercise[]; isLoading: boolean }` | Exercises for a day |
| `usePlanMutations(userId)` | `{ createPlan, updatePlan, activatePlan, deactivatePlan, duplicatePlan, archivePlan }` | Plan-level mutations |
| `useDayMutations(planId)` | `{ addDay, updateDay, removeDay }` | Day mutations |
| `useExerciseMutations(dayId)` | `{ addExercise, updateExercise, removeExercise, reorderExercises }` | Exercise mutations |

### Types

| Export | Notes |
|--------|-------|
| `WorkoutPlan` | Full plan entity (camelCase) |
| `WorkoutDay` | Day entity |
| `PlanExercise` | Exercise slot entity |
| `WorkoutDayWithCount` | Day + derived `exerciseCount` |
| `PlanGoal` | `'muscle_gain' \| 'fat_loss' \| 'strength' \| 'conditioning' \| 'general'` |
| `PlanLevel` | `'beginner' \| 'intermediate' \| 'advanced'` |

---

## Integration Contracts

### → Workout Session (spec 003)

`startSession(userId, { sourcePlanId, sourceWorkoutDayId })` accepts real Supabase UUIDs from `workout_plans.id` and `workout_days.id`. The plan module does NOT call this — it only provides the IDs. The workout session start UI (at `/workout`) is responsible for reading the active plan and passing its day ID.

### → Exercise Library (spec 007)

`WorkoutDayEditor` opens the existing `ExercisePicker` component from `@/modules/workout-session/components/ExercisePicker` via the same import path used in session tracking. The exercise picker's `onSelect` callback receives `{ exerciseId, exerciseNameSnapshot }` which is then stored in `plan_exercises.exercise_id`.

### → Home Screen (spec 005)

`StartWorkoutCTA` in `src/modules/home/components/StartWorkoutCTA.tsx` receives a new `activePlan: WorkoutPlan | null` prop (via `usePlans`). When `activePlan` is null, it renders a secondary CTA linking to `/plans/new`. When `activePlan` exists, it shows the plan name and links to the plan detail.

### → BottomNav (`src/modules/home/components/BottomNav.tsx`)

History tab replaced with Plans tab. New `NavTab` entry: `{ href: '/plans', labelKey: 'navPlans', Icon: ClipboardList }` (import `ClipboardList` from `lucide-react`). Add `'navPlans'` to the `NavTab.labelKey` union type. Remove `'history'` from the union and from `NAV_TABS` array. New tab order: Home → Workout → Plans → Exercises → Profile.

History remains reachable at `/history` via a link added to the Profile screen in this spec.

---

## Zod Validation Schemas (`src/modules/workout-plans/validation/plan-schema.ts`)

```typescript
export const planFormSchema = z.object({
  name: z.string().min(1, t('planNameRequired')).max(100),
  goal: z.enum(['muscle_gain', 'fat_loss', 'strength', 'conditioning', 'general']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  durationWeeks: z.number().int().min(1).max(52).nullable(),
  daysPerWeek: z.number().int().min(1).max(7),
  description: z.string().max(500).nullable(),
})

export const planExerciseFormSchema = z.object({
  targetSets: z.number().int().min(1).max(20).nullable(),
  targetReps: z.number().int().min(1).max(100).nullable(),
  targetRepRangeMin: z.number().int().min(1).max(100).nullable(),
  targetRepRangeMax: z.number().int().min(1).max(100).nullable(),
  targetWeight: z.number().min(0).max(9999).nullable(),
  restSeconds: z.number().int().min(0).max(600).nullable(),
  notes: z.string().max(500).nullable(),
}).refine(
  (d) => !(d.targetReps && d.targetRepRangeMin),
  { message: 'Use either exact reps or a rep range, not both' }
)

export const workoutDaySchema = z.object({
  name: z.string().min(1).max(80),
})
```
