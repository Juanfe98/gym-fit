# Tasks: Workout History

**Input**: Design documents from `/specs/004-workout-history/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story. US5 (post-workout summary) is already implemented — its only work
is migration + payload updates in Phase 2 (T003–T005).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story this task delivers (US1–US4; US5 covered by Phase 2)

---

## Phase 1: Setup

**Purpose**: Module scaffold and shared i18n strings

- [x] T001 Create src/modules/workout-history/ directory structure with empty index.ts barrel: types/, services/, hooks/, components/, stores/, utils/
- [x] T002 [P] Add history i18n keys (en + es) to src/i18n/ui.ts — keys: `history`, `historyEmpty`, `historyEmptyCtaStart`, `historyFilterEmpty`, `historyClearFilter`, `historySearchPlaceholder`, `historyWorkouts`, `historySets`, `historyDate7d`, `historyDate30d`, `historyDate90d`, `historyDate180d`, `historyDate365d`, `historyDateAll`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migration, cross-module payload update, shared service, types, utilities, and nav.
US5 (post-workout summary saves total_volume + pr_count) is satisfied by T003–T005.

**⚠️ CRITICAL**: No history UI tasks can begin until T003–T009 are complete.

- [x] T003 Create supabase/migrations/002_workout_sessions_summary.sql — `ALTER TABLE workout_sessions ADD COLUMN total_volume NUMERIC(10,2), ADD COLUMN pr_count INT NOT NULL DEFAULT 0;` — no new RLS policies needed
- [x] T004 Add `total_volume: number` and `pr_count: number` fields to the `session` object inside `SyncSessionPayload` in src/modules/workout-session/services/session-supabase.ts
- [x] T005 Write `total_volume: session.totalVolume` and `pr_count: session.prCount` in `finishedSessionToPayload` in src/modules/workout-session/utils/session-payload.ts (depends on T004)
- [x] T006 [P] Create TypeScript types in src/modules/workout-history/types/index.ts — `WorkoutHistorySummary` (note: `totalVolume: number | null` — nullable until migration 002 written), `WorkoutHistoryDetail`, `WorkoutHistoryExercise`, `WorkoutHistorySet`, `DateRangeFilter`, `HistoryFilters` — match exactly the shapes in specs/004-workout-history/data-model.md §3; add `prCount: number` to `WorkoutHistorySummary`
- [x] T007 [P] Create historyKeys query key factory in src/modules/workout-history/hooks/query-keys.ts — match contract at specs/004-workout-history/contracts/tanstack-query-keys.ts exactly
- [x] T008 [P] Create `formatSessionName(session: Pick<WorkoutHistorySummary, 'startedAt' | 'sourcePlanId'>): string` in src/modules/workout-history/utils/format-session-name.ts — returns `"Workout"` when sourcePlanId set, else `"Workout — {MMM d}"` from startedAt using `Intl.DateTimeFormat`
- [x] T009 Implement `fetchHistoryList`, `fetchHistoryDetail`, `searchSessionsByExercise` in src/modules/workout-history/services/history-supabase.ts — signatures from specs/004-workout-history/contracts/supabase-queries.ts; accepts `SupabaseClient` as param (works with both server and browser client); fetchHistoryList filters WHERE status='completed', ORDER BY started_at DESC, LIMIT 20 with cursor on started_at (depends on T006)
- [x] T010 Build bottom tab nav in src/app/(app)/layout.tsx — add `BottomNav` inline (Workout tab → `/workout`, History tab → `/history`); use `usePathname()` for active state; Lucide icons `Dumbbell` + `History` (both from `lucide-react`); `"use client"` already set on layout; min 44px tap targets

**Checkpoint**: Run `npm run build`. Foundation ready — user story work can begin.

---

## Phase 3: User Story 1 — Browse Workout History List (Priority: P1) 🎯 MVP

**Goal**: Authenticated user sees a paginated list of completed sessions sorted by date descending, with name, date, duration, volume, and set count on each card. Empty state shown when no sessions exist.

**Independent Test**: Complete at least one workout session → navigate to `/history` → verify session card shows name, date, duration, total volume (or "—" if pre-migration), and set count.

- [x] T011 [P] [US1] Create `WorkoutHistoryCard` in src/modules/workout-history/components/WorkoutHistoryCard.tsx — props: `session: WorkoutHistorySummary`; display: `formatSessionName()` as title, date from `startedAt`, `formatDuration(durationSeconds)`, `totalVolume ?? '—'` with unit label, `totalSets` sets, `notes` truncated to 2 lines (`line-clamp-2`); define `formatDuration(seconds: number): string` locally in this file (same h/m/s logic as `src/modules/workout-session/components/SessionSummary.tsx:16–23` — do not import from there); no navigation yet (added in T019)
- [x] T012 [P] [US1] Create `HistoryEmptyState` in src/modules/workout-history/components/HistoryEmptyState.tsx — props: `variant: 'no-history' | 'filtered'`; `no-history`: i18n `historyEmpty` message + `historyEmptyCtaStart` CTA button linking to `/workout`; `filtered`: i18n `historyFilterEmpty` message + clear-filter button (callback prop)
- [x] T013 [US1] Create `useHistoryList` hook in src/modules/workout-history/hooks/use-history-list.ts — `useInfiniteQuery` with key from `historyKeys.list(filters)`, page size 20, cursor pagination on `started_at`; accepts `filters: HistoryFilters` (default: `{ dateRange: null, exerciseSearch: '' }`); passes `SupabaseClient` (browser client from `@/lib/supabase/client`) to `fetchHistoryList` (depends on T007, T009)
- [x] T014 [US1] Create `WorkoutHistoryList` `"use client"` component in src/modules/workout-history/components/WorkoutHistoryList.tsx — props: `initialData: FetchHistoryListResult`; calls `useHistoryList` with `initialData` shaped as `{ pages: [initialData], pageParams: [undefined] }` (use actual `initialData.hasMore` from server fetch, not hardcoded `true`); renders `WorkoutHistoryCard` per session; renders `HistoryEmptyState variant="no-history"` when pages are empty; "Load more" button triggers `fetchNextPage` only when `hasNextPage` is true (depends on T011, T012, T013)
- [x] T015 [US1] Create history list Server Page in src/app/(app)/history/page.tsx — Server Component; uses `createClient()` from `@/lib/supabase/server`; calls `fetchHistoryList` for first page; passes result as `initialData` to `WorkoutHistoryList`; export `WorkoutHistoryList` and `WorkoutHistoryCard` from src/modules/workout-history/index.ts (depends on T009, T014)

**Checkpoint**: Navigate to `/history` — list renders with session cards. Empty state appears when no completed sessions exist.

---

## Phase 4: User Story 2 — View Workout Detail (Priority: P1)

**Goal**: Tapping a session card opens a detail screen showing all exercises, every logged set (weight, reps, RPE), warmup sets visually distinct from working sets, PR indicators, PR summary, and session notes.

**Independent Test**: Tap any session card → detail screen opens → verify all exercises shown with sets, weight, reps; warmup sets styled differently; PR sets show `PrBadge`; notes section visible.

- [x] T016 [P] [US2] Create `ExerciseSetGroup` in src/modules/workout-history/components/ExerciseSetGroup.tsx — props: `exercise: WorkoutHistoryExercise`; renders exercise name (from `exerciseNameSnapshot`), replacement note if `wasReplaced` (show `originalExerciseId` label); per set: set number, weight + unit, reps, RPE if non-null; warmup sets rendered with muted style or "Warm-up" badge (`setType === 'warmup'`); PR sets render `PrBadge isNew={false}` imported from `@/modules/workout-session/components/PrBadge` (verify export from barrel or import directly); no `"use client"` directive needed unless PrBadge import forces it
- [x] T017 [US2] Create `WorkoutHistoryDetail` component in src/modules/workout-history/components/WorkoutHistoryDetail.tsx — props: `session: WorkoutHistoryDetail`; header: session name, date, start time, duration, total volume, total sets, `prCount > 0` → PR summary block listing PR sets with exercise name + value; per exercise: renders `ExerciseSetGroup`; notes section at bottom; no `"use client"` directive (pure display, receives data as prop) (depends on T016)
- [x] T018 [US2] Create history detail Server Page in src/app/(app)/history/[sessionId]/page.tsx — Server Component; uses `createClient()` from `@/lib/supabase/server`; calls `fetchHistoryDetail({ supabase, sessionId: params.sessionId })`; returns 404 if `data === null`; renders `WorkoutHistoryDetail` with fetched data (depends on T009, T017)
- [x] T019 [US2] Wrap `WorkoutHistoryCard` in `next/link` Link to `/history/${session.id}` in src/modules/workout-history/components/WorkoutHistoryCard.tsx — add `prefetch={false}`; ensure full card is tappable (min 44px height) (depends on T018)

**Checkpoint**: History list → tap card → detail screen shows exercises, sets, PRs, notes. Back navigation works.

---

## Phase 5: User Story 3 — Filter History by Date (Priority: P2)

**Goal**: User applies a predefined date range filter (7d / 30d / 90d / 180d / 365d). List updates immediately. Active filter persists when navigating away and returning. Filter-specific empty state shown when no sessions match.

**Independent Test**: Apply "Last 7 days" filter → only sessions from past 7 days shown → clear filter → full list returns. Navigate away and back → filter still active.

- [x] T020 [P] [US3] Create `useHistoryFilterStore` Zustand store in src/modules/workout-history/stores/history-filter-store.ts — state: `{ dateRange: DateRangeFilter; exerciseSearch: string }`; actions: `setDateRange`, `setExerciseSearch`, `clearFilters`; initial state: `{ dateRange: null, exerciseSearch: '' }`; in-memory (no persist middleware — filter survives SPA navigation, resets on hard refresh)
- [x] T021 [P] [US3] Create `HistoryFilters` `"use client"` component in src/modules/workout-history/components/HistoryFilters.tsx — reads + writes `useHistoryFilterStore`; renders horizontal scroll row of date range pill buttons (All, 7d, 30d, 90d, 180d, 365d) using i18n keys; active pill highlighted; search input placeholder `historySearchPlaceholder` (stub — wired in T026); min 44px tap targets (depends on T020)
- [x] T022 [US3] Extend `useHistoryList` to accept and pass `dateRange` to `fetchHistoryList` in src/modules/workout-history/hooks/use-history-list.ts — `dateRange` in query key via `historyKeys.list(filters)` so filter change triggers refetch; compute `startDate` from filter value using current date − N days (depends on T020)
- [x] T023 [US3] Update `HistoryEmptyState` `filtered` variant to accept `onClearFilter?: () => void` prop in src/modules/workout-history/components/HistoryEmptyState.tsx — render "Clear filter" button using i18n `historyClearFilter` that calls `onClearFilter` (depends on T020)
- [x] T024 [US3] Wire `HistoryFilters` into `WorkoutHistoryList` in src/modules/workout-history/components/WorkoutHistoryList.tsx — render `HistoryFilters` above list; read `dateRange` from `useHistoryFilterStore`; pass to `useHistoryList`; render `HistoryEmptyState variant="filtered"` with `onClearFilter={clearFilters}` when filtered pages empty (depends on T021, T022, T023)

**Checkpoint**: Date filter pills appear above list. Selecting a filter narrows results. Filter-specific empty state appears. Cleared filter restores full list.

---

## Phase 6: User Story 4 — Search History by Exercise Name (Priority: P2)

**Goal**: User types an exercise name into the search field. List updates within 300ms to show only sessions containing a matching exercise. Combined with active date filter (AND logic). Clear search restores full list.

**Independent Test**: Type "bench" → only sessions with exercises matching "bench" shown. Combined with date filter → AND logic. Clear search → full list (or date-filtered list) returns.

- [x] T025 [US4] Create `useExerciseNameSearch` hook in src/modules/workout-history/hooks/use-exercise-name-search.ts — debounce input 250ms; calls `searchSessionsByExercise` via `useQuery` when term is non-empty; returns `{ sessionIds: string[] | null; isSearching: boolean }`; uses `historyKeys` for query key; passes browser Supabase client (depends on T007, T009)
- [x] T026 [US4] Wire search input in `HistoryFilters` to `useHistoryFilterStore.setExerciseSearch` in src/modules/workout-history/components/HistoryFilters.tsx — controlled input bound to `exerciseSearch` state; clear button (×) when non-empty; input uses i18n `historySearchPlaceholder` (depends on T020, T025)
- [x] T027 [US4] Extend `useHistoryList` to accept `sessionIds: string[] | null` and pass to `fetchHistoryList` in src/modules/workout-history/hooks/use-history-list.ts — when `sessionIds` is non-null (search active), adds `WHERE id IN (sessionIds)` constraint alongside any dateRange filter (AND logic); `sessionIds` included in query key (depends on T025)
- [x] T028 [US4] Wire `useExerciseNameSearch` result into `WorkoutHistoryList` in src/modules/workout-history/components/WorkoutHistoryList.tsx — read `exerciseSearch` from filter store; pass to `useExerciseNameSearch` to get `sessionIds`; pass `sessionIds` to `useHistoryList`; when `isSearching` show loading indicator on filter bar (depends on T025, T026, T027)

**Checkpoint**: Search input active → results filter in real-time. Combined date + search shows AND results. Clear search restores previous date-filtered list.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T029 [P] Verify `totalVolume: null` renders `—` (not `0` or `null`) on history cards for pre-migration sessions in src/modules/workout-history/components/WorkoutHistoryCard.tsx — fix display if needed
- [x] T030 Run `npm run build` — confirm zero TypeScript errors across all new and modified files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user story phases**
- **Phase 3 (US1)**: Depends on Phase 2 — T011–T015
- **Phase 4 (US2)**: Depends on Phase 3 — T019 requires `WorkoutHistoryCard` from T011; T018 requires `fetchHistoryDetail` from T009
- **Phase 5 (US3)**: Depends on Phase 3 — extends `WorkoutHistoryList` and `useHistoryList`
- **Phase 6 (US4)**: Depends on Phase 5 — extends `HistoryFilters` and `useHistoryList`
- **Phase 7 (Polish)**: Depends on Phases 3–6

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2
- **US2 (P1)**: Starts after US1 (T019 modifies WorkoutHistoryCard)
- **US3 (P2)**: Starts after US1 (extends WorkoutHistoryList and useHistoryList)
- **US4 (P2)**: Starts after US3 (extends HistoryFilters)
- **US5 (P1, existing)**: Satisfied by T003–T005 in Phase 2

### Within Each Phase

- Tasks marked [P] with no sequential dependency can start in parallel
- T004 → T005 (payload update depends on type change)
- T006, T007, T008 → T009 (service depends on types; parallel among themselves)
- T011, T012 → T013 → T014 → T015 (within US1)
- T016 → T017 → T018 → T019 (within US2)
- T020, T021 → T022 → T023 → T024 (within US3; T023 adds prop, T024 uses it)
- T025 → T026, T027 → T028 (within US4)

---

## Parallel Opportunities

### Phase 2 Parallel Block (after T003 applied)

```
T006 (types)          ─┐
T007 (query keys)     ─┼─→ T009 (service)
T008 (format util)    ─┘
T010 (nav)            ─ (independent)
```

### Phase 3 Parallel Block

```
T011 (WorkoutHistoryCard)   ─┐
T012 (HistoryEmptyState)    ─┼─→ T014 (WorkoutHistoryList) → T015 (page)
T013 (useHistoryList)       ─┘
```

### Phase 4 Parallel Entry

```
T016 (ExerciseSetGroup) ─→ T017 (WorkoutHistoryDetail) → T018 (detail page) → T019 (card nav)
```

### Phase 5 Parallel Block

```
T020 (filter store) ─┐
T021 (HistoryFilters) ─┘ → T022 → T023 (add prop) → T024 (wire)
```

---

## Implementation Strategy

### MVP (User Stories 1 + 2 only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational — apply migration first)
3. Complete Phase 3 (US1 — history list)
4. **STOP**: Verify list renders at `/history`, cards show correct data
5. Complete Phase 4 (US2 — history detail)
6. **STOP**: Verify tap → detail → all exercises and sets shown

### Full Delivery

7. Complete Phase 5 (US3 — date filter)
8. Complete Phase 6 (US4 — exercise search)
9. Complete Phase 7 (Polish + build check)

---

## Notes

- Apply migration 002 (`supabase db push`) before running the app with history features
- `PrBadge` import: use `@/modules/workout-session/components/PrBadge` directly if not yet in barrel export
- `useHistoryList` `initialData` shape for `useInfiniteQuery`: `{ pages: [firstPageResult], pageParams: [undefined] }`
- `totalVolume` is nullable in DB — always render `session.totalVolume ?? '—'` on cards
- `use-history-detail.ts` hook omitted — detail page uses SSR (Server Page → props → display component)
- Bottom nav `"use client"` is already set on `(app)/layout.tsx` — no new directive needed
