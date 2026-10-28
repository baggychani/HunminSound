'use client'
import { usePathname } from 'next/navigation'
import { useOverridesStore, useOverridesStatus, refreshAdminOverrides } from '@/lib/overrides-store'

function LoadedContent({ children }: { children: React.ReactNode }) {
  useOverridesStore()
  const { ready, error } = useOverridesStatus()
  if (error || !ready) return <div className="mx-auto max-w-4xl px-6 py-16 font-sans text-sm text-ink-muted" role="status">
    <p>{error || '현재 내용을 불러오는 중…'}</p>
    {error && <button className="mt-3 underline" onClick={() => void refreshAdminOverrides()}>다시 불러오기</button>}
  </div>
  return <>{children}</>
}
export function AdminContentStatus({ children }: { children: React.ReactNode }) {
  return usePathname().startsWith('/admin/content/') ? <LoadedContent>{children}</LoadedContent> : <>{children}</>
}
