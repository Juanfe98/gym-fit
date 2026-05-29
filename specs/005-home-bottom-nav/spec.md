# Feature Specification: Home Screen + Bottom Navigation (App Shell)

**Feature Branch**: `005-home-bottom-nav`
**Created**: 2026-05-28
**Status**: Done
**Input**: Home + bottom nav (app shell — every other module needs it)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Navigate Between Sections via Bottom Nav (Priority: P1)

A logged-in user needs to move between the app's main sections. A persistent bottom navigation bar is always visible, showing labeled icons for each primary destination. Tapping a tab switches the view and highlights the active tab.

**Why this priority**: Every other module is unreachable without navigation. The bottom nav is the root dependency of the entire authenticated experience — no other feature can be tested end-to-end without it.

**Independent Test**: Launch the authenticated app, verify the bottom nav renders with all tabs, tap each tab, verify the correct screen loads and the tapped tab is highlighted active.

**Acceptance Scenarios**:

1. **Given** a logged-in user on any screen, **When** they view the bottom of the screen, **Then** a navigation bar is visible with four tabs: Home, Workout, History, and Profile.
2. **Given** the bottom nav, **When** the user taps a tab, **Then** the corresponding section loads and that tab's icon and label are visually highlighted as active.
3. **Given** an active tab, **When** the user taps the same active tab again, **Then** no new navigation event is pushed to the history stack.
4. **Given** an active tab with scrollable content, **When** the user taps the same active tab again, **Then** the content scrolls back to the top.
5. **Given** any navigation action within a section, **When** the user is on a nested screen (e.g., workout detail), **Then** the bottom nav remains visible with the parent section's tab still active.
6. **Given** the bottom nav, **When** viewed at 375px viewport, **Then** all four tabs are visible without horizontal scroll or overflow.

---

### User Story 2 — Home Dashboard (Priority: P1)

A logged-in user opens the app and lands on a Home screen that gives them an at-a-glance summary of their recent activity and a quick path to start their next workout.

**Why this priority**: Home is the first screen users see after login. It sets the tone for the product and provides the primary entry point to the most frequent action — starting a workout.

**Independent Test**: Log in, land on Home, verify: quick-start CTA is visible, recent workout summary (or empty state) is shown, and the screen renders correctly at 375px.

**Acceptance Scenarios**:

1. **Given** a logged-in user who has completed past workouts, **When** they land on the Home screen, **Then** they see their most recent workout summary (name, date, key stats) in a card.
2. **Given** a logged-in user with no past workouts, **When** they land on Home, **Then** an encouraging empty state is shown with a call-to-action to start their first workout.
3. **Given** the Home screen, **When** the user views it, **Then** a prominent "Start Workout" button is always visible regardless of history state.
4. **Given** the "Start Workout" button, **When** tapped, **Then** the user is taken to the Workout section to begin a session.

---

### User Story 3 — App Shell Auth Gate (Priority: P1)

Any user who is not authenticated is redirected to the login screen when attempting to access any app route. Authenticated users are never shown the login screen after a successful session.

**Why this priority**: The app shell must enforce the auth boundary. Without it, unauthenticated users can reach protected modules, and authenticated users may get stuck in login loops.

**Independent Test**: Access any authenticated route without a session → verify redirect to login. Log in → verify redirect to Home. Refresh the page while authenticated → verify Home loads without redirect.

**Acceptance Scenarios**:

1. **Given** a user with no active session, **When** they navigate to any authenticated route, **Then** they are redirected to the login screen.
2. **Given** a user who just logged in successfully, **When** redirected back, **Then** they land on the Home screen.
3. **Given** a logged-in user, **When** they refresh the app, **Then** their session is preserved and Home loads without a login redirect.
4. **Given** a logged-in user, **When** their session expires, **Then** they are silently redirected to login on their next navigation action.

---

### User Story 4 — User Identity + Sign Out (Priority: P2)

The app shell surfaces the logged-in user's display name or avatar in the Home header so users always know whose account they are viewing, and provides a sign-out action accessible from that same header.

**Why this priority**: Users who share a device or manage multiple accounts need confirmation of which account is active and a quick way to switch. Identity and sign-out are co-located so the action is discoverable without extra navigation.

**Independent Test**: Log in with a known account, verify the display name or avatar appears in the Home header. Tap the sign-out action, verify session is destroyed and user is redirected to login.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they view the Home screen, **Then** their display name or avatar is shown in the header area.
2. **Given** a user with no display name set, **When** the Home header renders, **Then** a sensible fallback (e.g., email prefix or "User") is shown instead of blank.
3. **Given** the Home header, **When** the user taps the sign-out action, **Then** their session is destroyed and they are redirected to the login screen.
4. **Given** the sign-out action, **When** tapped, **Then** no authenticated route is accessible until the user logs in again.

---

### User Story 5 — Profile Tab Stub (Priority: P2)

The Profile tab must be present and functional so the bottom nav is complete and navigable, even though the full Profile module is out of scope for this feature.

**Why this priority**: A missing or crashing tab breaks the nav shell contract. All four tabs must work so no module built on the shell encounters broken navigation.

**Independent Test**: Tap the Profile tab, verify a placeholder screen loads without errors, verify the Profile tab is highlighted active, verify the bottom nav remains visible.

**Acceptance Scenarios**:

1. **Given** the bottom nav, **When** the user taps the Profile tab, **Then** a placeholder screen loads with a brief message indicating the feature is coming soon.
2. **Given** the Profile placeholder screen, **When** it renders, **Then** the bottom nav is visible and the Profile tab is highlighted active.
3. **Given** the Profile placeholder screen, **When** the user taps another tab, **Then** they navigate away without errors.

---

### Edge Cases

- What happens when the user navigates to a route that no longer exists? → App shows a 404 / not-found state without crashing the shell.
- What happens when the session refresh fails silently? → User is redirected to login on next protected route access.
- What happens when the Home screen data fetch fails? → Error state shown in the summary card; quick-start CTA remains functional.
- What happens on extremely slow connections? → Shell renders with skeleton loaders for data-dependent sections; nav tabs are interactive immediately.
- What happens when the device back button is pressed from the Home tab? → App exits (or confirms exit) rather than navigating to a blank state.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a persistent bottom navigation bar on all authenticated screens with four tabs: Home, Workout, History, and Profile.
- **FR-002**: System MUST visually indicate the currently active tab in the bottom nav.
- **FR-003**: System MUST redirect unauthenticated users to the login screen when accessing any authenticated route.
- **FR-004**: System MUST redirect users to the Home screen after successful login.
- **FR-005**: System MUST refresh the user session on app load and preserve the authenticated state across page refreshes.
- **FR-006**: System MUST display the user's most recent completed workout summary on the Home screen if one exists.
- **FR-007**: System MUST display an empty state with a call-to-action on the Home screen when no workout history exists.
- **FR-008**: System MUST display a "Start Workout" button on the Home screen that navigates to the Workout section.
- **FR-009**: System MUST display the logged-in user's display name or avatar in the Home screen header.
- **FR-010**: System MUST provide a sign-out action in the Home screen header that destroys the session and redirects to login.
- **FR-011**: System MUST show skeleton loaders for data-dependent sections while content is loading.
- **FR-012**: System MUST show an error state in the summary card if the Home screen data fetch fails, without disabling the navigation or quick-start CTA.
- **FR-013**: Bottom navigation tabs MUST meet a minimum 44×44px tap target on all supported viewports.
- **FR-014**: System MUST render correctly at 375px viewport width without horizontal overflow.
- **FR-015**: Bottom navigation tab icons and labels MUST meet high contrast ratios sufficient for variable lighting conditions (constitution Principle II minimum).
- **FR-016**: Active and inactive tab states MUST be visually distinguishable by means other than color alone (e.g., icon weight, label emphasis) to support users with color vision deficiencies.
- **FR-017**: System MUST render a Profile placeholder screen when the Profile tab is tapped, displaying a "coming soon" message without errors.

### Key Entities

- **AppShell**: The authenticated layout wrapper. Renders the bottom nav, enforces session gate, and provides the slot for module-level content.
- **BottomNav**: Persistent navigation component. Owns tab definitions (label, icon, route), active state, and tap-to-scroll-top behavior.
- **HomeScreen**: Dashboard module entry point. Composes the user greeting, recent workout summary card, and quick-start CTA.
- **RecentWorkoutCard**: Read-only summary of the most recent completed session. Shows name, date, duration, and volume.
- **UserSession**: The authenticated user object. Provides display name, avatar URL, and user ID to the shell and home screen.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four bottom nav tabs are reachable in 1 tap from any authenticated screen.
- **SC-002**: The Home screen fully renders (including skeleton resolution) in under 2 seconds on a standard mobile connection.
- **SC-003**: Unauthenticated route access always results in a redirect to login — 0 unprotected authenticated routes.
- **SC-004**: All interactive elements in the bottom nav have a tap target of at least 44×44px, verified at 375px viewport.
- **SC-005**: The Home screen renders usably with no horizontal scroll at 375px viewport width.
- **SC-006**: Session state is preserved across page refreshes — users are not unexpectedly logged out.
- **SC-007**: 100% of authenticated screens display the bottom nav without layout breaks at 375px.
- **SC-008**: Active and inactive nav tab states are visually distinguishable in high-contrast lighting conditions.

---

## Assumptions

- Four primary navigation sections are sufficient for MVP: Home, Workout, History, Profile. Additional tabs (e.g., Progress, Goals) are out of scope for this feature.
- The Workout tab routes to the module defined in `003-workout-session-tracking`; the History tab routes to `004-workout-history`. Those modules own their own screens — this feature only owns the nav shell and home screen.
- Display name is stored in Supabase user metadata or a `profiles` table; the shell reads it on load.
- Skeleton loaders are used for the recent workout card; the greeting header and nav are never blocked by data loading.
- The Profile tab is a stub for MVP — full profile management is a future feature.
- Home screen does NOT display a current active workout plan — that is deferred to a future feature (see `specs/005-home-bottom-nav/future-scope-home-plan-widget.md`).
- Accessibility target is constitution minimum: high contrast for variable lighting, 44×44px tap targets, and color-independent active state indication. Full WCAG 2.1 AA is out of scope for MVP.
- ADR: UI/UX planning and implementation tasks for this feature MUST use the `/ui-ux-pro-max` skill.
