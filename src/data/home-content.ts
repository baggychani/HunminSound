/** 홈 CMS 편집 대상 — 한국어 canonical 원문 */
export const HOME_KO_BASE = {
  homeSubtitle: '훈민정음 창제 원리의 과학적 재조명',
  homeIntro:
    '1443년 세종이 훈민정음(訓民正音)을 창제하며 제시한 상형 원리를,\n580여 년이 지난 오늘 MRI 영상·음성공학·AI 융합 기술로 실증합니다.',
  homeResearchTitle: 'MRI로 밝히는 훈민정음의 비밀',
  homeResearchDesc:
    '세종대왕은 580년 전, 인간의 발성 기관을 정밀하게 관찰하여 한글을 창제했습니다.\n현대의 3T MRI 기술과 AI 분석으로 그 놀라운 과학적 통찰을 실증합니다.',
  contactDesc:
    '한국어 음성학, MRI 음성 과학, 언어 유산 연구에 관심 있는 연구자·기관과의 협력을 환영합니다.',
} as const

export type HomeCmsFieldId = keyof typeof HOME_KO_BASE

export const HOME_CMS_FIELDS: {
  id: HomeCmsFieldId
  section: string
  label: string
}[] = [
  { id: 'homeSubtitle', section: '히어로', label: '부제' },
  { id: 'homeIntro', section: '히어로', label: '소개' },
  { id: 'homeResearchTitle', section: '연구 소개', label: '제목' },
  { id: 'homeResearchDesc', section: '연구 소개', label: '본문' },
  { id: 'contactDesc', section: '문의하기', label: '협력 안내' },
]

export function joinHomeLines(...parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join('\n')
}
