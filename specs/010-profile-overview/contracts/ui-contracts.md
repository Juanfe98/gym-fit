# UI Contracts: User Profile Overview Page

This document defines the component prop interfaces and data contracts for the profile overview module. No external API is introduced — all data flows through Supabase via TanStack Query.

---

## Page Entry Point

### `src/app/(app)/profile/page.tsx`

Server Component. Reads auth session, passes `userId`, `displayName`, `avatarUrl` to the client screen.

```ts
// Props injected into ProfileOverviewScreen from the Server Component
type ProfilePageProps = {
  userId: string
  displayName: string      // from auth.user_metadata.full_name ?? email prefix ?? 'User'
  avatarUrl: string | null // from auth.user_metadata.avatar_url
}
```

---

## Main Screen

### `ProfileOverviewScreen`

`"use client"` component. Owns `useProfileOverview` hook. Routes to skeleton, error, or content.

```ts
type ProfileOverviewScreenProps = {
  userId: string
  displayName: string
  avatarUrl: string | null
}
```

---

## Shared Components

### `SectionCard`

Card shell only — rounded border + `<h2>` title. No action slot. Each section renders its own action(s) internally to avoid a union type that would break dual-action sections like `MeasurementsSection`.

```ts
type SectionCardProps = {
  title: string
  children: React.ReactNode
}
```

### `ProfileError`

```ts
type ProfileErrorProps = {
  onRetry: () => void   // receives refetch from useProfileOverview
}
```

`ProfileOverviewScreen` wires this as: `<ProfileError onRetry={refetch} />`

---

## Section Components

All section components receive pre-resolved data (never raw TQ results). They are pure presentational.

### `ProfileHeader`

```ts
type ProfileHeaderProps = {
  displayName: string
  avatarUrl: string | null
  fitnessGoal: FitnessGoal | null       // from preferences
  experienceLevel: ExperienceLevel | null
  completion: ProfileCompletion
}
```

### `GoalSection`

```ts
type GoalSectionProps = {
  goal: FitnessGoal | null
}
```

### `ExperienceLevelSection`

```ts
type ExperienceLevelSectionProps = {
  level: ExperienceLevel | null
}
```

### `AvailabilitySection`

```ts
type AvailabilitySectionProps = {
  daysPerWeek: number | null
  sessionDurationMinutes: number | null
  preferredDays: string[]   // e.g. ['mon', 'tue', 'sat']
}
```

### `EquipmentSection`

```ts
type EquipmentSectionProps = {
  preset: EquipmentPreset | null
  equipmentItems: string[]
}
```

### `BodyInfoSection`

```ts
type BodyInfoSectionProps = {
  heightCm: number | null
  weightKg: number | null
  heightUnit: HeightUnit    // for display conversion
  weightUnit: WeightUnit
}
```

### `LimitationsSection`

```ts
type LimitationsSectionProps = {
  limitations: PhysicalLimitation[]
}
```

### `MeasurementsSection`

```ts
type MeasurementsSectionProps = {
  latestMeasurement: BodyMeasurementEntry | null
  weightUnit: WeightUnit   // for display conversion
}
```

---

## Hooks

### `use-profile-overview.ts` — `useProfileOverview(userId: string)`

Fires 5 parallel TanStack Query reads. Returns:

```ts
type UseProfileOverviewResult = {
  isLoading: boolean
  isError: boolean
  data: ProfileOverviewData | null
  refetch: () => void
}
```

### `useProfileCompletion(data: ProfileOverviewData | null, displayName: string)`

Pure derived value from `data`. Returns:

```ts
type UseProfileCompletionResult = ProfileCompletion
// { score: 0-6, tier: ProfileCompletionTier }
```

---

## Service Functions (`src/modules/profile/services/profile-service.ts`)

```ts
getPreferences(userId: string): Promise<FitnessPreferences | null>
getEquipment(userId: string): Promise<EquipmentAccess | null>
getBodyInfo(userId: string): Promise<BodyInfo | null>
getLimitations(userId: string): Promise<PhysicalLimitation[]>
getLatestMeasurement(userId: string): Promise<BodyMeasurementEntry | null>
```

---

## TanStack Query Keys

```ts
['profile', 'preferences', userId]
['profile', 'equipment', userId]
['profile', 'body-info', userId]
['profile', 'limitations', userId]
['profile', 'measurements', userId]
```

Downstream edit pages MUST invalidate the matching key after a successful write.
