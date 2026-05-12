'use client'

import dynamic from 'next/dynamic'

// NextStudio와 sanity.config 모두 클라이언트에서만 동적 로드 (ssr: false)
// → 서버 번들에서 Sanity의 React.createContext 호출을 완전히 분리
const NextStudio = dynamic(
  async () => {
    const [{ NextStudio: Studio }, configModule] = await Promise.all([
      import('next-sanity/studio'),
      import('../../../../../sanity/sanity.config'),
    ])
    const WrappedStudio = () => <Studio config={configModule.default} />
    return WrappedStudio
  },
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDFDF9',
          fontFamily: 'serif',
          color: '#1C1917',
        }}
      >
        세종말소리 관리자 로딩 중…
      </div>
    ),
  },
)

export default function StudioClient() {
  return <NextStudio />
}
