# ADR-007: Color Token System

**Status:** Accepted  
**Date:** 2026-05-28  
**Deciders:** Engineering

---

## Context

The app needs a color system that:
- Is expressive enough to feel designed, not generated
- Prevents hardcoded hex values in components
- Makes dark-mode maintenance trivial (it's dark-only for V1)
- Supports semantic meaning (accent = action, gold = PR, red = danger)

---

## Decision

### Palette Philosophy

**Hue:** Cool blue-black (not neutral gray, not pure black). HSL ~215° bias through the surface stack.  
**Accent:** Brand orange `#F7521E` — more red-shifted than standard web orange, aggressive, athletic.  
**PR color:** Gold `#EAB308` — reserved exclusively for personal records.  
**Status colors:** Standard success/warning/danger; never used decoratively.

---

### Token Reference

All tokens live in `src/styles/global.css` under `@theme`. Always use token names in components — never hardcoded hex.

#### Surfaces

| Token | Value | Use |
|-------|-------|-----|
| `gym-bg` | `#07111F` | Page background |
| `gym-surface` | `#0F1C2E` | Panels, sheets, bottom nav |
| `gym-surface-2` | `#152438` | Cards, list rows |
| `gym-surface-3` | `#1C2F48` | Inputs, selected items |

#### Borders

| Token | Value | Use |
|-------|-------|-----|
| `gym-border-subtle` | `#152035` | Dividers, section separators |
| `gym-border` | `#1E3350` | Card/input borders |
| `gym-border-strong` | `#2A4670` | Focus rings, selected borders |

#### Text

| Token | Value | Use |
|-------|-------|-----|
| `gym-text` | `#EDF2FA` | Primary text |
| `gym-muted` | `#7384A0` | Secondary labels, metadata |
| `gym-disabled` | `#384D68` | Disabled states |

#### Accent

| Token | Value | Use |
|-------|-------|-----|
| `orange-500` | `#F7521E` | CTAs, active states, active exercise |
| `orange-400` | `#FF7445` | Muted accent text (e.g. "+ Add Set") |
| `orange-600` | `#D84410` | Hover/pressed CTA |
| `gym-accent-subtle` | `#F7521E1F` | Subtle orange background (12% opacity) |

#### Status & Special

| Token | Value | Use |
|-------|-------|-----|
| `gym-pr` | `#EAB308` | PR badges, PR celebrations |
| `success` / `sync-ok` | `#10B981` | Sync success, completion |
| `warning` / `sync-pending` | `#F59E0B` | Sync pending, warnings |
| `danger` / `sync-failed` | `#EF4444` | Errors, destructive actions |

---

### Usage Rules

**1. Semantic first**  
Always use semantic tokens. Never `bg-[#152438]` — always `bg-gym-surface-2`.

**2. Orange is for action only**  
`orange-500` / `gym-accent` is used for:
- Primary CTA buttons
- Active state indicators (selected exercise, current set)
- PR celebration moments
- Active filter chips

Never use orange for:
- Decorative borders
- Background fills (except `gym-accent-subtle` for very subtle highlights)
- Text that is not interactive or an active state

**3. Gold is for PRs only**  
`gym-pr` (`#EAB308`) is exclusively for personal record indicators. Using gold anywhere else trains users to misread it as a PR.

**4. Red is for danger only**  
`color-danger` is for destructive actions, errors, failed sync. Not for "warning" or "attention" states — that's amber/warning.

**5. Muted text minimum**  
`gym-disabled` (`#384D68`) is the minimum for any visible text — do not go below this. `gym-muted` is the standard secondary text. Check contrast: `gym-muted` on `gym-surface-2` achieves ~3.5:1; acceptable for non-essential metadata. Essential text must use `gym-text`.

---

### Contrast Reference

| Text | Background | Ratio | Use |
|------|-----------|-------|-----|
| `gym-text` on `gym-bg` | ~12:1 | ✅ Body text |
| `gym-text` on `gym-surface-2` | ~10:1 | ✅ Card text |
| `gym-muted` on `gym-surface-2` | ~3.8:1 | ⚠️ Non-essential labels only |
| `gym-muted` on `gym-bg` | ~4.5:1 | ✅ Secondary text |
| `white` on `orange-500` | ~4.8:1 | ✅ CTA buttons |

---

## Consequences

- No hardcoded hex or Tailwind palette classes in components (exception: one-off values with comment explaining why)
- The orange override in `@theme` means Tailwind `orange-500` resolves to `#F7521E` — not Tailwind's default
- Adding a new semantic color requires updating this ADR and `global.css`
- Light mode is out of scope for V1; tokens are dark-only
