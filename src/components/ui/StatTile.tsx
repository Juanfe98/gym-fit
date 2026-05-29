import type { LucideIcon } from 'lucide-react'

interface StatTileProps {
  label: string
  value: string | number
  /** Small unit suffix rendered after the value (e.g. "kg", "m"). */
  unit?: string
  Icon?: LucideIcon
  /** Tailwind text-color class for the value + icon accent. */
  accentClass?: string
  className?: string
}

/**
 * Compact metric card. Big tabular number in the Barlow Condensed `.metric`
 * style, muted label below. Used for weekly summaries and profile stats.
 */
export function StatTile({
  label,
  value,
  unit,
  Icon,
  accentClass = 'text-gym-text',
  className,
}: StatTileProps) {
  return (
    <div
      className={`card flex flex-col gap-1 p-3 ${className ?? ''}`}
    >
      <div className="flex items-center gap-1.5 text-gym-muted">
        {Icon && <Icon className={`h-3.5 w-3.5 ${accentClass}`} aria-hidden="true" />}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`metric text-2xl ${accentClass}`}>{value}</span>
        {unit && <span className="text-xs font-medium text-gym-muted">{unit}</span>}
      </div>
    </div>
  )
}
