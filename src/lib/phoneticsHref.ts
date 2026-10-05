import type { GlyphLinkTarget } from '@/data/hunminjeongeumPassages'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'

/** 자음·모음 차트 페이지 — 선택할 항목 `_id` (예: eo, oj), 차트 보기(기본: 현대 음성학) */
export function phoneticsChartHref(target: GlyphLinkTarget, id?: string, view?: ChartViewMode): string {
  const params = new URLSearchParams()
  if (view === 'hunmin') params.set('view', 'hunmin')
  if (id) params.set('id', id)
  const query = params.toString()
  return `/${target}${query ? `?${query}` : ''}`
}
