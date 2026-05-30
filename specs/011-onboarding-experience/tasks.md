# Tasks: Onboarding Experience Selection

**Input**: Design documents from `specs/011-onboarding-experience/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/onboarding-experience-ui.md`, `quickstart.md`

**Tests**: No automated tests requested. Validation is manual per `quickstart.md` plus `npm run build`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing onboarding structure and target files before implementation.

- [X] T001 Inspect existing onboarding goal-step patterns in `src/app/(app)/onboarding/goal/page.tsx`, `src/modules/onboarding/components/GoalSelectionForm.tsx`, `src/modules/onboarding/components/GoalOptionCard.tsx`, `src/modules/onboarding/components/GoalOptionGrid.tsx`, and `src/modules/onboarding/components/OnboardingActions.tsx`
- [X] T002 Inspect existing profile preferences read/write shape in `src/modules/profile/services/profile-service.ts`, `src/modules/profile/types/index.ts`, and `supabase/migrations/006_user_fitness_profile.sql`
- [X] T003 Inspect current placeholder route in `src/app/(app)/onboarding/experience/page.tsx` and confirm whether `src/app/(app)/onboarding/frequency/page.tsx` exists

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared typed data, copy keys, and exports needed before user-story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Add `ExperienceLevel`, `ONBOARDING_EXPERIENCE_OPTIONS`, `OnboardingExperienceCopyKey`, `ExperienceOption`, and `isExperienceLevel` to `src/modules/onboarding/types/index.ts` with allowed IDs `beginner`, `intermediate`, and `advanced`
- [X] T005 Add experience option labels, descriptions, example bullet copy, options aria label, page error/loading copy, and save error copy to English and Spanish records in `src/i18n/ui.ts`
- [X] T006 Update `src/modules/onboarding/index.ts` exports to include any new experience-step components and onboarding state functions once created

**Checkpoint**: Shared types/copy contract is ready for all user stories.

---

## Phase 3: User Story 1 - Select training experience (Priority: P1) 🎯 MVP

**Goal**: User can visit `/onboarding/experience`, see Step 2 of 8 with Beginner/Intermediate/Advanced cards, select exactly one level, see clear selected state, and enable Continue.

**Independent Test**: Visit `/onboarding/experience`, select each option, verify only one card is active at a time and Continue is disabled until a valid option is selected.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create selectable card component `src/modules/onboarding/components/ExperienceOptionCard.tsx` with props from `contracts/onboarding-experience-ui.md`, label, description, example bullets, selected state, and disabled state
- [X] T008 [P] [US1] Create responsive option group `src/modules/onboarding/components/ExperienceOptionGrid.tsx` that renders all `ONBOARDING_EXPERIENCE_OPTIONS` in Beginner, Intermediate, Advanced order with an accessible group label
- [X] T009 [US1] Create client component `src/modules/onboarding/components/ExperienceSelectionForm.tsx` with local `selectedLevel`, `isSaving`, and `error` state, selection handling, disabled Continue behavior, and no-op Continue guard when no level is selected
- [X] T010 [US1] Replace placeholder content in `src/app/(app)/onboarding/experience/page.tsx` with full Step 2 page using `OnboardingShell`, `OnboardingProgress currentStep={2} totalSteps={8}`, title `How experienced are you with training?`, required description, and `ExperienceSelectionForm`
- [X] T011 [US1] Ensure `ExperienceOptionCard.tsx`, `ExperienceOptionGrid.tsx`, and `ExperienceSelectionForm.tsx` use the dark premium fitness styling tokens from existing onboarding components and keep mobile-first layout without horizontal scroll

**Checkpoint**: User Story 1 is independently functional and visually complete without persistence.

---

## Phase 4: User Story 2 - Save and continue onboarding (Priority: P1)

**Goal**: User can save the selected experience level to `user_fitness_preferences.experience_level`, see loading/error states, avoid duplicate submissions, and navigate to `/onboarding/frequency` after success.

**Independent Test**: Select a level, activate Continue, verify saving state, verify `user_fitness_preferences.experience_level` is persisted for the current user, verify navigation to `/onboarding/frequency`, and verify save failure preserves selection with an error.

### Implementation for User Story 2

- [X] T012 [US2] Add `getExperienceLevel` to `src/modules/onboarding/services/onboarding-state.ts` using the Supabase server/client-appropriate read pattern to load the current user's `user_fitness_preferences.experience_level` and return `null` for missing or invalid values
- [X] T013 [US2] Add `saveExperienceLevel` to `src/modules/onboarding/services/onboarding-state.ts` that validates with `isExperienceLevel`, requires an authenticated user, upserts `user_fitness_preferences` by `user_id`, updates only `experience_level`/timestamp fields, and preserves unrelated preference fields
- [X] T014 [US2] Update `src/app/(app)/onboarding/experience/page.tsx` to read the initial saved experience level through the server Supabase client or `getExperienceLevel` and pass it as `initialExperienceLevel` to `ExperienceSelectionForm`
- [X] T015 [US2] Connect Continue in `src/modules/onboarding/components/ExperienceSelectionForm.tsx` to `saveExperienceLevel`, saving state, duplicate-submit prevention, retryable error alert, and successful `router.push('/onboarding/frequency')` plus refresh behavior
- [X] T016 [US2] Create minimal authenticated placeholder route `src/app/(app)/onboarding/frequency/page.tsx` if absent so successful Continue navigation does not land on a missing page
- [X] T017 [US2] Verify saved `experience_level` is visible to existing profile overview by checking the profile read path in `src/modules/profile/services/profile-service.ts` remains compatible with the persisted values

**Checkpoint**: User Story 2 is independently functional with persistence, pending/error behavior, and next-step navigation.

---

## Phase 5: User Story 3 - Navigate backward safely (Priority: P2)

**Goal**: User can activate Back from `/onboarding/experience` to return to `/onboarding/goal`, and Back cannot interrupt an active save.

**Independent Test**: Activate Back from `/onboarding/experience` and verify navigation to `/onboarding/goal`; start a save and verify Back is disabled or blocked until saving completes.

### Implementation for User Story 3

- [X] T018 [US3] Extend `src/modules/onboarding/components/OnboardingActions.tsx` with optional `backHref?: string` defaulting to `/onboarding/welcome` so the existing goal step behavior is preserved
- [X] T019 [US3] Pass `backHref="/onboarding/goal"` from `src/modules/onboarding/components/ExperienceSelectionForm.tsx` into `OnboardingActions`
- [X] T020 [US3] Ensure `src/modules/onboarding/components/OnboardingActions.tsx` blocks or disables Back while `isSaving` is true and preserves accessible disabled semantics

**Checkpoint**: User Story 3 is independently functional without breaking goal-step Back navigation.

---

## Phase 6: User Story 4 - Use the step with assistive technology and different screen sizes (Priority: P2)

**Goal**: User can complete the step with keyboard-only navigation and assistive technology, and the layout works on mobile, tablet, and desktop.

**Independent Test**: Complete `/onboarding/experience` using keyboard only, verify selected state is announced, verify visible focus states, and check 320px, 375px, tablet, and desktop widths without horizontal scroll.

### Implementation for User Story 4

- [X] T021 [US4] Audit and adjust `src/modules/onboarding/components/ExperienceOptionCard.tsx` so each card is a native keyboard-operable control with visible focus state, `aria-pressed`, non-color-only selected indicator, and minimum 44px tap target
- [X] T022 [US4] Audit and adjust `src/modules/onboarding/components/ExperienceOptionGrid.tsx` so tab order matches visual order and the group label clearly identifies the experience options
- [X] T023 [US4] Audit and adjust `src/modules/onboarding/components/ExperienceSelectionForm.tsx` so save errors render in an alert region and saving/disabled states are communicated clearly
- [X] T024 [US4] Audit and adjust `src/app/(app)/onboarding/experience/page.tsx` and experience components for responsive layout at 320px, 375px, tablet, and desktop widths with no horizontal scroll

**Checkpoint**: User Story 4 accessibility and responsive requirements are satisfied.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across all user stories.

- [X] T025 [P] Run `npm run build` and resolve any TypeScript or Next.js build errors
- [X] T026 Validate `specs/011-onboarding-experience/quickstart.md` end-to-end, including save success, simulated save failure, Back navigation, keyboard-only completion, and responsive checks
- [X] T027 [P] Review changed files for minimal scope: no new npm dependencies, no Supabase migration, no unrelated refactors, and no exercise catalog changes
- [X] T028 [P] Confirm `src/app/(app)/onboarding/goal/page.tsx` and `src/modules/onboarding/components/GoalSelectionForm.tsx` still compile and preserve existing goal-step behavior after shared component/service changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies; start immediately
- **Phase 2 Foundational**: Depends on Phase 1; blocks all user stories
- **Phase 3 US1**: Depends on Phase 2; MVP selection UI
- **Phase 4 US2**: Depends on Phase 3; adds persistence and next navigation
- **Phase 5 US3**: Depends on Phase 3; can run in parallel with US2 after `ExperienceSelectionForm` exists
- **Phase 6 US4**: Depends on Phases 3–5; accessibility/responsive audit after UI and action states exist
- **Phase 7 Polish**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational; no dependency on other stories
- **US2 (P1)**: Depends on US1 form/page structure for Continue integration
- **US3 (P2)**: Depends on US1 form/page structure; independent of persistence except save-blocking state
- **US4 (P2)**: Depends on final UI/action behavior from US1–US3

### Within Each User Story

- Types/copy before components
- Option card/grid before form composition
- Form composition before page integration
- Service read/save before Continue persistence integration
- Core behavior before accessibility/responsive audit

## Parallel Opportunities

- T001, T002, and T003 can be done as parallel inspection tasks.
- T007 and T008 can be implemented in parallel after T004/T005.
- T018 and T020 are in the same file and should be done together by one worker; T019 can follow afterward.
- T021, T022, T023, and T024 can be reviewed in parallel by file after US1–US3 are complete.
- T025, T027, and T028 can run in parallel after implementation is complete.

## Parallel Example: User Story 1

```bash
# After Phase 2, launch independent component creation together:
Task: "Create selectable card component src/modules/onboarding/components/ExperienceOptionCard.tsx"
Task: "Create responsive option group src/modules/onboarding/components/ExperienceOptionGrid.tsx"

# Then compose the form/page after both complete:
Task: "Create client component src/modules/onboarding/components/ExperienceSelectionForm.tsx"
Task: "Replace placeholder content in src/app/(app)/onboarding/experience/page.tsx"
```

## Parallel Example: User Story 4

```bash
# After US1-US3, audit separate files concurrently:
Task: "Audit ExperienceOptionCard accessibility"
Task: "Audit ExperienceOptionGrid keyboard order and labeling"
Task: "Audit ExperienceSelectionForm error and saving semantics"
Task: "Audit route page responsive layout"
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 selection UI
4. Stop and validate: Step 2 page renders, options select exclusively, Continue enables only after selection

### Persistence Increment (US2)

1. Add preferences read/save service functions
2. Connect Continue to persistence and `/onboarding/frequency`
3. Validate saved value in `user_fitness_preferences.experience_level`
4. Validate revisiting `/onboarding/experience` preselects saved value

### Navigation and Accessibility Increment (US3 + US4)

1. Add Back target support without breaking goal step
2. Audit keyboard, screen-reader state, and responsive behavior
3. Run build and quickstart validation
