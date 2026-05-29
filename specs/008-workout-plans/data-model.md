# Data Model: Workout Plans

**Branch**: `008-workout-plans` | **Date**: 2026-05-29

---

## Supabase Tables

### `workout_plans`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| user_id | UUID | NOT NULL, FK auth.users ON DELETE CASCADE | RLS anchor |
| name | TEXT | NOT NULL | max 100 chars (validated client-side) |
| description | TEXT | NULLABLE | optional |
| goal | TEXT | NOT NULL | enum: muscle_gain, fat_loss, strength, conditioning, general |
| level | TEXT | NOT NULL | enum: beginner, intermediate, advanced |
| duration_weeks | INT | NULLABLE | null = open-ended |
| days_per_week | INT | NOT NULL | 1–7 |
| is_active | BOOLEAN | NOT NULL DEFAULT false | only one true per user (app-level constraint) |
| is_archived | BOOLEAN | NOT NULL DEFAULT false | soft delete |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT now() | |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT now() | updated via trigger or app |

### `workout_days`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| plan_id | UUID | NOT NULL, FK workout_plans ON DELETE CASCADE | |
| name | TEXT | NOT NULL | e.g. "Day 1 — Push" |
| day_order | INT | NOT NULL | 0-based; determines display order |
| target_muscle_groups | TEXT[] | NOT NULL DEFAULT '{}' | e.g. ['chest', 'triceps'] |

### `plan_exercises`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| day_id | UUID | NOT NULL, FK workout_days ON DELETE CASCADE | |
| exercise_id | TEXT | NOT NULL | references static catalog exercise id |
| display_order | INT | NOT NULL | 0-based within day |
| target_sets | INT | NULLABLE | |
| target_reps | INT | NULLABLE | exact reps (if no range) |
| target_rep_range_min | INT | NULLABLE | lower bound of rep range |
| target_rep_range_max | INT | NULLABLE | upper bound of rep range |
| target_weight | NUMERIC(8,2) | NULLABLE | in user's preferred unit |
| rest_seconds | INT | NULLABLE | |
| tempo | TEXT | NULLABLE | e.g. "3-0-1-0" |
| target_rpe | NUMERIC(3,1) | NULLABLE | 6.0–10.0 |
| notes | TEXT | NULLABLE | |

---

## Migration SQL

**File**: `supabase/migrations/004_workout_plans.sql`

```sql
-- workout_plans
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT NOT NULL,
  level TEXT NOT NULL,
  duration_weeks INT,
  days_per_week INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their plans"
  ON workout_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- workout_days
CREATE TABLE workout_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES workout_plans ON DELETE CASCADE,
  name TEXT NOT NULL,
  day_order INT NOT NULL,
  target_muscle_groups TEXT[] NOT NULL DEFAULT '{}'
);

ALTER TABLE workout_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their workout days"
  ON workout_days FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM workout_plans WHERE id = plan_id)
  )
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM workout_plans WHERE id = plan_id)
  );

-- plan_exercises
CREATE TABLE plan_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES workout_days ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  display_order INT NOT NULL,
  target_sets INT,
  target_reps INT,
  target_rep_range_min INT,
  target_rep_range_max INT,
  target_weight NUMERIC(8,2),
  rest_seconds INT,
  tempo TEXT,
  target_rpe NUMERIC(3,1),
  notes TEXT
);

ALTER TABLE plan_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their plan exercises"
  ON plan_exercises FOR ALL
  USING (
    auth.uid() = (
      SELECT wp.user_id FROM workout_plans wp
      JOIN workout_days wd ON wd.plan_id = wp.id
      WHERE wd.id = day_id
    )
  )
  WITH CHECK (
    auth.uid() = (
      SELECT wp.user_id FROM workout_plans wp
      JOIN workout_days wd ON wd.plan_id = wp.id
      WHERE wd.id = day_id
    )
  );
```

---

## TypeScript Types

**File**: `src/modules/workout-plans/types/index.ts`

```typescript
export type PlanGoal = 'muscle_gain' | 'fat_loss' | 'strength' | 'conditioning' | 'general'
export type PlanLevel = 'beginner' | 'intermediate' | 'advanced'

export interface WorkoutPlan {
  id: string
  userId: string
  name: string
  description: string | null
  goal: PlanGoal
  level: PlanLevel
  durationWeeks: number | null
  daysPerWeek: number
  isActive: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkoutDay {
  id: string
  planId: string
  name: string
  dayOrder: number
  targetMuscleGroups: string[]
}

export interface PlanExercise {
  id: string
  dayId: string
  exerciseId: string
  displayOrder: number
  targetSets: number | null
  targetReps: number | null
  targetRepRangeMin: number | null
  targetRepRangeMax: number | null
  targetWeight: number | null
  restSeconds: number | null
  tempo: string | null
  targetRpe: number | null
  notes: string | null
}

export interface WorkoutDayWithCount extends WorkoutDay {
  exerciseCount: number
}
```

---

## i18n Keys

**File**: `src/i18n/ui.ts` — add to both `en` and `es` blocks.

| Key | English | Spanish |
|-----|---------|---------|
| `plansTitle` | "My Plans" | "Mis Planes" |
| `newPlan` | "New Plan" | "Nuevo Plan" |
| `editPlan` | "Edit Plan" | "Editar Plan" |
| `plansEmpty` | "No plans yet. Create one to get started." | "Sin planes. Crea uno para empezar." |
| `planNameLabel` | "Plan Name" | "Nombre del Plan" |
| `planGoalLabel` | "Goal" | "Objetivo" |
| `planLevelLabel` | "Level" | "Nivel" |
| `planDurationLabel` | "Duration (weeks)" | "Duración (semanas)" |
| `planDaysPerWeekLabel` | "Days per week" | "Días por semana" |
| `planDescriptionLabel` | "Description (optional)" | "Descripción (opcional)" |
| `planGoalMuscleGain` | "Muscle Gain" | "Ganancia Muscular" |
| `planGoalFatLoss` | "Fat Loss" | "Pérdida de Grasa" |
| `planGoalStrength` | "Strength" | "Fuerza" |
| `planGoalConditioning` | "Conditioning" | "Acondicionamiento" |
| `planGoalGeneral` | "General Fitness" | "Fitness General" |
| `planLevelBeginner` | "Beginner" | "Principiante" |
| `planLevelIntermediate` | "Intermediate" | "Intermedio" |
| `planLevelAdvanced` | "Advanced" | "Avanzado" |
| `planStatusActive` | "Active" | "Activo" |
| `planStatusArchived` | "Archived" | "Archivado" |
| `planFromTemplate` | "Start from template" | "Empezar desde plantilla" |
| `planManual` | "Build manually" | "Construir manualmente" |
| `activatePlan` | "Activate Plan" | "Activar Plan" |
| `deactivatePlan` | "Deactivate" | "Desactivar" |
| `duplicatePlan` | "Duplicate Plan" | "Duplicar Plan" |
| `archivePlan` | "Archive Plan" | "Archivar Plan" |
| `activationErrorNoDays` | "Add at least one day before activating." | "Añade al menos un día antes de activar." |
| `activationErrorNoExercises` | "Each day must have at least one exercise." | "Cada día debe tener al menos un ejercicio." |
| `addDay` | "Add Day" | "Añadir Día" |
| `removeDay` | "Remove Day" | "Eliminar Día" |
| `dayEditorTitle` | "Edit Day" | "Editar Día" |
| `planExerciseTargetSets` | "Sets" | "Series" |
| `planExerciseTargetReps` | "Reps" | "Reps" |
| `planExerciseTargetWeight` | "Target Weight" | "Peso Objetivo" |
| `planExerciseRest` | "Rest (sec)" | "Descanso (seg)" |
| `planExerciseNotes` | "Notes" | "Notas" |
| `navPlans` | "Plans" | "Planes" |
| `myPlans` | "My Plans" | "Mis Planes" |
| `createPlanCta` | "Create a plan to structure your training" | "Crea un plan para estructurar tu entrenamiento" |
| `workoutHistory` | "Workout History" | "Historial de Entrenamientos" |
