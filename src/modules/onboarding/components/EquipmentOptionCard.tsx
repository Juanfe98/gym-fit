import type { EquipmentItem } from '../types'

type EquipmentOptionCardProps = {
  item: EquipmentItem
  label: string
  selected: boolean
  onToggle: (item: EquipmentItem) => void
  disabled?: boolean
}

export function EquipmentOptionCard({
  item,
  label,
  selected,
  onToggle,
  disabled = false,
}: EquipmentOptionCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onToggle(item)}
      className={`focus-ring flex min-h-[72px] w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? 'border-orange-400 bg-orange-500/15 shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_18px_50px_rgba(249,115,22,0.16)]'
          : 'border-gym-border bg-gym-surface-2/85 hover:border-gym-border-strong hover:bg-gym-surface-3'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
          selected
            ? 'border-orange-400 bg-orange-500'
            : 'border-gym-border bg-gym-surface'
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
