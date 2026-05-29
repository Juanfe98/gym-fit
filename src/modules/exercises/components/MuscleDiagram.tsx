'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/i18n/client'
import { FrontBodySvg } from '@/assets/muscle-diagrams/FrontBodySvg'
import { BackBodySvg } from '@/assets/muscle-diagrams/BackBodySvg'
import { getMuscleId } from '@/services/muscle-map'

interface MuscleDiagramProps {
  primaryMuscle: string
  secondaryMuscles: string[]
}

export function MuscleDiagram({ primaryMuscle, secondaryMuscles }: MuscleDiagramProps) {
  const { t } = useI18n()
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const primaryId = getMuscleId(primaryMuscle)
    const secondaryIds = new Set(
      secondaryMuscles.map((m) => getMuscleId(m)).filter((id): id is string => !!id),
    )

    for (const ref of [frontRef, backRef]) {
      if (!ref.current) continue
      ref.current.querySelectorAll<SVGElement>('[data-muscle]').forEach((el) => {
        const muscleId = el.dataset.muscle
        if (muscleId === primaryId) {
          el.style.fill = 'var(--color-gym-accent)'
          el.style.opacity = '0.9'
        } else if (secondaryIds.has(muscleId!)) {
          el.style.fill = 'var(--color-gym-accent)'
          el.style.opacity = '0.4'
        } else {
          el.style.fill = ''
          el.style.opacity = ''
        }
      })
    }
  }, [primaryMuscle, secondaryMuscles])

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex justify-center gap-4"
        aria-label={t('musclesDiagram')}
        role="img"
      >
        <div ref={frontRef} className="w-1/2 max-w-[140px]">
          <FrontBodySvg />
        </div>
        <div ref={backRef} className="w-1/2 max-w-[140px]">
          <BackBodySvg />
        </div>
      </div>
      <div className="flex justify-center gap-4 text-xs text-gym-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gym-accent" aria-hidden="true" />
          {t('musclePrimaryLegend')}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full bg-gym-accent opacity-40"
            aria-hidden="true"
          />
          {t('muscleSecondaryLegend')}
        </span>
      </div>
    </div>
  )
}
