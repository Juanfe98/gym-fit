# Data Model: Goal-Based Routine Generator

**Phase**: 1
**Date**: 2026-05-26
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Entities

### Goal

Training objective. Determines which routine is shown and which rationale copy applies.

```typescript
type Goal = 'muscle-gain' | 'strength' | 'fat-loss' | 'conditioning';
```

| Display Name | Slug           | URL               |
|--------------|----------------|-------------------|
| Muscle Gain  | `muscle-gain`  | `/routine/muscle-gain`  |
| Strength     | `strength`     | `/routine/strength`     |
| Fat Loss     | `fat-loss`     | `/routine/fat-loss`     |
| Conditioning | `conditioning` | `/routine/conditioning` |

---

### Routine

Complete weekly training plan for a goal. One file per goal in `src/data/routines/`.

```typescript
interface Routine {
  goal: Goal;
  displayName: string;    // e.g., "Muscle Gain"
  rationale: string;      // 2–4 sentences explaining the split structure
  days: TrainingDay[];
}
```

**Constraints**:
- Exactly 4 routines exist (one per Goal)
- `rationale` is 2–4 sentences, goal-specific, no placeholder text

---

### TrainingDay

A single day within a routine.

```typescript
interface TrainingDay {
  label: string;              // e.g., "Day 1 — Push"
  focus: string;              // e.g., "Chest, Shoulders, Triceps"
  exercises: ExerciseRef[];
}
```

**Constraints**:
- Exactly 5 exercises per day (FR2)
- `label` format: `"Day N — {split name}"`

---

### ExerciseRef

Reference to an exercise within a training day. Contains all manually authored content.

```typescript
interface ExerciseRef {
  exerciseDbId: string;     // ExerciseDB exercise ID for media lookup at build time
  name: string;             // Display name (title-cased, may differ from API casing)
  rationale: string;        // Goal-specific "why this exercise" copy — unique per goal
  formCues: string[];       // 3–6 intermediate-to-advanced form cues
  commonMistakes: string[]; // 2–4 common mistakes (per FR3)
}
```

**Constraints**:
- `rationale` must be goal-specific — same exercise in two routines must have
  distinct rationale text (Constitution Principle III)
- `formCues` targets intermediate-to-advanced level — no beginner basics
- `commonMistakes`: 2–4 items (FR3)
- No placeholder or lorem ipsum content (Constitution Principle III)

---

### Exercise (ExerciseDB Cache)

Media data fetched at build time from ExerciseDB. Stored as JSON, never regenerated
at runtime.

```typescript
interface Exercise {
  id: string;                  // ExerciseDB numeric string ID, e.g. "0001"
  name: string;                // Lowercase exercise name from API
  gifUrl: string;              // Animated GIF CDN URL (auth-free at runtime)
  bodyPart: string;            // Body part category, e.g. "chest"
  target: string;              // Primary muscle, e.g. "pectorals"
  secondaryMuscles: string[];  // Secondary muscles, e.g. ["triceps", "delts"]
  equipment: string;           // Required equipment, e.g. "barbell"
}
```

**Source**: `scripts/fetch-exercises.ts` (runs once at build time)
**Storage**: `src/data/exercises/exercises.json` (committed to repo)

---

### MuscleHighlight

Derived type used by `MuscleDiagram.astro`. Computed from `Exercise` at render time —
not stored separately.

```typescript
interface MuscleHighlight {
  primary: string[];    // [exercise.target]
  secondary: string[];  // exercise.secondaryMuscles
}
```

---

## Relationships

```
Goal (1) ────────────── (1) Routine
Routine (1) ──────────── (1..N) TrainingDay
TrainingDay (1) ──────── (5) ExerciseRef
ExerciseRef (N) ──── (1) Exercise        [joined by exerciseDbId === Exercise.id]
Exercise (1) ──────── (1) MuscleHighlight [derived at render]
```

---

## Data File Layout

```
src/data/
  routines/
    muscle-gain.ts      ← export const muscleGainRoutine: Routine
    strength.ts         ← export const strengthRoutine: Routine
    fat-loss.ts         ← export const fatLossRoutine: Routine
    conditioning.ts     ← export const conditioningRoutine: Routine
    index.ts            ← export const ROUTINES: Record<Goal, Routine>
  exercises/
    exercises.json      ← Exercise[] — full ExerciseDB dataset cache
```

---

## Navigation State

No user state persisted. Navigation only:

```
/ (Homepage)
  → select Goal
  → /routine/[goal]  (Routine Page)
    → tap exercise name
    → /exercise/[id]  (Exercise Card)
      → back
      → /routine/[goal]  (scroll position restored via browser native scroll restoration)
```

Scroll restoration: `history.scrollRestoration = 'auto'` (browser default) — no custom
implementation needed for MVP.
