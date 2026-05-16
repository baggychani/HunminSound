'use client'

import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AdminFooter() {
  return (
    <footer className="border-t border-hanji-border mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-x-4">
          <span className="shrink-0 text-center font-serif text-sm text-ink-muted sm:justify-self-start sm:text-start">
            세종말소리 · Sejong Speech Sounds
          </span>
          <div className="flex shrink-0 justify-center sm:justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
