# Feature Specification: Onboarding Experience Selection

**Feature Branch**: `011-onboarding-experience`  
**Created**: 2026-05-29  
**Status**: Draft  
**Input**: User description: "Create a premium onboarding page where the user selects their training experience level. Route: /onboarding/experience. Experience levels: Beginner, Intermediate, Advanced. Requirements: Dark premium fitness UI. Show progress: Step 2 of 8. Title: \"How experienced are you with training?\" Description explaining that the app will adjust workout intensity and progression. Show experience levels as modern selectable cards. Each card should include label, description, example bullet points. Only one option can be selected. Selected card must have a clear visual state. Continue button disabled until selection. Continue saves experienceLevel into onboarding state and navigates to /onboarding/frequency. Back action navigates to /onboarding/goal. Include loading and error states. Use strong TypeScript types. Accessible keyboard navigation required. Responsive layout for desktop, tablet, and mobile. Suggested components: OnboardingShell, OnboardingProgress, ExperienceOptionGrid, ExperienceOptionCard, OnboardingActions"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select training experience (Priority: P1)

A logged-in user reaches `/onboarding/experience` during onboarding and selects the training experience level that best matches their current ability so the app can personalize future workout intensity and progression.

**Why this priority**: This is the core purpose of the step. Without a saved experience level, later onboarding and recommendations cannot safely calibrate intensity.

**Independent Test**: Can be tested by visiting `/onboarding/experience`, selecting one of Beginner, Intermediate, or Advanced, and verifying that only the selected level is active and the Continue action becomes available.

**Acceptance Scenarios**:

1. **Given** a logged-in user is on `/onboarding/experience`, **When** the page loads, **Then** the system shows Step 2 of 8, the title "How experienced are you with training?", explanatory description text, and three selectable experience cards.
2. **Given** no experience level is selected, **When** the user views the action area, **Then** Continue is disabled.
3. **Given** the user selects Beginner, Intermediate, or Advanced, **When** the card is activated, **Then** that card shows a clear selected state and the other cards are not selected.
4. **Given** one level is already selected, **When** the user selects a different level, **Then** the new level becomes selected and the previous level is deselected.

---

### User Story 2 - Save and continue onboarding (Priority: P1)

A user who has chosen an experience level can save it and continue to the next onboarding step.

**Why this priority**: The step only delivers value if the selected level is persisted and the user can move forward in the onboarding flow.

**Independent Test**: Can be tested by selecting a level, activating Continue, confirming a saving state appears, confirming the selected value is saved as the user's `experienceLevel`, and confirming navigation to `/onboarding/frequency` after success.

**Acceptance Scenarios**:

1. **Given** a user has selected an experience level, **When** they activate Continue, **Then** the system saves the selected level into onboarding state.
2. **Given** the selected level saves successfully, **When** the save completes, **Then** the system navigates the user to `/onboarding/frequency`.
3. **Given** the save is in progress, **When** the user views the actions, **Then** the page communicates loading state and prevents duplicate save attempts.
4. **Given** saving fails, **When** the error occurs, **Then** the page shows a clear error message, preserves the selected level, and allows the user to retry.

---

### User Story 3 - Navigate backward safely (Priority: P2)

A user can return to the previous onboarding step without losing control of the flow.

**Why this priority**: Back navigation reduces onboarding friction and lets users revise the prior goal selection.

**Independent Test**: Can be tested by activating Back from `/onboarding/experience` and verifying navigation to `/onboarding/goal`.

**Acceptance Scenarios**:

1. **Given** the user is on `/onboarding/experience`, **When** they activate Back, **Then** the system navigates to `/onboarding/goal`.
2. **Given** a save is currently in progress, **When** the user attempts to navigate backward, **Then** the system prevents accidental interruption or clearly blocks the action until saving completes.

---

### User Story 4 - Use the step with assistive technology and different screen sizes (Priority: P2)

A user can complete the experience step using keyboard navigation, screen reader semantics, and layouts appropriate for mobile, tablet, and desktop screens.

**Why this priority**: The onboarding flow must be usable by all users and must preserve the product's mobile-first experience.

**Independent Test**: Can be tested by completing the page with keyboard only, verifying screen reader labels/states for selectable cards and progress, and checking mobile, tablet, and desktop viewport layouts.

**Acceptance Scenarios**:

1. **Given** the user is using a keyboard, **When** they tab through the page, **Then** focus reaches the cards and actions in a logical visual order with visible focus indicators.
2. **Given** a card has keyboard focus, **When** the user presses Enter or Space, **Then** that card is selected.
3. **Given** a card is selected, **When** assistive technology reads it, **Then** the selected state is conveyed without relying on color alone.
4. **Given** the page is viewed on mobile, tablet, or desktop, **When** the layout renders, **Then** all content remains readable and actionable without horizontal scrolling.

### Edge Cases

- User opens `/onboarding/experience` with a previously saved experience level: the saved level is preselected and Continue is enabled.
- User activates Continue repeatedly or rapidly: only one save attempt is processed at a time.
- User loses connectivity or the save service is unavailable: the selected value remains on screen and an error message explains that the user can retry.
- User navigates to the page directly rather than from `/onboarding/goal`: the page still renders for an authenticated user and supports selection normally.
- User has a saved value outside Beginner, Intermediate, or Advanced: the page treats it as no valid selection and requires the user to choose one of the supported options.
- Text content or card examples wrap on small screens: cards expand vertically without clipping controls or causing horizontal scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose the experience selection step at `/onboarding/experience` for authenticated onboarding users.
- **FR-002**: System MUST display onboarding progress as Step 2 of 8.
- **FR-003**: System MUST display the title "How experienced are you with training?".
- **FR-004**: System MUST display description text explaining that the app will adjust workout intensity and progression based on the selected experience level.
- **FR-005**: System MUST present exactly three selectable experience levels: Beginner, Intermediate, and Advanced.
- **FR-006**: Each experience option MUST be shown as a modern card containing a label, a description, and example bullet points.
- **FR-007**: System MUST allow only one experience option to be selected at a time.
- **FR-008**: System MUST show a clear selected state for the active card using more than color alone.
- **FR-009**: System MUST leave Continue disabled until a valid experience level is selected.
- **FR-010**: System MUST save the selected value as `experienceLevel` in onboarding state when Continue is activated.
- **FR-011**: System MUST navigate to `/onboarding/frequency` after the selected experience level saves successfully.
- **FR-012**: System MUST navigate to `/onboarding/goal` when the Back action is activated.
- **FR-013**: System MUST show a loading or saving state while the selected experience level is being saved.
- **FR-014**: System MUST prevent duplicate Continue submissions while saving is in progress.
- **FR-015**: System MUST show a clear error state if saving fails.
- **FR-016**: System MUST preserve the user's current selection after a save error so the user can retry without reselecting.
- **FR-017**: System MUST preselect a previously saved valid experience level when the page loads.
- **FR-018**: System MUST reject or ignore invalid experience values outside the supported Beginner, Intermediate, and Advanced options.
- **FR-019**: Experience card controls MUST be operable by keyboard using standard activation keys.
- **FR-020**: Interactive elements MUST provide visible focus indicators and a logical focus order.
- **FR-021**: The selected/unselected state of each option MUST be available to assistive technologies.
- **FR-022**: All primary interactive targets MUST be large enough for comfortable touch interaction.
- **FR-023**: The page MUST be responsive across mobile, tablet, and desktop viewports without horizontal scrolling.
- **FR-024**: Visual design MUST align with a dark premium fitness onboarding experience.
- **FR-025**: The page SHOULD use reusable onboarding building blocks equivalent to a shell, progress indicator, option grid, option card, and action area to keep the onboarding flow consistent with adjacent steps.

### Key Entities *(include if feature involves data)*

- **Experience Level**: The user's self-reported training background. Allowed values are Beginner, Intermediate, and Advanced.
- **Onboarding State**: The set of saved onboarding choices for the current user. For this feature, it includes `experienceLevel`, supports loading a previously saved valid value, and uses the same profile preferences source consumed by the profile overview.
- **Experience Option Card**: A selectable presentation of one experience level, including label, description, example bullets, and selected/unselected state.
- **Onboarding Step**: Represents the user's position in the setup flow. For this feature, experience selection is Step 2 of 8, follows `/onboarding/goal`, and leads to `/onboarding/frequency`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select an experience level and activate Continue within 30 seconds of the page loading.
- **SC-002**: Users can reach `/onboarding/frequency` with no more than two activations after the page loads when they have no previous selection.
- **SC-003**: 100% of successful Continue actions persist one of the three supported experience levels before navigation.
- **SC-004**: The page can be completed using keyboard only with no blocked interactions.
- **SC-005**: The page renders without horizontal scrolling at mobile, tablet, and desktop viewport widths.
- **SC-006**: After a simulated save failure, users can retry without losing their selected option.

## Assumptions

- The user is authenticated before accessing this onboarding step.
- `/onboarding/goal` already exists and is the previous step in the onboarding flow.
- `/onboarding/frequency` is the next route in the onboarding flow; if the full frequency step is not ready, a valid target route should still exist before validating successful Continue navigation.
- Example bullet points may be written by the product team as concise indicators of training familiarity, consistency, and exercise knowledge for each level.
- The implementation will keep the experience value constrained to the three supported options so downstream personalization can rely on it.
- The experience level saved during onboarding is the same value shown later in the user's profile/preferences experience-level summary.
