# Tasks: Exercise Library

**Input**: Design documents from `specs/007-exercise-library/`
**Branch**: `007-exercise-library`
**Tests**: Not requested — validation via `npm run build` + manual 375px visual check per constitution DoD.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared state dependencies)
- **[Story]**: User story label (US1–US4 maps to spec.md user stories)
- Exact file paths in every description

---

## Phase 1: Setup

**Purpose**: Migration, module scaffolding, SVG assets, i18n keys, types. No behaviour changes.

- [x] T001 Create `supabase/migrations/003_user_exercise_favorites.sql` — SQL from `data-model.md`: `CREATE TABLE user_exercise_favorites (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE, exercise_id TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (user_id, exercise_id));` + `ALTER TABLE user_exercise_favorites ENABLE ROW LEVEL SECURITY;` + `CREATE POLICY "Users own their favorites" ON user_exercise_favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`
- [x] T002 Create `src/modules/exercises/` directory structure: `components/`, `hooks/`, `services/`, `utils/`, `types/` — empty dirs only; create stub `src/modules/exercises/index.ts` with single comment `// barrel — exports added per phase`
- [x] T003 [P] Add 24 i18n keys to `src/i18n/ui.ts` in both `en` and `es` blocks (values from `specs/007-exercise-library/data-model.md` i18n table). NOTE: `formCues` already exists at line 22 — skip it, reuse existing key. Keys to add: `navExercises`, `exerciseLibraryTitle`, `exerciseSearch`, `filterMuscle`, `filterEquipment`, `filterFavorites`, `allMuscles`, `allEquipment`, `exercisesEmpty`, `exercisesEmptyFavorites`, `noExercisesFound`, `clearFilters`, `commonMistakesLabel`, `whyIncluded`, `primaryMuscle`, `secondaryMusclesLabel`, `equipmentLabel`, `addedToSession`, `addToSession`, `favoriteAdd`, `favoriteRemove`, `favoriteSyncError`, `exerciseGifAlt`, `musclesDiagram`
- [x] T004 [P] Create `src/modules/exercises/types/index.ts` — export `ExerciseFilterState`: `{ query: string; bodyPart: string; equipment: string; favoritesOnly: boolean; page: number }` and `CoachingData`: `{ rationale: string; formCues: string[]; commonMistakes: string[] }`
- [x] T005 [P] Convert `src/assets/muscle-diagrams/front.svg` → `src/assets/muscle-diagrams/FrontBodySvg.tsx` — Read the SVG file, convert to a React functional component: replace `class=` with `className=`, convert all hyphenated SVG attributes to camelCase, wrap in `export function FrontBodySvg()`. The component MUST preserve all `data-muscle="..."` attributes verbatim — these are used by MuscleDiagram to apply highlight styles. Return the full SVG JSX.
- [x] T006 [P] Convert `src/assets/muscle-diagrams/back.svg` → `src/assets/muscle-diagrams/BackBodySvg.tsx` — same conversion as T005 for the back view. Preserve all `data-muscle="..."` attributes.

**Checkpoint**: Module dirs exist; migration file ready to apply; i18n keys in en + es; SVG components built; types defined.

---

## Phase 2: Foundational — Blocking Prerequisites

**Purpose**: Hook relocation, coaching lookup, bottom nav tab, route stubs. BLOCKS all screen work.

**⚠️ CRITICAL**: No list or detail screen can be implemented until T007, T008, T009, T010 are complete.

- [x] T007 Move `src/modules/workout-session/hooks/use-exercise-search.ts` → `src/modules/exercises/hooks/use-exercise-search.ts` (copy file, delete original). Update BOTH import lines in `src/modules/workout-session/components/ExercisePicker.tsx` (lines 8 and 9 — value import and type import): change `from '../hooks/use-exercise-search'` to `from '@/modules/exercises/hooks/use-exercise-search'` in each. No other changes.
- [x] T008 [P] Create `src/modules/exercises/utils/catalog-coaching.ts` — imports all four routine files (`muscleGainRoutine`, `strengthRoutine`, `fatLossRoutine`, `conditioningRoutine` from `@/data/routines/`), imports `EXERCISE_CATALOG` from `@/data/exercises/catalog`. Builds two maps at module load time: `coachingMap: Map<ExerciseKey, CoachingData>` (iterates all routine days/exercises; first occurrence wins) and `idToKey: Map<string, ExerciseKey>` (reverse of EXERCISE_CATALOG exerciseDbId). Exports `getCoachingByExerciseDbId(exerciseDbId: string): CoachingData | null`.
- [x] T009 [P] Update `src/modules/home/components/BottomNav.tsx` — add `'navExercises'` to the `NavTab.labelKey` union type. Add new entry to `NAV_TABS` array: `{ href: '/exercises', labelKey: 'navExercises', Icon: BookOpen }` (import `BookOpen` from `lucide-react`). Insert between `navWorkout` and `history` tabs so order becomes: Home → Workout → Exercises → History → Profile. (Depends on T003 having added `navExercises` to i18n.)
- [x] T010 Create route dirs and stub pages: `src/app/(app)/exercises/page.tsx` and `src/app/(app)/exercises/[id]/page.tsx` — each exports a default function returning `<div className="p-4 text-gym-text">Coming soon</div>`. No `'use client'` — plain Server Components. Confirms bottom nav navigates without crashing.

**Checkpoint**: Navigate to `http://localhost:3000/exercises` while authenticated → "Coming soon" renders (not redirected, not 404). Bottom nav shows 5 tabs. `npm run build` still passes. `ExercisePicker` in workout session still works (smoke check: start workout → add exercise flow still opens).

---

## Phase 3: User Story 1 — Browse & Search (Priority: P1) 🎯 MVP

**Goal**: Full exercise list at `/exercises` with search, muscle-group filter, equipment filter, favorites-only toggle, pagination, and scroll restore.

**Independent Test**: Navigate to `/exercises` → list renders all exercises → type "squat" → filters in real-time → apply "upper legs" body-part chip → narrows further → apply "barbell" equipment chip → narrows further → clear all → full list returns → scroll down → more exercises load → tap an exercise → navigate to detail → tap back → list scroll position restored.

- [x] T011 [P] [US1] Create `src/modules/exercises/components/ExerciseListItem.tsx` — `'use client'`; props: `{ exercise: ExerciseSearchResult; isFavorite: boolean; onClick: () => void }`; renders: exercise name (`text-gym-text text-sm font-medium`), bodyPart + equipment badges (`text-xs text-gym-muted bg-gym-surface-2 rounded px-2 py-0.5`), Heart icon from `lucide-react` filled (`fill-gym-accent text-gym-accent`) when `isFavorite`; outer `<button>` with `className="flex w-full items-center gap-3 px-4 py-3 min-h-[44px] active:bg-gym-surface-2"` and `onClick` prop.
- [x] T012 [P] [US1] Create `src/modules/exercises/components/ExerciseFilters.tsx` — `'use client'`; props: `{ filters: ExerciseFilterState; onChange: (f: ExerciseFilterState) => void }`; renders: search `<input>` with `placeholder={t('exerciseSearch')}`, body-part `<select>` with `t('allMuscles')` default + `BODY_PARTS` options, equipment `<select>` with `t('allEquipment')` default + `EQUIPMENT_OPTIONS` options, favorites toggle `<button>` that sets `favoritesOnly`; all controls `min-h-[44px]`; on any change call `onChange({ ...filters, page: 0, [field]: value })` to reset pagination.
- [x] T013 [US1] Replace `src/app/(app)/exercises/page.tsx` stub — `'use client'`; manages `ExerciseFilterState` in `useState` (default: `{ query: '', bodyPart: '', equipment: '', favoritesOnly: false, page: 0 }`); calls `useExerciseSearch(filters)`; renders `ExerciseFilters` + scrollable list of `ExerciseListItem`; on scroll near bottom (within 200px): `setFilters(f => ({ ...f, page: f.page + 1 }))`; empty state: when `data.total === 0` show `<p>{t(filters.favoritesOnly ? 'exercisesEmptyFavorites' : 'exercisesEmpty')}</p>` + clear-filters button; tapping item: save `window.scrollY` to `sessionStorage.setItem('exercises-scroll', String(window.scrollY))` then `router.push('/exercises/' + exercise.id)`; on mount: `window.scrollTo(0, Number(sessionStorage.getItem('exercises-scroll') ?? 0))`; title `<h1>{t('exerciseLibraryTitle')}</h1>`; `isFavorite` prop on each item hardcoded `false` for now (wired in US3). (Depends on T011, T012.)
- [x] T014 [US1] Update `src/modules/exercises/index.ts` barrel — add: `export { ExerciseListItem } from './components/ExerciseListItem'`, `export { ExerciseFilters } from './components/ExerciseFilters'`, `export { useExerciseSearch, BODY_PARTS, EQUIPMENT_OPTIONS } from './hooks/use-exercise-search'`, `export type { ExerciseFilterState, CoachingData } from './types'`

**Checkpoint**: `/exercises` renders full list. Search and filter work in real-time. Pagination loads more on scroll. Empty state appears when no results. Scroll position saved and restored on back navigation. Each list item min 44px tall.

---

## Phase 4: User Story 2 — View Exercise Detail (Priority: P1)

**Goal**: Detail page at `/exercises/[id]` with animated GIF (skeleton + fallback), muscle diagram, basic exercise info, and coaching content for catalog exercises.

**Independent Test**: Tap Barbell Bench Press in list → detail opens → skeleton shows briefly → GIF loads → MuscleDiagram highlights chest primary + triceps/deltoids secondary → form cues, common mistakes, rationale sections visible → tap a non-catalog exercise → no coaching sections visible → DevTools: block `static.exercisedb.dev` → reload → fallback placeholder shows, rest of page intact → navigate to `/exercises/invalid-id` → not-found state with back link.

- [x] T015 [P] [US2] Create `src/modules/exercises/components/GifPlayer.tsx` — `'use client'`; props: `{ gifUrl: string; alt: string }`; state: `loaded: boolean`, `error: boolean`; renders skeleton `<div className="aspect-video w-full max-w-xs mx-auto rounded-lg bg-gym-surface-2 animate-pulse" />` when `!loaded && !error`; renders `<img>` with `onLoad={() => setLoaded(true)}` and `onError={() => setError(true)}`; when `error`: renders `<div className="aspect-video w-full max-w-xs mx-auto rounded-lg bg-gym-surface-2 flex items-center justify-center"><span className="text-xs text-gym-muted">{alt}</span></div>`; `<img>` hidden (`className="hidden"`) until loaded.
- [x] T016 [P] [US2] Create `src/modules/exercises/components/MuscleDiagram.tsx` — `'use client'`; props: `{ primaryMuscle: string; secondaryMuscles: string[] }`; imports `FrontBodySvg` from `@/assets/muscle-diagrams/FrontBodySvg`, `BackBodySvg` from `@/assets/muscle-diagrams/BackBodySvg`, `getMuscleId` from `@/services/muscle-map`; uses `useEffect` + `useRef` on wrapper divs to apply inline `fill` styles: for each `[data-muscle]` element in the SVG, if `getMuscleId(primaryMuscle)` matches → set `style.fill = 'var(--color-gym-accent)'` and `style.opacity = '0.9'`; for each secondary muscle → `style.opacity = '0.4'`; renders front + back SVGs side-by-side in `<div className="flex gap-4 justify-center" aria-label={t('musclesDiagram')} role="img">`; each SVG wrapped in `<div className="w-1/2 max-w-[140px]">`.
- [x] T017 [P] [US2] Create `src/modules/exercises/components/CoachingContent.tsx` — `'use client'`; props: `{ coaching: CoachingData }`; renders three labelled sections: `<section>` for rationale (`t('whyIncluded')` heading + `<p>`), `<section>` for formCues (`t('formCues')` heading + `<ol>` numbered list), `<section>` for commonMistakes (`t('commonMistakesLabel')` heading + `<ul>` bulleted list); each heading `text-sm font-semibold text-gym-text mb-2`; content `text-sm text-gym-muted leading-relaxed`; outer `<div className="flex flex-col gap-6">`.
- [x] T018 [US2] Replace `src/app/(app)/exercises/[id]/page.tsx` stub — `'use client'`; get `id` via `const { id } = useParams<{ id: string }>()` (import `useParams` from `next/navigation` — NOT from `params` prop; Next.js 15 client components must use `useParams()`); finds exercise: `const exercise = (exercisesJson as ExerciseSearchResult[]).find(e => e.id === id)`; if not found: renders not-found state `<div className="p-4 flex flex-col gap-4"><p>{t('noExercisesFound')}</p><Link href="/exercises">{t('clearFilters')}</Link></div>` (no crash); else renders: back `<button onClick={router.back}>` (`←` + exercise name or `t('exerciseLibraryTitle')`), `<GifPlayer gifUrl={exercise.gifUrl} alt={t('exerciseGifAlt').replace('{name}', exercise.name)} />`, basic info section (bodyPart, equipment, target, secondaryMuscles labels using t keys), `<MuscleDiagram primaryMuscle={exercise.target} secondaryMuscles={exercise.secondaryMuscles} />`, if `getCoachingByExerciseDbId(id)` non-null: `<CoachingContent coaching={...} />`; placeholder `{/* FavoriteButton — added T024 */}` and `{/* AddToSessionButton — added T027 */}`; page title `<h1 className="text-lg font-semibold text-gym-text">{exercise.name}</h1>`. (Depends on T008, T015, T016, T017.)
- [x] T019 [US2] Update `src/modules/exercises/index.ts` barrel — add: `export { GifPlayer } from './components/GifPlayer'`, `export { MuscleDiagram } from './components/MuscleDiagram'`, `export { CoachingContent } from './components/CoachingContent'`

**Checkpoint**: `/exercises/[exercise-id]` opens from list. GIF skeleton shows then resolves. Blocking CDN shows fallback. Muscle diagram highlights primary muscle. Barbell Bench Press shows coaching sections. Non-catalog exercise shows no coaching sections. `/exercises/invalid-id` shows not-found state with back link.

---

## Phase 5: User Story 3 — Favorite an Exercise (Priority: P2)

**Goal**: Optimistic favorite toggle on detail page; heart icon on favorited list rows; favorites-only filter works; server-persisted via Supabase.

**Independent Test**: On detail page tap heart → fills immediately (optimistic) → navigate away and back → still filled → list shows heart on that row → apply Favorites filter in list → only that exercise shown → un-favorite → heart empties immediately → removed from filter → simulate error (block Supabase in DevTools) → tap heart → fills, then reverts after request fails + error shown.

- [x] T020 [P] [US3] Create `src/modules/exercises/services/favorites.ts` — imports `createClient` from `@/lib/supabase/client`; exports three functions: `getFavorites(userId: string): Promise<string[]>` (SELECT exercise_id WHERE user_id = userId; returns array of exercise_id strings), `addFavorite(userId: string, exerciseId: string): Promise<void>` (INSERT INTO user_exercise_favorites), `removeFavorite(userId: string, exerciseId: string): Promise<void>` (DELETE WHERE user_id AND exercise_id); throw on error.
- [x] T021 [US3] Create `src/modules/exercises/hooks/use-favorites.ts` — `'use client'`; imports `useWorkoutSessionStore` for `userId` OR reads from Supabase session; use `useQuery({ queryKey: ['favorites', userId], queryFn: () => getFavorites(userId), enabled: !!userId })`; `useMutation` for toggle with optimistic update: `onMutate`: snapshot current Set, update queryClient cache optimistically; `onError`: roll back to snapshot; `onSettled`: `queryClient.invalidateQueries(['favorites', userId])`; returns `{ favorites: Set<string>; toggle: (exerciseId: string) => void; isLoading: boolean; error: string | null }`; get userId from `createClient().auth.getUser()` on mount via `useEffect` or from a query.
- [x] T022 [US3] Create `src/modules/exercises/components/FavoriteButton.tsx` — `'use client'`; props: `{ exerciseId: string; isFavorite: boolean; onToggle: () => void; error?: string | null }`; renders `<button onClick={onToggle} aria-label={isFavorite ? t('favoriteRemove') : t('favoriteAdd')} className="flex items-center justify-center min-h-[44px] min-w-[44px]">`; `<Heart className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} />` with `text-gym-accent` when filled; if `error`: `<p role="alert" className="text-xs text-red-400 mt-1">{t('favoriteSyncError')}</p>` below button. (Depends on T021.)
- [x] T023 [US3] Update `src/app/(app)/exercises/page.tsx` — add `useFavorites()` hook; pass `isFavorite={favorites.has(exercise.id)}` to each `ExerciseListItem`; when `filters.favoritesOnly` is true, pre-filter results client-side: `exercises.filter(e => favorites.has(e.id))` before rendering. (Depends on T021.)
- [x] T024 [US3] Update `src/app/(app)/exercises/[id]/page.tsx` — replace `{/* FavoriteButton placeholder */}` comment with real `<FavoriteButton exerciseId={id} isFavorite={favorites.has(id)} onToggle={() => toggle(id)} error={error} />` wired to `useFavorites()`; position in header row alongside exercise name. (Depends on T022.)
- [x] T025 [US3] Update `src/modules/exercises/index.ts` barrel — add: `export { FavoriteButton } from './components/FavoriteButton'`, `export { useFavorites } from './hooks/use-favorites'`

**Checkpoint**: Favorite toggle on detail page updates immediately. Heart icon appears on list rows. Favorites-only filter works. Favorite state persists across page reload. Error message appears and state reverts when Supabase blocked.

---

## Phase 6: User Story 4 — Add Exercise to Active Session (Priority: P2)

**Goal**: "Add to session" button on detail page visible only when active session exists; tapping appends exercise and shows auto-dismiss toast.

**Independent Test**: Start active workout → navigate to `/exercises` → open any detail → "Add to session" button visible → tap → toast appears "Added to workout" → auto-dismisses → navigate to workout → exercise appended at end. Open detail with no active session → button not shown.

- [x] T026 [US4] Create `src/modules/exercises/components/AddToSessionButton.tsx` — `'use client'`; imports `useWorkoutSessionStore` from `@/modules/workout-session/stores/workout-session-store`; props: `{ exerciseId: string; exerciseName: string }`; `const session = useWorkoutSessionStore(s => s.session)`; `const addExercise = useWorkoutSessionStore(s => s.addExercise)`; if `!session` return `null` (FR-018 — hidden); local state `toastVisible: boolean`; `handleAdd`: call `addExercise({ exerciseId, exerciseNameSnapshot: exerciseName })` → `setToastVisible(true)` → `setTimeout(() => setToastVisible(false), 2000)`; renders `<button disabled={toastVisible} onClick={handleAdd} className="glow-accent h-11 w-full rounded-lg bg-gym-accent font-semibold text-white disabled:opacity-50">{t('addToSession')}</button>`; toast: `{toastVisible && <div role="status" className="fixed bottom-16 left-0 right-0 mx-4 py-2 text-center text-sm font-medium text-white bg-gym-accent rounded-lg">{t('addedToSession')}</div>}`.
- [x] T027 [US4] Update `src/app/(app)/exercises/[id]/page.tsx` — replace `{/* AddToSessionButton placeholder */}` comment with `<AddToSessionButton exerciseId={id} exerciseName={exercise.name} />` positioned below FavoriteButton + basic info, above coaching content. (Depends on T026.)
- [x] T028 [US4] Update `src/modules/exercises/index.ts` barrel — add: `export { AddToSessionButton } from './components/AddToSessionButton'`

**Checkpoint**: With active session open detail → "Add to session" button visible → tap → toast appears and dismisses → exercise in session. With no session → button absent. Button disabled during toast to prevent double-tap.

---

## Phase 7: Polish & DoD Validation

**Purpose**: Build verification and final visual check.

- [x] T029 Run `npm run build` — verify zero TypeScript errors; fix any type errors before marking done
- [ ] T030 Manual DoD check per `specs/007-exercise-library/quickstart.md` DoD Checklist: (1) list renders + search/filter/pagination work; (2) detail: GIF skeleton → load → fallback on block; muscle diagram highlights; catalog exercise shows coaching; non-catalog shows none; (3) favorites: optimistic toggle + heart on list rows + Favorites filter; (4) add-to-session: toast + appended; (5) all screens 375px no overflow; (6) Exercises tab in nav (5 tabs, none removed); (7) invalid ID → not-found state; (8) migration applied + RLS verified; (9) all i18n keys in en + es

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately; T003–T006 parallel after T002
- **Phase 2 (Foundational)**: Depends on Phase 1 — T007, T008, T009 parallel; T010 depends on T009
- **Phase 3 (US1)**: T011 and T012 parallel; T013 depends on T011+T012; T014 depends on T013
- **Phase 4 (US2)**: T015, T016, T017 parallel; T018 depends on T008+T015+T016+T017; T019 depends on T018
- **Phase 5 (US3)**: T020 parallel; T021 depends on T020; T022 depends on T021; T023+T024 parallel after T022; T025 depends on T023+T024
- **Phase 6 (US4)**: T026 independent of US3; T027 depends on T026+T024 (detail page must exist); T028 depends on T027
- **Phase 7**: Depends on all phases complete

### Parallel Opportunities

```
Phase 1:  T001 → T002 → [T003 ‖ T004 ‖ T005 ‖ T006]
Phase 2:  [T007 ‖ T008 ‖ T009] → T010
Phase 3:  [T011 ‖ T012] → T013 → T014
Phase 4:  [T015 ‖ T016 ‖ T017] → T018 → T019
Phase 5:  T020 → T021 → T022 → [T023 ‖ T024] → T025
Phase 6:  T026 → T027 → T028
Phase 7:  T029 → T030
```

Phase 4 (US2) and Phase 3 (US1) depend on Phase 2 completing but are otherwise independent of each other — they CAN be worked in parallel.

---

## Implementation Strategy

### MVP (US1 + US2 only — P1 stories)
1. Phase 1 (T001–T006)
2. Phase 2 (T007–T010)
3. Phase 3 (T011–T014) — list screen
4. Phase 4 (T015–T019) — detail screen
5. T029 build check
6. **VALIDATE**: Browse + detail end-to-end at 375px

### Full delivery order
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7

Each phase is independently testable and adds a complete user story increment.
