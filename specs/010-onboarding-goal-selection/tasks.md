# Tasks: Onboarding Goal Selection

**Input**: Design documents from `specs/010-onboarding-goal-selection/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/onboarding-goal-ui.md, quickstart.md

**Tests**: No automated test framework changes are requested. Validation tasks use manual checks from quickstart.md plus `npm run build`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the onboarding module structure and shared export surface.

- [x] T001 Create onboarding module directories at `src/modules/onboarding/components/`, `src/modules/onboarding/services/`, and `src/modules/onboarding/types/`
- [x] T002 Create onboarding module barrel export file at `src/modules/onboarding/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared typed goal data, save-shape conventions, and copy needed before any story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Define `MainGoal`, `FitnessGoalOption`, `OnboardingState`, `ONBOARDING_GOAL_OPTIONS`, and `isMainGoal` in `src/modules/onboarding/types/index.ts`
- [x] T004 Add English and Spanish onboarding goal-selection UI strings in `src/i18n/ui.ts`
- [x] T005 Export onboarding types and constants from `src/modules/onboarding/index.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Select a primary fitness goal (Priority: P1) 🎯 MVP

**Goal**: User can visit `/onboarding/goal`, view Step 1 of 8, see all seven goal cards, select exactly one goal, and see Continue disabled until selection.

**Independent Test**: Open `/onboarding/goal`, confirm required title/description/progress/options, select multiple cards, verify only the latest card is selected, and verify Continue enables only after a selection.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create premium dark onboarding layout shell in `src/modules/onboarding/components/OnboardingShell.tsx`
- [x] T007 [P] [US1] Create Step 1 of 8 progress indicator in `src/modules/onboarding/components/OnboardingProgress.tsx`
- [x] T008 [P] [US1] Create accessible selectable goal card with `aria-pressed` support in `src/modules/onboarding/components/GoalOptionCard.tsx`
- [x] T009 [P] [US1] Create Back and Continue action area component with disabled Continue support in `src/modules/onboarding/components/OnboardingActions.tsx`
- [x] T010 [US1] Create responsive goal option grid using `ONBOARDING_GOAL_OPTIONS` in `src/modules/onboarding/components/GoalOptionGrid.tsx`
- [x] T011 [US1] Create client goal selection form with single-selection state, selected-card state, and disabled Continue behavior in `src/modules/onboarding/components/GoalSelectionForm.tsx`
- [x] T012 [US1] Create authenticated `/onboarding/goal` route composition under the `(app)` route group that uses `isMainGoal` to treat invalid persisted metadata as no selection in `src/app/(app)/onboarding/goal/page.tsx`
- [x] T013 [US1] Ensure authenticated users are not redirected away from `/onboarding/goal` solely because existing metadata has skipped/completed onboarding status in `src/app/(app)/onboarding/goal/page.tsx`
- [x] T014 [US1] Update `src/modules/onboarding/index.ts` to export `OnboardingShell`, `OnboardingProgress`, `GoalOptionGrid`, `GoalOptionCard`, `OnboardingActions`, and `GoalSelectionForm`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Continue to the next onboarding step (Priority: P1)

**Goal**: User can save selected `mainGoal`, see pending/error feedback, avoid duplicate saves, and navigate to `/onboarding/experience` after success.

**Independent Test**: Select a goal, activate Continue, verify pending state, verify `mainGoal` is saved, verify duplicate submissions are blocked, verify success routes to `/onboarding/experience`, and verify save failure preserves selection with an error.

### Implementation for User Story 2

- [x] T015 [P] [US2] Implement `saveMainGoal` metadata update service in `src/modules/onboarding/services/onboarding-state.ts` that rejects invalid goals and updates auth metadata by merging top-level `mainGoal` into existing `user_metadata` without removing keys like `onboarding_status`
- [x] T016 [P] [US2] Create minimal authenticated `/onboarding/experience` placeholder route under the `(app)` route group if absent in `src/app/(app)/onboarding/experience/page.tsx`
- [x] T017 [US2] Connect Continue in `src/modules/onboarding/components/GoalSelectionForm.tsx` to `saveMainGoal`, pending state, duplicate-submit prevention, metadata-preserving save behavior, and `/onboarding/experience` navigation
- [x] T018 [US2] Add save error alert UI that preserves selected `mainGoal` in `src/modules/onboarding/components/GoalSelectionForm.tsx`
- [x] T019 [US2] Export `saveMainGoal` from `src/modules/onboarding/index.ts`

**Checkpoint**: User Stories 1 and 2 both work independently and together.

---

## Phase 5: User Story 3 - Move back to the welcome step (Priority: P2)

**Goal**: User can navigate from goal selection back to `/onboarding/welcome` without saving a new selection, and Back is blocked while saving.

**Independent Test**: Open `/onboarding/goal`, optionally select a goal, activate Back, verify navigation to `/onboarding/welcome`, then simulate a slow save and verify Back is unavailable or blocked until save resolves.

### Implementation for User Story 3

- [x] T020 [US3] Wire Back action in `src/modules/onboarding/components/OnboardingActions.tsx` to route to `/onboarding/welcome` without requiring or triggering a `mainGoal` save
- [x] T021 [US3] Pass saving state from `src/modules/onboarding/components/GoalSelectionForm.tsx` into `src/modules/onboarding/components/OnboardingActions.tsx` so Back is disabled or blocked while saving

**Checkpoint**: User Story 3 works without requiring a saved goal.

---

## Phase 6: User Story 4 - Use goal selection accessibly across devices (Priority: P2)

**Goal**: Goal selection is usable on mobile, tablet, and desktop with keyboard and assistive technologies.

**Independent Test**: Verify keyboard navigation reaches all cards/actions, selected cards expose `aria-pressed="true"`, unselected cards expose `aria-pressed="false"`, controls meet 44px tap targets, and layouts at 320px/375px/tablet/desktop have no horizontal scrolling or clipped actions.

### Implementation for User Story 4

- [x] T022 [US4] Audit and adjust mobile-first spacing, wrapping, and overflow behavior in `src/modules/onboarding/components/OnboardingShell.tsx`
- [x] T023 [US4] Audit and adjust responsive card columns and minimum tap targets in `src/modules/onboarding/components/GoalOptionGrid.tsx`
- [x] T024 [US4] Audit and adjust focus-visible, selected, hover-independent, and high-contrast states in `src/modules/onboarding/components/GoalOptionCard.tsx`
- [x] T025 [US4] Audit and adjust action button accessible names, disabled states, and 44px tap targets in `src/modules/onboarding/components/OnboardingActions.tsx`

**Checkpoint**: User Story 4 accessibility and responsive requirements are satisfied.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and consistency checks across all stories.

- [x] T026 Verify all copy and route behavior against `specs/010-onboarding-goal-selection/contracts/onboarding-goal-ui.md`
- [x] T027 Run manual quickstart validation from `specs/010-onboarding-goal-selection/quickstart.md`
- [x] T028 Run `npm run build` using `package.json` and fix any TypeScript/build errors in changed files
- [x] T029 Review changed files under `src/app/(app)/onboarding/`, `src/modules/onboarding/`, and `src/i18n/ui.ts` for minimal diff and no incidental refactors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
  - US1 and US2 are both P1; implement US1 first because US2 requires a selected goal UI
  - US3 and US4 are P2 and can proceed after US1, with US3 also integrating with US2 save state
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational only; no dependency on other stories
- **User Story 2 (P1)**: Depends on US1 selection/form/action structure
- **User Story 3 (P2)**: Depends on US1 action structure and US2 save state
- **User Story 4 (P2)**: Depends on UI components from US1 and actions from US3

### Within Each User Story

- Types/constants before components using them
- Card component before grid component
- Action component before form integration
- Service before save integration
- Placeholder next route before validating successful Continue navigation
- Core behavior before responsive/accessibility polish

### Parallel Opportunities

- T006, T007, T008, and T009 can run in parallel after T003-T005
- T015 and T016 can run in parallel after US1 is complete
- T022, T023, T024, and T025 can run in parallel once their target components exist

---

## Parallel Example: User Story 1

```bash
# After foundational tasks, these can be implemented in parallel:
Task: "Create premium dark onboarding layout shell in src/modules/onboarding/components/OnboardingShell.tsx"
Task: "Create Step 1 of 8 progress indicator in src/modules/onboarding/components/OnboardingProgress.tsx"
Task: "Create accessible selectable goal card with aria-pressed support in src/modules/onboarding/components/GoalOptionCard.tsx"
Task: "Create Back and Continue action area component with disabled Continue support in src/modules/onboarding/components/OnboardingActions.tsx"
```

## Parallel Example: User Story 2

```bash
# After US1, these can be implemented in parallel:
Task: "Implement saveMainGoal metadata update service in src/modules/onboarding/services/onboarding-state.ts"
Task: "Create minimal authenticated /onboarding/experience placeholder route if absent in src/app/(app)/onboarding/experience/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate card display, single selection, selected state, and disabled Continue behavior

### Complete Primary Flow

1. Complete MVP scope above
2. Complete Phase 4: User Story 2
3. Validate save, loading, error, duplicate-submit prevention, and `/onboarding/experience` navigation

### Incremental Delivery

1. Add User Story 3 for Back navigation and save-conflict prevention
2. Add User Story 4 for accessibility/responsive completion
3. Run Phase 7 polish and validation

## Notes

- Do not add npm dependencies.
- Do not refactor existing welcome-screen files unless required for imports or route compatibility.
- Use `src/app/(app)/onboarding/` for new authenticated onboarding routes per the constitution and current authenticated app structure.
- Keep `/onboarding/experience` placeholder minimal; the full experience module is out of scope.
- Store only supported `MainGoal` values as top-level `mainGoal` in auth user metadata and preserve existing metadata keys during updates.
- Preserve selected goal after save errors.
- Use `aria-pressed` on goal card buttons exactly as specified.
