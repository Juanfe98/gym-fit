# Core Application Flow

This document is the canonical high-level product flow for the Gym Tracker app. Use it to understand how onboarding, dashboard navigation, plans, workouts, history, progress, and profile management connect.

## Flow Diagram

```mermaid
flowchart TD
    A[App Launch] --> B{User has completed onboarding?}

    B -- No --> ONB[Onboarding Module]
    B -- Yes --> HOME[Home Dashboard]

    ONB --> WELCOME[Welcome Screen]
    WELCOME --> GOAL[Select Fitness Goal]
    GOAL --> EXPERIENCE[Select Experience Level]
    EXPERIENCE --> FREQUENCY[Preferred Workout Frequency]
    FREQUENCY --> TIME[Available Workout Time]
    TIME --> EQUIPMENT[Available Equipment]
    EQUIPMENT --> BODY[Optional Body Info]
    BODY --> LIMITATIONS[Optional Limitations / Injuries]
    LIMITATIONS --> SUMMARY[Onboarding Summary]
    SUMMARY --> HOME

    HOME --> TODAY[Today's Workout]
    HOME --> PLAN[Workout Plan]
    HOME --> PROGRESS[Progress Dashboard]
    HOME --> HISTORY[Workout History]
    HOME --> PROFILE[Profile & Preferences]

    PLAN --> PLAN_DETAIL[Plan Detail]
    PLAN_DETAIL --> WORKOUT_PREVIEW[Workout Preview]
    WORKOUT_PREVIEW --> ACTIVE_WORKOUT[Active Workout Session]

    TODAY --> ACTIVE_WORKOUT

    ACTIVE_WORKOUT --> EXERCISE_FLOW[Exercise Tracking Flow]
    EXERCISE_FLOW --> SET_TRACKING[Log Sets / Reps / Weight / Effort]
    SET_TRACKING --> REST_TIMER[Rest Timer]
    REST_TIMER --> NEXT_EXERCISE[Next Exercise]
    NEXT_EXERCISE --> EXERCISE_FLOW

    ACTIVE_WORKOUT --> COMPLETE[Workout Completed]
    COMPLETE --> SESSION_SUMMARY[Session Summary]
    SESSION_SUMMARY --> PROGRESS
    SESSION_SUMMARY --> HOME

    HISTORY --> WORKOUT_DETAIL[Past Workout Detail]
    WORKOUT_DETAIL --> REPEAT_WORKOUT[Repeat Workout]
    REPEAT_WORKOUT --> ACTIVE_WORKOUT

    PROGRESS --> MUSCLE_PROGRESS[Muscle Group Progress]
    PROGRESS --> STRENGTH_PROGRESS[Strength Progress]
    PROGRESS --> CONSISTENCY[Consistency / Streaks]

    PROFILE --> EDIT_GOALS[Edit Goals]
    PROFILE --> EDIT_EQUIPMENT[Edit Equipment]
    PROFILE --> EDIT_LIMITATIONS[Edit Limitations]
    PROFILE --> SETTINGS[Settings]
```

## Onboarding Step Order

The welcome screen introduces setup and is followed by 8 numbered onboarding steps:

| Step | Screen | Route |
|---:|---|---|
| — | Welcome Screen | `/onboarding/welcome` |
| 1 | Select Fitness Goal | `/onboarding/goal` |
| 2 | Select Experience Level | `/onboarding/experience` |
| 3 | Preferred Workout Frequency | `/onboarding/frequency` |
| 4 | Available Workout Time | `/onboarding/time` |
| 5 | Available Equipment | `/onboarding/equipment` |
| 6 | Optional Body Info | `/onboarding/body` |
| 7 | Optional Limitations / Injuries | `/onboarding/limitations` |
| 8 | Onboarding Summary | `/onboarding/summary` |

After the summary is completed, the user lands on the Home Dashboard.

## Current Implementation Status

| Area | Status |
|---|---|
| Welcome | Implemented |
| Fitness Goal | Implemented |
| Experience Level | Implemented |
| Workout Frequency | Placeholder route exists |
| Available Workout Time | Missing |
| Available Equipment | Missing |
| Optional Body Info | Missing |
| Optional Limitations / Injuries | Missing |
| Onboarding Summary / completion | Missing |

## Routing Rule

At app launch:

- If the user has not completed onboarding, route them into the onboarding module.
- If the user has completed onboarding, route them to the Home Dashboard.

The onboarding completion signal should be saved after the summary step so returning users do not repeat onboarding.
