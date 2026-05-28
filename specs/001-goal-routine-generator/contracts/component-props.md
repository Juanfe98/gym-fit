# Component Props Contract

**Feature**: Goal-Based Routine Generator
**Date**: 2026-05-26

All components are `.astro` files. No React, no Preact, no client-side framework.
Props are typed with TypeScript interfaces.

---

## GoalCard.astro

```typescript
interface Props {
  goal: Goal;           // Slug, e.g. 'muscle-gain'
  displayName: string;  // e.g. 'Muscle Gain'
  href: string;         // e.g. '/routine/muscle-gain'
}
```

**Renders**: Clickable card navigating to `href`. Entire card is a single tap target.
**Tap target**: Minimum 44×44px (mobile-first, Constitution II).
**No hover-only affordances.**

---

## RoutineDay.astro

```typescript
interface Props {
  day: TrainingDay;
  goal: Goal;   // needed to construct exercise hrefs
}
```

**Renders**: Day label, muscle focus, ordered list of exercise links.
Each exercise name is a link to `/exercise/{exerciseDbId}`.

---

## ExerciseCard.astro

```typescript
interface Props {
  exerciseRef: ExerciseRef;
  exercise: Exercise;       // matched from exercises.json by exerciseRef.exerciseDbId
}
```

**Renders**:
- `<img src={exercise.gifUrl} alt={exerciseRef.name} loading="lazy">` with `onerror`
  fallback showing a static placeholder
- `MuscleDiagram` component
- Form cues, common mistakes, goal-specific rationale
- All text visible regardless of GIF load status (FR4)

---

## MuscleDiagram.astro

```typescript
interface Props {
  primary: string[];    // [exercise.target], e.g. ["pectorals"]
  secondary: string[];  // exercise.secondaryMuscles, e.g. ["triceps", "delts"]
}
```

**Renders**: Inline front + back body SVG with CSS classes applied server-side:
- Matched primary muscle `<path>` elements → `muscle-primary` class
- Matched secondary muscle `<path>` elements → `muscle-secondary` class
- Unmatched elements → no class (neutral fill)

**No client-side JS.** No Astro island. Renders in static HTML.

**Dependency**: `src/services/muscle-map.ts` — translates ExerciseDB strings to SVG IDs.

---

## Shared Types

All interfaces live in `src/types.ts` and are imported by both data files and components.

```typescript
// src/types.ts
export type Goal = 'muscle-gain' | 'strength' | 'fat-loss' | 'conditioning';

export interface ExerciseRef {
  exerciseDbId: string;
  name: string;
  rationale: string;
  formCues: string[];
  commonMistakes: string[];
}

export interface TrainingDay {
  label: string;
  focus: string;
  exercises: ExerciseRef[];
}

export interface Routine {
  goal: Goal;
  displayName: string;
  rationale: string;
  days: TrainingDay[];
}

export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
}

export interface MuscleHighlight {
  primary: string[];
  secondary: string[];
}
```
