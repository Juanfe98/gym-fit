# UI Contract: Onboarding Welcome Screen

## Route Contract

| Route | Method | Auth | Result |
|-------|--------|------|--------|
| `/onboarding/welcome` | GET | Authenticated user required | Renders the onboarding welcome screen |
| `/onboarding/goal` | GET | Authenticated user expected | Destination after primary CTA |
| `/dashboard` | GET | Authenticated user expected | Destination after skip CTA |

If no authenticated user exists when `/onboarding/welcome` is requested, redirect to `/login`.

## Screen Content Contract

The welcome screen MUST expose these visible text elements:

- Headline: `Build a workout plan that actually fits you`
- Supporting copy explaining personalization based on:
  - goals
  - schedule
  - experience
  - equipment
- Benefits:
  - `Personalized workout setup`
  - `Track sets, reps, and progress`
  - `Stay consistent with a clear plan`
- Primary CTA: `Start setup`
- Secondary CTA: `Skip for now`

## Interaction Contract

### Start setup

**Trigger**: User activates `Start setup`.

**Expected behavior**:
1. Navigate to `/onboarding/goal`.
2. Do not persist skipped status.
3. Button/link has an accessible name equivalent to `Start setup`.

### Skip for now

**Trigger**: User activates `Skip for now`.

**Expected behavior**:
1. Persist current user's onboarding status as skipped.
2. Redirect to `/dashboard` after successful persistence.
3. Prevent duplicate submissions while persistence is pending.
4. If persistence fails, show a clear error message and keep the user on the welcome screen.
5. Button has an accessible name equivalent to `Skip for now`.

## Layout Contract

### Mobile

- Single-column stacked layout.
- No horizontal scrolling at 320px and 375px widths.
- CTAs remain reachable and readable.
- Interactive targets are at least 44px tall/wide.

### Desktop

- Two-column layout.
- Left/primary column contains value proposition, benefits, and actions.
- Right/secondary column contains an illustrative weekly workout/progress preview card.
- Preview card must not compete visually with the primary CTA.

## Accessibility Contract

- Use semantic headings in order.
- CTA controls must be keyboard reachable.
- Icon-only decorative elements must not be announced as unlabeled controls.
- Error message for failed skip persistence must use an accessible alert pattern.
- Contrast must be sufficient on the dark gradient background.
