'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { SectionCard } from './SectionCard'
import { EQUIPMENT_PRESET_KEYS } from '../utils/format-enums'
import type { EquipmentPreset } from '../types'

type EquipmentSectionProps = {
  preset: EquipmentPreset | null
  equipmentItems: string[]
}

export function EquipmentSection({ preset, equipmentItems }: EquipmentSectionProps) {
  const { t } = useI18n()
  const hasData = preset !== null || equipmentItems.length > 0

  return (
    <SectionCard title={t('profileEquipmentTitle')}>
      {hasData ? (
        <div className="flex flex-col gap-2">
          {preset && (
            <p className="text-base font-semibold text-gym-text">
              {t(EQUIPMENT_PRESET_KEYS[preset] as keyof typeof import('@/i18n/ui').UI.en)}
            </p>
          )}
          {equipmentItems.length > 0 && (
            <p className="text-sm text-gym-muted">
              {equipmentItems.slice(0, 3).join(', ')}
              {equipmentItems.length > 3 && (
                <span> {t('equipmentMore', { count: equipmentItems.length - 3 })}</span>
              )}
            </p>
          )}
          <Link
            href="/profile/equipment"
            className="mt-1 self-start min-h-[44px] flex items-center text-sm text-gym-accent active:opacity-70"
          >
            {t('profileEditPersonalInfo')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gym-text">{t('profileEquipmentEmptyTitle')}</p>
          <p className="text-sm text-gym-muted">{t('profileEquipmentEmptyBody')}</p>
          <Link
            href="/profile/equipment"
            className="mt-1 self-start min-h-[44px] flex items-center rounded-lg bg-gym-accent px-3 text-sm font-semibold text-white active:opacity-80"
          >
            {t('profileEquipmentEmptyCta')}
          </Link>
        </div>
      )}
    </SectionCard>
  )
}
