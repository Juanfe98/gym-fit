'use client'

import { Globe, Weight } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { languages, type Language } from '@/i18n/config'
import { useWeightUnitPreference } from '@/modules/workout-session/hooks/use-weight-unit-preference'
import type { WeightUnit } from '@/modules/workout-session/types'

/** Two-option segmented toggle used for both unit and language settings. */
function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  ariaLabel: string
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex rounded-lg bg-gym-surface p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`min-h-[36px] rounded-md px-3 text-xs font-semibold transition-colors ${
              active ? 'bg-gym-accent text-white' : 'text-gym-muted'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function SettingRow({
  Icon,
  label,
  children,
}: {
  Icon: typeof Globe
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 min-h-[44px]">
      <div className="flex items-center gap-3 text-gym-text">
        <Icon className="h-4 w-4 text-gym-muted" aria-hidden="true" />
        <span className="text-sm">{label}</span>
      </div>
      {children}
    </div>
  )
}

export function SettingsSection() {
  const { t, lang, setLang } = useI18n()
  const [unit, setUnit] = useWeightUnitPreference()

  return (
    <div className="card divide-y divide-gym-border-subtle">
      <SettingRow Icon={Weight} label={t('settingWeightUnit')}>
        <Segmented
          ariaLabel={t('settingWeightUnit')}
          value={unit}
          onChange={setUnit}
          options={[
            { value: 'kg' as WeightUnit, label: 'KG' },
            { value: 'lbs' as WeightUnit, label: 'LBS' },
          ]}
        />
      </SettingRow>
      <SettingRow Icon={Globe} label={t('settingLanguage')}>
        <Segmented
          ariaLabel={t('settingLanguage')}
          value={lang}
          onChange={(l: Language) => setLang(l)}
          options={languages.map((l) => ({ value: l, label: l.toUpperCase() }))}
        />
      </SettingRow>
    </div>
  )
}
