# Tasks: Onboarding Welcome Screen

**Input**: Design documents from `/specs/009-onboarding-welcome-screen/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated tests requested. Validation is manual responsive/accessibility verification plus `npm run build` per quickstart and constitution DoD.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the requested file structure and establish shared constants/types used by the screen.

- [X] T001 Create onboarding component directory at `src/components/onboarding/`
- [X] T002 [P] Create route directory at `src/app/onboarding/welcome/`
- [X] T003 [P] Create empty component file `src/components/onboarding/WelcomeHero.tsx`
- [X] T004 [P] Create empty component file `src/components/onboarding/WelcomeBenefitList.tsx`
- [X] T005 [P] Create empty component file `src/components/onboarding/WelcomeActions.tsx`
- [X] T006 [P] Create empty page file `src/app/onboarding/welcome/page.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared data and route-level auth behavior needed before user story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Define `WelcomeBenefit` TypeScript type and required benefit data in `src/components/onboarding/WelcomeBenefitList.tsx`
- [X] T008 Define illustrative weekly workout/progress preview data in `src/app/onboarding/welcome/page.tsx`
- [X] T009 Implement Supabase server auth check in `src/app/onboarding/welcome/page.tsx` with redirect to `/login` when no authenticated user exists
- [X] T010 Import planned onboarding components in `src/app/onboarding/welcome/page.tsx` and render a minimal authenticated page shell

**Checkpoint**: Foundation ready — authenticated users can reach `/onboarding/welcome`; unauthenticated users redirect to `/login`.

---

## Phase 3: User Story 1 - Start onboarding from welcome screen (Priority: P1) 🎯 MVP

**Goal**: A new user sees the welcome value proposition and can start setup by navigating to goal selection.

**Independent Test**: Open `/onboarding/welcome` as an authenticated user, confirm headline/supporting copy is visible, activate `Start setup`, and verify navigation to `/onboarding/goal`.

### Implementation for User Story 1

- [X] T011 [US1] Implement `WelcomeHero` headline and supporting personalization copy in `src/components/onboarding/WelcomeHero.tsx`
- [X] T012 [US1] Implement primary `Start setup` link to `/onboarding/goal` in `src/components/onboarding/WelcomeActions.tsx`
- [X] T013 [US1] Compose `WelcomeHero` and `WelcomeActions` in `src/app/onboarding/welcome/page.tsx`
- [X] T014 [US1] Apply mobile-first dark premium layout, headline typography, and readable supporting copy styles in `src/app/onboarding/welcome/page.tsx` and `src/components/onboarding/WelcomeHero.tsx`

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Understand onboarding benefits before deciding (Priority: P2)

**Goal**: A user can scan three clear benefits before deciding whether to start or skip setup.

**Independent Test**: Open `/onboarding/welcome` and verify the three required benefits are visible, distinct, readable, and visually consistent.

### Implementation for User Story 2

- [X] T015 [US2] Implement `WelcomeBenefitList` rendering for `Personalized workout setup`, `Track sets, reps, and progress`, and `Stay consistent with a clear plan` in `src/components/onboarding/WelcomeBenefitList.tsx`
- [X] T016 [US2] Add decorative Lucide icons or visual markers for benefits with accessible decorative handling in `src/components/onboarding/WelcomeBenefitList.tsx`
- [X] T017 [US2] Integrate `WelcomeBenefitList` into `WelcomeHero` or page composition in `src/components/onboarding/WelcomeHero.tsx` and `src/app/onboarding/welcome/page.tsx`
- [X] T018 [US2] Style benefit rows/cards with existing gym tokens, readable text hierarchy, and mobile-safe spacing in `src/components/onboarding/WelcomeBenefitList.tsx`

**Checkpoint**: User Stories 1 and 2 work independently: value proposition, start CTA, and benefit list are visible.

---

## Phase 5: User Story 3 - Skip onboarding for now (Priority: P3)

**Goal**: A user can skip setup, persist skipped status, and reach the dashboard without duplicate submissions.

**Independent Test**: Open `/onboarding/welcome`, activate `Skip for now`, verify status persistence in Supabase Auth metadata, redirect to `/dashboard`, and confirm repeated clicks are blocked while pending.

### Implementation for User Story 3

- [X] T019 [US3] Add `'use client'`, `useRouter`, pending state, and error state scaffolding in `src/components/onboarding/WelcomeActions.tsx`
- [X] T020 [US3] Implement Supabase browser `auth.updateUser` call to persist `onboarding_status: 'skipped'` and `onboarding_skipped_at` in `src/components/onboarding/WelcomeActions.tsx`
- [X] T021 [US3] Redirect to `/dashboard` after successful skip persistence in `src/components/onboarding/WelcomeActions.tsx`
- [X] T022 [US3] Disable skip action while pending and prevent duplicate/conflicting submissions in `src/components/onboarding/WelcomeActions.tsx`
- [X] T023 [US3] Render accessible error feedback with `role="alert"` when skip persistence fails in `src/components/onboarding/WelcomeActions.tsx`

**Checkpoint**: User Story 3 works independently: skip persists, redirects, handles pending state, and surfaces errors.

---

## Phase 6: User Story 4 - Use the screen accessibly across screen sizes (Priority: P3)

**Goal**: The screen is usable on mobile and desktop, including accessible controls and the right-side weekly workout/progress preview.

**Independent Test**: Verify `/onboarding/welcome` at 320px, 375px, tablet, and desktop widths; confirm no horizontal scrolling, desktop two-column layout, preview card visibility, keyboard reachable controls, and clear accessible names.

### Implementation for User Story 4

- [X] T024 [US4] Implement dark gradient background and responsive page container in `src/app/onboarding/welcome/page.tsx`
- [X] T025 [US4] Implement mobile stacked layout and desktop two-column layout in `src/app/onboarding/welcome/page.tsx`
- [X] T026 [US4] Implement right-side weekly workout/progress preview card with sample data in `src/app/onboarding/welcome/page.tsx`
- [X] T027 [US4] Apply metric typography and layered surface styling to preview metrics and workout rows in `src/app/onboarding/welcome/page.tsx`
- [X] T028 [US4] Add accessible names, focus-visible styling, and minimum 44px target sizing for both CTAs in `src/components/onboarding/WelcomeActions.tsx`
- [X] T029 [US4] Verify decorative icons/visual elements are not exposed as unlabeled controls in `src/components/onboarding/WelcomeBenefitList.tsx` and `src/app/onboarding/welcome/page.tsx`

**Checkpoint**: All user stories are independently functional and responsive/accessibility requirements are implemented.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and small quality passes across all stories.

- [X] T030 Review all new UI copy for exact required strings and no placeholder text in `src/app/onboarding/welcome/page.tsx`, `src/components/onboarding/WelcomeHero.tsx`, `src/components/onboarding/WelcomeBenefitList.tsx`, and `src/components/onboarding/WelcomeActions.tsx`
- [ ] T031 Verify route behavior manually against `specs/009-onboarding-welcome-screen/quickstart.md`
- [ ] T032 Verify responsive layout manually at 320px, 375px, tablet, and desktop widths per `specs/009-onboarding-welcome-screen/quickstart.md`
- [ ] T033 Verify keyboard navigation, accessible names, focus states, and error alert behavior on `/onboarding/welcome`
- [X] T034 Run `npm run build` and fix any TypeScript or Next.js build errors
- [X] T035 Check final diff for minimal scope and confirm no new dependencies, migrations, or unrelated refactors were introduced

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 should be completed first as MVP
  - US2 can follow US1 because it integrates into the visible welcome composition
  - US3 can proceed after Foundational and can be validated with the action component
  - US4 should follow visible content/action implementation so layout and accessibility can be verified end-to-end
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 only — delivers MVP start flow
- **User Story 2 (P2)**: Depends on Phase 2; integrates with US1 page composition
- **User Story 3 (P3)**: Depends on Phase 2; independent from US2 content
- **User Story 4 (P3)**: Depends on visible content/actions from US1–US3 for full validation

### Parallel Opportunities

- T002–T006 can run in parallel after T001 because they create separate files/directories
- T011 and T012 can run in parallel after Phase 2 because they edit different component files
- T015 and T016 can be implemented together in `WelcomeBenefitList.tsx`; avoid parallel edits to the same file
- T024–T027 are in the same page file and should be done sequentially to avoid conflicts
- T030–T033 can run in parallel as manual review tasks after implementation

---

## Parallel Example: User Story 1

```bash
# After Phase 2, these can be assigned separately:
Task: "T011 [US1] Implement WelcomeHero headline and supporting copy in src/components/onboarding/WelcomeHero.tsx"
Task: "T012 [US1] Implement primary Start setup link in src/components/onboarding/WelcomeActions.tsx"
```

## Parallel Example: Polish

```bash
# After all implementation tasks:
Task: "T031 Verify route behavior manually against quickstart.md"
Task: "T032 Verify responsive layout manually at 320px, 375px, tablet, and desktop widths"
Task: "T033 Verify keyboard navigation, accessible names, focus states, and error alert behavior"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate: authenticated user sees headline/copy and `Start setup` navigates to `/onboarding/goal`

### Incremental Delivery

1. Setup + Foundational → route and auth ready
2. US1 → headline, supporting copy, primary setup navigation
3. US2 → benefit list clarity
4. US3 → skip persistence and dashboard redirect
5. US4 → responsive premium layout, preview card, accessibility hardening
6. Polish → quickstart validation and build

### Single-Developer Execution

Proceed sequentially by task ID. Avoid editing the same file in parallel. Validate each checkpoint before moving to the next phase.

## Notes

- [P] tasks use different files and can be parallelized safely.
- User-facing implementation must preserve exact required strings from the spec.
- Use existing Tailwind tokens and design language; do not add dependencies.
- `WelcomeActions.tsx` should be the only Client Component unless implementation reveals a required exception.
- Store skipped status in Supabase Auth metadata; do not add database tables or migrations.
