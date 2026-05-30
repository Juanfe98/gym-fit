# Quickstart: Onboarding Experience Selection

## Prerequisites

- User can sign in to the app.
- `/onboarding/goal` exists.
- `/onboarding/frequency` exists or has a minimal authenticated placeholder before validating successful Continue navigation.

## Manual Verification

### 1. Page renders the required content

1. Sign in.
2. Navigate to `/onboarding/experience`.
3. Confirm the page shows:
   - Step 2 of 8
   - `How experienced are you with training?`
   - Description mentioning workout intensity and progression
   - Beginner, Intermediate, and Advanced cards
   - Back and Continue actions
4. Confirm Continue is disabled before selecting an option if no valid saved value exists.

### 2. Selection behavior

1. Select Beginner.
2. Confirm Beginner has a clear selected state.
3. Select Intermediate.
4. Confirm Intermediate is selected and Beginner is no longer selected.
5. Select Advanced.
6. Confirm only Advanced is selected.
7. Confirm Continue is enabled when one option is selected.

### 3. Save and navigation behavior

1. Select an option.
2. Activate Continue.
3. Confirm a saving/loading state appears.
4. Confirm duplicate Continue submissions are blocked while saving.
5. Confirm successful save navigates to `/onboarding/frequency`.
6. Confirm `user_fitness_preferences.experience_level` contains the selected value for the current user.
7. Return to `/onboarding/experience`.
8. Confirm the saved option is preselected.
9. Visit `/profile` and confirm the profile overview can use the same saved experience level.

### 4. Error behavior

1. Simulate a failed save (for example, disconnect network before saving or force the save service to fail in local development).
2. Select an option and activate Continue.
3. Confirm an error message appears.
4. Confirm the selected option remains selected.
5. Restore normal saving conditions.
6. Activate Continue again and confirm successful navigation.

### 5. Back behavior

1. Navigate to `/onboarding/experience`.
2. Activate Back.
3. Confirm navigation to `/onboarding/goal`.
4. Confirm Back cannot interrupt an in-progress save.

### 6. Keyboard and accessibility behavior

1. Reload `/onboarding/experience`.
2. Use Tab only to move through the page.
3. Confirm focus order follows: option cards in visual order, then actions.
4. Use Enter or Space to select each focused card.
5. Confirm selected state is communicated programmatically and visually.
6. Confirm focus indicators are visible on cards and actions.
7. Trigger a save error and confirm the error is announced or exposed as an alert.

### 7. Responsive behavior

Check the page at:

- 320px width
- 375px width
- Tablet width
- Desktop width

Confirm:

- No horizontal scrolling.
- Body text remains readable.
- Cards do not clip descriptions or bullet points.
- All interactive targets are comfortable to tap.
- Desktop/tablet layouts improve use of space without changing the completion flow.

## Build Verification

Run:

```bash
npm run build
```

Expected result: build completes successfully with no TypeScript errors.
