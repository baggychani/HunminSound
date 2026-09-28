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
      {/* --symbol-detail-room: 자음·모음 상세를 열 때 끝쪽 줄도 헤더 아래까지 올릴 수 있게 잠깐 두는 여백(useScrollToSymbolDetail) */}
      <main className="min-h-screen" style={{ paddingBottom: 'var(--symbol-detail-room, 0px)' }}>
        {children}
      </main>
      <SiteFooter />
    </LanguageProvider>
  )
}
