# Feature Specification: Workout Plans

**Feature Branch**: `008-workout-plans`
**Created**: 2026-05-29
**Status**: Draft
**Input**: User description: "Workout Plans module — create, view, edit, activate, duplicate, archive plans with workout days and exercise configuration"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Create a Plan (Priority: P1)

A user wants to build a structured workout schedule by creating a plan from scratch or from a pre-built template. They name the plan, pick a goal and experience level, set a duration, choose how many days per week, and add workout days with exercises.

**Why this priority**: Without plan creation, no other plan feature exists. This is the foundational entry point and delivers standalone value — a user who creates a plan immediately has an organisational structure for their training.

**Independent Test**: Navigate to `/plans` → tap "Create Plan" → fill form → choose manual → save → plan appears in list with 0 days. Then add a day, add an exercise to that day — plan is usable as a template.

**Acceptance Scenarios**:

1. **Given** a user is on the Plans List, **When** they tap "Create Plan" and choose "Manual", **Then** they see a form with name, goal, level, duration, and days-per-week fields.
2. **Given** a user submits the creation form with valid data, **When** the save action fires, **Then** a new plan appears in the Plans List in draft state (not active).
3. **Given** a user taps "Start from template", **When** they select a template (Muscle Gain, Fat Loss, Strength, Conditioning), **Then** a new plan is pre-populated with days and exercises copied from the chosen template routine.
4. **Given** a user submits the creation form with the name field empty, **When** they attempt to save, **Then** a field-level validation error appears on the name field.
5. **Given** a user selects 3 days-per-week for a template with 6 days, **When** they confirm, **Then** the first 3 days of the template are imported (excess days discarded).

---

### User Story 2 — Manage Plan Days & Exercises (Priority: P1)

A user opens a plan and wants to add, rename, reorder, or delete workout days. Inside each day they want to add exercises from the Exercise Library, configure target sets/reps, and reorder or remove exercises.

**Why this priority**: A plan with no day or exercise data has no workout value. Day and exercise management is the core editing loop needed before a plan can be activated.

**Independent Test**: Open any plan → add a day → open the day editor → add two exercises from the exercise picker → set target sets and reps for each → reorder them using up/down buttons → remove one → day shows correct single exercise.

**Acceptance Scenarios**:

1. **Given** a user is on Plan Detail, **When** they tap "Add Day", **Then** a new workout day is appended with a default name they can edit.
2. **Given** a user is on the Workout Day Editor, **When** they tap "Add Exercise", **Then** the Exercise Library picker opens and they can search and select an exercise.
3. **Given** an exercise is added to a day, **When** the user sets target sets and reps, **Then** those values persist and are shown on the day editor.
4. **Given** a day has two or more exercises, **When** the user taps the up or down reorder button on an exercise row, **Then** the exercise swaps position with its neighbour immediately.
5. **Given** a day has at least one exercise, **When** the user deletes an exercise, **Then** it is removed and the remaining exercises retain their order.
6. **Given** a user edits the name of a day, **When** they save, **Then** the new name is reflected in Plan Detail and the Workout Day Editor header.

---

### User Story 3 — Activate a Plan (Priority: P1)

A user wants to designate one plan as their current active plan so that the Workout Session screen can reference it when starting a session. Only one plan may be active at a time.

**Why this priority**: Plan activation is the bridge between planning and execution. Without it, the Workout Session module (spec 003) cannot load plan-sourced exercise lists. This is a core user journey, not a nice-to-have.

**Independent Test**: Create a plan with at least one day containing at least one exercise → tap "Activate" on Plan Detail → plan shows "Active" badge → create a second plan → activate it → first plan loses "Active" badge → both plans list shows only second plan as active.

**Acceptance Scenarios**:

1. **Given** a plan has at least one day and that day has at least one exercise, **When** the user taps "Activate", **Then** the plan becomes the active plan.
2. **Given** a plan has no days, **When** the user attempts to activate, **Then** an inline error is shown: activation requires at least one day with at least one exercise.
3. **Given** a plan is already active, **When** the user activates a different plan, **Then** the previously active plan is automatically deactivated and the new plan becomes active.
4. **Given** a plan is currently active, **When** the user taps "Deactivate", **Then** no plan is active and the active indicator is removed.

---

### User Story 4 — Duplicate & Archive a Plan (Priority: P2)

A user wants to copy an existing plan as a starting point for a new variation, or archive a completed/unused plan so it no longer appears in their primary list but is not deleted.

**Why this priority**: Duplicate and archive are quality-of-life operations. Users can manage plans without them, but these reduce friction for iterative programme design.

**Independent Test**: Open Plan Detail → tap "Duplicate" → new plan appears in list with "(copy)" suffix and identical days/exercises but is not active → open original plan → tap "Archive" → plan disappears from default list → toggle "Show archived" → plan appears with archived indicator.

**Acceptance Scenarios**:

1. **Given** the user taps "Duplicate" on Plan Detail, **When** the action completes, **Then** a new plan exists in the list with the same days and exercises, a "(copy)" suffix on the name, and is not active.
2. **Given** a plan is duplicated, **When** the user edits the copy, **Then** the original plan is unchanged.
3. **Given** the user taps "Archive" on a plan, **When** confirmed, **Then** the plan is hidden from the default Plans List.
4. **Given** archived plans exist, **When** the user toggles "Show archived", **Then** archived plans appear with a visual indicator distinguishing them from active plans.
5. **Given** an active plan is archived, **When** the archive action fires, **Then** the plan is deactivated before archiving.

---

### Edge Cases

- What happens when a plan is activated and then the only day in the plan is deleted? → Plan must be automatically deactivated.
- How does the system handle activating a plan with a day that has no exercises? → Activation blocked with a message indicating which day is incomplete.
- What happens when all exercises are removed from a day in the active plan mid-session? → The session is not affected; validation only runs at activation time.
- What happens when a template import fails partway through? → The partially-created plan is rolled back; user sees an error and the Plans List is unchanged.
- What if the user navigates away during plan creation without saving? → Changes are discarded; no draft state is persisted.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to create a new workout plan by providing a name, goal, experience level, target duration (weeks), and days-per-week count.
- **FR-002**: Users MUST be able to start plan creation from a pre-built template (Muscle Gain, Fat Loss, Strength, Conditioning); the template pre-populates days and exercises.
- **FR-003**: Users MUST be able to add, rename, and delete workout days within a plan.
- **FR-004**: Users MUST be able to add exercises to a workout day using the Exercise Library picker.
- **FR-005**: Users MUST be able to set target sets, target reps (or a rep range), target weight, and rest duration per exercise within a day.
- **FR-006**: Users MUST be able to reorder exercises within a day using up/down buttons (no drag-and-drop required for v1).
- **FR-007**: Users MUST be able to activate a plan; activation MUST fail if the plan has no days or any day has no exercises.
- **FR-008**: The system MUST enforce that only one plan is active per user at any time; activating a plan MUST automatically deactivate any previously active plan.
- **FR-009**: Users MUST be able to deactivate a plan without activating another.
- **FR-010**: Users MUST be able to duplicate a plan, producing a deep copy including all days and exercises.
- **FR-011**: Users MUST be able to archive a plan; archived plans are hidden from the default list but remain retrievable via a toggle.
- **FR-012**: Archiving an active plan MUST deactivate it first.
- **FR-013**: The Plans List MUST show an "Active" indicator on the current active plan.
- **FR-014**: The Workout Session start flow (spec 003) MUST be able to reference a plan day by its real persisted ID (`sourcePlanId`, `sourceWorkoutDayId`).
- **FR-015**: All form fields MUST show field-level validation errors before a save action is allowed to proceed.
- **FR-016**: Deleting the last day of an active plan MUST automatically deactivate the plan.

### Key Entities

- **WorkoutPlan**: Represents a structured training programme. Attributes: id, user_id, name, description, goal (muscle_gain | fat_loss | strength | conditioning | general), level (beginner | intermediate | advanced), duration_weeks, days_per_week, is_active, is_archived, created_at, updated_at.
- **WorkoutDay**: A single session template within a plan, ordered by day_order. Attributes: id, plan_id, name, day_order, target_muscle_groups (array of strings).
- **PlanExercise**: An exercise slot within a day with configuration. Attributes: id, day_id, exercise_id (references static catalog), order, target_sets, target_reps, target_rep_range_min, target_rep_range_max, target_weight, rest_seconds, tempo, target_rpe, notes.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a plan (manual or from template) and add their first day with exercises in under 3 minutes on a 375px mobile viewport.
- **SC-002**: Plan activation, deactivation, duplicate, and archive operations complete and reflect in the UI within 1 second.
- **SC-003**: Field-level validation errors appear without page reload on any invalid form submission attempt.
- **SC-004**: All plan list and detail screens render at 375px without horizontal overflow or overlapping elements.
- **SC-005**: Starting a workout session from an active plan day correctly pre-populates the session with the day's exercises on 100% of attempts.
- **SC-006**: A user who archives or deactivates a plan can still view its full detail and restore it without data loss.

---

## Assumptions

- Users are authenticated; no anonymous plan creation is supported.
- The Exercise Library (spec 007) is complete and the exercise picker component can be reused inside the Workout Day Editor without modification.
- Template routines (`src/data/routines/`) are the canonical source for "Start from template" data — no backend fetch is required for templates.
- Days-per-week for template import determines how many days are imported (first N days of the template); excess template days are silently dropped.
- No drag-and-drop library is added; up/down buttons suffice for exercise reorder in v1.
- Plan descriptions and notes fields are optional; empty values are valid.
- `target_weight` is stored in the user's preferred unit (kg/lb) as set in their fitness profile; no conversion is performed at the plan layer.
- Deleting a plan is out of scope for v1 — archive is the soft-delete alternative.
- Real-time collaboration (multiple devices editing the same plan simultaneously) is out of scope.
- The home screen "Create plan CTA" widget (noted in personal-notes.md spec 008 widget map) will be added to `src/modules/home/` within this spec.
