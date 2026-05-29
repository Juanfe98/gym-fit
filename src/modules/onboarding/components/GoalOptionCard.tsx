import { CheckCircle2 } from 'lucide-react'
import type { MainGoal } from '../types'

type GoalOptionCardProps = {
  id: MainGoal
  label: string
  description: string
  selected: boolean
  onSelect: (goal: MainGoal) => void
  disabled?: boolean
}

export function GoalOptionCard({
  id,
  label,
  description,
  selected,
  onSelect,
  disabled = false,
}: GoalOptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={`focus-ring group flex min-h-[104px] w-full items-start gap-4 rounded-2xl border p-4 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? 'border-orange-400 bg-orange-500/15 shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_18px_50px_rgba(249,115,22,0.16)]'
          : 'border-gym-border bg-gym-surface-2/85 hover:border-gym-border-strong hover:bg-gym-surface-3'
      }`}
    >
      <span
        className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
          selected
            ? 'border-orange-300 bg-orange-500 text-white'
            : 'border-gym-border bg-gym-surface text-gym-muted group-hover:text-orange-400'
        }`}
        aria-hidden="true"
      >
        <CheckCircle2 className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-lg font-semibold uppercase tracking-wide text-gym-text">
          {label}
        </span>
        <span className="mt-1 block text-sm leading-6 text-gym-muted">
          {description}
        </span>
      </span>
    </button>
  )
}
