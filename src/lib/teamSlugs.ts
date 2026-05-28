const SLUG_MAP: Record<string, string> = {
  '김슬옹': 'kim-seul-ong',
  '최홍식': 'choi-hong-sik',
  '이호영': 'lee-ho-young',
  '김진아': 'kim-jin-a',
  '이은상': 'lee-eun-sang',
  '이정민': 'lee-jeong-min',
  '이승수': 'lee-seung-su',
  '이호현': 'lee-ho-hyeon',
}

/** slug별 확장자 — 기본 jpg, png 등 개별 지정 가능 */
const PHOTO_EXT: Record<string, string> = {
  'lee-ho-young': 'png',
}

export function teamMemberSlug(name: string): string | null {
  const first = name.split(/[,\n]/)[0]?.trim()
  if (!first) return null
  return SLUG_MAP[first] ?? null
}

export function teamPhotoSrc(name: string): string | null {
  const slug = teamMemberSlug(name)
  if (!slug) return null
  const ext = PHOTO_EXT[slug] ?? 'jpg'
  return `/images/team/${slug}.${ext}`
}

export function teamInitials(name: string): string {
  const first = name.split(/[,\n]/)[0]?.trim() ?? name
  if (/^[A-Za-z]/.test(first)) {
    const parts = first.split(/\s+/)
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
  }
  return first.slice(0, 1)
}
