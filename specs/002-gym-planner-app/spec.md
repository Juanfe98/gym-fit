# Feature Specification: Gym Planner — User-Facing Application

**Feature Branch**: `002-gym-planner-app`  
**Created**: 2026-05-27  
**Status**: Draft  
**Type**: Umbrella Spec — each module below gets its own child spec

---

> **Scope Note**: This spec defines the overall product vision, principles, and module map.
> It is intentionally high-level. Each module listed in Section 4 will have a dedicated spec
> (`/speckit-specify`) before implementation begins.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Core Workout Loop (Priority: P1)

A gym-goer opens the app at the gym, starts a workout session, logs sets/reps/weight for each exercise, finishes the session, and sees a session summary.

**Why this priority**: This is the single most-used flow. Every other feature depends on session data being captured reliably. If only this works, the app delivers core value.

**Independent Test**: User can start a session → add exercises → log sets → end session → see summary. No plan required. Works offline.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the home screen, **When** they tap "Start Workout", **Then** a new session begins with a timer and empty exercise list.
2. **Given** an active session, **When** the user adds an exercise and logs a set with weight/reps, **Then** the set is saved immediately without requiring a save action.
3. **Given** an active session with logged sets, **When** the user taps "Finish", **Then** they see a session summary (exercises, total volume, duration) and the session is persisted.
4. **Given** a session in progress and loss of internet connection, **When** the user logs additional sets, **Then** data is saved locally and synced automatically when connection restores.

---

### User Story 2 — Workout Plan Execution (Priority: P2)

A user selects a pre-built or custom workout plan, follows it session by session, and sees which exercises and sets to do next.

**Why this priority**: Plans increase retention and structure. Users following a plan return more consistently than free-form loggers.

**Independent Test**: User can browse plans → pick one → start a plan session → follow prescribed exercises/sets → mark session complete.

**Acceptance Scenarios**:

1. **Given** a user without an active plan, **When** they browse the plan library and select one, **Then** the plan is activated and the next scheduled session is shown on the home screen.
2. **Given** an active plan, **When** the user starts the next plan session, **Then** prescribed exercises, sets, reps, and suggested weights are pre-loaded.
3. **Given** a completed plan session, **When** the user finishes, **Then** progress within the plan advances and the next session is scheduled.

---

### User Story 3 — Progress Visibility (Priority: P2)

A user wants to see if they are getting stronger over time. They view a chart of their bench press weight across the last 12 weeks.

**Why this priority**: Progress visibility is the primary retention driver after habit formation. Users who see progress stay.

**Independent Test**: User can navigate to exercise history → select an exercise → see a chart of max weight or volume over time.

**Acceptance Scenarios**:

1. **Given** a user with at least 3 logged sessions containing the same exercise, **When** they view that exercise's progress, **Then** they see a chart with dates on the x-axis and max weight/volume on the y-axis.
2. **Given** a progress chart, **When** the user taps a data point, **Then** they see the full session detail for that date.
3. **Given** a user who has set a personal record, **When** they log a new PR for that exercise, **Then** they receive a visual celebration and the record is updated.

---

### User Story 4 — Onboarding & Profile Setup (Priority: P1)

A new user downloads the app, creates an account, and completes an onboarding flow that captures their fitness level, goals, and available equipment.

**Why this priority**: Without onboarding, the app cannot personalize experience or recommend plans. Required before any other flow is useful.

**Independent Test**: New user can register → complete onboarding → land on personalized home screen with a recommended plan or prompt.

**Acceptance Scenarios**:

1. **Given** a new user on the welcome screen, **When** they complete registration (email + password or social), **Then** an account is created and onboarding begins.
2. **Given** an onboarding flow, **When** the user provides fitness level, primary goal, and available equipment, **Then** the profile is saved and used for plan recommendations.
3. **Given** a returning user, **When** they open the app, **Then** they land directly on the home screen without seeing onboarding again.

---

### User Story 5 — Goal Tracking (Priority: P3)

A user sets a goal ("Squat 100kg by September") and can track progress toward it over time.

**Why this priority**: Goals increase motivation and long-term engagement. Not required for core loop but improves retention at 30+ days.

**Independent Test**: User can create a goal with target metric and date → see current progress → see estimated date to reach the goal based on trend.

**Acceptance Scenarios**:

1. **Given** a user on the Goals screen, **When** they create a goal with exercise, target weight, and target date, **Then** the goal is saved and displayed with current progress.
2. **Given** a goal in progress, **When** the user logs a session where the relevant exercise improves, **Then** goal progress updates automatically.
3. **Given** a goal that has been reached, **When** the app detects the target was met, **Then** the user receives a congratulatory message and the goal is marked complete.

---

### Edge Cases

- User logs a session but loses connectivity mid-session — data must not be lost.
- User has no workout history — progress and analytics screens must handle empty state gracefully.
- User creates a plan with exercises not in their equipment profile — app must warn but not block.
- User attempts to log negative weight or zero reps — app must validate and reject with a clear message.
- User creates two active goals for the same exercise metric — app must handle deduplication or allow multiples with clear labeling.
- Session timer runs in background (phone locked) — timer must continue accurately.

---

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & Account**
- **FR-001**: System MUST allow users to register with email and password.
- **FR-002**: System MUST allow users to log in and maintain authenticated sessions.
- **FR-003**: System MUST allow users to reset their password via email.
- **FR-004**: System MUST allow users to delete their account and all associated data.

**Onboarding**
- **FR-005**: System MUST guide new users through a fitness profile setup on first launch.
- **FR-006**: System MUST capture fitness level, primary goal, and available equipment during onboarding.

**Workout Session Tracking**
- **FR-007**: System MUST allow users to start, pause, resume, and end a workout session.
- **FR-008**: System MUST allow users to add exercises to an active session from an exercise library.
- **FR-009**: System MUST allow users to log sets with weight, reps, and optional notes per set.
- **FR-010**: System MUST autosave all logged data without requiring manual save actions.
- **FR-011**: System MUST save session data locally when offline and sync when connectivity returns.
- **FR-012**: System MUST display a session summary (volume, duration, exercises) when a session ends.

**Exercise Library**
- **FR-013**: System MUST provide a searchable exercise library with muscle group and equipment filters.
- **FR-014**: System MUST allow users to create custom exercises not in the default library.

**Workout Plans**
- **FR-015**: System MUST allow users to browse and activate pre-built workout plans.
- **FR-016**: System MUST allow users to create custom workout plans.
- **FR-017**: System MUST track user progress within an active plan session by session.

**Progress & Analytics**
- **FR-018**: System MUST display per-exercise progress charts (weight/volume over time).
- **FR-019**: System MUST track and display personal records per exercise.
- **FR-020**: System MUST display workout history with session-level detail.

**Goals**
- **FR-021**: System MUST allow users to set goals with target metric and target date.
- **FR-022**: System MUST automatically update goal progress when relevant sessions are logged.

**Profile & Settings**
- **FR-023**: System MUST allow users to update their fitness profile at any time.
- **FR-024**: System MUST allow users to configure notification preferences.
- **FR-025**: System MUST allow users to configure units (kg/lbs, cm/in).

### Key Entities

- **User**: Authenticated account. Has profile (fitness level, goal, equipment, units preference).
- **Exercise**: Named movement with muscle group, equipment tags, and optional video/image. Can be system-defined or user-created.
- **WorkoutPlan**: Ordered collection of sessions. Has name, schedule frequency, and difficulty level.
- **PlanSession**: A single session within a plan. Has ordered list of exercises with prescribed sets, reps, and rest periods.
- **WorkoutSession**: A logged training session. Belongs to a user. Has start/end timestamps, exercises, and sets. May be linked to a PlanSession.
- **SetLog**: A single logged set within a WorkoutSession. Has weight, reps, set type (normal/warmup/drop), and timestamp.
- **PersonalRecord**: Best performance per exercise per metric (max weight, max volume). Auto-computed from SetLog history.
- **Goal**: User-defined target. Has exercise, target metric, target value, and target date. Linked to PersonalRecord for progress.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users complete a full workout session (start → log sets → finish) in under 5 minutes of total app interaction time for a 5-exercise session.
- **SC-002**: Users can log a single set within 5 seconds of viewing the exercise.
- **SC-003**: 90% of workout sessions with connectivity loss experience zero data loss upon reconnection.
- **SC-004**: New users complete onboarding and start their first session within 10 minutes of first launch.
- **SC-005**: Users who complete onboarding return within 7 days at a rate of 60% or higher.
- **SC-006**: Progress charts load within 2 seconds for users with up to 52 weeks of history.
- **SC-007**: App is fully functional on screens 375px wide and above.
- **SC-008**: 80% of users can find their workout history without assistance.

---

## Module Map — Child Specs

Each module below requires its own `/speckit-specify` run before implementation:

| Priority | Module | Description |
|----------|--------|-------------|
| P1 | `003-auth` | Registration, login, password reset, account deletion |
| P1 | `004-onboarding` | First-launch flow, fitness profile capture, plan recommendation prompt |
| P1 | `005-workout-session-tracking` | Core session flow, exercise add, set logging, offline sync, session summary |
| P1 | `006-exercise-library` | Searchable library, muscle/equipment filters, custom exercises |
| P2 | `007-workout-plans` | Plan browsing, plan creation, plan session execution, progress within plan |
| P2 | `008-progress-dashboard` | Per-exercise charts, volume trends, workout frequency heatmap |
| P2 | `009-personal-records` | PR detection, PR history, PR celebrations |
| P2 | `010-workout-history` | Session list, session detail, calendar view |
| P3 | `011-goals` | Goal creation, progress tracking, goal completion |
| P3 | `012-body-measurements` | Weight, body fat, measurement logging and trend charts |
| P3 | `013-scheduling-calendar` | Workout scheduling, rest day planning, calendar integration |
| P4 | `014-notifications` | Reminder setup, PR alerts, plan reminders, preferences UI |
| P4 | `015-settings-profile` | Unit preferences, profile editing, data export, account management |
| P4 | `016-help-feedback` | FAQ entry, feedback submission, support contact |

---

## Assumptions

- Users have a modern smartphone (iOS 16+ or Android 10+) or a desktop browser.
- Authentication uses email/password as the default method; social login (Google/Apple) is a secondary option considered during the auth module spec.
- Offline support covers workout session tracking only; browsing plans and analytics require connectivity.
- Pre-built exercise library contains at least 100 exercises at launch covering the major muscle groups and common equipment categories.
- Users are assumed to have at least basic gym knowledge; the app does not teach exercise form in v1 (form guidance is a future module).
- Body measurements (weight, body fat) are optional profile data; the core experience works without them.
- The app does not integrate with wearables or third-party fitness platforms in v1.
- AI-generated plans and coach-assigned plans are out of scope for v1; the module map above covers v1 only.
- Calendar integration (syncing to device calendar) is P3 and may be deferred post-launch.
