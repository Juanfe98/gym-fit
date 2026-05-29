# Feature Specification: Onboarding Welcome Screen

**Feature Branch**: `009-onboarding-welcome-screen`  
**Created**: 2026-05-29  
**Status**: Draft  
**Input**: User description: "Implement the Onboarding Welcome screen for the Gym Tracker web app. Create app/onboarding/welcome/page.tsx and onboarding components for the hero, benefit list, and actions. Requirements: modern premium fitness SaaS onboarding page, not generic generated UI; dark gradient background; large strong headline; clear supporting copy; benefits for personalized setup, tracking sets/reps/progress, and staying consistent; primary CTA \"Start setup\" navigates to /onboarding/goal; secondary CTA \"Skip for now\" saves onboarding status as skipped and redirects to /dashboard; desktop two-column layout; mobile stacked layout; right-side visual card showing a sample weekly workout/progress preview; accessible buttons/links; responsive spacing and typography."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start onboarding from welcome screen (Priority: P1)

A new user opening onboarding sees a premium, fitness-focused welcome screen that clearly explains the value of setup and can start the setup flow with one primary action.

**Why this priority**: This is the primary entry point into onboarding. If the user cannot understand the value or proceed, the rest of onboarding cannot succeed.

**Independent Test**: Can be fully tested by opening onboarding, confirming the headline, explanation, benefits, and selecting the primary action to reach goal selection.

**Acceptance Scenarios**:

1. **Given** a user is eligible for onboarding, **When** the welcome screen loads, **Then** they see the headline "Build a workout plan that actually fits you" prominently.
2. **Given** a user is on the welcome screen, **When** they read the supporting copy, **Then** it explains personalization based on goals, schedule, experience, and equipment.
3. **Given** a user is on the welcome screen, **When** they choose "Start setup", **Then** they are taken to the goal selection step.

---

### User Story 2 - Understand onboarding benefits before deciding (Priority: P2)

A user can quickly scan the welcome screen and understand the three core benefits of completing setup before making a decision.

**Why this priority**: Benefit clarity increases onboarding completion and helps users understand why setup is worth their time.

**Independent Test**: Can be tested by viewing the welcome screen and verifying that each required benefit is visible, distinct, and readable on phone-sized screens.

**Acceptance Scenarios**:

1. **Given** a user is on the welcome screen, **When** they scan the benefit section, **Then** they see "Personalized workout setup".
2. **Given** a user is on the welcome screen, **When** they scan the benefit section, **Then** they see "Track sets, reps, and progress".
3. **Given** a user is on the welcome screen, **When** they scan the benefit section, **Then** they see "Stay consistent with a clear plan".

---

### User Story 3 - Skip onboarding for now (Priority: P3)

A user who does not want to complete setup immediately can skip onboarding and reach the dashboard without being blocked.

**Why this priority**: The product requirements allow non-critical onboarding steps to be skipped, preventing forced setup from blocking user access.

**Independent Test**: Can be tested by selecting the secondary action and verifying the user reaches the dashboard and is not immediately returned to onboarding.

**Acceptance Scenarios**:

1. **Given** a user is on the welcome screen, **When** they choose "Skip for now", **Then** their onboarding status is recorded as skipped.
2. **Given** a user has skipped onboarding, **When** the skip action completes, **Then** they are taken to the dashboard.
3. **Given** a user has skipped onboarding, **When** they reopen the app, **Then** the app does not force them back to the welcome screen solely because they skipped.

---

### User Story 4 - Use the screen accessibly across screen sizes (Priority: P3)

A user can operate the welcome screen comfortably across mobile and desktop layouts and with assistive technologies.

**Why this priority**: Onboarding is the first impression and must be usable in mobile contexts, desktop contexts, and with screen reader navigation.

**Independent Test**: Can be tested by viewing the screen on small phone, tablet, and desktop dimensions, checking that text, preview content, and actions remain visible and accessible, and confirming buttons and links have meaningful accessible names.

**Acceptance Scenarios**:

1. **Given** a user views the welcome screen on a small phone, **When** content is displayed, **Then** all primary content and actions remain readable and reachable without horizontal scrolling.
2. **Given** a user views the welcome screen on desktop, **When** content is displayed, **Then** the layout uses a two-column presentation with the value proposition and actions on one side and the workout/progress preview on the other.
3. **Given** a user uses assistive technology, **When** they navigate to each call-to-action, **Then** each button or link has a clear accessible name matching its purpose.
4. **Given** a user interacts with either call-to-action, **When** they tap or click it, **Then** the target is large enough for reliable use.

### Edge Cases

- If saving the skipped status fails, the user should receive clear feedback and remain able to retry or continue without losing context.
- If navigation to the next step or dashboard fails, the user should remain on the welcome screen with a clear recovery path.
- On very small phone screens, content may scroll vertically, but it must not require horizontal scrolling or hide the primary and secondary actions.
- On desktop screens, the preview card must enhance the page without competing with or obscuring the primary onboarding action.
- If onboarding status is already completed or skipped, the user should not be shown the welcome screen as a blocking step.
- If the app is temporarily offline, the skip decision should still be captured locally or handled with a clear retry path.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display an onboarding welcome screen for users who are eligible to begin onboarding.
- **FR-002**: System MUST display the headline exactly as: "Build a workout plan that actually fits you".
- **FR-003**: System MUST display supporting text explaining that training will be personalized based on the user's goals, schedule, experience, and equipment.
- **FR-004**: System MUST display the benefit "Personalized workout setup".
- **FR-005**: System MUST display the benefit "Track sets, reps, and progress".
- **FR-006**: System MUST display the benefit "Stay consistent with a clear plan".
- **FR-007**: System MUST provide a primary action labeled "Start setup".
- **FR-008**: Selecting "Start setup" MUST take the user to `/onboarding/goal`.
- **FR-009**: System MUST provide a secondary action labeled "Skip for now".
- **FR-010**: Selecting "Skip for now" MUST record the user's onboarding status as skipped.
- **FR-011**: After onboarding is skipped, System MUST take the user to `/dashboard`.
- **FR-012**: System MUST prevent duplicate or conflicting navigation if a user taps or clicks either action repeatedly.
- **FR-013**: System MUST present the welcome content in a premium dark fitness visual style consistent with the product design language.
- **FR-014**: System MUST use a dark gradient background that preserves readable text contrast.
- **FR-015**: System MUST provide meaningful accessible names for both call-to-action controls.
- **FR-016**: System MUST support common phone screen sizes without horizontal scrolling, clipped calls-to-action, or unreadable text.
- **FR-017**: System MUST present a two-column layout on desktop-sized screens and a stacked layout on mobile-sized screens.
- **FR-018**: System MUST display a right-side visual preview card on wider screens showing sample weekly workout and progress information.
- **FR-019**: System MUST use responsive spacing and typography so the headline, supporting copy, benefits, preview card, and actions remain visually balanced across supported screen sizes.

### Key Entities *(include if feature involves data)*

- **Onboarding Status**: Represents the user's onboarding progression state. For this feature, the relevant status is whether onboarding has been skipped so the user can proceed to the dashboard without being forced back to setup.
- **Onboarding Step**: Represents a stage in the setup flow. For this feature, the welcome step leads to the goal selection step when the user starts setup.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can identify the purpose of the welcome screen and the primary next action within 5 seconds in usability review.
- **SC-002**: Users can move from the welcome screen to `/onboarding/goal` with one activation after the screen loads.
- **SC-003**: Users can skip onboarding and reach `/dashboard` with one activation after the screen loads.
- **SC-004**: The welcome screen remains fully usable at 320px-wide viewport equivalents without horizontal scrolling.
- **SC-005**: The desktop layout clearly presents both the onboarding value proposition and the weekly workout/progress preview without crowding at common laptop widths.
- **SC-006**: Both actions meet touch target accessibility expectations and expose clear accessible names during accessibility review.
- **SC-007**: The skip decision persists successfully in 99% of normal app sessions where local or remote storage is available.

## Assumptions

- The user is already authenticated or otherwise allowed to enter the onboarding flow before seeing this screen.
- `/onboarding/goal` is the next onboarding step after the welcome screen.
- `/dashboard` is the correct destination when a user skips onboarding.
- Skipping onboarding is allowed by product policy and can be edited or completed later from profile or settings.
- The visual design follows the existing Gym Tracker dark athletic design language and accessibility standards.
- The sample weekly workout/progress preview is illustrative and does not need to reflect real user data for this first screen.
- All user-facing strings may later be localized, but this feature defines the initial English copy.
