# Data Model: Onboarding Welcome Screen

## Entity: OnboardingStatus

Represents the authenticated user's onboarding progression state relevant to this screen.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userId` | string | yes | Supabase authenticated user id |
| `status` | `'not_started' \| 'skipped' \| 'in_progress' \| 'completed'` | yes | This feature writes `skipped`; other values are compatible with future onboarding steps |
| `updatedAt` | ISO datetime string | recommended | Useful for auditing/debugging when status changed |

### Storage Mapping

For this feature, store the status in Supabase Auth user metadata to avoid a schema migration:

```json
{
  "onboarding_status": "skipped",
  "onboarding_skipped_at": "2026-05-29T00:00:00.000Z"
}
```

### Validation Rules

- `status` must be one of the allowed onboarding progression values.
- Skip action must only be written for the currently authenticated user.
- Repeated skip attempts should be idempotent: writing `skipped` when already skipped is not an error.

### State Transitions

```text
not_started → skipped
not_started → in_progress
in_progress → skipped
in_progress → completed
skipped → in_progress     # future: user resumes setup later
skipped → completed       # future: user completes setup later
```

This feature implements only:

```text
not_started/in_progress → skipped
```

## Entity: WelcomeBenefit

Represents a single benefit shown on the welcome screen.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Stable key for rendering |
| `title` | string | yes | User-facing benefit text |
| `description` | string | optional | Short supporting line if used in design |
| `icon` | Lucide icon reference or semantic icon key | optional | Must render accessibly/decoratively as appropriate |

### Required Records

1. `Personalized workout setup`
2. `Track sets, reps, and progress`
3. `Stay consistent with a clear plan`

## Entity: WeeklyPreview

Illustrative, non-persisted data shown in the right-side visual card.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `weekLabel` | string | yes | Example: `This week` |
| `completedWorkouts` | number | yes | Sample metric only |
| `plannedWorkouts` | number | yes | Sample metric only |
| `workouts` | array | yes | Sample workout rows |
| `progressLabel` | string | yes | Example: `3 of 4 workouts` |

### Validation Rules

- Preview content must be clearly illustrative and must not imply real user progress.
- Numeric preview metrics should use metric typography.
- Preview rows must remain readable at supported breakpoints.
