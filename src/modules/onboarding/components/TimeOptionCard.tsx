import type { WorkoutDurationMinutes } from '../types'

type TimeOptionCardProps = {
  minutes: WorkoutDurationMinutes
  label: string
  selected: boolean
  onSelect: (minutes: WorkoutDurationMinutes) => void
  disabled?: boolean
}

export function TimeOptionCard({
  minutes,
  label,
  selected,
  onSelect,
  disabled = false,
}: TimeOptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(minutes)}
      className={`focus-ring flex min-h-[72px] w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? 'border-orange-400 bg-orange-500/15 shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_18px_50px_rgba(249,115,22,0.16)]'
          : 'border-gym-border bg-gym-surface-2/85 hover:border-gym-border-strong hover:bg-gym-surface-3'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-heading text-sm font-bold ${
          selected
            ? 'border-orange-300 bg-orange-500 text-white'
            : 'border-gym-border bg-gym-surface text-gym-muted'
        }`}
        aria-hidden="true"
      >
        {minutes}
      </span>
      <span className="font-heading text-base font-semibold uppercase tracking-wide text-gym-text">
        {label}
      </span>
    </button>
  )
}
