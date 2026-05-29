# Future Scope: Home Screen — Active Workout Plan Widget

**Deferred from**: `005-home-bottom-nav`
**Deferred on**: 2026-05-28
**Reason**: No workout plans module exists yet. Displaying plan data on Home requires a Plans feature to be defined and implemented first.

## Goal

When a user has an active workout plan assigned, the Home screen should surface:

- The plan name
- The next scheduled session (day label, muscle groups, estimated duration)
- A direct "Start Next Session" CTA that pre-loads that session's exercises

## Why This Matters

Without a plan widget, Home is a generic "start something" screen. With it, Home becomes a guided entry point — the app tells the user what to do next, removing friction for users following a structured program. This is a key differentiator from a plain workout logger.

## Dependencies Before Implementation

1. A **Workout Plans module** must be specified and implemented — it needs to define the `WorkoutPlan` entity, plan assignment per user, and scheduled session ordering.
2. The Home data fetch must be extended to query the user's active plan and its next session.
3. The `HomeScreen` component must be extended with a `PlanWidget` slot (currently only has `RecentWorkoutCard`).

## Suggested Future Spec

When the Plans module is ready, create `specs/NNN-home-plan-widget/spec.md` covering:

- Displaying active plan name and next session on Home
- "Start Next Session" CTA behavior (pre-populate workout session with plan exercises)
- Empty state when no plan is assigned (prompt to browse plans)
- Edge case: plan is complete (all sessions done) — show completion state or suggest a new plan
