# Tasks: User Profile Overview Page

**Input**: Design documents from `specs/010-profile-overview/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ui-contracts.md ✅

**Organization**: Grouped by phase → user story. Section components (T009–T019) are all [P] — write in any order once types + i18n are done.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable — different files, no blocking dependency on in-progress tasks
- **[Story]**: User story this task delivers
- All file paths are relative to repo root

---

## Phase 1: Database

**Purpose**: Create the 5 Supabase tables that all profile data reads depend on. Must complete before service layer can be verified.

- [X] T001 Create `supabase/migrations/006_user_fitness_profile.sql` — define tables `user_fitness_preferences` (UNIQUE user_id, fitness_goal TEXT nullable, experience_level TEXT nullable, days_per_week INT nullable, session_duration_minutes INT nullable, preferred_days TEXT[] default '{}', height_unit TEXT default 'cm', weight_unit TEXT default 'kg', timestamps), `user_equipment` (UNIQUE user_id, preset TEXT nullable, equipment_items TEXT[] default '{}', timestamps), `user_body_info` (UNIQUE user_id, height_cm NUMERIC(6,2) nullable, weight_kg NUMERIC(6,2) nullable, timestamps), `user_limitations` (user_id FK, affected_area TEXT NOT NULL, description TEXT nullable, created_at), `user_body_measurements` (user_id FK, measured_at DATE default CURRENT_DATE, weight_kg nullable, waist_cm nullable, chest_cm nullable, body_fat_pct NUMERIC(5,2) nullable, created_at). Enable RLS on all 5 tables. Add policy `auth.uid() = user_id` FOR ALL on each. Follow pattern in `supabase/migrations/004_workout_plans.sql`.

- [X] T002 Push migration to Supabase: run `supabase db push`. Verify all 5 tables and their RLS policies appear in the Supabase dashboard.

**Checkpoint**: 5 tables live in Supabase with RLS active. Type + service layer can now be finalized.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, services, utilities, i18n keys, and the TQ hook. All UI work blocks on this phase.

- [X] T003 [P] Create `src/modules/profile/types/index.ts` — export: `FitnessGoal` union (`'build_muscle' | 'lose_fat' | 'increase_strength' | 'improve_endurance' | 'general_fitness' | 'body_recomposition'`), `ExperienceLevel` union (`'beginner' | 'intermediate' | 'advanced'`), `EquipmentPreset` union (`'full_gym' | 'home_gym' | 'bodyweight' | 'custom'`), `HeightUnit` (`'cm' | 'in'`), `WeightUnit` (`'kg' | 'lb'`), `ProfileCompletionTier` (`'getting_started' | 'almost_ready' | 'profile_ready'`), `FitnessPreferences`, `EquipmentAccess`, `BodyInfo`, `PhysicalLimitation`, `BodyMeasurementEntry`, `ProfileOverviewData`, `ProfileCompletion`. Full type shapes are in `specs/010-profile-overview/data-model.md`.

- [X] T004 [P] Create `src/modules/profile/services/profile-service.ts` — import `createClient` from `@/lib/supabase/client`. Export 5 async functions: `getPreferences(userId)` → `FitnessPreferences | null` using `.from('user_fitness_preferences').select('*').eq('user_id', userId).maybeSingle()`; `getEquipment(userId)` → `EquipmentAccess | null` from `user_equipment`; `getBodyInfo(userId)` → `BodyInfo | null` from `user_body_info`; `getLimitations(userId)` → `PhysicalLimitation[]` from `user_limitations` ordered by `created_at`; `getLatestMeasurement(userId)` → `BodyMeasurementEntry | null` from `user_body_measurements` ordered by `measured_at` desc limit 1. Each function maps snake_case DB row to camelCase domain type. Pattern: `specs/010-profile-overview/data-model.md` Read Operations table. Reference `src/modules/workout-plans/services/plans-service.ts` for the row-mapping pattern.

- [X] T005 [P] Create `src/modules/profile/utils/format-enums.ts` — export 4 `const` maps: `FITNESS_GOAL_KEYS: Record<string, string>` mapping `'build_muscle'` → `'goalBuildMuscle'` etc. for all 6 goals; `EXPERIENCE_LEVEL_KEYS` for 3 levels; `EQUIPMENT_PRESET_KEYS` for 4 presets; `DAY_SHORT_KEYS` mapping `'mon'` → `'Mon'`, `'tue'` → `'Tue'` etc. Keys are i18n key suffixes used with `t()`.

- [X] T006 [P] Create `src/modules/profile/utils/completion.ts` — export `calcCompletion(data: { hasName: boolean, hasGoal: boolean, hasLevel: boolean, hasAvailability: boolean, hasEquipment: boolean, hasUnits: boolean }): ProfileCompletion`. Score = count of `true` fields. Tier: score === 0 → `'getting_started'`; score 1–4 → `'almost_ready'`; score 5–6 → `'profile_ready'`. Import `ProfileCompletion` from `../types`.

- [X] T007a Add foundational i18n keys to `src/i18n/ui.ts` for both `en` and `es`: `profileTitle`, `profileEditPersonalInfo`, `profileCompletionGettingStarted`, `profileCompletionAlmostReady`, `profileCompletionProfileReady`, `profileErrorTitle` ("We couldn't load your profile. Please try again in a moment."), `profileErrorRetry` ("Try again"), section titles (`profileGoalTitle`, `profileLevelTitle`, `profileAvailabilityTitle`, `profileEquipmentTitle`, `profileBodyInfoTitle`, `profileLimitationsTitle`, `profileMeasurementsTitle`). Both languages required — TypeScript `Record<Language, ...>` enforces this at build time.

- [X] T007b [P] Add per-section i18n keys to `src/i18n/ui.ts` for both `en` and `es`: empty state titles/bodies/CTAs for all 7 sections (e.g. `profileGoalEmptyTitle`, `profileGoalEmptyBody`, `profileGoalEmptyCta` — repeat pattern for level, availability, equipment, body info, limitations, measurements); goal labels (`goalBuildMuscle`, `goalLoseFat`, `goalIncreaseStrength`, `goalImproveEndurance`, `goalGeneralFitness`, `goalBodyRecomposition`) + personalization explanations (`goalExplainBuildMuscle` etc.); level labels (`levelBeginner`, `levelIntermediate`, `levelAdvanced`) + explanations (`levelExplainBeginner` etc.); preset labels (`presetFullGym`, `presetHomeGym`, `presetBodyweight`, `presetCustom`); format strings: `equipmentMore` ("+{count} more"), `availabilityDaysPerWeek` ("{days} days/week"), `availabilityMinPerSession` ("{min} min/session"), `limitationsCount` ("{count} limitations"), `measurementsLatest` ("Latest: {date}"), `measurementsViewHistory`, `measurementsAddEntry`. [P] with T007a — they add different keys to the same file, so write T007a first, then T007b immediately after.

- [X] T008 Create `src/modules/profile/hooks/use-profile-overview.ts` — `"use client"`. Import `useQueries` from `@tanstack/react-query` and all 5 service functions. Export `useProfileOverview(userId: string)` returning `{ isLoading: boolean, isError: boolean, data: ProfileOverviewData | null, refetch: () => void }`. Use `useQueries` (not 5 separate `useQuery` calls) so combined `isLoading`/`isError` and a single `refetch` are available for the error retry button — reference `specs/010-profile-overview/research.md` §1. Query keys: `['profile', 'preferences', userId]`, `['profile', 'equipment', userId]`, `['profile', 'body-info', userId]`, `['profile', 'limitations', userId]`, `['profile', 'measurements', userId]`. Map results into `ProfileOverviewData` only when all queries succeed.

**Checkpoint**: `npm run build` must pass with zero TS errors before moving to components.

---

## Phase 3: User Story 1 — View Profile Overview (Priority: P1) 🎯 MVP

**Goal**: Authenticated user visits `/profile` and sees a complete fitness dashboard — header + 8 section cards, data-or-empty-state rendering, loading skeleton, error state.

**Independent Test**: Navigate to `/profile` as a fully set-up user → all 8 sections render real data, no broken values. Navigate as a brand-new user → all 7 data sections show friendly empty states with CTAs.

> All T009–T019 components are [P] — they share no file dependencies and can be written in any order.

- [X] T009 [P] [US1] Create `src/modules/profile/components/SectionCard.tsx` — accepts `{ title: string, children: React.ReactNode }`. Renders a `card-elevated` shell with an `<h2>` section heading. No action slot. Reference existing `card-elevated` CSS class used in `src/modules/profile/components/ProfileScreen.tsx`.

- [X] T010 [P] [US1] Create `src/modules/profile/components/ProfileSkeleton.tsx` — renders pulsing `animate-pulse` placeholders that mirror the real page structure: one header-sized card + 7 section-sized cards (matching the desktop 2-column grid and mobile single-column stack). No spinner.

- [X] T011 [P] [US1] Create `src/modules/profile/components/ProfileError.tsx` — accepts `{ onRetry: () => void }`. Renders a card with error message (use `t('profileErrorTitle')`) and a retry button that calls `onRetry`. Must be accessible: error text readable by screen reader.

- [X] T012 [P] [US1] Create `src/modules/profile/components/ProfileHeader.tsx` — accepts `{ displayName: string, avatarUrl: string | null, fitnessGoal: FitnessGoal | null, experienceLevel: ExperienceLevel | null, completion: ProfileCompletion }`. Renders: avatar image (with descriptive alt text) or initials div; display name or fallback `t('profileTitle')`; goal + level summary using `FITNESS_GOAL_KEYS` and `EXPERIENCE_LEVEL_KEYS` maps with `t()`; completion tier badge (tier label text + visual indicator — do NOT use color alone); edit link to `/profile/edit` labeled `t('profileEditPersonalInfo')`. Min tap target 44×44px on edit action. No hover-only interactions.

- [X] T013 [P] [US1] Create `src/modules/profile/components/GoalSection.tsx` — accepts `{ goal: FitnessGoal | null }`. Wraps content in `SectionCard` with title `t('profileGoalTitle')`. When `goal` exists: show `t(FITNESS_GOAL_KEYS[goal])` label + `t('goalExplain' + PascalCase(goal))` explanation + `<Link href="/profile/preferences">` edit action. When `goal` is null: friendly empty state with `t('profileGoalEmptyTitle')`, `t('profileGoalEmptyBody')`, CTA `<Link href="/profile/preferences">` labeled `t('profileGoalEmptyCta')`.

- [X] T014 [P] [US1] Create `src/modules/profile/components/ExperienceLevelSection.tsx` — accepts `{ level: ExperienceLevel | null }`. Same pattern as `GoalSection`: `SectionCard` + data state showing level label + explanation + edit link to `/profile/preferences`, or empty state with CTA to `/profile/preferences`. Use `EXPERIENCE_LEVEL_KEYS` map.

- [X] T015 [P] [US1] Create `src/modules/profile/components/AvailabilitySection.tsx` — accepts `{ daysPerWeek: number | null, sessionDurationMinutes: number | null, preferredDays: string[] }`. Renders summary line when data exists (e.g. "4 days/week · 90 min/session") using `t('availabilityDaysPerWeek', { days })` + `t('availabilityMinPerSession', { min })`; show only available sub-fields when partial (no broken placeholder). Show preferred days as short labels from `DAY_SHORT_KEYS` when `preferredDays` is non-empty. Edit link to `/profile/preferences`. Empty state CTA to `/profile/preferences`.

- [X] T016 [P] [US1] Create `src/modules/profile/components/EquipmentSection.tsx` — accepts `{ preset: EquipmentPreset | null, equipmentItems: string[] }`. When equipment exists: show preset label via `EQUIPMENT_PRESET_KEYS`; show first 3 items comma-separated; if `equipmentItems.length > 3` append `t('equipmentMore', { count: equipmentItems.length - 3 })`; show total count; edit link to `/profile/equipment`. Empty state CTA to `/profile/equipment`.

- [X] T017 [P] [US1] Create `src/modules/profile/components/BodyInfoSection.tsx` — accepts `{ heightCm: number | null, weightKg: number | null, heightUnit: HeightUnit, weightUnit: WeightUnit }`. Convert for display: if `heightUnit === 'in'` show feet+inches; if `weightUnit === 'lb'` convert kg → lb (×2.20462, round 1dp). Show both when both exist (e.g. "180 cm · 75 kg"); show only available value when one is null. Empty state uses non-negative language (`t('profileBodyInfoEmptyBody')`). Edit link to `/profile/body`. Empty state CTA to `/profile/body`.

- [X] T018 [P] [US1] Create `src/modules/profile/components/LimitationsSection.tsx` — accepts `{ limitations: PhysicalLimitation[] }`. When `limitations.length > 0`: show `t('limitationsCount', { count: limitations.length })` + preview of up to 3 `affectedArea` values joined with " · "; edit link to `/profile/limitations`. MUST use only non-medical language — check all copy uses `t()` keys containing "limitations", "restrictions", or "areas" wording only. Empty state CTA to `/profile/limitations`.

- [X] T019 [P] [US1] Create `src/modules/profile/components/MeasurementsSection.tsx` — accepts `{ latestMeasurement: BodyMeasurementEntry | null, weightUnit: WeightUnit }`. When measurement exists: show `t('measurementsLatest', { date: formatted measuredAt })`; show available key values (weightKg converted if `weightUnit === 'lb'`, waistCm, chestCm, bodyFatPct) — skip null values silently; two actions: `<Link href="/profile/measurements">` labeled `t('measurementsViewHistory')` + `<Link href="/profile/measurements/new">` labeled `t('measurementsAddEntry')`. When null: empty state CTA to `/profile/measurements/new`. This section renders its own two-action footer instead of using `SectionCard`'s action slot (there is none).

- [X] T020 [US1] Create `src/modules/profile/components/ProfileOverviewScreen.tsx` — `"use client"`. Accepts `{ userId: string, displayName: string, avatarUrl: string | null }`. Calls `useProfileOverview(userId)`. Routing logic: when `isLoading` → render `<ProfileSkeleton />`; when `isError` → render `<ProfileError onRetry={refetch} />`; otherwise render full layout. Full layout: `<ProfileHeader>` + 2-column grid on desktop (`md:grid-cols-2`) collapsing to single column on mobile. Grid row order: row 1 — GoalSection + ExperienceLevelSection; row 2 — AvailabilitySection + EquipmentSection; row 3 — BodyInfoSection + LimitationsSection; row 4 — MeasurementsSection full-width. Mobile stack order: header, goal, level, availability, equipment, body info, limitations, measurements. Page must have one `<h1>` (the profile title from `<PageHeader>`); section cards provide `<h2>` headings. All interactive elements min 44×44px. No hover-only interactions.

- [X] T021 [US1] Add `ProfileOverviewScreen` export to `src/modules/profile/index.ts` — append `export { ProfileOverviewScreen } from './components/ProfileOverviewScreen'`. Do NOT remove existing exports yet (old components still exist; removal is T029). This unblocks T022 which imports from the barrel.

- [X] T022 [US1] Update `src/app/(app)/profile/page.tsx` — keep Server Component + auth guard pattern. Replace `ProfileScreen` import with `ProfileOverviewScreen` (now available via barrel after T021). Pass `userId: user.id`, `displayName: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? ''`, `avatarUrl: user.user_metadata?.avatar_url ?? null`.

**Checkpoint**: `/profile` renders full dashboard. Skeleton and error state visible. All 8 sections render data or empty states correctly. No `null`/`undefined` visible. `npm run build` passes.

---

## Phase 4: User Story 2 — Navigate to Edit Flows from Profile (Priority: P1)

**Goal**: Every section CTA navigates to its designated route without 404.

**Independent Test**: Click all 9 action links on `/profile` (including both measurement actions). Verify correct route, no 404.

> All T023–T029 are [P] — each is a separate file, no inter-dependencies.

- [X] T023 [P] [US2] Create `src/app/(app)/profile/edit/page.tsx` — minimal Server Component. Render `<PageHeader title="Edit Profile" />` and a `<p className="text-sm text-gym-muted px-4">Coming soon.</p>`. No auth guard needed (inherited from `(app)/layout.tsx`).

- [X] T024 [P] [US2] Create `src/app/(app)/profile/preferences/page.tsx` — stub: `<PageHeader title="Training Preferences" />` + coming soon text.

- [X] T025 [P] [US2] Create `src/app/(app)/profile/equipment/page.tsx` — stub: `<PageHeader title="Equipment" />` + coming soon text.

- [X] T026 [P] [US2] Create `src/app/(app)/profile/body/page.tsx` — stub: `<PageHeader title="Body Information" />` + coming soon text.

- [X] T027 [P] [US2] Create `src/app/(app)/profile/limitations/page.tsx` — stub: `<PageHeader title="Physical Limitations" />` + coming soon text.

- [X] T028 [P] [US2] Create `src/app/(app)/profile/measurements/page.tsx` — stub: `<PageHeader title="Body Measurements" />` + coming soon text.

- [X] T029 [P] [US2] Create `src/app/(app)/profile/measurements/new/page.tsx` — stub: `<PageHeader title="Add Measurement" />` + coming soon text.

**Checkpoint**: All 7 stub routes load without 404. All profile section CTAs navigate correctly.

---

## Phase 5: Polish & Cleanup

**Purpose**: Remove replaced files, finalize barrel, and run full validation.

- [X] T030 Delete replaced profile module files: `src/modules/profile/components/ProfileScreen.tsx`, `src/modules/profile/components/ProfileStats.tsx`, `src/modules/profile/components/SettingsSection.tsx`. Before deleting run `grep -rn "ProfileScreen\|ProfileStats\|SettingsSection" src/ --include="*.tsx" --include="*.ts"` — only `index.ts` references should remain (the old exports added in the original barrel). Safe to delete once confirmed.

- [X] T031 Update `src/modules/profile/index.ts` — remove the stale exports for `ProfileScreen`, `ProfileStats`, `SettingsSection` (added by the original barrel). The `ProfileOverviewScreen` export was already added in T021. Final barrel should export only `ProfileOverviewScreen`.

- [X] T032 Run `npm run build`. Fix any TypeScript errors. Common sources: missing i18n keys in one language, unused imports from deleted files, type mismatches in section component props.

- [ ] T033 Manual verification per `specs/010-profile-overview/quickstart.md`: (1) desktop 1280px — 2-column grid layout correct; (2) mobile 375px — single-column stack, no horizontal scroll; (3) loading skeleton appears (throttle network); (4) error state + retry button appear (block supabase domain in DevTools); (5) completion indicator shows correct tier at 0/partial/full fields; (6) all 9 CTAs navigate to correct route; (7) no raw enum values visible anywhere; (8) keyboard Tab through all interactive elements — focus rings visible; (9) confirm RLS: unauthenticated fetch of another user's row returns null.

**Checkpoint**: `npm run build` passes. All 9 manual checks pass. Feature complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (DB)**: Start immediately
- **Phase 2 (Foundational)**: Start after T001 — T003–T006 + T007a parallel; T007b after T007a; T008 after T003+T004
- **Phase 3 (US1 components)**: After T007a (section titles) + T003 (types) — T009–T019 parallel; T020 after T009–T019 + T008; T021 (barrel add) after T020; T022 (page.tsx) after T021
- **Phase 4 (US2 stubs)**: Independent — can run in parallel with Phase 3
- **Phase 5 (Cleanup)**: After T022 + T023–T029

### User Story Dependencies

| Story | Depends On | Can Parallelize With |
|-------|-----------|----------------------|
| US1 (View Profile) | Phase 1 + Phase 2 | US2 stub pages |
| US2 (Navigate) | None (stub pages) | Phase 3 components |
| US3 (Empty States) | Embedded in US1 section components — no additional code | — |
| US4 (Completion Indicator) | T006 (completion.ts) + T012 (ProfileHeader) — both in Phase 2/3 | — |
| US5 (Error State) | T011 (ProfileError) + T020 (wiring in screen) — both in Phase 3 | — |

### Parallel Opportunities

- T003, T004, T005, T006, T007a — write simultaneously (5 different files, no deps between them)
- T007b after T007a (same file, sequential); otherwise independent of T003–T006
- T009–T019 — write simultaneously (11 different component files)
- T023–T029 — write simultaneously (7 stub pages)

---

## Implementation Strategy

### MVP (User Story 1 only)

1. Complete Phase 1 (T001–T002)
2. Complete Phase 2 (T003–T008) — T003–T006 + T007a parallel, then T007b, then T008
3. Complete Phase 3 (T009–T022) — T009–T019 parallel, then T020, T021, T022
4. **Validate**: `/profile` renders full dashboard with skeleton, error, and section cards
5. Optionally deliver here — profile overview works even with dead-link CTAs

### Full Delivery

6. Complete Phase 4 (T023–T029) — all parallel
7. Complete Phase 5 (T030–T033)
8. All CTAs navigable, old files removed, build clean

---

## Task Summary

| Phase | Tasks | Parallel opportunities |
|-------|-------|------------------------|
| Phase 1 — Database | T001–T002 | None (sequential) |
| Phase 2 — Foundational | T003–T008, T007a–T007b | T003–T006 + T007a parallel; T007b after T007a |
| Phase 3 — US1 (View Profile) | T009–T022 | T009–T019 all parallel |
| Phase 4 — US2 (Navigation) | T023–T029 | T023–T029 all parallel |
| Phase 5 — Polish | T030–T033 | None (sequential) |
| **Total** | **33 tasks** | |
