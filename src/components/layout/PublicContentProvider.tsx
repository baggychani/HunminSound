'use client'
import { PublicContentContext } from '@/hooks/useSiteMessages'
import type { OverridesStore } from '@/lib/i18n-overrides'
export function PublicContentProvider({ store, children }: { store: OverridesStore; children: React.ReactNode }) {
  return <PublicContentContext.Provider value={store}>{children}</PublicContentContext.Provider>
}
