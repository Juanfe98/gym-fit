# Data Model: Exercise Library

## New Supabase Table

### `user_exercise_favorites`

```sql
-- Migration: 003_user_exercise_favorites
CREATE TABLE user_exercise_favorites (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  exercise_id  TEXT NOT NULL,  -- ExerciseDB id (e.g. 'EIeI8Vf')
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);

ALTER TABLE user_exercise_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their favorites"
  ON user_exercise_favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Notes**:
- `exercise_id` stores the ExerciseDB id string, not a FK — the exercise catalog is static.
- `UNIQUE (user_id, exercise_id)` prevents duplicate favorites at the DB level.
- RLS policy isolates each user's favorites completely.

---

## Frontend Domain Types

### `src/modules/exercises/types/index.ts`

```ts
export type ExerciseFilterState = {
  query: string
  bodyPart: string
  equipment: string
  favoritesOnly: boolean
  page: number
}

export type CoachingData = {
  rationale: string
  formCues: string[]
  commonMistakes: string[]
}
```

(Re-export from workout-session's `ExerciseSearchResult` and `ExerciseSearchPage` — do not duplicate.)

---

## Existing Types Reused

| Type | Source | Usage |
|------|--------|-------|
| `ExerciseSearchResult` | `workout-session/hooks/use-exercise-search` → moved to `exercises/hooks/` | List items, detail data |
| `ExerciseSearchPage` | same | Paginated results |
| `BODY_PARTS`, `EQUIPMENT_OPTIONS` | same | Filter chip options |
| `ExerciseRef` (session store) | `workout-session/stores/workout-session-store` | `addExercise({ exerciseId, exerciseNameSnapshot })` |

---

## i18n Keys Required

All keys added to both `en` and `es` blocks in `src/i18n/ui.ts`.

| Key | English | Spanish |
|-----|---------|---------|
| `navExercises` | `Exercises` | `Ejercicios` |
| `exerciseLibraryTitle` | `Exercise Library` | `Biblioteca de ejercicios` |
| `exerciseSearch` | `Search exercises…` | `Buscar ejercicios…` |
| `filterMuscle` | `Muscle group` | `Grupo muscular` |
| `filterEquipment` | `Equipment` | `Equipamiento` |
| `filterFavorites` | `Favorites` | `Favoritos` |
| `allMuscles` | `All muscles` | `Todos los músculos` |
| `allEquipment` | `All equipment` | `Todo el equipamiento` |
| `exercisesEmpty` | `No exercises match your filters` | `Ningún ejercicio coincide con tus filtros` |
| `exercisesEmptyFavorites` | `No favorites yet — tap ♥ on any exercise` | `Aún no tienes favoritos — toca ♥ en cualquier ejercicio` |
| `clearFilters` | `Clear filters` | `Limpiar filtros` |
| `formCues` | `Form cues` | `Indicaciones de técnica` |
| `commonMistakesLabel` | `Common mistakes` | `Errores comunes` |
| `whyIncluded` | `Why it's included` | `Por qué está aquí` |
| `primaryMuscle` | `Primary muscle` | `Músculo principal` |
| `secondaryMusclesLabel` | `Secondary muscles` | `Músculos secundarios` |
| `equipmentLabel` | `Equipment` | `Equipamiento` |
| `addedToSession` | `Added to workout` | `Agregado al entrenamiento` |
| `addToSession` | `Add to session` | `Agregar a la sesión` |
| `favoriteAdd` | `Add to favorites` | `Agregar a favoritos` |
| `favoriteRemove` | `Remove from favorites` | `Quitar de favoritos` |
| `favoriteSyncError` | `Could not save. Try again.` | `No se pudo guardar. Intenta de nuevo.` |
| `exerciseGifAlt` | `{name} demonstration` | `Demostración de {name}` |
| `musclesDiagram` | `Muscles diagram` | `Diagrama muscular` |
