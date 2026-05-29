# Data Model: Onboarding Goal Selection

## Entity: FitnessGoalOption

Represents one selectable goal shown to the user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `MainGoal` | Yes | Stable identifier saved in onboarding state |
| `label` | string | Yes | User-facing option label |
| `description` | string | Optional | Short supporting copy for the card if implementation chooses to include it |
| `accent` | string | Optional | Visual hint used for presentation only |

### Allowed `MainGoal` values

| Identifier | Display label |
|------------|---------------|
| `build-muscle` | Build muscle |
| `lose-fat` | Lose fat |
| `gain-strength` | Gain strength |
| `improve-endurance` | Improve endurance |
| `general-fitness` | General fitness |
| `improve-mobility` | Improve mobility |
| `maintain-current-shape` | Maintain current shape |

### Validation Rules

- `id` MUST be one of the seven allowed `MainGoal` values.
- `label` MUST match the product copy from the specification for initial English UI.
- Only one `FitnessGoalOption.id` may be selected at a time.

## Entity: OnboardingState

Represents the authenticated user's in-progress onboarding data for this step.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mainGoal` | `MainGoal` | No until user continues | The user's selected primary fitness goal |

### Validation Rules

- `mainGoal` MUST be absent/null or one of the seven allowed `MainGoal` values.
- Continue MUST NOT save when `mainGoal` is absent.
- Invalid persisted values MUST NOT be treated as selected.
- A save error MUST leave the in-memory selected `mainGoal` unchanged so the user can retry.

### State Transitions

```text
No selection
  └─ user selects valid goal → Goal selected locally

Goal selected locally
  ├─ user selects another valid goal → Different goal selected locally
  ├─ user activates Back → Navigate to /onboarding/welcome without saving
  └─ user activates Continue → Saving mainGoal

Saving mainGoal
  ├─ user activates Back → Back remains unavailable until save resolves
  ├─ save succeeds → mainGoal persisted; navigate to /onboarding/experience
  └─ save fails → Error shown; return to Goal selected locally
```

## Entity: OnboardingStep

Represents the user's position in the onboarding sequence.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currentStep` | number | Yes | The current onboarding step number; for this feature it is `1` |
| `totalSteps` | number | Yes | The total onboarding steps; for this feature it is `7` |
| `previousRoute` | string | Yes | `/onboarding/welcome` |
| `nextRoute` | string | Yes | `/onboarding/experience` |

### Validation Rules

- Progress text MUST communicate Step 1 of 7.
- Back action MUST route to `/onboarding/welcome`.
- Continue action after successful save MUST route to `/onboarding/experience`.
