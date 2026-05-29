# Quickstart: Onboarding Goal Selection

## Prerequisites

- Install dependencies with `npm install` if needed.
- Ensure local environment variables for Supabase are configured, matching the existing app setup.
- Use an authenticated account to access onboarding routes.

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000/onboarding/goal
```

If redirected to sign in, authenticate and return to the route.

## Manual Verification

### Page content

1. Confirm the route is `/onboarding/goal`.
2. Confirm progress reads `Step 1 of 7`.
3. Confirm title reads `What is your main fitness goal?`.
4. Confirm description reads `Choose the goal that best matches what you want to focus on first. You can update this later.`.
5. Confirm all seven goal options are visible.

### Selection behavior

1. Load the page with no existing saved goal.
2. Confirm Continue is disabled.
3. Select `Build muscle`.
4. Confirm the selected card has a clear visual state and Continue becomes enabled.
5. Select `Lose fat`.
6. Confirm only `Lose fat` remains selected.

### Navigation and save

1. Select `Gain strength`.
2. Activate Continue.
3. Confirm a pending/loading state is visible while saving.
4. Confirm duplicate Continue activations are prevented during saving.
5. Confirm successful save navigates to `/onboarding/experience` and does not show a missing page.
6. Return to `/onboarding/goal` and confirm a saved valid goal is reflected as selected when available.

### Back action

1. Open `/onboarding/goal`.
2. Select any goal but do not continue.
3. Activate Back.
4. Confirm navigation to `/onboarding/welcome`.
5. During a simulated slow save, confirm Back is unavailable or blocked until the save succeeds or fails.

### Error state

1. Simulate a failed save by disabling network or forcing the metadata update to fail in local testing.
2. Select a goal and activate Continue.
3. Confirm the page remains on `/onboarding/goal`.
4. Confirm an error message appears.
5. Confirm the selected goal remains selected and can be retried.

### Accessibility and responsive checks

1. Verify keyboard navigation reaches all goal cards, Back, and Continue.
2. Verify each selected card exposes `aria-pressed="true"` and each unselected card exposes `aria-pressed="false"`.
3. Verify all interactive targets are at least 44px tall/wide.
4. Check layouts at 320px, 375px, tablet width, and desktop width.
5. Confirm no horizontal scrolling or clipped actions at narrow widths.

## Build Validation

```bash
npm run build
```

The build must complete with zero TypeScript errors.
