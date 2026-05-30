# UI Contracts: Onboarding Experience Selection

## Route Contract

### `/onboarding/experience`

- **Audience**: Authenticated onboarding users
- **Purpose**: Collect one self-reported training experience level
- **Previous route**: `/onboarding/goal`
- **Next route after successful save**: `/onboarding/frequency`
- **Progress indicator**: Step 2 of 8

### Page Content Contract

The page MUST render:

- Progress text equivalent to `Step 2 of 8`
- Heading: `How experienced are you with training?`
- Description explaining that workout intensity and progression will be adjusted based on this answer
- Three selectable option cards:
  - Beginner
  - Intermediate
  - Advanced
- Back action
- Continue action
- Error alert region when saving fails

## Component Contracts

### `ExperienceSelectionForm`

```ts
type ExperienceSelectionFormProps = {
  initialExperienceLevel: ExperienceLevel | null
}
```

Responsibilities:

- Own selected level state
- Own saving state
- Own retryable error state
- Render `ExperienceOptionGrid`
- Render `OnboardingActions`
- Save selected level through onboarding state service into `user_fitness_preferences.experience_level`
- Navigate to `/onboarding/frequency` after successful save

### `ExperienceOptionGrid`

```ts
type ExperienceOptionGridProps = {
  selectedLevel: ExperienceLevel | null
  onSelect: (level: ExperienceLevel) => void
  disabled?: boolean
}
```

Responsibilities:

- Render all experience options exactly once
- Communicate the grouped purpose with an accessible group label
- Keep visual order consistent with logical keyboard order: Beginner, Intermediate, Advanced
- Pass selected/disabled state to each card

### `ExperienceOptionCard`

```ts
type ExperienceOptionCardProps = {
  id: ExperienceLevel
  label: string
  description: string
  examples: readonly string[]
  selected: boolean
  onSelect: (level: ExperienceLevel) => void
  disabled?: boolean
}
```

Responsibilities:

- Render as a keyboard-operable control
- Select itself when activated
- Expose selected state to assistive technology
- Show selected state using more than color alone
- Include label, description, and example bullets
- Maintain at least a 44px tap target

### `OnboardingActions`

Existing action component should support the experience step with minimal extension:

```ts
type OnboardingActionsProps = {
  canContinue: boolean
  isSaving: boolean
  onContinue: () => void
  backHref?: string
}
```

Experience-step behavior:

- `backHref` is `/onboarding/goal`
- Continue disabled when `canContinue` is false or `isSaving` is true
- Back blocked or disabled while saving
- Continue label changes to a saving/loading label while saving

## Type Contract

```ts
const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]

function isExperienceLevel(value: unknown): value is ExperienceLevel
```

Validation behavior:

- `isExperienceLevel('beginner')` returns true
- `isExperienceLevel('intermediate')` returns true
- `isExperienceLevel('advanced')` returns true
- Any other value returns false

## Read Contract

```ts
async function getExperienceLevel(): Promise<ExperienceLevel | null>
```

Behavior:

- Requires an authenticated user
- Reads the current user's `user_fitness_preferences.experience_level`
- Returns `null` when no preferences row exists or the stored value is invalid
- Throws on unexpected read/auth failure so the page can render an error state or retry path

## Save Contract

```ts
async function saveExperienceLevel(experienceLevel: ExperienceLevel): Promise<void>
```

Behavior:

- Rejects invalid values before saving
- Requires an authenticated user
- Upserts the current user's `user_fitness_preferences` row
- Adds or updates `experience_level`
- Preserves existing preference fields not owned by this onboarding step
- Throws on auth/save failure so the UI can display an error and allow retry

## Accessibility Contract

- Tab order follows visual order.
- Every selectable card has a visible focus state.
- Enter and Space activate the focused card.
- Selected state is programmatically available and not represented by color alone.
- Error messages use an alert pattern so they are announced.
- Disabled Continue state is visually clear and programmatically disabled.

## Responsive Contract

- Mobile: cards stack vertically; actions remain easy to reach; no horizontal scroll.
- Tablet: cards may use a balanced grid while preserving readable text.
- Desktop: cards may render in a three-column layout within the onboarding shell.
