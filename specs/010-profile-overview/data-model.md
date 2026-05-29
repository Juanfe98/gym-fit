# Data Model: User Profile Overview Page

## New Supabase Tables (migration: `006_user_fitness_profile.sql`)

### `user_fitness_preferences`

One row per user. Canonical source for goal, experience level, workout availability, and preferred display units.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | `UUID` | NO | PK, `gen_random_uuid()` |
| `user_id` | `UUID` | NO | FK → `auth.users`, UNIQUE, CASCADE DELETE |
| `fitness_goal` | `TEXT` | YES | Enum: `build_muscle`, `lose_fat`, `increase_strength`, `improve_endurance`, `general_fitness`, `body_recomposition` |
| `experience_level` | `TEXT` | YES | Enum: `beginner`, `intermediate`, `advanced` |
| `days_per_week` | `INT` | YES | 1–7 |
| `session_duration_minutes` | `INT` | YES | e.g. 45, 60, 90 |
| `preferred_days` | `TEXT[]` | NO | Default `'{}'`. Values: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun` |
| `height_unit` | `TEXT` | NO | Default `'cm'`. Enum: `cm`, `in` |
| `weight_unit` | `TEXT` | NO | Default `'kg'`. Enum: `kg`, `lb` |
| `created_at` | `TIMESTAMPTZ` | NO | Default `now()` |
| `updated_at` | `TIMESTAMPTZ` | NO | Default `now()` |

**RLS**: `auth.uid() = user_id` (ALL operations)

---

### `user_equipment`

One row per user. Stores equipment preset and selected item list.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | `UUID` | NO | PK |
| `user_id` | `UUID` | NO | FK → `auth.users`, UNIQUE, CASCADE DELETE |
| `preset` | `TEXT` | YES | Enum: `full_gym`, `home_gym`, `bodyweight`, `custom` |
| `equipment_items` | `TEXT[]` | NO | Default `'{}'`. Human-readable names |
| `created_at` | `TIMESTAMPTZ` | NO | Default `now()` |
| `updated_at` | `TIMESTAMPTZ` | NO | Default `now()` |

**RLS**: `auth.uid() = user_id` (ALL operations)

---

### `user_body_info`

One row per user. All values stored in metric; display conversion done on client using `preferred_units`.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | `UUID` | NO | PK |
| `user_id` | `UUID` | NO | FK → `auth.users`, UNIQUE, CASCADE DELETE |
| `height_cm` | `NUMERIC(6,2)` | YES | Stored in cm always |
| `weight_kg` | `NUMERIC(6,2)` | YES | Stored in kg always |
| `created_at` | `TIMESTAMPTZ` | NO | Default `now()` |
| `updated_at` | `TIMESTAMPTZ` | NO | Default `now()` |

**RLS**: `auth.uid() = user_id` (ALL operations)

---

### `user_limitations`

One row per limitation. Multiple rows per user allowed.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | `UUID` | NO | PK |
| `user_id` | `UUID` | NO | FK → `auth.users`, CASCADE DELETE |
| `affected_area` | `TEXT` | NO | Free text, e.g. "Shoulder", "Lower back" |
| `description` | `TEXT` | YES | Optional detail |
| `created_at` | `TIMESTAMPTZ` | NO | Default `now()` |

**RLS**: `auth.uid() = user_id` (ALL operations)

---

### `user_body_measurements`

One row per measurement entry. Multiple rows per user allowed.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | `UUID` | NO | PK |
| `user_id` | `UUID` | NO | FK → `auth.users`, CASCADE DELETE |
| `measured_at` | `DATE` | NO | Default `CURRENT_DATE` |
| `weight_kg` | `NUMERIC(6,2)` | YES | Stored in kg |
| `waist_cm` | `NUMERIC(6,2)` | YES | Stored in cm |
| `chest_cm` | `NUMERIC(6,2)` | YES | Stored in cm |
| `body_fat_pct` | `NUMERIC(5,2)` | YES | e.g. 18.5 |
| `created_at` | `TIMESTAMPTZ` | NO | Default `now()` |

**RLS**: `auth.uid() = user_id` (ALL operations)

---

## TypeScript Types (`src/modules/profile/types/index.ts`)

```ts
export type FitnessGoal =
  | 'build_muscle'
  | 'lose_fat'
  | 'increase_strength'
  | 'improve_endurance'
  | 'general_fitness'
  | 'body_recomposition'

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type EquipmentPreset = 'full_gym' | 'home_gym' | 'bodyweight' | 'custom'
export type HeightUnit = 'cm' | 'in'
export type WeightUnit = 'kg' | 'lb'
export type ProfileCompletionTier = 'getting_started' | 'almost_ready' | 'profile_ready'

export type FitnessPreferences = {
  userId: string
  fitnessGoal: FitnessGoal | null
  experienceLevel: ExperienceLevel | null
  daysPerWeek: number | null
  sessionDurationMinutes: number | null
  preferredDays: string[]
  heightUnit: HeightUnit
  weightUnit: WeightUnit
}

export type EquipmentAccess = {
  userId: string
  preset: EquipmentPreset | null
  equipmentItems: string[]
}

export type BodyInfo = {
  userId: string
  heightCm: number | null
  weightKg: number | null
}

export type PhysicalLimitation = {
  id: string
  userId: string
  affectedArea: string
  description: string | null
}

export type BodyMeasurementEntry = {
  id: string
  userId: string
  measuredAt: string
  weightKg: number | null
  waistCm: number | null
  chestCm: number | null
  bodyFatPct: number | null
}

export type ProfileOverviewData = {
  displayName: string
  avatarUrl: string | null
  preferences: FitnessPreferences | null
  equipment: EquipmentAccess | null
  bodyInfo: BodyInfo | null
  limitations: PhysicalLimitation[]
  latestMeasurement: BodyMeasurementEntry | null
}

export type ProfileCompletion = {
  score: number     // 0–6
  tier: ProfileCompletionTier
}
```

---

## Read Operations

| Data | Service Function | Pattern | TQ Query Key |
|------|-----------------|---------|--------------|
| Fitness preferences | `getPreferences(userId)` | `.maybeSingle()` | `['profile', 'preferences', userId]` |
| Equipment access | `getEquipment(userId)` | `.maybeSingle()` | `['profile', 'equipment', userId]` |
| Body info | `getBodyInfo(userId)` | `.maybeSingle()` | `['profile', 'body-info', userId]` |
| Limitations list | `getLimitations(userId)` | `.select('*')` | `['profile', 'limitations', userId]` |
| Latest measurement | `getLatestMeasurement(userId)` | `.order('measured_at', desc).limit(1).maybeSingle()` | `['profile', 'measurements', userId]` |

All 5 queries fired in parallel via `useQueries`.

---

## Write Operations (not in this feature — defined here for downstream planning)

All 5 tables use upsert for single-row tables or insert for multi-row tables:

| Table | Write Pattern | Used By |
|-------|--------------|---------|
| `user_fitness_preferences` | `.upsert({ user_id }, { onConflict: 'user_id' })` | `/profile/preferences` page (future) |
| `user_equipment` | `.upsert({ user_id }, { onConflict: 'user_id' })` | `/profile/equipment` page (future) |
| `user_body_info` | `.upsert({ user_id }, { onConflict: 'user_id' })` | `/profile/body` page (future) |
| `user_limitations` | `.insert(...)` / `.delete()` | `/profile/limitations` page (future) |
| `user_body_measurements` | `.insert(...)` | `/profile/measurements/new` page (future) |

---

## Completion Scoring

| Field | Condition | Source |
|-------|-----------|--------|
| Name | `displayName !== '' && displayName !== 'User'` | Auth metadata |
| Fitness goal | `preferences.fitnessGoal != null` | `user_fitness_preferences` |
| Experience level | `preferences.experienceLevel != null` | `user_fitness_preferences` |
| Workout availability | `preferences.daysPerWeek != null` | `user_fitness_preferences` |
| Equipment access | `equipment.equipmentItems.length > 0` | `user_equipment` |
| Preferred units | `preferences != null` (units have DB defaults) | `user_fitness_preferences` |

Score 0–6 → tiers: `getting_started` (0), `almost_ready` (1–4), `profile_ready` (5–6)
