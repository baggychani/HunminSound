import type { Metadata } from 'next'
import { PrivacyPolicyBody } from '@/components/privacy/PrivacyPolicyBody'

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: '세종말소리 누리집의 개인정보 처리방침입니다.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: '/privacy' },
}

export default function PrivacyPage() {
  return <PrivacyPolicyBody />
}
