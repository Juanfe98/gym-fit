# Research: Onboarding Goal Selection

## Decision: Store `mainGoal` in Supabase Auth user metadata for this onboarding step

**Rationale**: The adjacent welcome step already persists onboarding-related state in Supabase Auth user metadata. The goal-selection page only needs to store one lightweight profile preference and does not require querying, relational joins, reporting, or Row-Level Security policies for a new table. Reusing auth metadata keeps the change minimal and avoids a schema migration before the full onboarding data model is known. This is an MVP decision; a dedicated onboarding/profile table may be revisited after all seven steps are specified.

**Alternatives considered**:

- **New Supabase table for onboarding profile**: Rejected for this step because it adds migration/RLS work for one field and risks premature schema design before all seven onboarding steps are specified.
- **Client-only local storage**: Rejected because the selection should survive sessions/devices and be associated with the authenticated user.
- **URL query or session state only**: Rejected because the selected goal must persist after Continue succeeds.

## Decision: Implement `/onboarding/goal` as an auth-gated Server Component with a focused Client Component for interaction

**Rationale**: The route should verify the user server-side before rendering onboarding content. The selectable cards, pending save state, error state, and client navigation require client-side interactivity, so that behavior belongs in a small client component nested inside the route. Authenticated users who previously skipped or completed onboarding may still manually revisit this route to update `mainGoal`; onboarding status alone should not redirect them away.

**Alternatives considered**:

- **Entire page as a Client Component**: Rejected because it would push auth gating and initial metadata reading into the browser unnecessarily.
- **Server Action for the save**: Acceptable, but not required for this lightweight metadata update and less consistent with the existing welcome skip implementation, which uses the browser Supabase client.

## Decision: Use a typed goal constant list and a narrow `MainGoal` union

**Rationale**: The feature requires only seven allowed choices. A single exported constant list with stable identifiers and labels lets cards, validation, and save logic share one source of truth. Runtime validation should still guard persisted metadata so only supported values can become `mainGoal`.

**Alternatives considered**:

- **Free-text goal values**: Rejected because the UI only allows seven choices and downstream onboarding should rely on stable identifiers.
- **Reuse existing routine `Goal` type**: Rejected because the onboarding list includes goals not present in the existing routine generator, such as mobility and maintaining current shape.

## Decision: Cards are accessible buttons with explicit `aria-pressed` selected state

**Rationale**: Each goal option behaves like a single-select toggle inside a card grid. Buttons provide native keyboard activation, focus behavior, and semantic interactivity. The selected state must be visually obvious and exposed to assistive technologies through `aria-pressed`.

**Alternatives considered**:

- **Radio inputs visually styled as cards**: Also accessible, but would require more form markup. Buttons match the requested `aria-pressed` behavior and keep the implementation simple.
- **Clickable div cards**: Rejected because they would require recreating button semantics and keyboard behavior manually.

## Decision: Continue target must exist even if the full experience module is not implemented yet

**Rationale**: The goal step contract routes to `/onboarding/experience` after a successful save. If that route is absent, the primary flow lands on a missing page. A minimal authenticated placeholder target keeps the route contract valid without implementing the next onboarding module.

**Alternatives considered**:

- **Allow navigation to a missing route until the next module exists**: Rejected because it breaks the success path for this feature.
- **Implement the full experience step now**: Rejected as scope creep for the goal-selection module.

## Decision: Responsive mobile-first layout with a shared onboarding shell

**Rationale**: The welcome screen already establishes a premium dark onboarding visual language. A shell component can reuse the same background approach and keep future onboarding steps visually consistent. Mobile should stack content and cards vertically; wider screens can use a centered card/grid layout with more columns.

**Alternatives considered**:

- **Reuse the welcome page layout directly**: Rejected because the goal step is a focused form-like selection page rather than a two-column marketing intro.
- **Create only page-local markup**: Rejected because several additional onboarding steps are expected and shared shell/progress/action patterns will reduce duplication without broad refactoring.

## Decision: Manual validation plus build for this planning stage

**Rationale**: The project currently uses build validation and manual UI checks for similar onboarding work. This feature is primarily UI state and a simple metadata update. Required validation should include disabled state, one-selection-only behavior, save error handling, responsive layout, and accessibility state review.

**Alternatives considered**:

- **Add a new test framework**: Rejected because the constitution forbids new dependencies without approval and this feature does not justify expanding tooling.
