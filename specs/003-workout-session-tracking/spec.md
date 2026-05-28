# Feature Specification: Workout Session Tracking

**Feature Branch**: `003-workout-session-tracking`  
**Created**: 2026-05-27  
**Status**: Draft  
**Parent Spec**: `002-gym-planner-app`

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Log a Free Workout Session (Priority: P1)

A user at the gym opens the app, starts a new session, adds exercises, logs sets with weight and reps, and finishes the session to see a summary.

**Why this priority**: This is the core daily-use flow. Every other feature in the app produces or consumes data from this flow. Without it, the app has no value.

**Independent Test**: A user can start a session → add 3 exercises → log 3 sets per exercise → finish → see a summary showing total volume, duration, and exercises. No plan or history required.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the home screen, **When** they tap "Start Workout", **Then** a new active session begins, a session timer starts, and an empty exercise list is shown.
2. **Given** an active session, **When** the user searches for an exercise by name and selects it, **Then** the exercise is added to the session with an empty set list.
3. **Given** an exercise in an active session, **When** the user enters weight and reps and confirms a set, **Then** the set is saved immediately and displayed in the set list without requiring a manual save.
4. **Given** an active session with at least one logged set, **When** the user taps "Finish Workout" and confirms, **Then** the session ends, the timer stops, and a session summary screen is shown.
5. **Given** the session summary screen, **Then** it displays: total duration, total volume (sum of weight × reps across all sets), number of exercises, number of sets per exercise, and any personal records achieved.

---

### User Story 2 — Log Sets While Offline (Priority: P1)

A user at a gym with no internet connection starts a session, logs sets, and finishes. All data is saved and synced automatically when connectivity returns.

**Why this priority**: Gyms often have poor connectivity. Data loss mid-session is the highest-severity UX failure in this product.

**Independent Test**: Disable device internet before starting a session. Log 3 exercises with sets. Re-enable internet. Verify all session data appears in history.

**Acceptance Scenarios**:

1. **Given** a user with no internet connection, **When** they open the app, **Then** the session tracking flow is fully available (no connectivity required to start or log).
2. **Given** an active session with no internet, **When** the user logs sets, **Then** each set is saved locally and a connectivity indicator shows the user they are offline.
3. **Given** a finished session saved while offline, **When** internet connectivity returns, **Then** the session data syncs automatically without any user action and the offline indicator disappears.
4. **Given** a session that was partially synced due to intermittent connectivity, **When** the user next opens the app with connectivity, **Then** the remaining data syncs without duplicating already-synced sets.

---

### User Story 3 — Rest Timer Between Sets (Priority: P2)

After logging a set, the user sees an optional rest timer countdown. When it ends, they receive a notification to start the next set.

**Why this priority**: Rest timing is a standard gym feature. Improves session structure and is a common reason users prefer apps over paper logs.

**Independent Test**: Log a set → verify rest timer starts at default duration → dismiss timer → verify no disruption to session. Also verify timer fires a notification when phone is locked.

**Acceptance Scenarios**:

1. **Given** a logged set in an active session, **When** the set is confirmed, **Then** a rest timer automatically starts at the user's configured rest duration (default: 90 seconds).
2. **Given** an active rest timer, **When** the user taps "Skip Rest", **Then** the timer stops immediately without affecting the session.
3. **Given** an active rest timer that reaches zero, **When** the countdown completes, **Then** the user receives an in-app alert and a device notification (if notifications are enabled) signaling rest is over.
4. **Given** a user who locked their phone during a rest timer, **When** the timer completes, **Then** a device notification is delivered and the timer state is preserved correctly when the app is reopened.

---

### User Story 4 — Personal Record Detection (Priority: P2)

During a session, the user logs a set that beats their previous best weight for that exercise. The app detects this and shows a celebration.

**Why this priority**: PR moments are high-emotion events. Celebrating them in-app increases motivation and session engagement.

**Independent Test**: Log a session with a weight higher than any previous session for the same exercise. Verify PR badge appears on that set and PR celebration is shown.

**Acceptance Scenarios**:

1. **Given** a user logs a set with a weight that exceeds their previous max for that exercise, **When** the set is confirmed, **Then** the set is marked with a PR indicator and a celebration animation or message is shown.
2. **Given** a new exercise with no history, **When** the user logs their first set, **Then** no PR indicator is shown (first occurrence is not treated as a PR).
3. **Given** a PR logged in a session, **When** the session is finished, **Then** the session summary highlights all PRs achieved during that session.
4. **Given** a session that is cancelled (not finished), **When** the session is discarded, **Then** no PRs from that session are recorded.

---

### User Story 5 — Replace or Remove an Exercise Mid-Session (Priority: P2)

A user adds the wrong exercise or wants to swap it. They replace it without losing the sets already logged for other exercises.

**Why this priority**: Mistakes during session setup are common. Blocking the user or forcing a restart damages trust.

**Independent Test**: Add 2 exercises with logged sets. Replace exercise 1. Verify exercise 1 is swapped (sets cleared for that exercise only) and exercise 2 sets are untouched.

**Acceptance Scenarios**:

1. **Given** an exercise in an active session with logged sets, **When** the user chooses to replace it, **Then** they are warned that sets for that exercise will be cleared, and must confirm before the replacement happens.
2. **Given** a confirmed exercise replacement, **When** the new exercise is selected, **Then** the old exercise and its sets are removed and the new exercise is added with an empty set list.
3. **Given** an exercise in an active session, **When** the user removes it without replacing, **Then** the exercise and all its sets are deleted from the session after confirmation.

---

### User Story 6 — Cancel a Session (Priority: P2)

A user starts a session but needs to abandon it. They cancel and the incomplete session is discarded.

**Why this priority**: Users need a clear exit without accidentally creating empty or incomplete sessions in their history.

**Independent Test**: Start a session → log 1 set → tap cancel → confirm → verify session does not appear in history.

**Acceptance Scenarios**:

1. **Given** an active session, **When** the user taps cancel or navigates away, **Then** they are prompted to confirm discard or continue the session.
2. **Given** a cancel confirmation, **When** the user confirms, **Then** the session and all logged data are discarded and not saved to history.
3. **Given** an active session with no logged sets, **When** the user taps cancel, **Then** the session is discarded without requiring confirmation (no data to lose).

---

### Edge Cases

- User loses power or force-quits the app mid-session — locally saved sets must survive app restart.
- User switches between kg and lbs mid-session — previously logged sets must display in the updated unit with correct conversion.
- User logs a set with 0 reps or negative weight — app must reject the input with a clear validation message.
- User attempts to log more than 99 sets for a single exercise in one session — app must handle gracefully (warn but allow).
- Two sessions started on different devices for the same account — conflict resolution must not result in data loss (last-write or merge strategy).
- Rest timer fires notification while device is in Do Not Disturb mode — timer still expires; notification delivered when DND ends.
- User finishes a session with no sets logged — app must prevent finishing an empty session and prompt to add sets or cancel.

---

## Requirements *(mandatory)*

### Functional Requirements

**Session Lifecycle**
- **FR-001**: System MUST allow a logged-in user to start a new workout session from the home screen.
- **FR-002**: System MUST display an elapsed session timer from the moment the session starts.
- **FR-003**: System MUST allow the user to pause and resume the session timer.
- **FR-004**: System MUST allow the user to finish a session, triggering the session summary screen.
- **FR-005**: System MUST prevent finishing a session with zero logged sets, displaying a prompt to add sets or cancel instead.
- **FR-006**: System MUST allow the user to cancel and discard an active session with confirmation.
- **FR-007**: System MUST skip the cancel confirmation when no sets have been logged yet.

**Exercise Management Within Session**
- **FR-008**: System MUST allow users to add exercises to an active session by searching the exercise library by name, muscle group, or equipment.
- **FR-009**: System MUST allow users to add multiple exercises to a single session.
- **FR-010**: System MUST allow users to reorder exercises within an active session via drag-and-drop or equivalent gesture.
- **FR-011**: System MUST allow users to replace an exercise in an active session, clearing only that exercise's sets after user confirmation.
- **FR-012**: System MUST allow users to remove an exercise and all its sets from an active session after user confirmation.
- **FR-013**: System MUST allow users to add a free-text note per exercise within the session.

**Set Logging**
- **FR-014**: System MUST allow users to log a set with weight (numeric) and reps (integer) as required fields.
- **FR-015**: System MUST respect the user's preferred unit (kg or lbs) when displaying and accepting weight input.
- **FR-016**: System MUST allow users to assign a set type to each set: Normal, Warm-up, or Drop Set (default: Normal).
- **FR-017**: System MUST allow users to add an optional free-text note per set.
- **FR-018**: System MUST autosave each set immediately upon confirmation — no manual save action required.
- **FR-019**: System MUST validate that weight is a positive number and reps is a positive integer, rejecting invalid values with a clear message.
- **FR-020**: System MUST allow users to edit a previously logged set within the active session.
- **FR-021**: System MUST allow users to delete a previously logged set within the active session.

**Rest Timer**
- **FR-022**: System MUST automatically start a rest timer after each confirmed set.
- **FR-023**: System MUST default the rest timer duration to 90 seconds, configurable per user.
- **FR-024**: System MUST allow the user to dismiss the rest timer at any time without affecting the session.
- **FR-025**: System MUST notify the user when the rest timer reaches zero via an in-app alert and a device notification (if notifications are permitted).
- **FR-026**: System MUST maintain the rest timer state when the app is backgrounded or the screen is locked.

**Offline Support**
- **FR-027**: System MUST allow full session tracking (start, add exercises, log sets, finish) without an internet connection.
- **FR-028**: System MUST save all session data to local storage immediately, independent of connectivity.
- **FR-029**: System MUST display a clear connectivity status indicator when the user is offline during a session.
- **FR-030**: System MUST automatically sync locally saved session data to the server when internet connectivity is restored, without user action.
- **FR-031**: System MUST not duplicate sets or sessions during sync after intermittent connectivity.
- **FR-032**: System MUST preserve all session data if the app is force-quit or the device loses power mid-session, restoring it on next launch.

**Personal Records**
- **FR-033**: System MUST detect when a logged set exceeds the user's previous maximum weight for that exercise.
- **FR-034**: System MUST display a PR indicator on the set and show a celebration to the user immediately upon PR detection.
- **FR-035**: System MUST NOT mark the first-ever set for an exercise as a PR.
- **FR-036**: System MUST NOT record PRs from a session that is cancelled or discarded.
- **FR-037**: System MUST highlight all PRs achieved in the session summary screen.

**Session Summary**
- **FR-038**: System MUST display a session summary upon finishing, including: total duration, total volume (weight × reps summed across all normal and drop sets), exercise count, set count per exercise, and PRs achieved.
- **FR-039**: System MUST allow the user to add or edit a session-level free-text note on the summary screen before saving.
- **FR-040**: System MUST save the completed session to workout history after the summary is viewed.

### Key Entities

- **WorkoutSession**: A single logged training event. Has start/end timestamps, user reference, session notes, sync status, and an optional link to a plan session. Contains an ordered list of session exercises.
- **SessionExercise**: An exercise within a session. Has an exercise reference, display order, optional notes, and an ordered list of set logs.
- **SetLog**: A single logged set. Has weight, reps, set type (Normal/Warm-up/Drop Set), timestamp, optional notes, and a PR flag.
- **Exercise**: Referenced from the exercise library. Not modified by session tracking; only referenced by SessionExercise.
- **PersonalRecord**: Best weight logged per exercise per user. Updated automatically when a session containing a PR is saved.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can log a set (enter weight, enter reps, confirm) in under 5 seconds once the exercise is on screen.
- **SC-002**: Users can start a new session and log their first set within 30 seconds of tapping "Start Workout".
- **SC-003**: 99% of sessions with connectivity loss experience zero data loss — verified by comparing locally cached sets against server-stored sets post-sync.
- **SC-004**: App is fully functional for session tracking with no internet connection for the entire duration of a session.
- **SC-005**: Session summary loads within 1 second of tapping "Finish Workout" for sessions with up to 20 exercises and 10 sets each.
- **SC-006**: Rest timer notification is delivered within 2 seconds of timer expiry, even when the app is backgrounded.
- **SC-007**: 95% of users who start a session complete it (tap "Finish") rather than abandoning or force-quitting.
- **SC-008**: PR detection occurs and is displayed to the user within 1 second of the set being confirmed.

---

## Assumptions

- Users are authenticated before accessing session tracking; this module does not handle authentication.
- The exercise library exists and is queryable; this module consumes it but does not manage it (see `006-exercise-library`).
- Unit preference (kg/lbs) is set during onboarding and available as a user profile setting; session tracking reads it but does not manage it.
- Rest timer default is 90 seconds; users can change this in settings (settings module), but session tracking uses whatever value is stored in their profile.
- Warm-up sets and Drop sets are excluded from total volume calculation; only Normal sets count toward volume.
- Personal records are computed on max weight per exercise (not max volume or max reps); this aligns with common gym tracking conventions.
- If the same exercise appears multiple times in a session (intentional for some training styles), PR detection applies to each set independently.
- Offline data is stored on the device; the sync strategy (last-write-wins vs. merge) is defined at the infrastructure level, but this spec assumes no data loss under any connectivity scenario.
- Sessions that have been started but not finished (app crash, force-quit) are recovered as "in-progress" on next launch, not auto-discarded.
- Plan session linking (optional field on WorkoutSession) is a passive tag applied when the session is started from a plan; plan management logic is out of scope for this module.
