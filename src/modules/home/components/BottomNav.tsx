'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, History, User, BookOpen } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import type { LucideIcon } from 'lucide-react'

type NavTab = {
  href: string
  labelKey: 'navHome' | 'navWorkout' | 'navExercises' | 'history' | 'navProfile'
  Icon: LucideIcon
}

const NAV_TABS: NavTab[] = [
  { href: '/', labelKey: 'navHome', Icon: Home },
  { href: '/workout', labelKey: 'navWorkout', Icon: Dumbbell },
  { href: '/exercises', labelKey: 'navExercises', Icon: BookOpen },
  { href: '/history', labelKey: 'history', Icon: History },
  { href: '/profile', labelKey: 'navProfile', Icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 h-16 border-t border-gym-border bg-gym-surface"
    >
      <div className="flex h-full">
        {NAV_TABS.map(({ href, labelKey, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] text-xs transition-colors ${
                active ? 'text-gym-accent font-semibold' : 'text-gym-muted font-normal'
              }`}
              onClick={
                active
                  ? (e) => {
                      e.preventDefault()
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  : undefined
              }
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.5 : 1.5}
                aria-hidden="true"
              />
              <span>{t(labelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
