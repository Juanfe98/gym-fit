'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { OnboardingActions } from './OnboardingActions'
import { saveBodyInfo } from '../services/onboarding-state'

type HeightUnit = 'cm' | 'in'
type WeightUnit = 'kg' | 'lb'

type BodyInfoFormProps = {
  initialAge: number | null
  initialHeightCm: number | null
  initialWeightKg: number | null
  initialHeightUnit: HeightUnit
  initialWeightUnit: WeightUnit
}

function toCm(value: number, unit: HeightUnit): number {
  return unit === 'in' ? Math.round(value * 2.54 * 10) / 10 : value
}

function toKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? Math.round(value * 0.453592 * 10) / 10 : value
}

function fromCm(cm: number, unit: HeightUnit): number {
  return unit === 'in' ? Math.round((cm / 2.54) * 10) / 10 : cm
}

function fromKg(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? Math.round((kg / 0.453592) * 10) / 10 : kg
}

type UnitToggleProps = {
  options: { value: string; label: string }[]
  selected: string
  onChange: (value: string) => void
  disabled: boolean
}

function UnitToggle({ options, selected, onChange, disabled }: UnitToggleProps) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-gym-border" role="group">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(value)}
          className={`flex-1 px-3 py-1.5 font-heading text-sm font-semibold uppercase tracking-wide transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
            selected === value
              ? 'bg-orange-500 text-white'
              : 'bg-gym-surface text-gym-muted hover:bg-gym-surface-3 hover:text-gym-text'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function BodyInfoForm({
  initialAge,
  initialHeightCm,
  initialWeightKg,
  initialHeightUnit,
  initialWeightUnit,
}: BodyInfoFormProps) {
  const router = useRouter()
  const { t } = useI18n()

  const [heightUnit, setHeightUnit] = useState<HeightUnit>(initialHeightUnit)
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(initialWeightUnit)

  const [ageRaw, setAgeRaw] = useState(initialAge !== null ? String(initialAge) : '')
  const [heightRaw, setHeightRaw] = useState(
    initialHeightCm !== null ? String(fromCm(initialHeightCm, initialHeightUnit)) : ''
  )
  const [weightRaw, setWeightRaw] = useState(
    initialWeightKg !== null ? String(fromKg(initialWeightKg, initialWeightUnit)) : ''
  )

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ age?: string; height?: string; weight?: string }>({})

  function handleHeightUnitChange(unit: string) {
    const next = unit as HeightUnit
    if (heightRaw) {
      const currentVal = parseFloat(heightRaw)
      if (!isNaN(currentVal)) {
        const cm = toCm(currentVal, heightUnit)
        setHeightRaw(String(fromCm(cm, next)))
      }
    }
    setHeightUnit(next)
  }

  function handleWeightUnitChange(unit: string) {
    const next = unit as WeightUnit
    if (weightRaw) {
      const currentVal = parseFloat(weightRaw)
      if (!isNaN(currentVal)) {
        const kg = toKg(currentVal, weightUnit)
        setWeightRaw(String(fromKg(kg, next)))
      }
    }
    setWeightUnit(next)
  }

  function validate(): boolean {
    const errors: typeof fieldErrors = {}

    const age = ageRaw ? parseFloat(ageRaw) : undefined
    const height = heightRaw ? parseFloat(heightRaw) : undefined
    const weight = weightRaw ? parseFloat(weightRaw) : undefined

    if (age !== undefined && (isNaN(age) || age <= 0)) errors.age = t('onboardingBodyInfoAgeError')
    if (height !== undefined && (isNaN(height) || height <= 0)) errors.height = t('onboardingBodyInfoHeightError')
    if (weight !== undefined && (isNaN(weight) || weight <= 0)) errors.weight = t('onboardingBodyInfoWeightError')

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function continueOnboarding() {
    if (isSaving) return
    if (!validate()) return

    const age = ageRaw ? parseFloat(ageRaw) : undefined
    const height = heightRaw ? parseFloat(heightRaw) : undefined
    const weight = weightRaw ? parseFloat(weightRaw) : undefined

    const hasValues = age !== undefined || height !== undefined || weight !== undefined

    setIsSaving(true)
    setError(null)

    try {
      if (hasValues) {
        await saveBodyInfo({
          age,
          heightCm: height !== undefined ? toCm(height, heightUnit) : undefined,
          weightKg: weight !== undefined ? toKg(weight, weightUnit) : undefined,
          heightUnit,
          weightUnit,
        })
      }
      router.push('/onboarding/limitations')
      router.refresh()
    } catch {
      setError(t('onboardingBodyInfoSaveError'))
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Age */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="body-info-age"
            className="font-heading text-sm font-semibold uppercase tracking-wide text-gym-muted"
          >
            {t('onboardingBodyInfoAge')}
          </label>
          <input
            id="body-info-age"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="e.g. 28"
            value={ageRaw}
            disabled={isSaving}
            onChange={(e) => {
              setAgeRaw(e.target.value)
              if (fieldErrors.age) setFieldErrors((prev) => ({ ...prev, age: undefined }))
            }}
            className="focus-ring h-14 w-full rounded-2xl border border-gym-border bg-gym-surface-2/85 px-5 font-heading text-lg font-semibold text-gym-text placeholder:text-gym-muted/40 transition duration-150 hover:border-gym-border-strong disabled:cursor-not-allowed disabled:opacity-60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {fieldErrors.age && (
            <p role="alert" className="text-sm text-danger">{fieldErrors.age}</p>
          )}
        </div>

        {/* Height */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="body-info-height"
              className="font-heading text-sm font-semibold uppercase tracking-wide text-gym-muted"
            >
              {t('onboardingBodyInfoHeight')}
            </label>
            <UnitToggle
              options={[
                { value: 'cm', label: 'cm' },
                { value: 'in', label: 'ft/in' },
              ]}
              selected={heightUnit}
              onChange={handleHeightUnitChange}
              disabled={isSaving}
            />
          </div>
          <input
            id="body-info-height"
            type="number"
            inputMode="decimal"
            min={1}
            placeholder={heightUnit === 'cm' ? 'e.g. 175' : 'e.g. 69'}
            value={heightRaw}
            disabled={isSaving}
            onChange={(e) => {
              setHeightRaw(e.target.value)
              if (fieldErrors.height) setFieldErrors((prev) => ({ ...prev, height: undefined }))
            }}
            className="focus-ring h-14 w-full rounded-2xl border border-gym-border bg-gym-surface-2/85 px-5 font-heading text-lg font-semibold text-gym-text placeholder:text-gym-muted/40 transition duration-150 hover:border-gym-border-strong disabled:cursor-not-allowed disabled:opacity-60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {fieldErrors.height && (
            <p role="alert" className="text-sm text-danger">{fieldErrors.height}</p>
          )}
        </div>

        {/* Weight */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="body-info-weight"
              className="font-heading text-sm font-semibold uppercase tracking-wide text-gym-muted"
            >
              {t('onboardingBodyInfoWeight')}
            </label>
            <UnitToggle
              options={[
                { value: 'kg', label: 'kg' },
                { value: 'lb', label: 'lb' },
              ]}
              selected={weightUnit}
              onChange={handleWeightUnitChange}
              disabled={isSaving}
            />
          </div>
          <input
            id="body-info-weight"
            type="number"
            inputMode="decimal"
            min={1}
            placeholder={weightUnit === 'kg' ? 'e.g. 75' : 'e.g. 165'}
            value={weightRaw}
            disabled={isSaving}
            onChange={(e) => {
              setWeightRaw(e.target.value)
              if (fieldErrors.weight) setFieldErrors((prev) => ({ ...prev, weight: undefined }))
            }}
            className="focus-ring h-14 w-full rounded-2xl border border-gym-border bg-gym-surface-2/85 px-5 font-heading text-lg font-semibold text-gym-text placeholder:text-gym-muted/40 transition duration-150 hover:border-gym-border-strong disabled:cursor-not-allowed disabled:opacity-60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {fieldErrors.weight && (
            <p role="alert" className="text-sm text-danger">{fieldErrors.weight}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <OnboardingActions
          canContinue={true}
          isSaving={isSaving}
          onContinue={continueOnboarding}
          backHref="/onboarding/equipment"
        />
        <div className="flex justify-center">
          <Link
            href="/onboarding/limitations"
            aria-disabled={isSaving}
            onClick={(e) => { if (isSaving) e.preventDefault() }}
            className="font-heading text-sm font-semibold uppercase tracking-wide text-gym-muted transition-colors duration-150 hover:text-gym-text aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            {t('onboardingSkipForNow')}
          </Link>
        </div>
      </div>
    </div>
  )
}
