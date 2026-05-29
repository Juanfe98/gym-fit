/** "1h 5m" for longer sessions, "45m" otherwise. */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

/** Compact number: 12500 → "12.5k", 980 → "980". */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export type RelativeDay =
  | { key: 'timeAgoToday' }
  | { key: 'timeAgoYesterday' }
  | { key: 'timeAgoDays'; count: number }

/** Relative day bucket for "Today / Yesterday / Nd ago" rendering via i18n. */
export function relativeDay(iso: string): RelativeDay {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((start(new Date()) - start(new Date(iso))) / 86_400_000)
  if (diffDays <= 0) return { key: 'timeAgoToday' }
  if (diffDays === 1) return { key: 'timeAgoYesterday' }
  return { key: 'timeAgoDays', count: diffDays }
}
