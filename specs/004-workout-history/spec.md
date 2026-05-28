# Feature Specification: Workout History

**Feature Branch**: `004-workout-history`  
**Created**: 2026-05-28  
**Status**: Draft  
**Parent Spec**: `002-gym-planner-app`

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse Workout History List (Priority: P1)

A user wants to review their past workouts. They open the History section and see a chronological list of completed sessions showing key stats at a glance.

**Why this priority**: History is the primary way users verify their training consistency and recall what they did in previous sessions. Without it, logged data has no value beyond the moment it was captured.

**Independent Test**: Complete at least one workout session, navigate to History, and verify the session appears in the list with name, date, duration, and total volume shown.

**Acceptance Scenarios**:

1. **Given** a logged-in user with at least one completed workout session, **When** they open the History screen, **Then** they see a list of sessions sorted by date descending (most recent first).
2. **Given** the History list, **When** viewing each session card, **Then** the card displays: workout name, date, duration, total volume, and number of sets completed.
3. **Given** a user with no completed sessions, **When** they open the History screen, **Then** an empty state is shown with a clear message and a call-to-action to start their first workout.
4. **Given** a list of sessions, **When** the user scrolls through many sessions, **Then** the list loads smoothly without noticeable delay.

---

### User Story 2 — View Workout Detail (Priority: P1)

A user taps on a past workout to see the full breakdown: every exercise, every set logged, weight, reps, volume, and any personal records achieved.

**Why this priority**: The detail view is the core read-only product output of workout tracking. Users reference it to replicate successful sessions or understand their progress.

**Independent Test**: Tap any session in the list → verify detail screen shows all exercises and their logged sets including weight, reps, and any PR indicators.

**Acceptance Scenarios**:

1. **Given** a session in the History list, **When** the user taps it, **Then** a detail screen opens showing: workout name, date, start time, duration, total volume, total sets, and exercises completed.
2. **Given** the workout detail screen, **When** viewing an exercise, **Then** all logged sets are shown with set number, weight, reps, and any RPE value recorded.
3. **Given** a session where personal records were achieved, **When** viewing the detail, **Then** affected sets are marked with a PR indicator and a summary of PRs is shown at the top.
4. **Given** a session with workout-level notes, **When** viewing the detail, **Then** the notes are shown in a dedicated section.
5. **Given** a session where an exercise was replaced, **When** viewing the detail, **Then** the exercise shows which exercise it replaced (original exercise name shown as reference).

---

### User Story 3 — Filter History by Date (Priority: P2)

A user wants to find workouts from a specific period. They apply a date filter and the list narrows to sessions within that range.

**Why this priority**: Users with a long history need date filtering to find specific sessions quickly. Without it, history becomes unusable as the list grows.

**Independent Test**: Apply a "last 7 days" filter → verify only sessions from the past week appear. Clear filter → verify full list returns.

**Acceptance Scenarios**:

1. **Given** the History screen, **When** the user applies a date filter (e.g. "Last 7 days", "Last 30 days", "Last 3 months"), **Then** only sessions within that range appear.
2. **Given** an active date filter, **When** no sessions match the range, **Then** an empty state is shown specific to the filter (not the generic "no workouts" empty state).
3. **Given** an active date filter, **When** the user clears the filter, **Then** the full session list returns immediately.
4. **Given** a date filter is applied, **When** the user navigates away and returns, **Then** the filter persists until explicitly cleared.

---

### User Story 4 — Search History by Exercise Name (Priority: P2)

A user wants to find all past sessions where they performed a specific exercise. They type the exercise name and the list filters to matching sessions.

**Why this priority**: Users often want to trace the history of a specific exercise across sessions. This is the primary alternative to exercise-level progress charts.

**Independent Test**: Search "bench press" → verify only sessions containing that exercise appear. Clear search → full list returns.

**Acceptance Scenarios**:

1. **Given** the History screen, **When** the user types an exercise name into the search field, **Then** the list updates in near real-time to show only sessions that include an exercise matching the search term.
2. **Given** a search with no matches, **When** the search returns no results, **Then** an empty state explains no sessions contain that exercise with a prompt to clear the search.
3. **Given** a partial search term (e.g. "bench"), **When** searching, **Then** sessions with exercises whose names start with or contain the term are shown.
4. **Given** a search term with combined date filter, **When** both are applied, **Then** results must satisfy both conditions (AND logic).

---

### User Story 5 — View Workout Summary After Finishing (Priority: P1)

Immediately after finishing a workout session, the user is shown a summary of what they accomplished before the session is saved to history.

**Why this priority**: The post-workout summary is the emotional payoff of the tracking experience. It closes the session loop and gives users immediate feedback on their effort.

**Independent Test**: Finish an active workout → verify summary screen appears with correct stats before navigating away → verify session appears in history after dismissal.

**Acceptance Scenarios**:

1. **Given** a user who finishes an active workout session, **When** the session is completed, **Then** a summary screen is shown automatically with: total duration, total volume, exercises completed, total sets, and any PRs achieved.
2. **Given** the summary screen, **When** the user taps "Done" or "Save", **Then** the session is saved to history and the user is returned to the home or history screen.
3. **Given** the summary screen, **When** the session includes PRs, **Then** each PR is listed with the exercise name and the value that set the record.
4. **Given** the summary screen, **When** the session has workout notes, **Then** the notes are shown and editable before saving.

---

### Edge Cases

- What happens when a session was started but no sets were logged — does it appear in history?
- What if a session is in `cancelled` or `discarded` status — should it appear in history?
- What happens if the same exercise appears multiple times in a session (e.g. two chest exercises with the same name)?
- How does the detail view handle warmup sets — are they shown separately or grouped with working sets?
- What happens if the user opens the detail for a session that was synced from another device with a format mismatch?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a list of completed workout sessions sorted by date descending.
- **FR-002**: System MUST show on each session card: workout name, date, duration, total volume (kg or lb based on user preference), and total sets count.
- **FR-003**: System MUST show an empty state with a call-to-action when no completed sessions exist.
- **FR-004**: System MUST allow users to open a session detail screen from the history list.
- **FR-005**: System MUST show on the detail screen: workout name, date, start time, duration, total volume, total sets, exercises with all logged sets (set number, weight, reps, RPE if available), PR indicators per set, and workout notes.
- **FR-006**: System MUST mark sets that set a personal record with a visible PR indicator in the detail view.
- **FR-007**: System MUST display a summary of PRs achieved at the top of the workout detail when applicable.
- **FR-008**: System MUST allow users to filter session history by predefined date ranges: Last 7 days, Last 30 days, Last 3 months, Last 6 months, Last year.
- **FR-009**: System MUST allow users to search session history by exercise name with near real-time filtering.
- **FR-010**: System MUST support combining date filter and exercise search simultaneously (AND logic).
- **FR-011**: System MUST show an appropriate empty state when filters return no results, distinct from the no-history empty state.
- **FR-012**: System MUST show a workout summary screen automatically after a session is finished.
- **FR-013**: The summary screen MUST display: duration, total volume, total sets, exercises completed, and PRs achieved.
- **FR-014**: System MUST save the session to history upon user confirmation from the summary screen.
- **FR-015**: Completed sessions MUST be accessible offline from local storage if previously loaded.
- **FR-016**: Only sessions with status `completed` MUST appear in history. Sessions with status `cancelled` or `discarded` MUST NOT appear.
- **FR-017**: Warmup sets MUST be visually distinct from working sets in the detail view.
- **FR-018**: System MUST display notes on both the session card (truncated) and full in the detail screen.

### Key Entities

- **WorkoutSession**: A completed training session. Key attributes: id, name, status, startedAt, finishedAt, durationSeconds, totalVolume, exercises, notes, sourcePlanId.
- **LoggedExercise**: An exercise performed within a session. Key attributes: id, exerciseId, exerciseNameSnapshot, order, sets, notes, wasReplaced, originalExerciseId.
- **LoggedSet**: A single set within an exercise log. Key attributes: id, setNumber, weight, reps, rpe, isWarmup, isCompleted.
- **PersonalRecord**: A record of a best performance for an exercise. Key attributes: exerciseId, type (max_weight, max_reps, max_estimated_1rm), value, achievedAt, sessionId.
- **DateRangeFilter**: A user-selected time range applied to the history list. Options: 7d, 30d, 90d, 180d, 365d.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can locate and open any past workout session within 3 taps from the home screen.
- **SC-002**: The history list renders within 1 second for users with up to 200 completed sessions.
- **SC-003**: Exercise name search returns filtered results within 300 milliseconds of the user stopping typing.
- **SC-004**: 100% of completed workout sessions appear in history — no session data loss after app close or refresh.
- **SC-005**: The post-workout summary screen appears within 1 second of the user tapping "Finish Workout".
- **SC-006**: Users can view their full workout history while offline if previously loaded.
- **SC-007**: PR indicators are accurate — a set marked as PR must have a higher value than all prior recorded sets for that exercise.

---

## Assumptions

- Only sessions with `completed` status appear in history; `cancelled` and `discarded` sessions are excluded.
- Total volume is calculated as the sum of (weight × reps) across all non-warmup completed sets in a session.
- Estimated 1RM is not shown in the history list card but may be shown in the detail view if available.
- Edit and delete of past sessions are out of scope for V1; detail view is read-only.
- The workout summary shown after finishing is the same data that appears in the session detail, pre-save.
- Date filters use the user's local timezone for boundary calculations.
- Search matches exercise name snapshots stored at the time of logging (not the current exercise library name, which may have changed).
- Personal record detection is computed at set-log time and stored; history reads stored PR flags rather than recomputing.
- Pagination or virtual scrolling is assumed for large history lists but the exact page size is an implementation detail.
- Sessions from the local IndexedDB cache are used for offline access; no special offline-only UI is needed beyond the existing sync status bar.
- The history module reads data written by the workout-session module; it does not write session data.
