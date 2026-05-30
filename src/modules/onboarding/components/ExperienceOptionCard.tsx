import { CheckCircle2 } from 'lucide-react'
import type { ExperienceLevel } from '../types'

type ExperienceOptionCardProps = {
  id: ExperienceLevel
  label: string
  description: string
  examples: readonly string[]
  selected: boolean
  onSelect: (level: ExperienceLevel) => void
  disabled?: boolean
}

export function ExperienceOptionCard({
  id,
  label,
  description,
  examples,
  selected,
  onSelect,
  disabled = false,
}: ExperienceOptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={`focus-ring group flex h-full min-h-[244px] w-full flex-col rounded-3xl border p-5 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? 'border-orange-400 bg-orange-500/15 shadow-[0_0_0_1px_rgba(251,146,60,0.38),0_24px_70px_rgba(249,115,22,0.18)]'
          : 'border-gym-border bg-gym-surface-2/85 hover:border-gym-border-strong hover:bg-gym-surface-3'
      }`}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="min-w-0">
          <span className="block font-heading text-xl font-semibold uppercase tracking-wide text-gym-text">
            {label}
          </span>
          <span className="mt-2 block text-sm leading-6 text-gym-muted">
            {description}
          </span>
        </span>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
            selected
              ? 'border-orange-300 bg-orange-500 text-white'
              : 'border-gym-border bg-gym-surface text-gym-muted group-hover:text-orange-400'
          }`}
          aria-hidden="true"
        >
          <CheckCircle2 className="h-5 w-5" />
        </span>
      </span>

      <span className="my-5 h-px w-full bg-gym-border" aria-hidden="true" />

      <span className="flex flex-col gap-3">
        {examples.map((example) => (
          <span key={example} className="flex gap-3 text-sm leading-6 text-gym-muted">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
            <span>{example}</span>
          </span>
        ))}
      </span>
    </button>
  )
}
