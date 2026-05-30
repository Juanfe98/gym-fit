'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { OnboardingActions } from './OnboardingActions'
import { saveLimitations } from '../services/onboarding-state'
import { BODY_AREA_OPTIONS, type BodyArea } from '../types'

const NO_LIMITATIONS_ID = 'no_limitations'

type LimitationsSelectionFormProps = {
  initialAreas: BodyArea[]
  initialNotes: string
}

export function LimitationsSelectionForm({ initialAreas, initialNotes }: LimitationsSelectionFormProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [selectedAreas, setSelectedAreas] = useState<BodyArea[]>(initialAreas)
  const [noLimitations, setNoLimitations] = useState(initialAreas.length === 0 && initialNotes === '' ? false : initialAreas.length === 0)
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleArea(area: BodyArea) {
    setNoLimitations(false)
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
    setError(null)
  }

  function toggleNoLimitations() {
    setNoLimitations((prev) => {
      const next = !prev
      if (next) setSelectedAreas([])
      return next
    })
    setError(null)
  }

  async function continueOnboarding() {
    if (isSaving) return
    setIsSaving(true)
    setError(null)
    try {
      await saveLimitations(noLimitations ? [] : selectedAreas, notes)
      router.push('/onboarding/summary')
      router.refresh()
    } catch {
      setError(t('onboardingLimitationsSaveError'))
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div
        role="group"
        aria-label={t('onboardingLimitationsAreasAria')}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {BODY_AREA_OPTIONS.map(({ id, labelKey }) => {
          const isSelected = selectedAreas.includes(id)
          return (
            <AreaChip
              key={id}
              id={id}
              label={t(labelKey)}
              selected={isSelected}
              onToggle={() => toggleArea(id)}
              disabled={isSaving}
            />
          )
        })}

        <AreaChip
          id={NO_LIMITATIONS_ID}
          label={t('onboardingLimitationsNoLimitations')}
          selected={noLimitations}
          onToggle={toggleNoLimitations}
          disabled={isSaving}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="limitations-notes"
          className="font-heading text-sm font-semibold uppercase tracking-wide text-gym-muted"
        >
          {t('onboardingLimitationsNotesLabel')}{' '}
          <span className="font-normal normal-case text-gym-muted/60">{t('onboardingLimitationsNotesOptional')}</span>
        </label>
        <textarea
          id="limitations-notes"
          rows={3}
          placeholder={t('onboardingLimitationsNotesPlaceholder')}
          value={notes}
          disabled={isSaving}
          onChange={(e) => setNotes(e.target.value)}
          className="focus-ring w-full resize-none rounded-2xl border border-gym-border bg-gym-surface-2/85 px-5 py-4 font-heading text-base text-gym-text placeholder:text-gym-muted/40 transition duration-150 hover:border-gym-border-strong disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-3">
        <OnboardingActions
          canContinue={true}
          isSaving={isSaving}
          onContinue={continueOnboarding}
          backHref="/onboarding/body-info"
        />
        <div className="flex justify-center">
          <Link
            href="/onboarding/summary"
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

type AreaChipProps = {
  id: string
  label: string
  selected: boolean
  onToggle: () => void
  disabled: boolean
}

function AreaChip({ id, label, selected, onToggle, disabled }: AreaChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`focus-ring flex min-h-[72px] w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? 'border-orange-400 bg-orange-500/15 shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_18px_50px_rgba(249,115,22,0.16)]'
          : 'border-gym-border bg-gym-surface-2/85 hover:border-gym-border-strong hover:bg-gym-surface-3'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
          selected ? 'border-orange-400 bg-orange-500' : 'border-gym-border bg-gym-surface'
        }`}
        aria-hidden="true"
      >
        {selected && (
          <svg
            className="h-3 w-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="font-heading text-base font-semibold uppercase tracking-wide text-gym-text">
        {label}
      </span>
    </button>
  )
}
