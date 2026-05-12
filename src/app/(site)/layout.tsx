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
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
    </LanguageProvider>
  )
}
