export function formatSessionName(session: {
  startedAt: string
  sourcePlanId: string | null
  sourcePlanName?: string | null
  sourceDayName?: string | null
}): string {
  if (session.sourcePlanName) {
    return `${session.sourcePlanName} — ${session.sourceDayName}`
  }
  if (session.sourcePlanId) return 'Workout'
  const date = new Date(session.startedAt)
  const formatted = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date)
  return `Workout — ${formatted}`
}
