# Feature Specification: User Profile Overview Page

**Feature Branch**: `010-profile-overview`
**Created**: 2026-05-29
**Status**: Draft
**Route**: `/profile`

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Profile Overview (Priority: P1)

A logged-in user navigates to `/profile` and sees a complete dashboard summarizing all their fitness profile data: name, avatar, fitness goal, experience level, workout availability, equipment, body info, limitations, and measurements.

**Why this priority**: Core feature — without this, the page has no value.

**Independent Test**: Navigate to `/profile` as a fully set-up user. Verify all eight sections render with real data and no broken placeholders.

**Acceptance Scenarios**:

1. **Given** user has completed their profile, **When** they visit `/profile`, **Then** all sections display real data with no `null`, `undefined`, or raw enum values.
2. **Given** user visits `/profile`, **When** the page loads, **Then** a skeleton loading state appears first, then real content replaces it.
3. **Given** user has a profile photo, **When** header renders, **Then** avatar image is shown with useful alt text.
4. **Given** user has no profile photo, **When** header renders, **Then** their initials are shown instead.

---

### User Story 2 — Navigate to Edit Flows from Profile (Priority: P1)

A user sees a section they want to update (e.g., fitness goal) and clicks the edit action. They are taken to the correct dedicated editing page.

**Why this priority**: Profile overview is read-only — edit navigation is the primary interaction.

**Independent Test**: Click every section's action link/button. Verify each routes to the correct destination route.

**Acceptance Scenarios**:

1. **Given** user is on `/profile`, **When** they click "Edit personal info" in the header, **Then** they are navigated to `/profile/edit`.
2. **Given** user is on `/profile`, **When** they click the action in the Fitness Goal section, **Then** they are navigated to `/profile/preferences`.
3. **Given** user is on `/profile`, **When** they click the action in the Experience Level section, **Then** they are navigated to `/profile/preferences`.
4. **Given** user is on `/profile`, **When** they click the action in Workout Availability, **Then** they are navigated to `/profile/preferences`.
5. **Given** user is on `/profile`, **When** they click the action in Equipment Access, **Then** they are navigated to `/profile/equipment`.
6. **Given** user is on `/profile`, **When** they click the action in Body Information, **Then** they are navigated to `/profile/body`.
7. **Given** user is on `/profile`, **When** they click the action in Physical Limitations, **Then** they are navigated to `/profile/limitations`.
8. **Given** user is on `/profile`, **When** they click the primary action in Body Measurements, **Then** they are navigated to `/profile/measurements`.
9. **Given** user is on `/profile` and measurements exist, **When** they click the secondary action in Body Measurements, **Then** they are navigated to `/profile/measurements/new`.

---

### User Story 3 — View Empty States for Incomplete Profile (Priority: P2)

A new or partially set-up user visits `/profile`. Sections with no data show friendly empty states with explanations and CTAs instead of blank or broken content.

**Why this priority**: Most new users will have incomplete profiles. Empty states protect the experience and guide completion.

**Independent Test**: Create a user with no fitness profile data. Visit `/profile`. Verify every section shows a helpful empty state with a CTA.

**Acceptance Scenarios**:

1. **Given** user has no fitness goal set, **When** Fitness Goal section renders, **Then** a friendly message explains the benefit of selecting a goal and a CTA linking to `/profile/preferences` is shown.
2. **Given** user has no experience level, **When** Experience Level section renders, **Then** friendly empty state with CTA to `/profile/preferences` is shown.
3. **Given** user has no workout availability, **When** Workout Availability section renders, **Then** friendly empty state with CTA to `/profile/preferences` is shown.
4. **Given** user has no equipment selected, **When** Equipment Access section renders, **Then** friendly empty state with CTA to `/profile/equipment` is shown.
5. **Given** user has no height or weight, **When** Body Information section renders, **Then** friendly empty state (non-negative language) with CTA to `/profile/body` is shown.
6. **Given** user has no limitations, **When** Physical Limitations section renders, **Then** friendly empty state with CTA to `/profile/limitations` is shown.
7. **Given** user has no body measurements, **When** Body Measurements section renders, **Then** friendly empty state with CTA to `/profile/measurements/new` is shown.

---

### User Story 4 — Profile Completion Indicator (Priority: P2)

User sees how complete their profile is. The indicator motivates them to fill missing key fields without making the profile feel broken.

**Why this priority**: Drives engagement and data completeness without alarming users.

**Independent Test**: Test with 0, partial, and full profile data. Verify the completion label and visual indicator reflect the correct tier.

**Acceptance Scenarios**:

1. **Given** user has filled 0 of the 6 key fields, **When** page loads, **Then** completion indicator shows "Getting started".
2. **Given** user has filled 1–4 of the 6 key fields, **When** page loads, **Then** completion indicator shows "Almost ready".
3. **Given** user has filled all 6 key fields, **When** page loads, **Then** completion indicator shows "Profile ready".
4. **Given** body measurements and limitations are empty, **When** completion is calculated, **Then** those fields do not affect the score at all.

---

### User Story 5 — Error State on Load Failure (Priority: P3)

If the profile cannot be loaded, the user sees a friendly error state with a retry action instead of a broken page.

**Why this priority**: Network errors happen. Users need a safe fallback.

**Independent Test**: Simulate a failed profile fetch. Verify the error message and retry button appear.

**Acceptance Scenarios**:

1. **Given** profile data fails to load, **When** page renders, **Then** a message like "We couldn't load your profile. Please try again in a moment." is shown.
2. **Given** error state is visible, **When** user clicks retry, **Then** the page attempts to reload the profile.
3. **Given** error state is shown, **When** screen reader reads the page, **Then** the error message is announced correctly.

---

### Edge Cases

- What happens when only height exists but not weight (and vice versa)? Show only available value; no empty placeholder for missing one.
- What happens when user name is missing? Show "Your profile" as fallback in the header.
- What happens when equipment count exceeds 3 items? Show first 3 then "+ N more" (e.g., "Dumbbells, Barbell, Bench + 5 more").
- What happens when limitations exist but the affected-area label is missing or unknown? Show limitation count without broken label.
- What happens when the latest body measurement entry has no key values (weight, waist, etc.)? Show the entry date only, without broken metric rows.
- What happens when fitness goal is stored as a raw enum value? Map to human-readable label; never display the raw value.

## Requirements *(mandatory)*

### Functional Requirements

**Profile Page**

- **FR-001**: System MUST render a `/profile` page visible only to authenticated users; unauthenticated requests redirect to `/login`.
- **FR-002**: System MUST show a loading skeleton that matches the final page structure while profile data is being fetched.
- **FR-003**: System MUST show a friendly error state with a retry action if the profile fails to load.
- **FR-004**: Page MUST never display `null`, `undefined`, `N/A`, raw enum values, or empty raw values in any section.
- **FR-005**: This page MUST replace the existing `/profile` implementation entirely. The previous account/sign-out/stats layout is removed.

**Data & Schema**

- **FR-006**: Feature MUST include Supabase migrations creating tables for: training preferences, equipment access, body information, physical limitations, and body measurements.
- **FR-007**: All new Supabase tables MUST have Row-Level Security policies ensuring users can only read and write their own rows.
- **FR-008**: `TrainingPreferences` is the canonical source for fitness goal and experience level. `UserProfile` (auth metadata) is the canonical source for name and avatar URL only.

**Profile Header**

- **FR-009**: Header MUST display the user's avatar when available, or initials when no avatar exists. Avatar images MUST have descriptive alt text.
- **FR-010**: Header MUST display the user's name, or "Your profile" when name is missing.
- **FR-011**: Header MUST show a summary of the user's fitness goal and experience level sourced from `TrainingPreferences`.
- **FR-012**: Header MUST show a profile completion indicator with a tier label.
- **FR-013**: Header MUST include an action navigating to `/profile/edit`.

**Profile Completion**

- **FR-014**: Completion score MUST be calculated from exactly 6 key fields: name, fitness goal, experience level, workout availability (days per week), equipment access (at least one item), preferred units. Each field is worth 1 point (0–6 scale).
- **FR-015**: Completion tiers: 0 fields → "Getting started"; 1–4 fields → "Almost ready"; 5–6 fields → "Profile ready".
- **FR-016**: Body measurements and physical limitations MUST NOT be counted in the completion score.

**Fitness Goal Section**

- **FR-017**: Section MUST show the user's current goal label and a short explanation of how it affects personalization when a goal exists.
- **FR-018**: Section MUST show a friendly empty state with a CTA to `/profile/preferences` when no goal is set.
- **FR-019**: System MUST support display of: Build muscle, Lose fat, Increase strength, Improve endurance, General fitness, Body recomposition.

**Experience Level Section**

- **FR-020**: Section MUST show the experience level label and a short explanation of how it affects recommendations when a level exists.
- **FR-021**: Section MUST show a friendly empty state with CTA to `/profile/preferences` when no level is set.
- **FR-022**: System MUST support display of: Beginner, Intermediate, Advanced.

**Workout Availability Section**

- **FR-023**: Section MUST display days per week and preferred session duration when available (e.g., "4 days/week · 90 min/session").
- **FR-024**: Section MUST display preferred training days in readable short format when available (e.g., "Mon, Tue, Thu, Sat").
- **FR-025**: Section MUST show only available data when partial; no broken placeholder for missing sub-fields.
- **FR-026**: Section MUST show friendly empty state with CTA to `/profile/preferences` when no availability is set.

**Equipment Access Section**

- **FR-027**: Section MUST show equipment preset label when available (Full gym, Home gym, Bodyweight only, Custom).
- **FR-028**: Section MUST show count of selected equipment items and a preview of the first 3; when more than 3 exist, append "+ N more".
- **FR-029**: Section MUST show friendly empty state with CTA to `/profile/equipment` when no equipment is selected.

**Body Information Section**

- **FR-030**: Section MUST show height and weight in user's preferred units when both exist.
- **FR-031**: Section MUST show only the available value when only one of height or weight exists.
- **FR-032**: Section MUST show a friendly, non-negative empty state with CTA to `/profile/body` when neither exists.

**Physical Limitations Section**

- **FR-033**: Section MUST show the count of limitations and a preview of up to 3 affected areas when limitations exist (e.g., "2 limitations — Shoulder · Lower back").
- **FR-034**: Section MUST show a friendly empty state with CTA to `/profile/limitations` when no limitations exist.
- **FR-035**: Section MUST use non-medical language only: "limitations", "movement restrictions", "areas to be careful with". Never "medical conditions" or "diagnoses".

**Body Measurements Section**

- **FR-036**: Section MUST show the latest measurement entry date and a preview of available key values (weight, waist, chest, body fat %) when measurements exist. If no key values exist on the entry, show date only.
- **FR-037**: Section MUST provide two actions when measurements exist: primary → `/profile/measurements`; secondary → `/profile/measurements/new`.
- **FR-038**: Section MUST show a friendly empty state with CTA to `/profile/measurements/new` when no entries exist.

**Destination Routes (stub pages)**

- **FR-039**: Routes `/profile/edit`, `/profile/preferences`, `/profile/equipment`, `/profile/body`, `/profile/limitations`, `/profile/measurements`, `/profile/measurements/new` MUST exist as navigable pages. Stub pages with "Coming soon" content are acceptable for this feature.

**Layout & Responsiveness**

- **FR-040**: Desktop layout MUST use a two-column card grid with this arrangement: row 1 — Fitness Goal + Experience Level; row 2 — Workout Availability + Equipment Access; row 3 — Body Information + Physical Limitations; row 4 — Body Measurements (full width).
- **FR-041**: Mobile layout MUST stack all sections vertically in this order: header, goal, experience, availability, equipment, body info, limitations, measurements.
- **FR-042**: All interactive cards and actions MUST have visible focus states and be keyboard-accessible with minimum 44×44px tap targets on mobile.
- **FR-043**: Icon-only actions MUST have accessible labels.
- **FR-044**: Color MUST NOT be the only way to communicate status.
- **FR-045**: Page MUST have one clear `<h1>` page heading and `<h2>` section headings per card.

**i18n**

- **FR-046**: All user-visible copy (labels, empty state messages, CTAs, tier labels) MUST be added to the existing i18n system and rendered via `t()`.

### Key Entities

- **UserProfile** (auth metadata): name, avatar URL.
- **TrainingPreferences** (Supabase, new table): fitness goal (enum), experience level (enum), days per week, preferred session duration (minutes), preferred training days (list).
- **EquipmentAccess** (Supabase, new table): preset (enum), selected equipment items (list).
- **BodyInfo** (Supabase, new table): height value, height unit, weight value, weight unit.
- **PhysicalLimitation** (Supabase, new table): affected area label, description.
- **BodyMeasurementEntry** (Supabase, new table): date, weight, waist, chest, body fat percentage.
- **ProfileCompletion** (derived, client-side): 0–6 score, tier label string.

### Destination Route Map

| Section | CTA Action | Route |
|---------|------------|-------|
| Header | Edit personal info | `/profile/edit` |
| Fitness Goal | Edit / Choose goal | `/profile/preferences` |
| Experience Level | Edit / Set level | `/profile/preferences` |
| Workout Availability | Edit / Set availability | `/profile/preferences` |
| Equipment Access | Manage equipment | `/profile/equipment` |
| Body Information | Edit body info | `/profile/body` |
| Physical Limitations | Manage limitations | `/profile/limitations` |
| Body Measurements (primary) | View history | `/profile/measurements` |
| Body Measurements (secondary) | Add entry | `/profile/measurements/new` |

## Out of Scope

- Avatar upload or change flow
- Inline editing of any profile field
- Adding measurements directly on this page
- Managing equipment directly on this page
- Managing limitations directly on this page
- Progress charts or analytics
- Workout history stats or streaks
- Account management (sign-out, change password) — removed from this page entirely
- Full implementation of destination edit pages (stub routes are acceptable)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All eight profile sections render with real or empty-state content within 2 seconds on a standard connection (verified via browser DevTools).
- **SC-002**: Zero instances of `null`, `undefined`, raw enum values, or broken placeholders visible to users.
- **SC-003**: Every section's edit/manage action navigates to the correct route listed in the Destination Route Map.
- **SC-004**: Completion indicator shows correct tier label for a user with 0, 3, and 6 key fields filled.
- **SC-005**: Page has one `<h1>`, semantic `<h2>` per section, keyboard-accessible actions, visible focus states, and descriptive alt text on avatars.
- **SC-006**: Loading skeleton matches final page structure with no full-page spinner.
- **SC-007**: Error state with retry action appears when profile fetch fails.
- **SC-008**: Page layout is usable on 375px viewport with vertical stacking and no horizontal scroll.
- **SC-009**: Empty state CTA in each of the 7 data sections navigates to the correct destination route.
- **SC-010**: All new Supabase tables have RLS policies; a user cannot read another user's rows.
- **SC-011**: `npm run build` passes with zero TypeScript errors after implementation.

## Assumptions

- User must be authenticated to view `/profile`; unauthenticated access redirects to `/login` via existing middleware.
- `TrainingPreferences` is the single canonical source of truth for fitness goal and experience level. These are not duplicated in auth metadata.
- Preferred units (cm/in, kg/lb) are stored in `TrainingPreferences` alongside other user preferences.
- All user-visible copy follows the existing i18n pattern (`t()` via `useI18n`).
- Destination edit pages (`/profile/edit`, `/profile/preferences`, etc.) are stub pages for this feature; full implementation is a separate feature.
- The existing profile page implementation (`ProfileScreen`, `ProfileStats`, `SettingsSection`) is fully replaced by this feature. Account management (sign-out, change password) is removed from this page.
- The page uses the existing design system tokens (`card-elevated`, `gym-accent`, `gym-text`, `gym-muted`, etc.).
- Supabase migrations are included in this feature's scope; no fitness profile data exists in the database yet.
- Avatar upload remains out of scope; avatar URL comes from Supabase Auth metadata only (e.g., Google OAuth).
- Physical limitations language is intentionally non-medical; no clinical advice is implied or made.
