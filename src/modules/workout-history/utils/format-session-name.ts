export function formatSessionName(session: {
  startedAt: string
  sourcePlanId: string | null
}): string {
  if (session.sourcePlanId) return 'Workout'
  const date = new Date(session.startedAt)
  const formatted = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date)
  return `Workout — ${formatted}`
}
