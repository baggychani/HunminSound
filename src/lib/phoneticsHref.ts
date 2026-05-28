import type { GlyphLinkTarget } from '@/data/hunminjeongeumPassages'

/** 자음·모음 차트 페이지 — 선택할 항목 `_id` (예: eo, oj) */
export function phoneticsChartHref(target: GlyphLinkTarget, id?: string): string {
  const base = `/${target}`
  if (!id) return base
  return `${base}?id=${encodeURIComponent(id)}`
}
