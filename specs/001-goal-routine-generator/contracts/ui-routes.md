# UI Routes Contract

**Feature**: Goal-Based Routine Generator
**Date**: 2026-05-26

All routes are statically generated at build time (`output: 'static'`).

---

## Routes

### GET /

**Page**: Homepage — Goal Selector

**Renders**: Four goal cards (Muscle Gain, Strength, Fat Loss, Conditioning)

**Behavior**:
- Each card navigates to `/routine/{goal}` on click/tap
- No query params, no state
- No authentication gate (FR6)

**Static params**: None — always rendered

---

### GET /routine/[goal]

**Page**: Routine Page

**Valid values for `[goal]`**: `muscle-gain`, `strength`, `fat-loss`, `conditioning`

**Renders**: Full weekly plan for the selected goal
- Routine rationale (2–4 sentences)
- Ordered list of training days, each with:
  - Day label and muscle focus
  - 5 exercises, each linking to `/exercise/[id]`

**Behavior**:
- Invalid `[goal]` value → 404
- Back navigation from exercise card restores scroll position (native browser behavior)

**Static params**: Generated from `ROUTINES` keys at build time

---

### GET /exercise/[id]

**Page**: Exercise Card

**Valid values for `[id]`**: ExerciseDB numeric string ID (e.g., `"0001"`)

**Renders**: Full exercise card including:
- Animated GIF (`gifUrl` as `<img src>` — loads from ExerciseDB CDN at runtime)
- Front/back muscle diagram with primary + secondary highlights
- Form cues
- Common mistakes
- Goal-specific rationale

**Behavior**:
- GIF fails to load → visible static fallback (alt text + placeholder) displayed;
  all text content remains visible (FR4)
- Back button returns user to referring routine page with scroll restored

**Static params**: Generated from all `exerciseDbId` values across all routines at build time

---

## 404 Handling

Astro default 404 page. No custom 404 needed for MVP.

---

## No Authentication Routes

No login, signup, or protected routes exist anywhere in the app (FR6).
