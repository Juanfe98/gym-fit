'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { EquipmentOptionCard } from './EquipmentOptionCard'
import { OnboardingActions } from './OnboardingActions'
import { saveEquipment } from '../services/onboarding-state'
import { EQUIPMENT_OPTIONS, type EquipmentItem } from '../types'

type EquipmentSelectionFormProps = {
  initialItems: EquipmentItem[]
}

export function EquipmentSelectionForm({ initialItems }: EquipmentSelectionFormProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [selectedItems, setSelectedItems] = useState<EquipmentItem[]>(initialItems)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleItem(item: EquipmentItem) {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
    setError(null)
  }

  async function continueOnboarding() {
    if (!selectedItems.length || isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      await saveEquipment(selectedItems)
      router.push('/onboarding/body-info')
      router.refresh()
    } catch {
      setError(t('onboardingEquipmentSaveError'))
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
        aria-label={t('onboardingEquipmentOptionsAria')}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {EQUIPMENT_OPTIONS.map(({ id, labelKey }) => (
          <EquipmentOptionCard
            key={id}
            item={id}
            label={t(labelKey)}
            selected={selectedItems.includes(id)}
            onToggle={toggleItem}
            disabled={isSaving}
          />
        ))}
      </div>

      <OnboardingActions
        canContinue={selectedItems.length > 0}
        isSaving={isSaving}
        onContinue={continueOnboarding}
        backHref="/onboarding/time"
      />
    </div>
  )
}
