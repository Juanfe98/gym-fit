'use client'

import { Lightbulb, ListChecks, AlertTriangle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import type { CoachingData } from '@/modules/exercises/types'

function CoachingCard({
  Icon,
  title,
  accentClass,
  children,
}: {
  Icon: LucideIcon
  title: string
  accentClass: string
  children: React.ReactNode
}) {
  return (
    <section className="card flex flex-col gap-2 p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gym-text">
        <Icon className={`h-4 w-4 ${accentClass}`} aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  )
}

export function CoachingContent({ coaching }: { coaching: CoachingData }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-3">
      <CoachingCard Icon={Lightbulb} title={t('whyIncluded')} accentClass="text-gym-pr">
        <p className="text-sm leading-relaxed text-gym-muted">{coaching.rationale}</p>
      </CoachingCard>

      <CoachingCard Icon={ListChecks} title={t('formCues')} accentClass="text-success">
        <ol className="flex list-inside list-decimal flex-col gap-1 text-sm leading-relaxed text-gym-muted">
          {coaching.formCues.map((cue, i) => (
            <li key={i}>{cue}</li>
          ))}
        </ol>
      </CoachingCard>

      <CoachingCard
        Icon={AlertTriangle}
        title={t('commonMistakesLabel')}
        accentClass="text-danger"
      >
        <ul className="flex list-inside list-disc flex-col gap-1 text-sm leading-relaxed text-gym-muted">
          {coaching.commonMistakes.map((mistake, i) => (
            <li key={i}>{mistake}</li>
          ))}
        </ul>
      </CoachingCard>
    </div>
  )
}
