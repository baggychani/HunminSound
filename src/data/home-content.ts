import { homeText } from '@/data/home-text'

const koText = (id: string) => homeText(id, 'ko')

/** 홈 CMS 편집 대상 — 한국어 원문은 src/data/text/home.json */
export const HOME_KO_BASE = {
  homeSubtitle: koText('homeSubtitle'),
  homeIntro: koText('homeIntro'),
  homeResearchTitle: koText('homeResearchTitle'),
  homeResearchDesc: koText('homeResearchDesc'),
  contactDesc: koText('contactDesc'),
  consonantsCardDesc: koText('consonantsCardDesc'),
  vowelsCardDesc: koText('vowelsCardDesc'),
  hunminjeongeumCardDesc: koText('hunminjeongeumCardDesc'),
}

export type HomeCmsFieldId = keyof typeof HOME_KO_BASE

export const HOME_CMS_FIELDS: {
  id: HomeCmsFieldId
  section: string
  label: string
}[] = [
  { id: 'homeSubtitle', section: '히어로', label: '부제' },
  { id: 'homeIntro', section: '히어로', label: '소개' },
  { id: 'consonantsCardDesc', section: '자음 · 모음 · 훈민정음', label: '자음' },
  { id: 'vowelsCardDesc', section: '자음 · 모음 · 훈민정음', label: '모음' },
  { id: 'hunminjeongeumCardDesc', section: '자음 · 모음 · 훈민정음', label: '훈민정음' },
  { id: 'homeResearchTitle', section: '연구 소개', label: '제목' },
  { id: 'homeResearchDesc', section: '연구 소개', label: '본문' },
  { id: 'contactDesc', section: '문의하기', label: '안내' },
]

export function joinHomeLines(...parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join('\n')
}
