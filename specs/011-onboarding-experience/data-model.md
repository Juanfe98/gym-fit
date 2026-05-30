# Data Model: Onboarding Experience Selection

## Overview

This feature stores a single onboarding preference for the authenticated user: `experienceLevel`. The value is part of the user's existing fitness preferences and is persisted in `user_fitness_preferences.experience_level`, the same canonical source used by the profile overview.

## Entities

### ExperienceLevel

Represents the user's self-reported training background.

| Field | Type | Required | Values | Notes |
|------|------|----------|--------|-------|
| `id` | string enum | Yes | `beginner`, `intermediate`, `advanced` | Stable persisted identifier |
| `label` | string | Yes | Beginner, Intermediate, Advanced | User-facing display copy |
| `description` | string | Yes | Product-authored copy | Explains the level in plain language |
| `examples` | string[] | Yes | 2–3 short bullets recommended | Helps users choose accurately |

#### Validation Rules

- `id` MUST be one of `beginner`, `intermediate`, or `advanced`.
- Display labels MUST NOT be used as persisted identifiers.
- Invalid stored values MUST be treated as no valid selection.

### OnboardingState

Represents the current user's existing fitness preferences row. For this feature, only `experienceLevel` is created or updated.

| Field | Type | Required | Notes |
|------|------|----------|-------|
| `userId` | UUID | Yes | Current authenticated user |
| `experienceLevel` | ExperienceLevel id or null | No | Saved by this feature into `experience_level` |
| `fitnessGoal` | string enum or null | No | Existing preference field; must be preserved if present |
| `daysPerWeek` | number or null | No | Existing preference field; must be preserved if present |
| `sessionDurationMinutes` | number or null | No | Existing preference field; must be preserved if present |
| `preferredDays` | string[] | No | Existing preference field; must be preserved if present |
| `heightUnit` | string | No | Existing preference field; must retain existing/default value |
| `weightUnit` | string | No | Existing preference field; must retain existing/default value |

#### Validation Rules

- Saving `experienceLevel` MUST upsert the current user's `user_fitness_preferences` row.
- Saving MUST preserve existing preference fields not owned by this step.
- Saving MUST reject or ignore values outside the allowed ExperienceLevel ids.
- A valid saved `experienceLevel` MUST preselect the matching card on page load.
- If no preferences row exists yet, saving MUST create one with the selected `experienceLevel` and table defaults for other fields.

## State Transitions

```text
Page loads
  ├─ preferences read is pending → loading state shown if needed
  ├─ valid saved experienceLevel exists → selectedLevel = saved value; Continue enabled
  ├─ no preferences row or no valid saved experienceLevel → selectedLevel = null; Continue disabled
  └─ preferences read fails → error state shown with retry/reload path

User selects card
  ├─ selectedLevel = chosen level
  ├─ previous selected level cleared automatically
  └─ Continue enabled

User activates Continue
  ├─ no selectedLevel → no-op; Continue remains disabled
  ├─ selectedLevel exists → saving state starts; duplicate submissions blocked
  ├─ save succeeds → experienceLevel persisted to user_fitness_preferences; navigate to /onboarding/frequency
  └─ save fails → selectedLevel preserved; error shown; saving state ends

User activates Back
  ├─ not saving → navigate to /onboarding/goal
  └─ saving → action blocked until save completes
```

## Derived UI State

| UI State | Source | Behavior |
|----------|--------|----------|
| Continue disabled | `selectedLevel === null || isSaving` | Prevents proceeding without a choice and duplicate saves |
| Card selected | `selectedLevel === option.id` | Shows visual selected state and accessible pressed/selected state |
| Saving | Save request in progress | Shows loading label/state and blocks duplicate actions |
| Initial loading | Preferences read pending | Shows loading state before saved selection is known if the page cannot read it server-side |
| Initial error | Preferences read failed | Shows error state with retry/reload path |
| Error | Save request failed | Shows retryable error without clearing selection |

## Relationships

- One authenticated user has zero or one `user_fitness_preferences` row.
- One fitness preferences row has zero or one `experienceLevel`.
- The profile overview reads the same `experienceLevel` saved by this onboarding step.
- The experience step follows the goal step and precedes the frequency step.
