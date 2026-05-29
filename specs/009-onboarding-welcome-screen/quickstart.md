# Quickstart: Onboarding Welcome Screen

## Prerequisites

- Node.js version satisfies `package.json` engines (`>=22.12.0`)
- Project dependencies installed with npm
- Supabase environment variables configured for auth flows

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000/onboarding/welcome
```

If unauthenticated, expect redirect to `/login`. Sign in or sign up, then visit the route again.

## Manual Verification

### Content

- [ ] Headline reads: `Build a workout plan that actually fits you`
- [ ] Supporting copy mentions goals, schedule, experience, and equipment
- [ ] Benefits are visible:
  - [ ] Personalized workout setup
  - [ ] Track sets, reps, and progress
  - [ ] Stay consistent with a clear plan
- [ ] Primary CTA reads `Start setup`
- [ ] Secondary CTA reads `Skip for now`
- [ ] Preview card shows sample weekly workout/progress information

### Navigation

- [ ] Activating `Start setup` navigates to `/onboarding/goal`
- [ ] Activating `Skip for now` persists skipped status and redirects to `/dashboard`
- [ ] Repeated clicks/taps during skip do not trigger conflicting navigation
- [ ] Failed skip persistence shows a clear error and keeps user on the page

### Responsive UI

Verify in browser dev tools:

- [ ] 320px width: no horizontal scrolling; content readable
- [ ] 375px width: mobile-first stacked layout works
- [ ] Tablet width: spacing remains balanced
- [ ] Desktop/laptop width: two-column layout appears with preview on the right

### Accessibility

- [ ] Buttons/links are keyboard reachable
- [ ] Button/link accessible names match visible purpose
- [ ] Tap/click targets are at least 44px
- [ ] Text contrast is readable on the dark gradient background
- [ ] Error state is announced or exposed as an alert

## Build Check

```bash
npm run build
```

Expected: build completes with zero TypeScript errors.
