/** 모든 경로 공통 — 브레이킹 리스크 없는 기본 보안 헤더 */
const BASE_SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/**
 * CSP는 공개 페이지에만 적용. /admin, /studio(Sanity Studio)는 자체
 * 스크립트·워커 요구사항이 복잡해 검증 없이 씌우면 CMS가 깨질 위험이 있어 제외.
 */
const PUBLIC_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  /* connect-src에 blob: — 3D 훈민정음 책 모델(Three.js GLTFLoader)이 텍스처를
   * blob: URL로 fetch함. worker-src에도 blob: — Three.js/Draco 디코더가
   * blob 워커를 씀 */
  "connect-src 'self' blob:",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const PUBLIC_PAGE_SOURCES = ['/', '/consonants', '/vowels', '/hunminjeongeum', '/research']

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-sanity'],
  async headers() {
    return [
      { source: '/:path*', headers: BASE_SECURITY_HEADERS },
      ...PUBLIC_PAGE_SOURCES.map((source) => ({
        source,
        headers: [{ key: 'Content-Security-Policy', value: PUBLIC_CSP }],
      })),
    ]
  },
}

export default nextConfig
