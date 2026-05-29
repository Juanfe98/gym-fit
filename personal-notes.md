# Implementation Roadmap — Gym Exercise Tracker

## Current Status

| #   | Spec                      | Module            | Status                                                          |
| --- | ------------------------- | ----------------- | --------------------------------------------------------------- |
| 001 | Goal Routine Generator    | legacy            | ✅ Done (Astro era)                                             |
| 002 | Gym Planner App           | legacy            | ✅ Done (Astro era)                                             |
| 003 | Workout Session Tracking  | `workout-session` | ✅ Done                                                         |
| 004 | Workout History           | `workout-history` | ✅ Done                                                         |
| 005 | Home + Bottom Nav         | `home`            | ✅ Shell done — home widgets added incrementally per spec below |
| 006 | Auth Completion           | `auth`            | ✅ Done                                                         |
| 007 | Exercise Library          | `exercises`       | ✅ Done                                                         |
| 008 | Workout Plans             | `workout-plans`   | ✅ Done                                                         |
| 009 | Profile + Fitness Profile | `profile`         | ⬜                                                              |
| 010 | Onboarding                | `onboarding`      | ⬜                                                              |
| 011 | Progress Dashboard        | `progress`        | ⬜                                                              |
| 012 | Goals                     | `goals`           | ⬜                                                              |
| 013 | Calendar & Scheduling     | `calendar`        | ⬜                                                              |
| 014 | Settings                  | `settings`        | ⬜                                                              |

---

## Architecture Reference (for all specs)

- **Stack**: Next.js 15 App Router, TypeScript, Tailwind CSS
- **Auth + DB**: Supabase (client: `@/lib/supabase/client`, server: `@/lib/supabase/server`)
- **Server state**: TanStack Query — queryKeys follow pattern `['module', 'resource', userId]`
- **Client state**: Zustand stores under `src/modules/<module>/stores/`
- **Forms**: React Hook Form + Zod schemas under `src/modules/<module>/validation/`
- **i18n**: `src/i18n/ui.ts` — both `en` and `es` blocks required for every new key
- **Design tokens**: `gym-accent`, `gym-surface`, `gym-surface-2`, `gym-border`, `gym-text`, `gym-muted`
- **Module structure**: `src/modules/<module>/{components,hooks,services,stores,types,utils,validation}/index.ts`
- **Route group**: authenticated routes under `src/app/(app)/`, auth routes under `src/app/(auth)/`
- **App shell**: `AppShell` + `BottomNav` from `@/modules/home` — wrap all `(app)` routes
- **Offline**: Dexie (`src/lib/offline-db.ts`) for active workout; not needed for other modules yet

---

## Spec Prompts

Copy the prompt below each spec number into `/speckit-specify` when ready to start that spec.

---

### 006 — Auth Completion

**What**: Sign-up screen, forgot-password flow, reset-password screen, email verification screen, and session-expired screen. Login already exists at `src/app/(auth)/login/page.tsx`.

**Prompt:**

```
We are building the Gym Exercise Tracker — a Next.js 15 App Router app using Supabase for auth, Tailwind CSS with gym- design tokens, and i18n via src/i18n/ui.ts (en + es).

Implement the Auth Completion module (spec 006).

Existing auth: src/app/(auth)/login/page.tsx already works. Supabase client at @/lib/supabase/client, server at @/lib/supabase/server. Middleware at src/middleware.ts.

Scope:
- Sign Up screen: name, email, password, confirm password, terms checkbox. On success → redirect to /onboarding (stub for now).
- Forgot Password screen: email input → call supabase.auth.resetPasswordForEmail(). Show success message.
- Reset Password screen: new password + confirm. Reads access_token from URL hash (Supabase PKCE). On success → redirect to /login.
- Verify Email screen: informational screen shown after sign-up if email confirmation is required.
- Session Expired screen: shown when Supabase returns 401 mid-session. Link back to /login.

Technical constraints:
- All screens live under src/app/(auth)/ route group (no AppShell/BottomNav — not authenticated).
- Validation with Zod + React Hook Form. Schemas in src/modules/auth/validation/.
- i18n: add all strings to src/i18n/ui.ts en + es blocks.
- Module: src/modules/auth/{components,hooks,types,validation,utils}/index.ts.
- No new dependencies — use existing supabase-js, react-hook-form, zod.
- Password min requirements: 8 chars, at least one number.
- Error messages: safe generic text only (no "email not found" — security requirement).

Acceptance criteria:
- User can sign up with valid data.
- User cannot sign up without accepting terms.
- Password and confirm must match.
- User can request password reset email.
- User can set new password from reset link.
- All forms show field-level errors.
- All screens render correctly at 375px.
```

---

### 007 — Exercise Library

**What**: Browse/search/filter exercises, exercise detail screen, favorites toggle, custom exercise creation. Exercise data exists at `src/data/exercises/exercises.json` and `src/data/exercises/catalog.ts`. Exercise names i18n at `src/i18n/exercise-names.ts`.

**Prompt:**

```
We are building the Gym Exercise Tracker — Next.js 15 App Router, Supabase, Tailwind with gym- tokens, TanStack Query for server state, i18n at src/i18n/ui.ts (en + es).

Implement the Exercise Library module (spec 007).

Existing data:
- Static exercise catalog: src/data/exercises/exercises.json + src/data/exercises/catalog.ts
- Exercise name i18n: src/i18n/exercise-names.ts
- Muscle map service: src/services/muscle-map.ts
- Exercise lookup service: src/services/exercise-lookup.ts

Route: src/app/(app)/exercises/ — accessible via bottom nav (currently nav has Home/Workout/History/Profile; add Exercises tab OR nest under existing tabs — recommend replacing History tab with Exercises and keeping History under Profile or as sub-nav. Decide based on spec.)

Scope:
- Exercise Library screen: search input (debounced 300ms), muscle group chips filter, equipment filter, exercise list with card per exercise (name, primary muscle, equipment badge, difficulty badge), favorites button.
- Exercise Detail screen: /exercises/[id] — name, primary muscles, secondary muscles, equipment, difficulty, movement pattern, instructions list, common mistakes, safety tips, alternatives. Favorite action. "Add to plan" stub (wired in spec 008).
- Favorites: stored in Supabase table user_exercise_favorites(user_id, exercise_id). Optimistic update on toggle.
- Custom Exercise: form to create custom exercise stored in Supabase. Name, muscle group, equipment, notes.
- Filter state: Zustand store in src/modules/exercises/stores/exercise-filter-store.ts.

Module: src/modules/exercises/{components,hooks,services,stores,types,utils,validation}/index.ts

i18n: add all strings to src/i18n/ui.ts en + es.

TanStack Query:
- queryKey pattern: ['exercises', 'list', filters] for library
- queryKey: ['exercises', 'favorites', userId] for favorites
- Optimistic update for favorite toggle (cancel in-flight, rollback on error)

Acceptance criteria:
- User can search exercises with near-realtime filter (debounced).
- User can filter by muscle group and equipment.
- User can open exercise detail.
- User can favorite/unfavorite (optimistic).
- User can create custom exercise.
- Screens render at 375px without overflow.
```

---

### 008 — Workout Plans

**What**: Create, view, edit, activate, duplicate, archive workout plans. Workout days. Exercise configuration per day. This is the planning backbone before workout sessions. Routine data seeds exist at `src/data/routines/` for templates.

**Prompt:**

```
We are building the Gym Exercise Tracker — Next.js 15 App Router, Supabase, Tailwind with gym- tokens, TanStack Query, Zustand, React Hook Form + Zod, i18n at src/i18n/ui.ts (en + es).

Implement the Workout Plans module (spec 008).

Existing context:
- Workout session (spec 003) reads sourcePlanId + sourceWorkoutDayId — plan IDs must be real Supabase IDs.
- Template routines: src/data/routines/ (muscle-gain, fat-loss, strength, conditioning) — use for "Start from template" flow.
- Exercise library module (spec 007) must be complete first — "Add exercise to plan" opens exercise picker.

Routes under src/app/(app)/plans/:
- /plans — Plans List (active plan card + all plans list + create button)
- /plans/[id] — Plan Detail (days list, activate/deactivate, edit, duplicate, archive)
- /plans/[id]/edit — Edit Plan
- /plans/new — Create Plan (name, goal, duration, days per week, choose manual or template)
- /plans/[id]/days/[dayId] — Workout Day Editor (exercise list, add/remove/reorder exercises, set targets per exercise)

Module: src/modules/workout-plans/{components,hooks,services,stores,types,utils,validation}/index.ts

Data model (Supabase tables needed — document in data-model.md):
- workout_plans(id, user_id, name, description, goal, level, duration_weeks, days_per_week, is_active, created_at, updated_at)
- workout_days(id, plan_id, name, day_order, target_muscle_groups)
- plan_exercises(id, day_id, exercise_id, order, target_sets, target_reps, target_rep_range_min, target_rep_range_max, target_weight, rest_seconds, tempo, target_rpe, notes)

Business rules:
- Only one active plan per user. Activating a plan deactivates the current active one.
- Plan must have at least one day to be activated.
- Day must have at least one exercise.
- Duplicate creates deep copy (new plan + days + exercises).

TanStack Query queryKeys:
- ['plans', 'list', userId]
- ['plans', 'detail', planId]
- ['plans', 'days', planId]

Mutation invalidation: on activate/deactivate, invalidate ['plans', 'list'] and ['plans', 'detail'].

Acceptance criteria:
- User can create plan manually.
- User can create from template.
- User can add workout days.
- User can add exercises to days with target sets/reps.
- User can reorder exercises (drag or up/down buttons).
- User can activate a plan.
- User can duplicate and archive.
- Validation errors shown at field level.
```

---

### 009 — Profile + Fitness Profile

**What**: Profile overview screen (already a stub at `src/app/(app)/profile/page.tsx`), edit personal info, fitness info, body measurements log. Replace the "coming soon" stub with real content.

**Prompt:**

```
We are building the Gym Exercise Tracker — Next.js 15 App Router, Supabase, Tailwind with gym- tokens, TanStack Query, React Hook Form + Zod, i18n at src/i18n/ui.ts (en + es).

Implement the Profile + Fitness Profile module (spec 009).

Existing stub: src/app/(app)/profile/page.tsx renders a "coming soon" placeholder. Replace it with the real profile screen.

Supabase tables needed:
- fitness_profiles(id, user_id, goal, experience_level, training_days_per_week, preferred_workout_duration_minutes, height, weight, unit_system, equipment_access[], limitations[], created_at, updated_at)
- body_measurements(id, user_id, measured_at, body_weight, chest, waist, hips, arms, thighs, shoulders)

Routes under src/app/(app)/profile/:
- /profile — Profile Overview (avatar, name, fitness summary: goal, level, days/week; entry points to edit screens; body measurements latest; logout button)
- /profile/edit — Edit Personal Info (name, avatar upload stub — no actual file upload yet, just URL field)
- /profile/fitness — Edit Fitness Info (goal, experience level, training days/week, duration, equipment access, limitations)
- /profile/measurements — Body Measurements (list of entries chronologically + add new entry form)

Module: src/modules/profile/{components,hooks,services,types,utils,validation}/index.ts

Unit preference (kg/lb, cm/in) stored in fitness_profiles.unit_system — must propagate to workout session set logging (src/modules/workout-session already has use-weight-unit-preference.ts hook — connect it to real Supabase data here).

TanStack Query:
- queryKey: ['profile', 'fitness', userId]
- queryKey: ['profile', 'measurements', userId]

Acceptance criteria:
- User can view profile overview.
- User can edit name.
- User can edit fitness information.
- User can add body measurements.
- Unit preference change is persisted and reflected in workout session logging.
- Logout button works (already wired in HomeHeader but profile screen also needs it).
```

---

### 010 — Onboarding

**What**: Post sign-up onboarding flow. Collects fitness goal, experience level, training days, equipment access. Creates fitness_profile row. Should only run once (redirect to / if profile already exists).

**Prompt:**

```
We are building the Gym Exercise Tracker — Next.js 15 App Router, Supabase, Tailwind with gym- tokens, React Hook Form + Zod, i18n at src/i18n/ui.ts (en + es).

Implement the Onboarding module (spec 010).

Context:
- Auth Completion (spec 006) redirects new users to /onboarding after sign-up.
- Profile module (spec 009) creates the fitness_profiles table — onboarding writes the initial row.
- If user already has a fitness_profile, redirect to / immediately.

Routes under src/app/(onboarding)/ route group (no AppShell/BottomNav — full-screen flow):
- /onboarding — Welcome step
- /onboarding/goal — Fitness goal selection (muscle_gain, fat_loss, strength, endurance, mobility, general_fitness)
- /onboarding/level — Experience level (beginner, intermediate, advanced)
- /onboarding/schedule — Training days per week (1–7 selector) + preferred duration
- /onboarding/equipment — Equipment access (multi-select: bodyweight, barbell, dumbbell, machine, cable, kettlebell, resistance_band, pull_up_bar, cardio_machine)
- /onboarding/summary — Review + confirm → creates fitness_profile row → redirect to /

UX requirements:
- Progress indicator showing current step / total steps.
- User can go back to previous step.
- User can skip optional steps (schedule, equipment are optional; goal and level are required).
- No step requires a form submit button — selection is immediate (tap to select, auto-advance or explicit Next button).
- Mobile-first: large tap targets, full-width option cards.

Module: src/modules/onboarding/{components,hooks,services,types,validation}/index.ts
State: React useState/useReducer local to the flow (no Zustand — ephemeral wizard state).

Acceptance criteria:
- User can complete all steps.
- User can skip optional steps.
- Progress indicator accurate.
- fitness_profile created on completion.
- Already-onboarded users redirected to /.
- All text in en + es.
```

---

### 011 — Progress Dashboard

**What**: Progress metrics dashboard — workout consistency, volume trend, streaks, PRs, exercise-specific progress charts. Reads from completed workout sessions already stored in Supabase.

**Prompt:**

```
We are building the Gym Exercise Tracker — Next.js 15 App Router, Supabase, Tailwind with gym- tokens, TanStack Query, i18n at src/i18n/ui.ts (en + es).

Implement the Progress Dashboard module (spec 011).

Existing data source: workout_sessions + logged_exercises + logged_sets tables (from spec 003). All data already exists in Supabase for users who have logged workouts.

Routes under src/app/(app)/progress/:
- /progress — Progress Dashboard (date range selector, summary metrics, volume chart, streak, workout frequency heatmap or bar chart)
- /progress/exercises — Exercise Progress list (search + select an exercise to view its history)
- /progress/exercises/[exerciseId] — Exercise Progress Detail (best weight, best reps, best estimated 1RM, volume trend chart, historical sets table)
- /progress/records — Personal Records list (max weight, max reps at weight, max est. 1RM per exercise)

Add "Progress" tab to BottomNav in src/modules/home/components/BottomNav.tsx — replace one of the current 4 tabs or add a 5th (discuss in spec).

Metrics to calculate (server-side Supabase queries or client utils):
- Total workouts completed
- Weekly workouts (current week)
- Training streak (consecutive days with workout)
- Total volume (sum weight * reps across sets)
- Estimated 1RM: Brzycki formula = weight / (1.0278 − 0.0278 × reps)
- Volume by exercise over time (for charts)

Date filters: last 7d, 30d, 3m, 6m, 1y.

Charts: use Recharts (check if already installed; if not, add to spec as required dependency).

Module: src/modules/progress/{components,hooks,services,types,utils}/index.ts

TanStack Query:
- queryKey: ['progress', 'summary', userId, dateRange]
- queryKey: ['progress', 'exercise', exerciseId, userId, dateRange]
- queryKey: ['progress', 'records', userId]

Acceptance criteria:
- User can see workout count, streak, volume for selected date range.
- Date range selector works and re-fetches data.
- User can browse exercise progress.
- User can see their PRs.
- Charts show empty state for new users.
- Estimated 1RM calculation is accurate (unit tested).
```

---

### 012 — Goals

**What**: Create and track fitness goals — strength targets, consistency goals, body weight goals. Auto-progress from workout data where possible.

**Prompt:**

```
We are building the Gym Exercise Tracker — Next.js 15 App Router, Supabase, Tailwind with gym- tokens, TanStack Query, React Hook Form + Zod, i18n at src/i18n/ui.ts (en + es).

Implement the Goals module (spec 012).

Context:
- Progress module (spec 011) must be complete first — goal progress for strength goals reads from the same exercise progress data.
- Profile module (spec 009) must be complete first — body weight goals read from body_measurements.

Supabase table:
- goals(id, user_id, type, title, description, target_value, current_value, unit, start_date, deadline, status, linked_exercise_id, created_at, updated_at)

Goal types: strength, body_weight, body_measurement, consistency, workout_count, custom.
Statuses: active, completed, paused, cancelled.

Routes under src/app/(app)/goals/:
- /goals — Goals List (active goals with progress bars, completed goals section, create button)
- /goals/new — Create Goal (type selector → dynamic form fields based on type)
- /goals/[id] — Goal Detail (progress, linked data, edit/pause/complete/delete actions)

Auto-progress calculation (run on goals list load):
- strength goal with linked_exercise_id → pull best 1RM from progress data → update current_value
- consistency goal (workouts per week) → count sessions in last 7d → update current_value
- workout_count goal → count total completed sessions → update current_value
- body_weight goal → read latest body_measurements.body_weight → update current_value

Module: src/modules/goals/{components,hooks,services,types,utils,validation}/index.ts

TanStack Query:
- queryKey: ['goals', 'list', userId]
- queryKey: ['goals', 'detail', goalId]

Acceptance criteria:
- User can create each goal type.
- Progress bar reflects current vs target.
- Strength and consistency goals update automatically from existing data.
- User can mark goal complete, pause, or delete.
- Deadline validation: cannot be before start date.
```

---

### 013 — Calendar & Scheduling

**What**: Schedule workout plan days to specific calendar dates. Week/month view. Start scheduled workout. Mark as skipped/missed.

**Prompt:**

```
We are building the Gym Exercise Tracker — Next.js 15 App Router, Supabase, Tailwind with gym- tokens, TanStack Query, i18n at src/i18n/ui.ts (en + es).

Implement the Calendar & Scheduling module (spec 013).

Dependencies: Workout Plans (spec 008) must be complete — scheduling assigns plan workout days to dates.

Supabase table:
- scheduled_workouts(id, user_id, workout_plan_id, workout_day_id, scheduled_date, status, completed_workout_session_id)
- Statuses: scheduled, completed, skipped, missed, rescheduled

Routes under src/app/(app)/calendar/:
- /calendar — Calendar screen (week view default, month toggle, scheduled workouts shown per day)

Tapping a scheduled workout opens a bottom sheet or modal with: workout day name, exercises preview, Start Workout button (→ /workout with sourceWorkoutDayId pre-populated), Skip button, Reschedule action.

UX for scheduling:
- From Plan Detail (/plans/[id]), user can tap "Schedule" → opens calendar picker → assigns workout days to selected dates.
- Auto-schedule: if plan has N days/week, suggest next N available weekdays.

Completed workout sessions: when a session is marked complete (spec 003), update any scheduled_workout row for that day to status=completed + set completed_workout_session_id.

No calendar library dependency — build week/month grid with CSS Grid. Keep it simple.

Module: src/modules/calendar/{components,hooks,services,types,utils}/index.ts

TanStack Query:
- queryKey: ['calendar', 'scheduled', userId, monthYear]

Acceptance criteria:
- User can see scheduled workouts on calendar.
- User can start scheduled workout from calendar.
- User can mark workout as skipped.
- Completed workouts reflect correct status on calendar.
- Week and month views both work.
```

---

### 014 — Settings

**What**: Account settings, unit preferences (kg/lb, cm/in), theme, notification preferences, data export stub, account deletion with confirmation.

**Prompt:**

```
We are building the Gym Exercise Tracker — Next.js 15 App Router, Supabase, Tailwind with gym- tokens, React Hook Form + Zod, i18n at src/i18n/ui.ts (en + es).

Implement the Settings module (spec 014).

Context:
- Unit preferences already exist in fitness_profiles.unit_system (spec 009) — settings must read/write the same field.
- Notification preferences: store in user_preferences(user_id, notification_workout_reminders, notification_weekly_summary, notification_goal_updates, notification_pr_celebrations, quiet_hours_start, quiet_hours_end) — in-app only for V1 (no push/email).

Routes under src/app/(app)/settings/:
- /settings — Settings index (list of sections: Account, Units & Preferences, Notifications, Privacy, Data)
- /settings/account — Edit email (Supabase updateUser), change password
- /settings/preferences — Units (kg/lb, cm/in), language toggle (en/es — write to localStorage + cookie used by i18n config)
- /settings/notifications — Toggle notification types, quiet hours
- /settings/data — Data export (stub — show "coming soon"), Account deletion (requires typing "DELETE" to confirm → supabase.auth.admin not available client-side — show "contact support" message or implement via Supabase Edge Function stub)

Unit change must invalidate TanStack Query cache for workout session data (logged sets display weights in user's preferred unit).

Module: src/modules/settings/{components,hooks,services,types,validation}/index.ts

Acceptance criteria:
- User can change unit preference — reflected immediately in workout logging.
- User can change language — app re-renders in selected language.
- User can configure notification types.
- Account deletion requires explicit confirmation.
- All settings persisted to Supabase.
```

---

## Home Screen Widget Enhancement Map

Spec 005 built the shell + V1 home (recent workout + start CTA). Product spec 8.4 requires more. Each widget is blocked by a dependency — add it **inside the blocking spec**, not a new spec:

| Widget                                  | Add in spec  | Blocked by               |
| --------------------------------------- | ------------ | ------------------------ |
| Create plan CTA in empty state          | 008 Plans    | workout_plans table      |
| Current streak                          | 011 Progress | streak calculation util  |
| Weekly workout progress (bar/ring)      | 011 Progress | progress queries         |
| Latest personal record on Home          | 011 Progress | PR query                 |
| Active goals summary (2–3 active goals) | 012 Goals    | goals table              |
| Today's scheduled workout card          | 013 Calendar | scheduled_workouts table |

When each spec is being specified, include a task like:

> "Add [widget] component to `src/modules/home/` and wire into `src/app/(app)/page.tsx`"

---

## Notes

- After spec 005, BottomNav has 4 tabs: Home / Workout / History / Profile. Progress tab added in spec 011.
- Supabase migrations for each spec go in `supabase/migrations/` — create one migration file per spec.
- Every new module needs i18n keys in BOTH `en` and `es` in `src/i18n/ui.ts` before any component uses `t()`.
- Validate each spec with `npm run build` (TypeScript check) before moving to next.
- Exercise Library (007) must come before Workout Plans (008) — plan editor uses exercise picker.
- Profile (009) must come before Onboarding (010) and Goals (012).
- Progress (011) must come before Goals (012).
- Workout Plans (008) must come before Calendar (013).
- Home screen is **fully complete only after spec 013** — all widgets wired.
