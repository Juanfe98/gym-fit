# Feature Specification: Auth Completion

**Feature Branch**: `006-auth-completion`
**Created**: 2026-05-28
**Status**: Ready
**Input**: Complete the authentication module — sign up, forgot password, reset password, email verification, and session expired screens to close the full auth loop.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — New User Sign Up (Priority: P1)

A new user arrives at the app and needs to create an account before they can start tracking workouts. They enter their name, email, and a password, accept the terms of service, and are guided into the onboarding flow.

**Why this priority**: Without sign-up, no new users can access the app. Every other feature is unreachable until this flow works. It is the entry point for the entire product.

**Independent Test**: Open the app unauthenticated → tap "Sign up" on the login screen → fill in name, email, valid password, accept terms → submit → verify redirect to `/onboarding` (stub). Repeat with mismatched passwords, missing terms, and weak password to verify field-level errors appear.

**Acceptance Scenarios**:

1. **Given** a user on the Sign Up screen, **When** they fill in name, valid email, password ≥8 chars with at least one number, matching confirm password, and check the terms checkbox, **Then** submitting creates their account and redirects them to `/onboarding`.
2. **Given** a user on the Sign Up screen, **When** they submit without checking the terms checkbox, **Then** the terms field shows an error and the form does not submit.
3. **Given** a user on the Sign Up screen, **When** the password and confirm password fields do not match, **Then** the confirm password field shows a "Passwords do not match" error.
4. **Given** a user on the Sign Up screen, **When** the password is fewer than 8 characters or has no number, **Then** the password field shows a descriptive error explaining the requirements.
5. **Given** a user on the Sign Up screen, **When** they submit an email already registered, **Then** a safe generic error is shown without revealing whether the email exists.
6. **Given** a user on the Sign Up screen, **When** any required field is empty, **Then** that field shows a validation error and the Sign Up button remains in its loading-prevented state.
7. **Given** the Sign Up screen, **When** email confirmation is enabled in Supabase, **Then** the user is redirected to the Verify Email screen instead of `/onboarding`.
8. **Given** the Sign Up screen, **When** viewed at 375px viewport width, **Then** the form renders without horizontal scroll or overflow.

---

### User Story 2 — Forgot Password Flow (Priority: P2)

A returning user cannot remember their password. They use the "Forgot password?" link from the login screen, enter their email, and receive a reset link. The app shows a success confirmation regardless of whether the email exists to prevent user enumeration.

**Why this priority**: Password recovery is critical for retention. Without it, users who forget their password are permanently locked out. It must be present before any public-facing launch.

**Independent Test**: On the login screen, tap "Forgot password?" → enter an email → submit → verify a success confirmation message appears (not a redirect). Try submitting an invalid email format → verify field-level error. Verify submitting a non-existent email still shows the success message (no enumeration).

**Acceptance Scenarios**:

1. **Given** a user on the Forgot Password screen, **When** they enter a valid email format and submit, **Then** the Supabase password reset email is triggered and a success confirmation message is shown in place of the form.
2. **Given** a user on the Forgot Password screen, **When** they submit a non-existent email, **Then** the same success confirmation message is shown — the response never reveals whether the email exists.
3. **Given** a user on the Forgot Password screen, **When** they submit an invalid email format, **Then** the email field shows a validation error.
4. **Given** a user on the Forgot Password screen, **When** the screen is viewed at 375px, **Then** it renders correctly without overflow.
5. **Given** the success confirmation state, **When** the user taps "Back to sign in", **Then** they are navigated to the login screen.

---

### User Story 3 — Reset Password (Priority: P2)

A user clicks the password reset link from their email. The link contains a Supabase PKCE token in the URL. The user is shown a form to enter and confirm their new password. On success they are redirected to the login screen.

**Why this priority**: Directly coupled to the Forgot Password flow — without this screen, the reset email is useless and users remain locked out.

**Independent Test**: Trigger a password reset email → click the link → land on `/reset-password` → enter a new valid password with matching confirm → submit → verify redirect to `/login`. Enter mismatched passwords → verify field-level error. Use an expired or invalid token URL → verify a user-friendly error is shown.

**Acceptance Scenarios**:

1. **Given** a user who landed on the Reset Password screen via a valid Supabase reset link, **When** they enter a new password meeting requirements and a matching confirm, **Then** the password is updated and they are redirected to `/login`.
2. **Given** a user on the Reset Password screen, **When** the new password and confirm do not match, **Then** the confirm field shows an error.
3. **Given** a user on the Reset Password screen, **When** the password does not meet requirements (< 8 chars or no number), **Then** the password field shows a descriptive error.
4. **Given** a user who arrives via an expired or invalid reset link, **When** the page loads, **Then** a user-friendly error message is shown with a link back to Forgot Password.
5. **Given** the Reset Password screen at 375px, **When** the page renders, **Then** there is no horizontal scroll or overflow.

---

### User Story 4 — Email Verification Screen (Priority: P3)

After sign-up, if Supabase requires email confirmation, the user is redirected to an informational screen telling them to check their inbox before they can proceed.

**Why this priority**: Informational only — no form logic. Needed when email confirmation is on, but the app still works without it if confirmation is disabled.

**Independent Test**: Complete sign-up while email confirmation is enabled → verify redirect to `/verify-email` → verify the screen displays a generic "check your inbox" message (no email address shown) → verify a "Resend email" button is available.

**Acceptance Scenarios**:

1. **Given** a user who just signed up with email confirmation required, **When** they are redirected to the Verify Email screen, **Then** they see a message explaining they need to confirm their email before continuing.
2. **Given** the Verify Email screen, **When** the user taps "Resend email", **Then** the confirmation email is resent and a confirmation message is shown.
3. **Given** the Verify Email screen, **When** viewed at 375px, **Then** it renders correctly.

---

### User Story 5 — Session Expired Screen (Priority: P3)

A user's session expires while they are using the app (token expired, revoked session). When the app detects an expired session on any authenticated page, the user is redirected to a clear "session expired" screen rather than a blank page or confusing error.

**Why this priority**: Edge case UX. Improves the experience for long-idle users but is not on the critical launch path.

**Independent Test**: Manually expire a session (clear auth cookies/tokens) → trigger any authenticated action → verify redirect to `/session-expired` → verify the screen shows a helpful message and a "Sign in again" link → tap the link → verify redirect to `/login`.

**Acceptance Scenarios**:

1. **Given** a user whose session has expired, **When** they are redirected to the Session Expired screen, **Then** they see a clear message explaining their session is no longer active.
2. **Given** the Session Expired screen, **When** the user taps "Sign in again", **Then** they are navigated to the login screen.
3. **Given** the Session Expired screen at 375px, **When** it renders, **Then** there is no overflow.

---

### Edge Cases

- What happens when the reset link URL token is malformed or missing?
- What happens when sign-up succeeds but the redirect to `/onboarding` fails (network issue)?
- What happens when the user opens the reset password URL after the token has already been used?
- What happens when the Supabase `resetPasswordForEmail` call itself fails (network error)?
- What happens if a user tries to access `/reset-password` directly without a token in the URL?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Sign Up screen at `/signup` under the `(auth)` route group with fields: name, email, password, confirm password, terms acceptance checkbox.
- **FR-002**: System MUST validate the Sign Up form client-side: email format, password ≥ 8 characters and contains at least one number, passwords match, terms accepted.
- **FR-003**: System MUST show field-level validation errors on Sign Up without submitting to the server.
- **FR-004**: System MUST show a safe, generic error message when sign-up fails due to a server-side error (no leaking of "email already exists" details).
- **FR-005**: System MUST redirect to `/onboarding` after successful sign-up when email confirmation is disabled, or to `/verify-email` when email confirmation is enabled.
- **FR-006**: System MUST provide a Forgot Password screen at `/forgot-password` with a single email input.
- **FR-007**: System MUST always show the same success confirmation after Forgot Password submission regardless of whether the email exists in the system (prevents user enumeration).
- **FR-008**: System MUST provide a Reset Password screen at `/reset-password` that reads the Supabase PKCE token from the URL and renders a new-password + confirm form.
- **FR-009**: System MUST redirect to `/login` after a successful password reset.
- **FR-010**: System MUST show a user-friendly error on the Reset Password screen when the URL token is invalid, expired, or missing.
- **FR-011**: System MUST provide a Verify Email screen at `/verify-email` with a "Resend email" action.
- **FR-012**: System MUST provide a Session Expired screen at `/session-expired` with a link back to `/login`.
- **FR-013**: The login screen MUST include a "Forgot password?" link navigating to `/forgot-password` and a "Sign up" link navigating to `/signup`.
- **FR-014**: All new screens MUST be under `src/app/(auth)/` route group (no authenticated shell — no BottomNav or AppShell).
- **FR-015**: All user-facing strings MUST be added to `src/i18n/ui.ts` in both `en` and `es` blocks.
- **FR-016**: All forms MUST validate client-side before any server call, with errors shown per-field without a page reload.
- **FR-017**: Forms MUST prevent duplicate submission — a second submit while a request is in-flight MUST be ignored.
- **FR-018**: No new dependencies may be added to implement this feature — all required capabilities are available in existing project libraries.
- **FR-019**: All interactive elements (submit buttons, links, checkboxes) MUST have a minimum 44×44px tap target.
- **FR-020**: All form inputs MUST have accessible labels; inline error messages MUST be announced to screen readers (e.g., via `role="alert"` or equivalent live region).
- **FR-021**: Submit buttons MUST display a loading indicator and be disabled during async operations to prevent duplicate submission.

### Key Entities

- **AuthError**: Server response when auth operation fails — must be translated to generic user-facing messages. Never expose raw Supabase error messages to the user.
- **SignUpPayload**: `{ name: string; email: string; password: string; confirmPassword: string; termsAccepted: boolean }` — validated by Zod schema before submission.
- **ResetPasswordPayload**: `{ password: string; confirmPassword: string }` + PKCE token from URL — validated by Zod schema.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete the sign-up flow (form fill → account created → redirect) in under 90 seconds on a standard mobile connection.
- **SC-002**: All form validation errors appear inline within the relevant fields, without a page reload or full-form error banner.
- **SC-003**: The Forgot Password success confirmation appears regardless of whether the email exists — zero user enumeration leakage.
- **SC-004**: All five screens (Sign Up, Forgot Password, Reset Password, Verify Email, Session Expired) render at 375px width without horizontal overflow or content clipping.
- **SC-005**: Every new user-facing string exists in both English and Spanish translation files before any screen is rendered.
- **SC-006**: The login screen surfaces "Forgot password?" and "Sign up" links, making auth recovery and account creation discoverable without external navigation.

---

## Out of Scope

- OAuth providers (Google, Apple) — future spec
- Two-factor authentication / MFA
- Rate limiting or CAPTCHA on auth forms
- Email address change flow
- Account deletion from the auth level
- Magic link / passwordless sign-in
- Session management UI (active devices, revoke sessions)

---

## Assumptions

- Supabase is already configured for this project and handles email delivery for password reset and verification emails.
- The `/onboarding` route does not yet exist — a redirect there after sign-up will land on a 404 during development. This is acceptable; the route will be built in spec 010.
- Email confirmation may be disabled in the Supabase project settings for local development. The spec covers both cases (email confirmation on and off).
- The existing login page at `src/app/(auth)/login/page.tsx` will be updated to add "Forgot password?" and "Sign up" links — no full rewrite needed.
- React Hook Form and Zod are already installed as project dependencies (confirmed in specs 003–005).
- Password requirements (≥ 8 chars, at least one number) are the minimum — Supabase may enforce stricter rules server-side; client validation should match or exceed Supabase's configured policy.
- No OAuth providers (Google, Apple) in this spec — email/password only.
- The module barrel `src/modules/auth/index.ts` is new — no existing auth module exists.
