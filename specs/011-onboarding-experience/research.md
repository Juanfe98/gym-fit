# Research: Onboarding Experience Selection

## Decision: Store `experienceLevel` in existing `user_fitness_preferences.experience_level`

**Rationale**: The profile overview architecture already defines `user_fitness_preferences.experience_level` as the canonical source for training experience. Saving the onboarding selection there keeps onboarding and profile data consistent, uses existing Supabase/RLS infrastructure, and avoids a new migration. The save operation should upsert the current user's preferences row and update only `experience_level` plus timestamp fields, preserving existing preference fields such as goal, availability, and units.

**Alternatives considered**:
- **Store `experienceLevel` in Supabase Auth metadata**: Rejected because the profile overview reads experience level from `user_fitness_preferences`, which would create two sources of truth and make the profile appear incomplete after onboarding.
- **Create a new onboarding-specific table**: Rejected because the existing preferences table already models this field and has RLS.
- **Local-only browser storage**: Rejected because the selection would not reliably persist across devices/sessions and would not be available to the authenticated app.
- **In-memory state only**: Rejected because the value would be lost on refresh before the next onboarding step.

## Decision: Reuse the existing onboarding component pattern and extend it minimally

**Rationale**: The goal selection step already defines the expected UI architecture: shell, progress indicator, selectable option cards, action area, service function, and strongly typed option IDs. The experience step should follow the same pattern to keep the onboarding flow consistent and minimize changes.

**Alternatives considered**:
- **Build the page as one large component**: Rejected because it would duplicate patterns already established by the goal step and make accessibility/state handling harder to review.
- **Create a generic option-card abstraction now**: Rejected as premature. Goal cards and experience cards differ enough (experience cards include example bullets) that two small explicit components are more reviewable for MVP.

## Decision: Experience values are constrained to `beginner`, `intermediate`, and `advanced`

**Rationale**: The user-facing labels are Beginner, Intermediate, and Advanced. Stable lowercase identifiers are suitable for persistence and match existing domain naming in profile/workout plan features. A type guard should ignore invalid stored values and require reselection.

**Alternatives considered**:
- **Persist display labels directly**: Rejected because labels are product copy and may change or be localized.
- **Allow arbitrary strings**: Rejected because downstream personalization needs a closed set of known levels.

## Decision: Use native button semantics for selectable cards

**Rationale**: Buttons provide keyboard activation with Enter/Space by default, support disabled behavior, are familiar to assistive technologies, and align with the existing goal card pattern. `aria-pressed` communicates selected state without inventing custom keyboard behavior.

**Alternatives considered**:
- **Radio inputs visually hidden inside cards**: Valid but more markup-heavy than needed for three choices; the existing onboarding goal step already uses pressed buttons.
- **Custom div cards with key handlers**: Rejected because custom keyboard handling is more error-prone and less accessible by default.

## Decision: Add a minimal `/onboarding/frequency` placeholder only if the route is absent

**Rationale**: The experience step contract routes to `/onboarding/frequency` after successful save. If that route is absent, the primary flow lands on a missing page. A minimal authenticated placeholder target keeps the route contract valid without implementing the next module.

**Alternatives considered**:
- **Implement the full frequency step now**: Rejected as scope creep.
- **Navigate somewhere else temporarily**: Rejected because it violates the explicit route contract.
- **Do nothing if route is missing**: Rejected because the main acceptance scenario would fail after a successful save.
