# ADR-008: Component & Interaction Standards

**Status:** Accepted  
**Date:** 2026-05-28  
**Deciders:** Engineering, Product

---

## Context

Workout tracking happens in real conditions — gym floor, sweaty hands, bad lighting. Every interaction must be instant, predictable, and forgiving. This ADR governs how components are built and how users interact with them.

---

## Touch & Tap Targets

**Minimum tap target: 44×44px.** Applied via `min-h-[44px] min-w-[44px]`.

This applies to ALL interactive elements without exception:
- Buttons
- Filter chips
- Row action buttons (edit, delete)
- Drag handles
- Navigation items
- Toggle switches

Visual size can be smaller — padding can absorb the required area. Example:

```tsx
// Badge chip: visually small, but touch-safe
<button className="flex min-h-[44px] items-center px-3 text-xs ...">
  Back
</button>
```

**Never use `h-8` or smaller for a tappable element unless it has additional padding to reach 44px.**

---

## Buttons

### Primary CTA
```tsx
<button className="h-12 w-full rounded-lg bg-orange-500 font-heading font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-40">
  Finish Workout
</button>
```

Rules:
- `h-12` (48px) for primary — exceeds 44px minimum, gives more visual weight
- `rounded-lg` (not `rounded-full`) — see ADR-005
- `uppercase` + `font-heading` (Barlow Condensed) on primary CTAs
- `disabled:opacity-40` — not `disabled:cursor-not-allowed` (too heavy)
- Always `transition-colors duration-150` — never instant color change

### Destructive
```tsx
<button className="h-12 w-full rounded-lg bg-red-500 ...">
  Discard Workout
</button>
```

Red background, not outline. Destructive actions must be visually unambiguous.

### Ghost / Secondary
```tsx
<button className="flex min-h-[44px] items-center rounded-lg border border-gym-border px-4 text-sm transition-colors duration-150 hover:border-gym-border-strong hover:bg-gym-surface-3">
  Cancel
</button>
```

### Icon button
```tsx
<button
  type="button"
  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gym-muted transition-colors duration-150 hover:bg-gym-surface-3 hover:text-gym-text"
  aria-label="Delete set"
>
  <Trash2 className="h-4 w-4" />
</button>
```

**All icon-only buttons require `aria-label`.**

---

## Form Inputs

```tsx
<input
  className="h-11 w-full rounded-lg border border-gym-border bg-gym-surface-3 px-3 text-sm transition-colors duration-150 focus:border-gym-border-strong focus:outline-none"
/>
```

Rules:
- `h-11` (44px) minimum height
- `bg-gym-surface-3` (highest elevation — visually distinct from card)
- `focus:border-gym-border-strong` — no colored glow, just stronger border
- `focus:outline-none` — custom focus, not browser default
- `inputmode` attribute always on numeric inputs:
  ```tsx
  <input type="number" inputMode="decimal" />  // weight
  <input type="number" inputMode="numeric" />  // reps, sets
  ```

---

## Cards & List Items

```tsx
<div className="rounded-lg border border-gym-border bg-gym-surface-2 p-4">
```

Rules:
- Cards always on `gym-surface-2` (one step above the page surface)
- Border `gym-border` (visible but subtle)
- `rounded-lg` (12px) — consistent radius
- No drop shadows (elevation via color, not shadow)
- Active/selected row: swap border to `gym-border-strong`, bg to `gym-surface-3`

---

## Animation & Motion

**Principle:** Instant feedback, no decorative animation. Motion serves function.

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Color change (hover/press) | 150ms | `ease-out` |
| Sheet / modal entrance | 250ms | `ease-out` |
| Toast appearance | 200ms | `ease-out` |
| Timer digit change | 0ms | instant (tabular-nums handles visual stability) |
| PR celebration | 300ms | `ease-out` |
| Skeleton loading | 1500ms | `ease-in-out` loop |

**Never animate:**
- Layout properties (width, height, padding) — use opacity/transform only
- The active workout set log form — must feel instant

**`@media (prefers-reduced-motion: reduce)`** is applied globally in `global.css`. All transitions will be effectively disabled for users who request it.

---

## Dialogs & Sheets

All confirmation dialogs use `CancelSessionDialog` (or an equivalent modal):
- Fixed overlay with `bg-black/60` backdrop
- Sheet-style: anchored to bottom on mobile (`items-end`)
- `rounded-t-2xl` on the sheet itself
- Confirm button: full-width, destructive red, `min-h-[44px]`
- Cancel button: full-width, ghost style
- Never auto-dismiss — user must explicitly choose

---

## Empty States

Every list/screen with async data must have an empty state:

```tsx
<div className="flex flex-col items-center gap-5 py-16 text-center">
  <SomeIcon className="h-10 w-10 text-gym-muted" />
  <div className="flex flex-col gap-1">
    <p className="font-semibold text-gym-text">Short action-oriented headline</p>
    <p className="text-sm text-gym-muted">One-line explanation or instruction</p>
  </div>
  <button className="h-11 rounded-lg bg-orange-500 px-6 ...">
    Primary action
  </button>
</div>
```

Rules:
- Lucide icon (not emoji) — `text-gym-muted`, `h-10 w-10`
- Two lines of text max
- One CTA max

---

## Loading States

| Context | Pattern |
|---------|---------|
| Full screen init | Centered spinner or skeleton |
| Button submit | `disabled + opacity-50` + text change ("Saving…") |
| List loading | Skeleton rows (3 placeholder items) |
| Inline data | Pulse animation on placeholder |

Never block the entire screen for partial data loads.

---

## Sync Status Bar

`SyncStatusBar` is the single source of truth for sync feedback. It appears at the top of the active workout screen. No other sync indicators are permitted during a session — it would create noise and anxiety.

---

## Z-Index Scale

```
10  — sticky headers, floating buttons
20  — tooltips, popovers
30  — drawers, side sheets
40  — bottom sheets, modals
50  — toast notifications
60  — full-screen overlays (ExercisePicker, dialogs)
```

Use these levels directly (`z-10`, `z-20`, etc.) — never arbitrary values.

---

## Consequences

- New components must follow button height/radius/transition conventions above
- `aria-label` is required on all icon-only interactive elements — CI lint rule recommended
- Z-index values outside the defined scale require a comment explaining why
- Skeleton loaders are required on any screen that fetches data before rendering
