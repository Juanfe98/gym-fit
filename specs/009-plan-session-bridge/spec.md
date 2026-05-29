# Feature Specification: Plan → Session Bridge

**Feature Branch**: `009-plan-session-bridge`
**Created**: 2026-05-29
**Status**: Done
**Input**: User description: "Plan → Session Bridge: when user has an active workout plan, the home screen and workout start flow should let them pick a day from that plan and start a pre-loaded session with the plan's exercises already added. The session should track which plan and day it came from (sourcePlanId, sourceWorkoutDayId already exist on the session schema). After finishing, history should show which plan/day the session came from. This closes the Plan → Do → Track loop that currently has no connection between plans and actual workouts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Start Workout from Plan Day (Priority: P1)

A user with an active workout plan wants to start today's training. Instead of adding exercises from scratch, they see their active plan above the start CTA on the home screen, tap the day they want to train, and the workout session opens pre-loaded with all the exercises and targets from that day. They just hit start and begin logging sets.

**Why this priority**: This is the entire reason plans exist. Without this bridge, a plan is just a note — it never touches the actual workout flow. This single story delivers the core value of the feature and makes everything built in spec 008 actually useful.

**Independent Test**: User has an active plan with ≥1 day containing ≥1 exercise. From the home screen, they see the plan section above the start CTA, tap a day → workout session opens with those exercises pre-loaded and correct set/rep targets shown. User logs one set, finishes → session saved. The existing start CTA is still visible below the plan widget.

**Acceptance Scenarios**:

1. **Given** a user has an active plan with days and exercises, **When** they view the home screen, **Then** they see the plan widget (plan name + day list) above the existing start CTA.
2. **Given** the home screen shows a plan day, **When** the user taps that day, **Then** a workout session starts with all exercises from that day already added, in the correct order, with their target sets/reps/weight visible.
3. **Given** a pre-loaded session is active, **When** the user finishes and saves it, **Then** the session is stored with a reference to the source plan and day.
4. **Given** a user has no active plan, **When** they view the home screen, **Then** the plan widget is not shown — the existing start CTA displays as before, unchanged.
5. **Given** an active plan day has no exercises, **When** the user taps that day, **Then** an inline warning appears ("This day has no exercises yet") and the session does not start. No navigation occurs — the warning is informational only.

---

### User Story 2 — Plan Attribution in Workout History (Priority: P2)

After completing workouts from a plan, users can see in their history which plan and day each session came from. This lets them track how consistently they're following their program and quickly find past sessions for a specific plan day.

**Why this priority**: Without attribution in history, users lose the context of why they did a particular workout. The Plan → Do → Track loop is only closed when the "Track" step shows plan context. P2 because it requires P1 to be useful, but adds significant value to the overall feature.

**Independent Test**: Complete a workout started from a plan day. Open History → find that session → it shows the plan name and day name as a badge or subtitle. Sessions started without a plan show no attribution.

**Acceptance Scenarios**:

1. **Given** a session was started from a plan day, **When** the user views that entry in workout history, **Then** the plan name and day name are shown as attribution (e.g., "Push & Pull — Day 2: Upper Body").
2. **Given** a session was started without a plan (blank session), **When** viewed in history, **Then** no plan attribution is shown — layout unchanged.
3. **Given** a plan or day is archived or deleted after a session was completed, **When** that session is viewed in history, **Then** the plan and day name still appear as they were at the time of the workout.

---

### User Story 3 — Next Day Suggestion (Priority: P3)

The app suggests which plan day the user should do next, based on their last completed plan session. This removes the decision of "what should I train today?" and nudges users toward consistent program adherence.

**Why this priority**: High convenience value but not required for the core loop to work. Users can manually pick a day. Enhancement that reduces friction once P1 and P2 are solid.

**Independent Test**: User has done Day 1 previously. Home screen shows "Next up: Day 2 — Lower Body" as the highlighted/default option. Tapping it starts the session. If no prior session exists, Day 1 is suggested.

**Acceptance Scenarios**:

1. **Given** the user last completed Day 2 of their active plan, **When** they view the home screen plan section, **Then** Day 3 is highlighted as "Next up".
2. **Given** the user has never done a session from their active plan, **When** they view the home screen, **Then** Day 1 is highlighted as the suggested starting point.
3. **Given** the user completed the last day of the plan, **When** they return to the home screen, **Then** Day 1 is suggested again (cycle restarts).

---

### Edge Cases

- What happens when a plan is deactivated while a session sourced from it is in progress? → Session continues normally; attribution is preserved on save.
- What happens if plan exercises are edited after a session is started from them? → Session exercises are a snapshot at start time; changes to the plan don't affect the active session.
- What happens if the user adds exercises to a pre-loaded session? → Allowed. Extra exercises appear without plan attribution on the set level.
- What happens if the user removes a pre-loaded exercise before starting? → Allowed. Attribution still stored at session level.
- What happens when a plan day has exercises referencing an exercise ID that no longer exists in the catalog? → Show exercise ID as fallback name; do not block session start.

---

## Requirements *(mandatory)*

### Functional Requirements

**FR1 — Home Screen Plan Widget**
When the user has an active plan, the home screen displays a plan widget above the existing start CTA. The widget shows the plan name and a list of its workout days, each with its name and exercise count. When no active plan exists, the widget is hidden and the home screen is unchanged.

**FR2 — Start Session from Plan Day**
Tapping a plan day initiates a workout session pre-loaded with all exercises from that day, in their configured order. Each exercise entry shows the target sets, reps/rep range, and weight as reference values (not enforced constraints).

**FR3 — Session Source Attribution**
Every session started from a plan day stores the source plan ID, source day ID, source plan name, and source day name at the time of session start. Sessions started manually store none of these. This data is immutable after the session ends.

**FR4 — Plan Attribution in History**
Workout history entries for plan-sourced sessions display the plan name and day name. This appears consistently in both the history list view and the session detail view. Attribution is shown even if the source plan or day is later archived or deleted.

**FR5 — Manual Start Preserved**
Users can always start a blank session independent of any plan. The plan widget sits above the existing start CTA — it does not replace it. The start CTA remains visible and functional at all times.

**FR6 — Empty Day Guard**
Tapping a plan day with zero exercises shows an inline warning ("This day has no exercises yet") and does not start a session. The warning is informational only — no navigation away from the home screen occurs.

**FR7 — Next Day Suggestion**
The plan widget highlights the suggested next day based on the most recently completed plan session for the active plan. If no prior session exists for the active plan, Day 1 is suggested. Suggestion cycles back to Day 1 after the last day is completed.

---

### Non-Functional Requirements

- **Performance**: Home screen plan widget loads within the same render pass as existing home widgets — no perceptible additional delay.
- **Offline**: If plan data is unavailable (network error), the widget degrades gracefully — hidden, existing start CTA shown as fallback.
- **Consistency**: Pre-loaded exercises appear in the same exercise row UI used by manual sessions — no new UI patterns for exercise display.

---

## Success Criteria *(mandatory)*

1. **Core loop closed**: A user with an active plan can start a plan-day workout in 2 taps from the home screen (tap day → tap start), with exercises pre-loaded and no manual exercise search needed.
2. **Zero regressions**: Users without an active plan see no change to the current home screen or workout start flow.
3. **Full attribution trail**: 100% of sessions started from a plan day appear in history with the correct plan and day attribution, even after the plan is later archived or deleted.
4. **Suggestion accuracy**: The "next day" suggestion correctly identifies the next day after the most recently completed plan session, or Day 1 when no prior session exists.

---

## Key Entities *(optional)*

| Entity | Role in this feature |
|--------|---------------------|
| `WorkoutPlan` | Source of truth for the active plan shown on home screen |
| `WorkoutDay` | Unit the user selects to start a session from |
| `PlanExercise` | Provides exercise ID + targets pre-loaded into the session |
| `WorkoutSession` | Stores `sourcePlanId`, `sourceWorkoutDayId`, `sourcePlanName`, `sourceDayName` |
| `WorkoutHistory` | Read to determine the last completed plan session for next-day suggestion |

---

## Assumptions *(optional)*

- `sourcePlanId` and `sourceWorkoutDayId` fields already exist on the workout session schema (confirmed in spec 008 contracts). `sourcePlanName` and `sourceDayName` snapshot fields may need to be added — confirmed in planning phase.
- Exercise targets from the plan (sets, reps, weight) are shown as reference values in the session UI — they do not replace the actual logged values.
- The plan widget sits above `StartWorkoutCTA` on the home screen — no new layout section, it is prepended to the existing home content flow.
- Next-day suggestion uses modular arithmetic on `dayOrder` — no ML or complex scheduling.

---

## Out of Scope

- Session count per plan day on the plan detail screen — deferred to a future spec
- Schedule/calendar integration (which days of the week to train) — spec 013
- Progress analytics per plan (volume trends, PRs per plan) — spec 011
- Notifications or reminders to train — future spec
- Modifying plan exercises from within a session — user must go to the plan editor
- Multiple active plans — spec 008 already enforces one active plan at a time
