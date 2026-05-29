# Contract: Exercises Module Public API

**Module**: `src/modules/exercises/index.ts`

---

## Exported Components

| Component | Props | Description |
|-----------|-------|-------------|
| `ExerciseListItem` | `exercise: ExerciseSearchResult`, `isFavorite: boolean`, `onPress: () => void` | Single row in the list — name, body part, equipment chip, heart icon if favorited |
| `ExerciseFilters` | `filters: ExerciseFilterState`, `onChange: (filters) => void` | Search input + body part chip, equipment chip, favorites toggle |
| `MuscleDiagram` | `primaryMuscle: string`, `secondaryMuscles: string[]` | Front + back SVG diagrams with highlighted muscle groups |
| `GifPlayer` | `gifUrl: string`, `alt: string` | Loads ExerciseDB GIF with skeleton while loading and fallback on error |
| `CoachingContent` | `coaching: CoachingData` | Form cues, common mistakes, rationale sections — rendered only when coaching data exists |
| `FavoriteButton` | `exerciseId: string`, `isFavorite: boolean`, `onToggle: () => void`, `loading?: boolean` | Heart icon toggle with aria-label |
| `AddToSessionButton` | `exerciseId: string`, `exerciseName: string` | Shown only when active session exists; triggers add + shows toast |

## Exported Hooks

| Hook | Returns | Description |
|------|---------|-------------|
| `useExerciseSearch(options)` | `UseQueryResult<ExerciseSearchPage>` | Search + filter + paginate the static catalog |
| `useFavorites(userId)` | `{ favorites: Set<string>, toggle: (id) => void, isLoading: boolean }` | Optimistic favorites state backed by Supabase |

## Exported Utils

| Util | Signature | Description |
|------|-----------|-------------|
| `getCoachingByExerciseDbId(id: string)` | `CoachingData \| null` | Returns coaching content for catalog exercises; null for all others |

---

## Module Boundaries

- `exercises` module MAY import from `workout-session` module only for: `useWorkoutSessionStore` (to check session + call `addExercise`).
- `workout-session` module MAY import `useExerciseSearch` from `exercises` module (moved hook).
- No other cross-module imports are introduced by this spec.
- All Supabase calls for favorites go through `src/modules/exercises/services/favorites.ts` only.
