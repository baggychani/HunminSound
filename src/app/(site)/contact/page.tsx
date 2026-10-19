import type { Metadata } from 'next'
import { HomeContactSection } from '@/components/home/HomeContactSection'

export const metadata: Metadata = {
  title: '문의하기',
  description: '세종말소리 연구 협력과 문의 메시지를 보냅니다.',
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact' },
}

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { form?: string }
}) {
  const formOnly = searchParams?.form === '1'
  return (
    <div className={`site-container page-shell ${formOnly ? 'py-6 sm:py-16' : 'py-10 sm:py-16'}`}>
      <HomeContactSection formOnly={formOnly} />
    </div>
  )
}
