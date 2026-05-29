'use client'

import { useI18n } from '@/i18n/client'
import type { CoachingData } from '@/modules/exercises/types'

interface CoachingContentProps {
  coaching: CoachingData
}

export function CoachingContent({ coaching }: CoachingContentProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-sm font-semibold text-gym-text mb-2">{t('whyIncluded')}</h2>
        <p className="text-sm text-gym-muted leading-relaxed">{coaching.rationale}</p>
      </section>
      <section>
        <h2 className="text-sm font-semibold text-gym-text mb-2">{t('formCues')}</h2>
        <ol className="flex flex-col gap-1 list-decimal list-inside text-sm text-gym-muted leading-relaxed">
          {coaching.formCues.map((cue, i) => (
            <li key={i}>{cue}</li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="text-sm font-semibold text-gym-text mb-2">{t('commonMistakesLabel')}</h2>
        <ul className="flex flex-col gap-1 list-disc list-inside text-sm text-gym-muted leading-relaxed">
          {coaching.commonMistakes.map((mistake, i) => (
            <li key={i}>{mistake}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
