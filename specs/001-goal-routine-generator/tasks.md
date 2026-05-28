# Tasks: Goal-Based Routine Generator

**Input**: Design documents from `specs/001-goal-routine-generator/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅
**Tests**: None — DoD is `npm run build` pass + visual verification at 375px (Constitution)
**UI tasks**: Invoke `ui-ux-pro-max` skill for design decisions on all component and page tasks

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable — different files, no shared dependencies
- **[Story]**: User story label (US1, US2)

---

## Phase 1: Setup

**Purpose**: Scaffold Astro project and configure locked stack.

- [x] T001 Initialize Astro project — run `npm create astro@latest` with minimal/empty template, TypeScript strict, into `gym-planner/` root; confirm `astro.config.mjs`, `package.json`, `tsconfig.json` generated
- [x] T002 Get user approval then install `tsx` as devDependency (`npm install -D tsx`) — required for `scripts/fetch-exercises.ts`; flag per Constitution Principle V before installing
- [x] T003 [P] Configure Tailwind CSS v4 — install package, set up PostCSS integration with Astro, create `src/styles/global.css` with `@import "tailwindcss"` and empty `@theme {}` block; no `tailwind.config.ts`
- [x] T004 [P] Configure `@astrojs/vercel` static adapter — install package, update `astro.config.mjs` with `output: 'static'` and `adapter: vercel()`
- [x] T005 [P] Create `.env.example` documenting `EXERCISEDB_API_KEY=your_rapidapi_key_here`; add `.env` to `.gitignore` (ensure `src/data/exercises/exercises.json` is NOT gitignored)
- [x] T006 Create full `src/` directory structure per plan: `types.ts` (empty placeholder), `data/routines/`, `data/exercises/`, `pages/routine/`, `pages/exercise/`, `components/`, `services/`, `assets/muscle-diagrams/`, `styles/`

**Checkpoint**: `npm run dev` starts without errors on localhost:4321

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, data pipeline, and SVG assets that all user story phases depend on.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [x] T007 Define all shared TypeScript interfaces in `src/types.ts` — `Goal`, `ExerciseKey`, `Routine`, `TrainingDay`, `ExerciseRef` (using stable `exerciseKey`, not provider IDs), `Exercise`, `MuscleHighlight` aligned with the curated catalog approach
- [x] T008 [P] Write `src/services/exercisedb.ts` — export `fetchExercisePage(cursor?: string): Promise<ExercisePage>` that calls `GET https://oss.exercisedb.dev/api/v1/exercises` with cursor pagination; map raw `exerciseId`, `gifUrl`, body parts, equipment, target and secondary muscles into typed `Exercise[]`
- [x] T009 [P] Write `scripts/fetch-exercises.ts` — calls `fetchExercisePage()` from `exercisedb.ts`; supports resumable batched fetching via `src/data/exercises/.fetch-cursor`; accumulates and writes the full array to `src/data/exercises/exercises.json`; run with `npm run fetch:exercises`
- [x] T010 Run `npm run fetch:exercises` enough times to populate `src/data/exercises/exercises.json`; commit the resulting file — complete cache currently contains 1500 ExerciseDB records with valid `gifUrl` fields
- [x] T011 [P] Source muscle diagram SVGs — download `front.svg` and `back.svg` from the `body-highlighter` MIT-licensed GitHub repository (raw file URLs); verify MIT license in repo; place at `src/assets/muscle-diagrams/front.svg` and `src/assets/muscle-diagrams/back.svg`; commit both files
- [x] T012 Write `src/services/muscle-map.ts` — **depends on T011**: open both SVGs and inspect actual element IDs on `<path>` or `<g>` tags for each muscle group; write `MUSCLE_MAP: Record<string, string>` mapping ExerciseDB muscle strings (e.g. `"pectorals"`, `"lats"`, `"abs"`, `"triceps"`, `"biceps"`, `"glutes"`, `"hamstrings"`, `"quads"`, `"delts"`, `"upper back"`, `"lower back"`, `"traps"`, `"calves"`) to their SVG element IDs; export `getMuscleId(name: string): string | undefined`
- [x] T012A Write `src/data/exercises/catalog.ts` — curated app-level exercise catalog mapping stable `ExerciseKey` values to provider-specific ExerciseDB IDs from `exercises.json`; include notes for closest-available media substitutions (e.g. face pull, glute bridge); routines must reference catalog keys rather than raw ExerciseDB IDs
- [x] T012B Write `src/services/exercise-lookup.ts` — load cached `exercises.json`, index exercises by provider ID, expose helpers to resolve an `ExerciseKey` through `EXERCISE_CATALOG` to its cached `Exercise` and generated exercise page ID
- [x] T012C Write `scripts/validate-routines.ts` and add `validate:routines` to `package.json` — verify every routine `exerciseKey` exists in the catalog, every catalog ExerciseDB ID exists in `exercises.json`, every linked exercise has `gifUrl`, and every training day has exactly 5 exercises; run validation before `astro build`

**Checkpoint**: `npm run build` passes with zero TypeScript errors. `exercises.json` is committed and non-empty.

---

## Phase 3: US1 — Goal Selection + Routine Display (Priority: P1) 🎯 MVP

**Goal**: User lands on homepage, selects a training goal, and sees their complete weekly routine with exercise links.

**Covers**: FR1 (goal selection), FR2 (routine display + rationale), FR6 (no auth), Scenarios 1 & 3

**Independent Test**: Open `/`, tap "Muscle Gain", confirm routine page shows training days with 5 exercises each and a 2–4 sentence rationale. Repeat for all 4 goals. Verify at 375px viewport.

### Routine Data (manually authored content)

- [x] T013 [P] [US1] Author `src/data/routines/muscle-gain.ts` — export `muscleGainRoutine: Routine`; hypertrophy-focused push/pull/legs + upper/lower volume split; 5 days, 5 exercises per day; each `ExerciseRef` has stable `exerciseKey` from `EXERCISE_CATALOG`, goal-specific `rationale`, 3–6 `formCues` at intermediate-to-advanced level, 2–4 `commonMistakes`; no placeholder text
- [x] T014 [P] [US1] Author `src/data/routines/strength.ts` — export `strengthRoutine: Routine`; powerlifting/strength-focused split (squat/bench/deadlift days + accessories); 5 days, 5 exercises per day; each `ExerciseRef` uses stable `exerciseKey`; same content requirements as T013
- [x] T015 [P] [US1] Author `src/data/routines/fat-loss.ts` — export `fatLossRoutine: Routine`; full-body resistance + metabolic finisher structure; 4 days, 5 exercises per day; each `ExerciseRef` uses stable `exerciseKey`; same content requirements as T013
- [x] T016 [P] [US1] Author `src/data/routines/conditioning.ts` — export `conditioningRoutine: Routine`; athletic power, strength, conditioning, and integration split; 5 days, 5 exercises per day; each `ExerciseRef` uses stable `exerciseKey`; same content requirements as T013
- [x] T017 [US1] Create `src/data/routines/index.ts` — export `ROUTINES: Record<Goal, Routine>` importing all 4 routines (depends on T013–T016)

### UI Components + Pages

- [x] T018 [P] [US1] Build `src/components/GoalCard.astro` — **invoke `ui-ux-pro-max` skill** for design direction; props: `{ goal: Goal; displayName: string; href: string }`; entire card is one tap target ≥44×44px; no hover-only affordances; high contrast; gym-floor aesthetic
- [x] T019 [US1] Build `src/pages/index.astro` — **invoke `ui-ux-pro-max` skill**; import `ROUTINES`, render 4 `GoalCard` components; 375px-first layout; no auth gate; no account prompt
- [x] T020 [P] [US1] Build `src/components/RoutineDay.astro` — **invoke `ui-ux-pro-max` skill**; props: `{ day: TrainingDay; goal: Goal }`; renders day label, focus muscles, ordered list of exercise links; resolves `exercise.exerciseKey` through `getExercisePageId()` so hrefs use `/exercise/{catalog ExerciseDB id}`; exercise link tap targets ≥44×44px
- [x] T021 [US1] Build `src/pages/routine/[goal].astro` — **invoke `ui-ux-pro-max` skill**; `getStaticPaths` from `Object.keys(ROUTINES)`; renders routine `rationale`, ordered `RoutineDay` list; 375px-first; 404 on invalid goal slug (handled by Astro static output)

**Checkpoint**: `npm run build` passes. Navigate `/` → select goal → routine page shows correct days and exercises. All 4 goals work. Verify at 375px.

---

## Phase 4: US2 — Exercise Card (Priority: P2)

**Goal**: User taps an exercise name and sees the full exercise card — animated GIF, muscle diagram, form cues, common mistakes, goal-specific rationale. GIF fallback works if load fails.

**Covers**: FR3 (exercise card), FR4 (graceful degradation), Scenarios 2 & 4

**Independent Test**: From routine page tap any exercise → exercise card shows. GIF loads (or fallback placeholder shows). Muscle diagram highlights correct primary (one color) and secondary (different color) muscles. All text visible. Back button returns to routine with scroll position restored. Verify at 375px.

- [x] T022 [US2] Build `src/components/MuscleDiagram.astro` — **invoke `ui-ux-pro-max` skill**; props: `{ primary: string[]; secondary: string[] }`; inline both `front.svg` and `back.svg` as raw HTML (use `fs.readFileSync` in Astro frontmatter); for each muscle string call `getMuscleId()` from `muscle-map.ts`; add CSS class `muscle-primary` to matched elements in primary array and `muscle-secondary` to secondary array; unmatched elements use default neutral fill; **no `client:*` directive** — pure server-side; depends on T011 and T012
- [x] T023 [US2] Add Tailwind `@theme` tokens in `src/styles/global.css` — define `--color-muscle-primary` (e.g. red-500) and `--color-muscle-secondary` (e.g. orange-300); add `.muscle-primary { fill: var(--color-muscle-primary); }` and `.muscle-secondary { fill: var(--color-muscle-secondary); }` as global CSS rules
- [x] T024 [US2] Build `src/components/ExerciseCard.astro` — **invoke `ui-ux-pro-max` skill**; props: `{ routineRef: ExerciseRef; exercise: Exercise }`; render `<img src={exercise.gifUrl}>` with descriptive alt text; render `MuscleDiagram` with `primary={[exercise.target]}` and `secondary={exercise.secondaryMuscles}`; render `formCues`, `commonMistakes`, goal-specific `rationale`; all text visible independently of GIF loading state
- [x] T025 [US2] Build `src/pages/exercise/[id].astro` — **invoke `ui-ux-pro-max` skill**; `getStaticPaths`: collect all unique catalog ExerciseDB IDs by resolving routine `exerciseKey` values through `EXERCISE_CATALOG` (not from all exercises.json entries — only referenced exercises); for each ID load matching `ExerciseRef` and cached `Exercise`; render `ExerciseCard`; back navigation uses browser default (no custom JS needed); 375px-first

**Checkpoint**: `npm run build` passes. Exercise card renders at 375px. Manually test GIF fallback by blocking network in DevTools. All text visible with GIF blocked. Confirm scroll restoration on back navigation.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Mobile hardening, accessibility, final validation.

- [x] T026 [P] Audit all interactive elements for 44×44px minimum tap targets — `GoalCard`, exercise name links in `RoutineDay`, back navigation; fix any that fall short
- [x] T027 [P] Verify `src/styles/global.css` sets `body { font-size: 16px; }` (or Tailwind base) — no viewport zoom needed to read body text on mobile
- [x] T028 [P] Add `aria-label` to SVG elements in `MuscleDiagram.astro` — primary muscle groups get `aria-label="{muscleName} (primary)"`, secondary get `aria-label="{muscleName} (secondary)"`; add `role="img"` to SVG root with `aria-label="Muscle diagram"`
- [x] T029 [P] Remove Astro scaffold boilerplate — delete any default pages, styles, or components not used by this feature; keep `src/` clean per plan structure
- [x] T030 Final validation — run `npm run build`; confirm zero TypeScript errors; open `dist/` locally; check all 3 page types at 375px viewport; check exercise card at 375px with GIF blocked; confirm all 4 goal routines render

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — blocks all user stories
  - T012 (muscle-map) depends on T011 (SVGs sourced) — do T011 first, inspect SVG IDs, then write map
  - T009/T010 (fetch script + run) depends on T008 (exercisedb.ts service)
  - T012A/T012B/T012C (catalog, lookup, validation) depend on T010 cache and T013–T016 routine exercise choices before final validation
- **Phase 3 (US1)**: Depends on Phase 2 complete
  - T013–T016 (routine files) are independent of each other — fully parallel, but each exercise must use a stable `ExerciseKey` from `EXERCISE_CATALOG`
  - T017 (index.ts) depends on T013–T016 all done
  - T018/T020 (GoalCard, RoutineDay components) are independent — parallel; T020 also depends on T012B for key-to-page-ID resolution
  - T019 (index.astro) depends on T018
  - T021 (routine page) depends on T017 + T020
- **Phase 4 (US2)**: Depends on Phase 2 + Phase 3 complete
  - T022 (MuscleDiagram) depends on T011 + T012
  - T023 (Tailwind tokens) is independent — parallel with T022
  - T024 (ExerciseCard) depends on T022 + T023
  - T025 (exercise page) depends on T017 + T024 + T012A/T012B so static paths are generated from catalog-resolved routine exercises
- **Phase 5 (Polish)**: Depends on Phase 4 complete

### Parallel Opportunities

```
Phase 1 parallel:  T003 + T004 + T005 (Tailwind, Vercel adapter, .env.example)
Phase 2 parallel:  T008 + T011 (exercisedb.ts + SVG sourcing)
                   T009 unblocks after T008
Phase 3 parallel:  T013 + T014 + T015 + T016 (all 4 routine files)
                   T018 + T020 (GoalCard + RoutineDay)
Phase 4 parallel:  T022 + T023 (MuscleDiagram + Tailwind tokens)
Phase 5 parallel:  T026 + T027 + T028 + T029
```

---

## Implementation Strategy

### MVP (Phase 1 → 2 → 3 only)

1. Complete Phase 1: Scaffold + configure stack
2. Complete Phase 2: Types, data pipeline, SVGs, muscle map
3. Complete Phase 3: Routine data + homepage + routine pages
4. **STOP and validate**: All 4 goal routines accessible, correct content, 375px verified
5. Deploy preview — this is a shippable MVP (no exercise cards yet)

### Full Feature Delivery

1. MVP complete →
2. Phase 4: Exercise card + muscle diagram + GIF fallback
3. Phase 5: Mobile polish + accessibility + final build check
4. Deploy to production

---

## Notes

- All UI tasks: invoke `ui-ux-pro-max` skill for aesthetic decisions — gym-floor context, high contrast, mobile-first
- `exercises.json` must be committed — CI does not re-fetch
- Routines reference stable internal `exerciseKey` values; provider-specific ExerciseDB IDs live only in `src/data/exercises/catalog.ts`
- `npm run build` runs `validate:routines` before Astro build to catch broken catalog/routine/cache links
- `muscle-map.ts` cannot be written until SVG element IDs are physically inspected (T011 → T012)
- Routine data files (T013–T016) require real content — no placeholders per Constitution III
- `npm run build` must pass zero TypeScript errors before marking any checkpoint done
- Visual verification at 375px is required at each checkpoint per Constitution DoD
