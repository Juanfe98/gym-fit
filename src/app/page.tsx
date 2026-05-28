'use client'

import { useI18n } from '@/i18n/client'

export default function Home() {
  const { t } = useI18n()

  return (
    <main>
      <h1>{t('appName')}</h1>
    </main>
  )
}
