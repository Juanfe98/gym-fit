# Feature Specification: Onboarding Goal Selection

**Feature Branch**: `010-onboarding-goal-selection`  
**Created**: 2026-05-29  
**Status**: Draft  
**Input**: User description: "Create a goal selection onboarding page where the user selects one primary fitness goal. Route: /onboarding/goal. Goal options: Build muscle, Lose fat, Gain strength, Improve endurance, General fitness, Improve mobility, Maintain current shape. Requirements: premium dark fitness UI, progress Step 1 of 7, title \"What is your main fitness goal?\", description \"Choose the goal that best matches what you want to focus on first. You can update this later.\", options as modern selectable cards, single selection only, selected card has clear state, Continue disabled until selected, Continue saves mainGoal into onboarding state and navigates to /onboarding/experience, Back navigates to /onboarding/welcome, include loading/error states for save action, use strong TypeScript types, accessible buttons with aria-pressed, responsive desktop/tablet/mobile. Suggested components: OnboardingShell, OnboardingProgress, GoalOptionGrid, GoalOptionCard, OnboardingActions."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select a primary fitness goal (Priority: P1)

A user entering the onboarding setup can choose exactly one primary fitness goal from a focused list, understand which choice is active, and continue only after making a selection.

**Why this priority**: Capturing the user's main goal is the first required personalization input after the welcome screen. Without this value, the product cannot tailor later onboarding or recommendations.

**Independent Test**: Can be fully tested by visiting `/onboarding/goal`, selecting each available goal card, verifying only one card is selected at a time, and confirming the Continue action becomes available only after a goal is selected.

**Acceptance Scenarios**:

1. **Given** a user is on `/onboarding/goal` with no goal selected, **When** the page loads, **Then** the Continue action is disabled and no goal card is shown as selected.
2. **Given** a user is on `/onboarding/goal`, **When** they select "Build muscle", **Then** the "Build muscle" card has a clear selected state and Continue becomes enabled.
3. **Given** a user has selected "Build muscle", **When** they select "Lose fat", **Then** "Lose fat" becomes selected and "Build muscle" is no longer selected.
4. **Given** a user has selected any goal, **When** they inspect the available options, **Then** exactly one option is selected at any time.

---

### User Story 2 - Continue to the next onboarding step (Priority: P1)

A user who has chosen a primary goal can save that choice and proceed to the experience step of onboarding.

**Why this priority**: This completes the goal-selection step and allows the onboarding flow to progress while preserving the user's personalization input.

**Independent Test**: Can be tested by selecting one goal, activating Continue, verifying the selected goal is recorded as the user's `mainGoal`, and confirming navigation to `/onboarding/experience`.

**Acceptance Scenarios**:

1. **Given** a user has selected "Gain strength", **When** they activate Continue, **Then** the selected value is saved as `mainGoal`.
2. **Given** the selected goal saves successfully, **When** the save completes, **Then** the user is taken to `/onboarding/experience`.
3. **Given** the selected goal is saving, **When** the user views the actions, **Then** the page shows a loading or pending state and prevents duplicate save attempts.
4. **Given** saving fails, **When** the failure is shown, **Then** the user remains on the goal page, sees a clear error state, and can retry without losing the selected goal.

---

### User Story 3 - Move back to the welcome step (Priority: P2)

A user can return from goal selection to the onboarding welcome screen without making or saving a goal selection.

**Why this priority**: Onboarding should support natural step-by-step navigation and allow users to review prior context before committing to the next step.

**Independent Test**: Can be tested by visiting `/onboarding/goal`, activating the Back action, and confirming navigation to `/onboarding/welcome` without requiring a selected goal.

**Acceptance Scenarios**:

1. **Given** a user is on `/onboarding/goal`, **When** they activate Back, **Then** they are taken to `/onboarding/welcome`.
2. **Given** a user has selected a goal but has not continued, **When** they activate Back, **Then** no new goal save is required before returning to `/onboarding/welcome`.

---

### User Story 4 - Use goal selection accessibly across devices (Priority: P2)

A user can understand and operate the goal-selection page on mobile, tablet, and desktop screens, including with assistive technologies.

**Why this priority**: The first data-entry step in onboarding must be comfortable and accessible across common user contexts so users can complete setup without friction.

**Independent Test**: Can be tested by viewing the page at mobile, tablet, and desktop widths; navigating to each selectable card and action with keyboard and assistive technology; and verifying readable content, accessible names, and selected-state announcements.

**Acceptance Scenarios**:

1. **Given** a user views the page on a small phone-sized screen, **When** the goal cards and actions are displayed, **Then** content remains readable and usable without horizontal scrolling.
2. **Given** a user views the page on a tablet or desktop-sized screen, **When** the goal cards are displayed, **Then** the grid adapts to use available space while preserving clear card separation and tap/click targets.
3. **Given** a user navigates goal cards with assistive technology, **When** a card is selected or unselected, **Then** the card exposes its pressed/selected state in a way assistive technologies can announce.
4. **Given** a user sees the page, **When** they review the progress indicator, **Then** it communicates "Step 1 of 7".

### Edge Cases

- If the user attempts to continue without a selected goal, the action remains disabled and no save or navigation occurs.
- If the user rapidly selects multiple goals, only the most recent selection is active and saved.
- If the user repeatedly activates Continue during saving, duplicate saves and duplicate navigation must be prevented.
- If saving the selected goal fails, the selected card remains selected so the user can retry without reselecting.
- If the user activates Back while a save is in progress, Back is temporarily unavailable until the save succeeds or fails, preventing conflicting navigation.
- On narrow screens, goal options may stack vertically, but all options and actions must remain reachable through normal vertical scrolling.
- If a user returns to the page with an existing saved `mainGoal`, the previously saved goal should be reflected as the selected option when available.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide the goal-selection onboarding page at `/onboarding/goal`.
- **FR-002**: System MUST display onboarding progress as "Step 1 of 7".
- **FR-003**: System MUST display the page title exactly as: "What is your main fitness goal?".
- **FR-004**: System MUST display the description exactly as: "Choose the goal that best matches what you want to focus on first. You can update this later.".
- **FR-005**: System MUST display the goal option "Build muscle".
- **FR-006**: System MUST display the goal option "Lose fat".
- **FR-007**: System MUST display the goal option "Gain strength".
- **FR-008**: System MUST display the goal option "Improve endurance".
- **FR-009**: System MUST display the goal option "General fitness".
- **FR-010**: System MUST display the goal option "Improve mobility".
- **FR-011**: System MUST display the goal option "Maintain current shape".
- **FR-012**: System MUST present goal options as modern selectable cards in a premium dark fitness visual style.
- **FR-013**: System MUST allow only one primary goal to be selected at a time.
- **FR-014**: System MUST provide a clear selected visual state that distinguishes the selected goal card from unselected cards.
- **FR-015**: System MUST expose each goal option as an accessible button whose `aria-pressed` state matches whether that option is currently selected.
- **FR-016**: System MUST provide a Continue action that is disabled until a goal has been selected.
- **FR-017**: System MUST save the selected goal as `mainGoal` in onboarding state when Continue is activated.
- **FR-018**: After `mainGoal` saves successfully, System MUST navigate the user to `/onboarding/experience`.
- **FR-019**: System MUST provide a Back action that navigates the user to `/onboarding/welcome`.
- **FR-020**: System MUST display a loading or pending state while the selected goal is being saved.
- **FR-021**: System MUST display a clear error state if saving the selected goal fails.
- **FR-022**: System MUST preserve the user's current selected goal after a save error so the user can retry.
- **FR-023**: System MUST prevent duplicate save attempts while a save is already in progress.
- **FR-024**: System MUST temporarily disable or block Back navigation while a save is already in progress.
- **FR-025**: System MUST accept only the supported goal identifiers for `mainGoal` and reject invalid goal values.
- **FR-026**: System MUST adapt layout, spacing, and card grid presentation across desktop, tablet, and mobile viewports without horizontal scrolling or clipped actions.
- **FR-027**: System SHOULD organize the page with reusable onboarding building blocks equivalent to a shell, progress indicator, option grid, option card, and action area to keep the onboarding experience consistent with adjacent steps.

### Key Entities *(include if feature involves data)*

- **Fitness Goal Option**: Represents one selectable goal shown to the user. Key attributes include a stable goal identifier, display label, selected state, and accessible pressed state.
- **Onboarding State**: Represents the user's in-progress setup data. For this feature, the relevant attribute is `mainGoal`, which stores the single selected primary fitness goal.
- **Onboarding Step**: Represents the user's position in the setup flow. For this feature, goal selection is Step 1 of 7 and leads to the experience step.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can identify that they need to choose one main fitness goal within 5 seconds of viewing the page.
- **SC-002**: Users can select a goal and reach `/onboarding/experience` with no more than two activations after the page loads.
- **SC-003**: The Continue action remains unavailable in 100% of attempts when no goal is selected.
- **SC-004**: In usability testing, 95% of users can correctly tell which card is selected after choosing a goal.
- **SC-005**: The page remains fully usable at 320px-wide viewport equivalents without horizontal scrolling.
- **SC-006**: All seven goal options and both navigation actions meet accessibility expectations for names, state communication, and reliable activation during accessibility review.
- **SC-007**: Goal save failures present recoverable feedback and preserve the user's selected goal in 100% of simulated failure cases.
- **SC-008**: Successful goal saves persist the selected `mainGoal` and route users to the next onboarding step in 99% of normal app sessions where storage and navigation are available.

## Assumptions

- The user is already authenticated or otherwise allowed to enter the onboarding flow before seeing this page.
- The onboarding welcome page at `/onboarding/welcome` already exists and is the previous step in the flow.
- If `/onboarding/experience` does not yet exist during implementation, this feature will add a minimal authenticated placeholder target so successful Continue navigation does not produce a missing page.
- Authenticated users who manually revisit `/onboarding/goal`, including users who previously skipped or completed onboarding, may view and update `mainGoal` rather than being redirected solely because of onboarding status.
- The selected `mainGoal` may be edited later, consistent with the page description.
- Existing onboarding state storage will be reused; this feature only adds or updates the `mainGoal` value.
- The initial goal list is fixed to the seven provided options for this feature.
- All user-facing strings in this specification define the initial English copy and may be localized later.
