'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dumbbell, History } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/workout', icon: Dumbbell, label: 'Workout' },
  { href: '/history', icon: History, label: 'History' },
] as const

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  )
  const pathname = usePathname()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pb-16">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-gym-border bg-gym-surface">
          <div className="flex h-full">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] text-xs font-medium transition-colors ${
                    active ? 'text-gym-accent' : 'text-gym-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </QueryClientProvider>
  )
}
