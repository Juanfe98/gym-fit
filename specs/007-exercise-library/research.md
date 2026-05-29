# Research: Exercise Library

## Existing Assets — No Unknowns

All dependencies already exist in the project. No external research required.

---

## Decision 1: Browse source — exercises.json vs catalog.ts

**Decision**: Use `exercises.json` (1500 exercises) as the browse source.
**Rationale**: `catalog.ts` has ~37 entries — insufficient for a meaningful library. `exercises.json` is what the existing `use-exercise-search` hook already targets.
**Alternatives considered**: catalog-only (too small), ExerciseDB live API (violates Constitution IV — must work without it).

---

## Decision 2: Coaching content lookup strategy

**Decision**: Build a reverse-lookup utility at module load time: `exerciseDbId → ExerciseKey → coaching data` from routine files.
**Rationale**: Coaching content (formCues, commonMistakes, rationale) lives in `src/data/routines/*.ts` nested inside `ExerciseRef` objects. A flat map built once at module init is O(1) per lookup with zero runtime cost.
**Alternatives considered**: Fetching from Supabase (no coaching data there), duplicating coaching data (violates DRY), embedding in exercises.json (would require maintaining 1500-entry file).
**Key mapping**: `EXERCISE_CATALOG[exerciseKey].exerciseDbId` links the two data sources.

---

## Decision 3: MuscleDiagram in React

**Decision**: Convert `front.svg` and `back.svg` from `src/assets/muscle-diagrams/` into inline React components (`FrontBodySvg.tsx`, `BackBodySvg.tsx`). `MuscleDiagram.tsx` imports them and applies CSS to `[data-muscle]` elements.
**Rationale**: Inline SVG is the only way to apply per-element CSS without new dependencies. The original Astro component used the same SVG assets and `data-muscle` attributes via `muscle-map.ts`.
**Alternatives considered**: `@svgr/webpack` (new dep, violates FR-024), `dangerouslySetInnerHTML` with fetch (network call, unpredictable), `next/image` (no per-element styling).
**Note**: One-time conversion of 2 SVG files into React components. Maintenance impact is zero — diagrams never change.

---

## Decision 4: use-exercise-search hook location

**Decision**: Move `src/modules/workout-session/hooks/use-exercise-search.ts` to `src/modules/exercises/hooks/use-exercise-search.ts`. Update the single import in `ExercisePicker.tsx`.
**Rationale**: The hook belongs to the exercises domain, not the workout session domain. The workout session just consumes it. Leaving it in workout-session would create an inverted module dependency (exercises module importing from workout-session).
**Alternatives considered**: Duplicate the hook (introduces drift), put in `src/shared/hooks/` (correct but adds a shared layer not yet established in this project).

---

## Decision 5: Favorites persistence — optimistic update pattern

**Decision**: Use TanStack Query `useMutation` with `onMutate`/`onError`/`onSettled` lifecycle for optimistic updates. Favorites state is managed by a `use-favorites.ts` hook backed by Supabase.
**Rationale**: TanStack Query v5 provides built-in optimistic update support. Pattern already established in the project (server state via TQ per constitution stack constraints).
**Alternatives considered**: Zustand local state + sync queue (adds complexity, offline behavior is not offline-first like sessions), SWR (not in project stack).

---

## Decision 6: Toast component

**Decision**: Build a minimal auto-dismiss `AddToSessionToast.tsx` using `useState` + `useEffect` timeout. Pattern already used in `PrBadge.tsx` (workout-session module).
**Rationale**: No shared toast library in the project. The existing PrBadge pattern is simple, proven, and requires no new dependency.
**Alternatives considered**: `react-hot-toast` or `sonner` (new deps, violates FR-024).

---

## Decision 7: Scroll position restoration

**Decision**: Store scroll position in `sessionStorage` keyed by route before navigating to detail. Restore on back navigation via `useEffect` + `window.scrollTo`.
**Rationale**: Next.js App Router does not automatically restore scroll position for client-side navigation within the same layout. `sessionStorage` is cleared on tab close (appropriate — no stale position on fresh open).
**Alternatives considered**: URL state for scroll offset (pollutes URL), Zustand store (adds state for ephemeral UI concern).
