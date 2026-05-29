# Research: Workout Plans

**Branch**: `008-workout-plans` | **Date**: 2026-05-29

---

## Decision 1: Plans Tab Replaces History in Primary Nav

**Decision**: Add a Plans tab to `BottomNav` by replacing the History tab. History remains at `/history` and is accessible via a "Workout History" link on the Profile screen. New tab order: **Home | Workout | Plans | Exercises | Profile**.

**Rationale**: The reference product spec (`docs/gym_tracker_user_facing_app_spec.md` §6) explicitly defines Plans as a primary bottom tab (`Home | Workout | Plans | Progress | Profile`). Plans is a first-class destination — not a sub-screen of Workout. History is a secondary/analytical feature that maps naturally under Profile. This keeps the nav at 5 tabs (no readability problem), aligns with the long-term product spec, and positions the nav correctly ahead of spec 011 which will add Progress as a tab (replacing Exercises or History at that point).

**Tab order rationale**: History replaced (not Exercises) because Exercises (spec 007) is a primary browsing surface used during plan building and at the gym floor — removing it immediately after shipping is regressive. History is review-only and less time-critical.

**Alternatives considered**:
- Keep Plans hidden under Workout tab → conflicts with reference product spec; Plans is explicitly a primary nav destination
- Add 6th tab → icon labels unreadable at 375px; fails Principle II
- Replace Exercises tab → regressive; Exercises just shipped in spec 007 and is used during plan editing
- Plans as sub-nav under Profile → wrong context; plans are workout-centric not profile-centric

---

## Decision 2: Template Import Strategy

**Decision**: Template import reads from `src/data/routines/` in-memory at import time. The selected routine's days and exercises are written to Supabase as real `workout_days` and `plan_exercises` rows. No separate "template" table exists in Supabase.

**Rationale**: The four template routines (`muscleGainRoutine`, `strengthRoutine`, `fatLossRoutine`, `conditioningRoutine`) are already curated TypeScript objects with days and exercise keys. Converting them to Supabase rows at plan-creation time produces a user-owned copy that can be freely edited without affecting the canonical template. This is the minimal correct implementation — no new backend structure needed.

**Alternatives considered**:
- Store templates in Supabase as a `workout_plan_templates` table → extra migration, extra service, extra query; not needed since templates are static
- Deep-link to template data at session start → plans would have unresolvable foreign keys during the session; violates FR-014

**Constraint**: When `days_per_week` selected during template creation is fewer than the template's total days, import the first N days. Excess days are silently discarded. This is documented in spec Assumptions.

---

## Decision 3: Plan Exercise Reorder — Up/Down Buttons

**Decision**: Up and down arrow buttons swap `order` values between adjacent `plan_exercises` rows. No drag-and-drop library is added.

**Rationale**: Spec and personal-notes.md explicitly exclude drag-and-drop for v1. Up/down buttons are simpler to implement (two index swaps + one mutation), keyboard-accessible, and work reliably on mobile without a new dependency. Principle V (no new deps without approval) applies.

**Implementation detail**: `order` is a 0-based integer. Swapping two adjacent rows requires updating both rows in a single Supabase `upsert`. TanStack Query optimistic update is appropriate here.

---

## Decision 4: Active Plan Constraint Enforcement

**Decision**: Activation constraint ("only one active plan") is enforced in application logic, not in Supabase. The mutation service sets `is_active = false` for all of the user's plans in one update call, then sets `is_active = true` for the target plan.

**Rationale**: A Postgres trigger or partial unique index could enforce this server-side, but adding a trigger introduces a migration artifact that is harder to reason about than application logic. The two-step update (deactivate all → activate one) is a single Supabase client transaction and is idempotent on retry.

**Risk**: Concurrent activation from two devices could result in briefly having two active plans until the second update completes. Acceptable for v1 (gym users don't typically activate plans concurrently). Can be hardened with a Postgres constraint in a future spec.

---

## Decision 5: No Plan Deletion in v1

**Decision**: Archive is the only removal path. `is_archived` flag hides plans from the default list. No `DELETE` endpoint is exposed.

**Rationale**: Archived plans retain their `workout_days` and `plan_exercises` rows, which may be referenced by historical `workout_sessions` via `source_plan_id`. Deleting a plan would orphan those session records. Archive is the safe, reversible alternative.

---

## Decision 6: TanStack Query Key Strategy

**Decision**:
- `['plans', 'list', userId]` — full list of user's plans
- `['plans', 'detail', planId]` — single plan metadata
- `['plans', 'days', planId]` — workout days for a plan (includes exercise count)
- `['plans', 'exercises', dayId]` — plan exercises for a day

**Invalidation rules**:
- After `activate` / `deactivate` → invalidate `['plans', 'list', userId]` + `['plans', 'detail', planId]`
- After `duplicate` → invalidate `['plans', 'list', userId]`
- After `archive` → invalidate `['plans', 'list', userId]`
- After add/remove/reorder day → invalidate `['plans', 'days', planId]` + `['plans', 'detail', planId]`
- After add/remove/reorder exercise → invalidate `['plans', 'exercises', dayId]` + `['plans', 'days', planId]`

---

## Decision 7: i18n Key Count

~30 new keys required. Derived from form labels (name, goal, level, duration, days-per-week), template picker labels (4 templates), plan status badges (active, archived, draft), action labels (activate, deactivate, duplicate, archive, addDay, removeDay, addExercise, removeExercise), error messages (activationRequiresDay, activationRequiresExercise, planNameRequired), and navigation labels (navPlans, myPlans, plansEmpty, plansTitle, newPlan, editPlan, dayEditor).

Full key list documented in `data-model.md`.
