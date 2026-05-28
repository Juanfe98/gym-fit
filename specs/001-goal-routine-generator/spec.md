# Spec: Goal-Based Routine Generator

**Feature directory**: `specs/001-goal-routine-generator`
**Status**: Ready for planning
**Created**: 2026-05-26

---

## Overview

Gym Planner is a web application that gives intermediate-to-advanced gym-goers a complete, science-backed weekly workout routine based on their training goal. Each exercise in the routine includes a visual demonstration, muscle targeting information, form guidance, and a rationale explaining why it was selected for that specific goal.

The app requires no account creation, no login, and stores no user data. It functions as an always-available reference tool that users can consult before or during a gym session.

---

## Problem Being Solved

Experienced gym-goers often lack structured programming despite knowing how to perform individual exercises. Personal trainers are unreliable or inaccessible, and existing resources (YouTube, forums, generic apps) either lack structure or don't explain the reasoning behind exercise selection. This leads to ineffective sessions, plateaus, and frustration.

---

## Target Users

- **Primary**: Intermediate-to-advanced gym-goers (1–4+ years of training experience)
- **Context of use**: Before training sessions (to plan the day) and during sessions (to reference form and technique on a mobile device)
- **Assumption**: Users train in a fully-equipped gym with barbells, dumbbells, cables, and machines

---

## User Scenarios

### Scenario 1 — First-time visitor selects a goal

1. User lands on the homepage
2. User sees four goal options: Muscle Gain, Strength, Fat Loss, Conditioning
3. User selects one goal
4. User is taken to a routine page showing the full weekly plan
5. User reads the plan rationale explaining why this split was chosen for their goal

**Expected outcome**: User understands the structure of their weekly routine and why it suits their goal.

### Scenario 2 — User explores an exercise during a session

1. User is on the routine page for their goal
2. User taps an exercise name on their mobile device
3. User sees the exercise card: animated movement demonstration, muscle diagram, form cues, common mistakes, and goal-specific rationale
4. User navigates back to the routine without losing their scroll position

**Expected outcome**: User understands how to perform the exercise correctly and why it's in their plan.

### Scenario 3 — User returns for a later session

1. User opens the app mid-week during a subsequent training session
2. User lands on the homepage and re-selects their goal
3. User navigates to the relevant training day and reviews exercises

**Expected outcome**: Return visit is as fast and frictionless as the first visit.

### Scenario 4 — Exercise media fails to load

1. User opens an exercise card
2. The animated demonstration fails to load (network issue or service unavailability)
3. The card still displays all text content: muscle information, form cues, common mistakes, rationale

**Expected outcome**: User can still use the card as a reference without the visual demonstration.

---

## Functional Requirements

### FR1 — Goal Selection

- The homepage presents exactly four selectable goals: Muscle Gain, Strength, Fat Loss, Conditioning
- Only one goal can be selected at a time
- Selecting a goal navigates the user to the corresponding routine page immediately, without a confirmation step

### FR2 — Weekly Routine Display

- Each goal maps to a distinct preset weekly routine
- Each routine displays: training days in order, primary muscle group(s) per day, and a list of 5 exercises per day
- Each routine page includes a 2–4 sentence rationale explaining the split structure and why it suits the selected goal

### FR3 — Exercise Card

- Tapping or clicking any exercise name opens an exercise card
- The exercise card contains:
  - Animated looping movement demonstration (autoplays, no tap-to-play required)
  - Front and back body diagram with primary muscles highlighted in one color and secondary muscles in a distinct second color
  - Form cues written at an intermediate-to-advanced level (not beginner basics)
  - Between 2 and 4 common mistakes
  - A goal-specific rationale (not a generic description) explaining why this exercise is in this particular plan
- Navigating back from the card returns the user to their scroll position on the routine page

### FR4 — Graceful Degradation

- If the animated demonstration fails to load, a visible fallback (static image or placeholder) is shown
- All text content on the exercise card remains visible and usable regardless of media load status

### FR5 — Mobile Usability

- The app is fully usable one-handed in portrait orientation on devices with a viewport of 375px or wider
- All interactive elements meet a minimum tap target size suitable for thumb use
- Body text is readable without zooming

### FR6 — No Authentication

- No sign-up, login, or account creation prompt appears anywhere in the app
- No feature is gated behind authentication

---

## Success Criteria

1. A user can select a goal and reach their full weekly routine in under 10 seconds from the homepage
2. A user can open an exercise card and identify the primary muscles targeted without reading more than the diagram
3. Users return to the app across multiple sessions without being prompted to create an account
4. The app remains fully functional on a mobile device in a gym environment (single-hand use, portrait orientation)
5. Exercise cards remain usable (all text content visible) even when the animated demonstration fails to load

---

## Key Entities

### Goal
A training objective selected by the user. One of: Muscle Gain, Strength, Fat Loss, Conditioning.

### Routine
A complete weekly training plan associated with a specific goal. Contains an ordered list of training days, each with a muscle group focus and 5 exercises.

### Training Day
A single day within a routine. Has a label (e.g., "Day 1 — Push"), a primary muscle group focus, and an ordered list of exercises.

### Exercise
A movement within a training day. Has a name, a goal-specific rationale, form cues, a list of common mistakes, and associations to primary and secondary muscle groups.

### Exercise Card
The detailed view of a single exercise. Combines the exercise's static content (form cues, mistakes, rationale) with dynamically loaded media (animated demonstration, muscle diagram).

---

## Assumptions

- All routines assume access to a fully-equipped gym (barbells, dumbbells, cable machines, resistance machines). Home or bodyweight variants are out of scope.
- Exercise content (form cues, rationale, common mistakes) is authored manually and curated for intermediate-to-advanced users — not auto-generated.
- Animated movement demonstrations and muscle group data are sourced from an external media service at runtime. The routine structure itself does not depend on this service.
- The app has no server-side logic beyond static asset delivery — there is no backend, database, or user data storage.
- Analytics, if added, will use a lightweight third-party service and will not require user consent flows for the MVP (no PII collected).

---

## Out of Scope

- Workout logging or session tracking
- Custom routine builder or exercise substitution
- Periodization (progressive overload across weeks)
- User accounts, profiles, or personalization
- Social or sharing features
- Nutrition guidance
- Home workouts or bodyweight-only variants
- Video production or custom exercise demonstration content
- AI-generated recommendations or chat interface
- Paid features or subscription tiers
