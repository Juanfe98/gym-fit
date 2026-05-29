# Research: Onboarding Welcome Screen

## Decision 1: Route location and rendering model

**Decision**: Implement `/onboarding/welcome` as `src/app/onboarding/welcome/page.tsx`, with the page as a Server Component and the CTA block as a Client Component.

**Rationale**: The page can verify the Supabase user server-side and redirect unauthenticated users before rendering. Most of the screen is presentational and benefits from staying server-rendered. The CTA block needs client interactivity for pending state, repeat-click protection, metadata persistence, and navigation after skip.

**Alternatives considered**:
- Put the route under `src/app/(app)/onboarding/welcome`: rejected because `(app)` currently wraps authenticated pages in `AppShell` with bottom nav, which is not appropriate for a full-screen onboarding entry page.
- Make the whole page a Client Component: rejected because only actions need client behavior; this would add unnecessary client JS.

## Decision 2: Skipped onboarding persistence

**Decision**: Persist skipped status in Supabase Auth user metadata using a value such as `onboarding_status: 'skipped'`.

**Rationale**: The feature only needs a lightweight status flag and does not require a new profile schema or RLS-protected table. Supabase Auth metadata is already available in the project through existing auth flows and can be updated from the browser client for the current authenticated user. This avoids migrations and keeps the change minimal.

**Alternatives considered**:
- Add a new `fitness_profiles` or `onboarding_profiles` table: rejected for this feature because it introduces migration/RLS work beyond the welcome screen and duplicates a simple status flag.
- Store only in local storage/cookie: rejected because the status should persist across normal authenticated sessions and devices where possible.

## Decision 3: Visual design approach

**Decision**: Use existing Gym Planner design tokens with a dark gradient page background, athletic orange primary CTA, high-contrast text, Barlow/Barlow Condensed typography, and layered surface cards.

**Rationale**: ADR-005/006/007 define an Athletic Dark visual language. The welcome screen should feel premium and performance-oriented without introducing a new design system. Gradients should be subtle and built from existing dark/orange token colors so contrast remains strong.

**Alternatives considered**:
- Use generic SaaS light-mode onboarding: rejected because V1 is dark-only and the product identity is athletic dark.
- Add illustration/image assets: rejected because the spec calls for a visual preview card and no new media dependency is necessary.

## Decision 4: Responsive layout

**Decision**: Build mobile-first stacked layout and progressively enhance to a two-column desktop layout.

**Rationale**: The constitution requires mobile-first design at 375px, while the feature explicitly requires desktop two-column layout. Starting stacked avoids horizontal overflow on small screens; desktop can use a grid/flex layout to place copy/actions and preview side-by-side.

**Alternatives considered**:
- Desktop-first grid that collapses later: rejected because it risks missing the primary mobile gym-floor use case.

## Decision 5: Component boundaries

**Decision**: Use the requested component boundaries: `WelcomeHero`, `WelcomeBenefitList`, and `WelcomeActions`. Keep the preview card colocated in the page or hero unless it becomes too large during implementation.

**Rationale**: The requested structure is clean and minimal. Splitting the preview into another component is not necessary at planning time and would add more files than requested.

**Alternatives considered**:
- Create a full `modules/onboarding` feature module: rejected for this small screen because the user requested `src/components/onboarding` paths and no reusable onboarding domain logic exists yet.
