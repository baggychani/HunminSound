import { Header } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <Header />
      {/* --symbol-detail-room 은 더 이상 채우지 않는다. 남아 있으면 0으로 둔다. */}
      <main className="min-h-screen" style={{ paddingBottom: 'var(--symbol-detail-room, 0px)' }}>
        {children}
      </main>
      <SiteFooter />
    </LanguageProvider>
  )
}
