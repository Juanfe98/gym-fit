# UI Contract: Onboarding Goal Selection

## Route

`/onboarding/goal`

## Access

- Unauthenticated users are redirected to sign in.
- Authenticated onboarding users can view the page.
- Authenticated users who previously skipped or completed onboarding can manually revisit the page and update `mainGoal`.
- If a previously saved valid `mainGoal` exists, the matching goal card is selected on load.

## Required Visible Copy

- Progress: `Step 1 of 8`
- Title: `What is your main fitness goal?`
- Description: `Choose the goal that best matches what you want to focus on first. You can update this later.`
- Primary action: `Continue`
- Secondary action: `Back`

## Goal Options

The page MUST display all options:

1. `Build muscle`
2. `Lose fat`
3. `Gain strength`
4. `Improve endurance`
5. `General fitness`
6. `Improve mobility`
7. `Maintain current shape`

## Interaction Contract

### Initial state with no saved goal

- No goal card is selected.
- Continue is disabled.
- Back is enabled.

### Select goal

- Activating any goal card selects that option.
- Selecting a second card clears the previous selection.
- Exactly one card is selected after any successful selection.
- Selected state is visible and announced to assistive technology.

### Continue

- Disabled until a goal is selected.
- When activated with a selected goal:
  - Shows a pending/loading state.
  - Prevents duplicate submissions.
  - Temporarily disables or blocks Back until the save succeeds or fails.
  - Saves `mainGoal` using the selected stable identifier.
  - On success, navigates to `/onboarding/experience`.
  - On failure, remains on `/onboarding/goal`, shows an error message, and preserves the selected goal.

### Back

- Navigates to `/onboarding/welcome`.
- Does not require a goal selection.
- Does not save a newly selected goal unless the Continue action has already succeeded.

## Accessibility Contract

- Each goal card is keyboard reachable and operable.
- Each goal card has an accessible name matching its visible label.
- Each goal card exposes whether it is selected/pressed through `aria-pressed`.
- Continue and Back have accessible names matching their visible labels.
- Error feedback uses an alert-style announcement pattern.
- Interactive targets are at least 44px by 44px.
- The page remains usable without hover interactions.

## Next Route Contract

- `/onboarding/experience` must exist before validating the successful Continue flow.
- If the full experience step is not implemented yet, the route may be a minimal authenticated placeholder that clearly identifies it as the next onboarding step.

## Responsive Contract

- At 320px and 375px widths, content stacks vertically and does not horizontally scroll.
- At tablet widths, the option grid may use multiple columns if cards remain readable.
- At desktop widths, the layout is visually balanced and keeps the title, progress, options, and actions in a focused onboarding composition.
