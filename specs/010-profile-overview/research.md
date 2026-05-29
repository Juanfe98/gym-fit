# Research: User Profile Overview Page

## 1. Multi-table TanStack Query pattern

**Decision**: Use `useQueries` (TanStack Query v5) to fire all 5 Supabase reads in parallel from a single `useProfileOverview` hook. Combine loading/error states with `every`/`some` on the results array.

**Rationale**: The overview page reads from 5 tables (preferences, equipment, body info, limitations, measurements). Sequential fetching would add ~200ms per hop. `useQueries` fires all in parallel and lets each cache independently — so navigating away and back hits TQ cache, not the network.

**Alternatives considered**:
- Single `useQuery` wrapping a `Promise.all` — simpler but loses per-query cache granularity. Rejected because the edit pages will invalidate specific query keys (e.g., only preferences), not all at once.
- Server Component data fetching — valid, but the profile page needs retry-on-error and loading skeletons that map cleanly to client-side TQ patterns. The existing profile page is already a Server Component that passes data to a `"use client"` screen component; same pattern is used here.

**Pattern**:
```ts
// hooks/useProfileOverview.ts
const results = useQueries({
  queries: [
    { queryKey: ['profile', 'preferences', userId], queryFn: () => getPreferences(userId) },
    { queryKey: ['profile', 'equipment', userId],   queryFn: () => getEquipment(userId) },
    { queryKey: ['profile', 'body-info', userId],   queryFn: () => getBodyInfo(userId) },
    { queryKey: ['profile', 'limitations', userId], queryFn: () => getLimitations(userId) },
    { queryKey: ['profile', 'measurements', userId],queryFn: () => getLatestMeasurement(userId) },
  ],
})
const isLoading = results.some(r => r.isLoading)
const isError   = results.some(r => r.isError)
```

---

## 2. Skeleton pattern

**Decision**: Render a `ProfileSkeleton` component (separate file) when `isLoading` is true. The skeleton mirrors the exact card structure of the real page — header card + 8 section cards — using pulsing `div` placeholders. No full-page spinner.

**Rationale**: SC-006 explicitly requires the skeleton to match final structure. The existing codebase has no shared skeleton primitive, so `ProfileSkeleton` is self-contained. Tailwind's `animate-pulse` class is the only dependency.

**Alternatives considered**: React Suspense with a `loading.tsx` route segment — simpler but produces a full-page fallback, violating SC-006. Rejected.

---

## 3. Supabase single-row tables (upsert pattern)

**Decision**: `user_fitness_preferences`, `user_equipment`, and `user_body_info` have `UNIQUE (user_id)` — one row per user. Reads use `.maybeSingle()` (returns `null` when no row exists, no error). Writes use `.upsert({ user_id: ... }, { onConflict: 'user_id' })`.

**Rationale**: Matches the existing pattern for single-row-per-user tables. `PGRST116` (no row found) is suppressed by `maybeSingle()`, so the service returns `null` cleanly — which the overview page renders as an empty state.

---

## 4. Enum display mapping

**Decision**: Flat `const` maps in `utils/format-enums.ts` mapping raw DB strings → i18n key suffix. The `t()` call resolves the full key.

**Rationale**: Same pattern as `PlanGoal`/`PlanLevel` in `workout-plans/types`. Keeps the mapping in one place; if a label changes, only the i18n file changes.

```ts
export const FITNESS_GOAL_KEYS: Record<string, string> = {
  build_muscle:        'goalBuildMuscle',
  lose_fat:            'goalLoseFat',
  increase_strength:   'goalIncreaseStrength',
  improve_endurance:   'goalImproveEndurance',
  general_fitness:     'goalGeneralFitness',
  body_recomposition:  'goalBodyRecomposition',
}
export const EXPERIENCE_LEVEL_KEYS: Record<string, string> = {
  beginner:     'levelBeginner',
  intermediate: 'levelIntermediate',
  advanced:     'levelAdvanced',
}
```

---

## 5. Profile completion scoring

**Decision**: Pure function in `utils/completion.ts`. 6 binary fields, each worth 1 point. Tier thresholds: 0 → `getting_started`; 1–4 → `almost_ready`; 5–6 → `profile_ready`.

```ts
export function calcCompletion(data: {
  hasName: boolean
  hasGoal: boolean
  hasLevel: boolean
  hasAvailability: boolean   // daysPerWeek != null
  hasEquipment: boolean      // equipmentItems.length > 0
  hasUnits: boolean          // always true if preferences row exists (default units set on creation)
}): ProfileCompletion {
  const score = Object.values(data).filter(Boolean).length
  const tier = score === 0 ? 'getting_started'
             : score <= 4  ? 'almost_ready'
             :               'profile_ready'
  return { score, tier }
}
```

**Note**: `hasUnits` is `true` whenever a preferences row exists (columns have DB defaults). So a user who has only saved preferences but filled nothing else gets 1 point (units) — displayed as "Almost ready".

---

## 6. i18n key naming convention

**Decision**: Prefix all new keys with `profile` for the overview page. Sub-sections use the section name. Examples:

```
profileOverviewTitle
profileEditPersonalInfo
profileCompletionGettingStarted
profileCompletionAlmostReady
profileCompletionProfileReady
profileGoalSectionTitle
profileGoalEmptyTitle
profileGoalEmptyCta
profileGoalExplanationBuildMuscle
...
profileEquipmentPreviewMore       → "{count} more"
profileMeasurementsLatestEntry    → "Latest entry: {date}"
profileLimitationsCount           → "{count} limitations"
profileErrorTitle
profileErrorCta
```

Both `en` and `es` keys added simultaneously in `src/i18n/ui.ts`.

---

## 7. Body info unit conversion

**Decision**: All body measurements stored in metric (cm, kg) in Supabase. Frontend converts for display using `preferred_units` from `user_fitness_preferences`.

```ts
// height: cm → in
const heightIn = Math.round(heightCm / 2.54 * 10) / 10

// weight: kg → lb
const weightLb = Math.round(weightKg * 2.20462 * 10) / 10
```

**Rationale**: Single source of truth in DB. Avoids storing duplicate values in different units. Conversion at display layer is stateless and testable.
