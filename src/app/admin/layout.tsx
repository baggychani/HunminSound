import { AdminTopBar } from '@/components/admin/AdminTopBar'

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sanityProjectIdConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim())

  return (
    <div className="relative flex min-h-screen flex-col bg-hanji text-ink">
      <AdminTopBar sanityProjectIdConfigured={sanityProjectIdConfigured} />
      <main className="flex min-h-0 w-full flex-1 flex-col">{children}</main>
    </div>
  )
}
