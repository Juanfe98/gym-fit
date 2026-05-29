# Feature Specification: Exercise Library

**Feature Branch**: `007-exercise-library`
**Created**: 2026-05-28
**Status**: Ready
**Input**: A full-screen browsable and searchable exercise library. Users can browse all exercises from the static catalog, filter by muscle group and equipment, search by name, and tap an exercise to view its detail page (form cues, common mistakes, rationale, muscle diagram, ExerciseDB GIF). The library is accessible from the bottom nav. Exercises can also be favorited and added to the active workout session from the detail page.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse & Search Exercises (Priority: P1)

A gym-goer opens the Exercise Library from the bottom nav to find an exercise. They scroll the full list, search by name, and filter by muscle group or equipment to narrow results. They find what they need quickly without leaving the app.

**Why this priority**: Discovery is the entry point for everything else. Without a functional list, detail, favorites, and session add are unreachable. This is the foundation of the feature.

**Independent Test**: Tap the Exercises tab in bottom nav → full list loads with all exercises visible → type "squat" in search → results narrow to matching exercises → clear search → apply "upper legs" muscle filter → only upper-leg exercises show → apply "barbell" equipment filter → results narrow further → clear all filters → full list returns.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they tap the Exercises tab in the bottom nav, **Then** the exercise list screen opens showing all exercises from the catalog.
2. **Given** the exercise list, **When** the user types in the search field, **Then** the list filters in real-time to show exercises whose names contain the query.
3. **Given** the exercise list, **When** the user selects a muscle group filter, **Then** only exercises targeting that muscle group are shown.
4. **Given** the exercise list, **When** the user selects an equipment filter, **Then** only exercises using that equipment are shown.
5. **Given** active filters, **When** the user clears them, **Then** the full unfiltered list is restored.
6. **Given** a search query that matches no exercises, **When** it is applied, **Then** an empty state message is shown with a clear-filter action.
7. **Given** the exercise list at 375px, **When** the page renders, **Then** there is no horizontal overflow or clipped content.
8. **Given** the exercise list, **When** the user scrolls to the bottom, **Then** more exercises are loaded (pagination) without a full-page reload.

---

### User Story 2 — View Exercise Detail (Priority: P1)

A user taps an exercise in the list to learn how to perform it correctly. The detail page shows the exercise name, animated GIF demonstration, muscle group information, muscle diagram, and — for curated catalog exercises — form cues, common mistakes, and training rationale.

**Why this priority**: Tied to P1 with browse — the library's core value is education. A list without actionable detail is a directory, not a library.

**Independent Test**: Tap any exercise in the list → detail page opens → animated GIF plays → muscle diagram visible → muscle group and equipment labels visible → tap a curated catalog exercise (e.g., Barbell Bench Press) → form cues, common mistakes, and rationale sections are visible → tap a non-catalog exercise → only basic info, GIF, and muscle diagram shown (no coaching sections) → tap back → returns to list at the same scroll position.

**Acceptance Scenarios**:

1. **Given** a user on the exercise list, **When** they tap an exercise, **Then** the detail page opens showing name, animated GIF, muscle diagram, primary muscle group, secondary muscles, and equipment.
2. **Given** a curated catalog exercise, **When** the detail page loads, **Then** form cues, common mistakes, and rationale sections are visible.
3. **Given** a non-catalog exercise, **When** the detail page loads, **Then** only the basic information, GIF, and muscle diagram are shown — coaching sections are entirely absent (not rendered empty).
4. **Given** the ExerciseDB GIF is loading, **When** the detail page first renders, **Then** a skeleton placeholder occupies the GIF area until the image loads.
5. **Given** the ExerciseDB GIF fails to load or times out, **When** the detail page renders, **Then** a static fallback placeholder is shown instead and the rest of the page remains fully functional.
6. **Given** the detail page, **When** the user taps back, **Then** they return to the exercise list at the same scroll position they left.
7. **Given** the detail page at 375px, **When** it renders, **Then** the GIF, muscle diagram, text sections, and action buttons display without horizontal overflow.

---

### User Story 3 — Favorite an Exercise (Priority: P2)

A user marks exercises they frequently use as favorites. Favorites persist across sessions. The user can filter the library to show only their favorites for quick access on gym days.

**Why this priority**: Favorites reduce friction for returning users who have established programs. Not required for the library to function, but significantly improves repeat-use value.

**Independent Test**: On the detail page, tap the favorite icon → icon fills/becomes active immediately → navigate away and back → icon remains active → return to list → exercise row shows heart indicator → filter by favorites → only favorited exercises appear → un-favorite from detail → icon empties immediately → removed from favorites list. Simulate offline → tap favorite → icon activates immediately → go online → favorite syncs to server.

**Acceptance Scenarios**:

1. **Given** a user on an exercise detail page, **When** they tap the favorite button, **Then** the button immediately reflects the active state (optimistic update) and the favorite is persisted to the server in the background.
2. **Given** a favorited exercise, **When** the user taps the favorite button again, **Then** the button immediately reflects the inactive state (optimistic update) and the removal is persisted to the server in the background.
3. **Given** a favorite action fails to sync (network error), **When** the server responds with an error, **Then** the optimistic state is reverted and a brief error message is shown.
4. **Given** a user who has favorited exercises, **When** they apply the favorites filter in the library, **Then** only their favorited exercises are shown.
5. **Given** a user with no favorites, **When** they apply the favorites filter, **Then** an empty state is shown with a prompt to favorite exercises.
6. **Given** a user favorites an exercise on one device, **When** they open the app on another device, **Then** the favorite state is reflected (persisted server-side, not device-local).
7. **Given** the favorites filter active, **When** the user also applies a muscle or equipment filter, **Then** both filters apply simultaneously (intersection, not union).
8. **Given** the exercise list, **When** the list renders, **Then** each exercise row that is favorited shows a heart icon indicator.

---

### User Story 4 — Add Exercise to Active Workout Session (Priority: P2)

A user browsing the exercise library during a workout finds an exercise they want to add to their current session. They tap "Add to session" on the detail page and the exercise is appended to their active workout without leaving the library.

**Why this priority**: Bridges the library and the workout session. Reduces the workflow friction of switching screens mid-workout.

**Independent Test**: Start an active workout session → navigate to Exercise Library → find any exercise → open detail → "Add to session" button is visible → tap it → navigate to active workout → exercise appears appended at the end of the session.

**Acceptance Scenarios**:

1. **Given** an active workout session and a user viewing an exercise detail page, **When** they tap "Add to session", **Then** the exercise is appended to the active session and a transient toast notification confirms the action (auto-dismisses after ~2 seconds).
2. **Given** no active workout session, **When** the user views an exercise detail page, **Then** the "Add to session" button is not shown.
3. **Given** an exercise already present in the active session, **When** the user taps "Add to session" again, **Then** a duplicate is added (same behavior as the in-session exercise picker).
4. **Given** the toast confirmation appears, **When** it auto-dismisses, **Then** the user remains on the detail page — no forced navigation away.

---

### Edge Cases

- What happens when the exercise catalog data file fails to load (corrupt JSON)?
- What happens when the user applies multiple filters that result in zero matches?
- What happens when a user favorites an exercise while offline? → Optimistic update applied immediately; sync retried when connectivity returns. If sync permanently fails, state reverts with an error message.
- What happens when the ExerciseDB GIF URL returns a 404 or the CDN is unavailable?
- What happens when the user navigates back from a deep detail page (history stack depth)?
- What happens when an exercise present in the user's favorites is removed from the catalog in a future update?
- What happens when the user navigates directly to `/exercises/[id]` with an ID that does not exist in the catalog? → A "not found" state must be shown with a link back to the library — no crash or blank screen.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an Exercise Library screen accessible via a dedicated tab in the bottom navigation bar.
- **FR-002**: System MUST display all exercises from the static exercise catalog in the library list.
- **FR-003**: System MUST support real-time search filtering by exercise name in the library list.
- **FR-004**: System MUST support filtering by muscle group (body part) with a selectable filter control.
- **FR-005**: System MUST support filtering by equipment type with a selectable filter control.
- **FR-006**: System MUST support a "Favorites only" filter that shows only the authenticated user's favorited exercises.
- **FR-007**: System MUST paginate the exercise list — loading exercises in batches on scroll rather than all at once.
- **FR-008**: System MUST provide an empty state when no exercises match the active filters, with a visible action to clear filters.
- **FR-009**: System MUST provide an exercise detail screen reachable by tapping any exercise in the list.
- **FR-010**: System MUST display on the detail screen: exercise name, animated GIF, muscle diagram, primary muscle group, secondary muscles, and equipment type.
- **FR-011**: System MUST display form cues, common mistakes, and training rationale on the detail screen for exercises in the curated catalog. Coaching sections MUST be entirely absent (not rendered empty) for non-catalog exercises.
- **FR-012**: System MUST show a skeleton placeholder in the GIF area while the animated GIF is loading.
- **FR-013**: System MUST show a static fallback placeholder if the animated GIF fails to load or times out — the rest of the page must remain fully functional.
- **FR-014**: System MUST provide a favorite/unfavorite toggle on the exercise detail screen that updates immediately (optimistic update) before server confirmation.
- **FR-015**: System MUST show a heart icon indicator on exercise list rows that are already favorited by the authenticated user.
- **FR-016**: System MUST persist favorites per authenticated user in the backend — favorites MUST NOT be device-local only.
- **FR-017**: When a favorite action fails to sync to the server, the system MUST revert the optimistic state and show a brief error message.
- **FR-018**: System MUST NOT show the "Add to session" button on the exercise detail screen when no active workout session exists.
- **FR-019**: System MUST append the selected exercise to the active workout session when "Add to session" is tapped, and display a transient toast notification that auto-dismisses after approximately 2 seconds.
- **FR-020**: System MUST restore the exercise list scroll position when the user navigates back from a detail page.
- **FR-021**: All new user-facing strings MUST be added to the i18n translation files in both English and Spanish.
- **FR-022**: All interactive elements (buttons, list rows, filter chips) MUST have a minimum 44×44px tap target.
- **FR-023**: The bottom navigation bar MUST include the Exercises tab alongside existing tabs; no existing tab may be removed.
- **FR-024**: No new npm dependencies may be added — all required capabilities exist in the current project stack.

### Key Entities

- **Exercise**: An item from the static catalog — identified by id, name, body part, target muscle, secondary muscles, equipment, and GIF URL. Read-only; never user-generated.
- **CatalogExercise**: A curated subset of exercises that have authored coaching content (form cues, common mistakes, rationale). Identified by a stable `ExerciseKey`. Overlaps with Exercise by `exerciseDbId`.
- **UserFavorite**: A saved relationship between an authenticated user and an exercise id. Persisted per user, scoped to their account, isolated from other users by RLS.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can find any exercise by name in under 2 seconds from opening the library — search filters the local static catalog with no network call required.
- **SC-002**: The exercise list renders its first batch within 1 second on a standard mobile connection (no network call required — data is static and local).
- **SC-003**: All five filter types (search, muscle group, equipment, favorites, combinations) work correctly for 100% of exercises in the catalog.
- **SC-004**: Favoriting and un-favoriting an exercise reflects the correct state on the next app launch — zero stale favorite state after a page refresh.
- **SC-005**: The "Add to session" action appends the exercise to the active workout on 100% of taps when a session is active — no silent failures.
- **SC-006**: All detail pages render without layout breakage at 375px viewport width.
- **SC-007**: ExerciseDB GIF failures never cause the detail page to crash or show broken UI — fallback is always displayed.

---

## Out of Scope

- Custom user-created exercises (stored in Supabase) — future spec
- Exercise programming (sets, reps, rest prescriptions) on the detail page — belongs to workout plans spec
- Social features (sharing exercises, community ratings)
- Exercise video content beyond ExerciseDB GIFs
- Bulk-favoriting or favorite collections/folders
- Comparing two exercises side by side

---

## Assumptions

- The static exercise catalog contains ~1500 exercises with name, muscle group, secondary muscles, equipment, and animated GIF reference per entry. This is the browse source.
- Coaching content (form cues, common mistakes, rationale) exists only for the ~37 curated exercises referenced in the app's routine programming data. All other exercises show basic info and GIF only.
- Favorites are a new server-persisted feature requiring a new database table with per-user data isolation. This is the only new database object in this spec.
- The ExerciseDB animated GIF service is a runtime enhancement — the library must be fully browsable and useful without it.
- Search, filter, and pagination logic already exists in the workout session module and will be reused rather than duplicated.
- The bottom navigation expands from 4 to 5 tabs to accommodate the Exercises tab.
- The Exercise Library is an authenticated screen — the app shell and bottom nav are always present.
- "Add to session" reuses the active workout session state management already available in the workout session module.
- The onboarding route referenced in spec 006 does not yet exist — this spec does not depend on it.
