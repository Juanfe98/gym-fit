import { createClient } from '@/lib/supabase/client'
import type {
  FitnessPreferences,
  EquipmentAccess,
  BodyInfo,
  PhysicalLimitation,
  BodyMeasurementEntry,
  FitnessGoal,
  ExperienceLevel,
  EquipmentPreset,
  HeightUnit,
  WeightUnit,
} from '../types'

type PreferencesRow = {
  user_id: string
  fitness_goal: string | null
  experience_level: string | null
  days_per_week: number | null
  session_duration_minutes: number | null
  preferred_days: string[]
  height_unit: string
  weight_unit: string
}

type EquipmentRow = {
  user_id: string
  preset: string | null
  equipment_items: string[]
}

type BodyInfoRow = {
  user_id: string
  height_cm: number | null
  weight_kg: number | null
}

type LimitationRow = {
  id: string
  user_id: string
  affected_area: string
  description: string | null
}

type MeasurementRow = {
  id: string
  user_id: string
  measured_at: string
  weight_kg: number | null
  waist_cm: number | null
  chest_cm: number | null
  body_fat_pct: number | null
}

export async function getPreferences(userId: string): Promise<FitnessPreferences | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_fitness_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const row = data as PreferencesRow
  return {
    userId: row.user_id,
    fitnessGoal: row.fitness_goal as FitnessGoal | null,
    experienceLevel: row.experience_level as ExperienceLevel | null,
    daysPerWeek: row.days_per_week,
    sessionDurationMinutes: row.session_duration_minutes,
    preferredDays: row.preferred_days,
    heightUnit: row.height_unit as HeightUnit,
    weightUnit: row.weight_unit as WeightUnit,
  }
}

export async function getEquipment(userId: string): Promise<EquipmentAccess | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_equipment')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const row = data as EquipmentRow
  return {
    userId: row.user_id,
    preset: row.preset as EquipmentPreset | null,
    equipmentItems: row.equipment_items,
  }
}

export async function getBodyInfo(userId: string): Promise<BodyInfo | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_body_info')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const row = data as BodyInfoRow
  return {
    userId: row.user_id,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
  }
}

export async function getLimitations(userId: string): Promise<PhysicalLimitation[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_limitations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at')
  if (error) throw error
  return ((data as LimitationRow[]) ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    affectedArea: row.affected_area,
    description: row.description,
  }))
}

export async function getLatestMeasurement(userId: string): Promise<BodyMeasurementEntry | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_body_measurements')
    .select('*')
    .eq('user_id', userId)
    .order('measured_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const row = data as MeasurementRow
  return {
    id: row.id,
    userId: row.user_id,
    measuredAt: row.measured_at,
    weightKg: row.weight_kg,
    waistCm: row.waist_cm,
    chestCm: row.chest_cm,
    bodyFatPct: row.body_fat_pct,
  }
}
