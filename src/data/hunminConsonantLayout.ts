/**
 * 해례본 오음(五音) 자음 배치 — 기호만(IPA 없음).
 * basic 구역: 상형기본자·일반 가획·이체자 등(머리글은 UI에서 「기본자」로 묶음) / extended: 각자·합용·연서 등.
 */
export type HunminSegment = {
  label: string
  symbols: string[]
}

export type HunminRow = {
  id: string
  title: string
  basicSegments: HunminSegment[]
  extendedSegments: HunminSegment[]
  footnote?: string
}

export function hunminRowContainsSymbol(row: HunminRow, symbol: string | undefined): boolean {
  if (!symbol) return false
  const hit = (segs: HunminSegment[]) => segs.some((s) => s.symbols.includes(symbol))
  return hit(row.basicSegments) || hit(row.extendedSegments)
}

export const HUNMIN_CONSONANT_ROWS: HunminRow[] = [
  {
    id: 'aram',
    title: '아음',
    basicSegments: [
      { label: '상형기본자', symbols: ['ㄱ'] },
      { label: '일반 가획', symbols: ['ㅋ'] },
      { label: '이체자', symbols: ['ㆁ'] },
    ],
    extendedSegments: [{ label: '각자병서', symbols: ['ㄲ'] }],
  },
  {
    id: 'seol',
    title: '설음',
    basicSegments: [
      { label: '상형기본자', symbols: ['ㄴ'] },
      { label: '일반 가획', symbols: ['ㄷ', 'ㅌ'] },
      { label: '이체자', symbols: ['ㄹ'] },
    ],
    extendedSegments: [{ label: '각자병서', symbols: ['ㄸ'] }],
    footnote: 'ᄛ은 해례본에서 언급만 되며 실제 표기로는 등장하지 않습니다.',
  },
  {
    id: 'sun',
    title: '순음',
    basicSegments: [
      { label: '상형기본자', symbols: ['ㅁ'] },
      { label: '일반 가획', symbols: ['ㅂ', 'ㅍ'] },
    ],
    extendedSegments: [
      { label: '각자병서', symbols: ['ㅃ'] },
      { label: '각자병서', symbols: ['ㅶ'] },
      { label: '합용병서', symbols: ['ㅴ', 'ㅵ'] },
      { label: '연서', symbols: ['ㅸ'] },
    ],
  },
  {
    id: 'chi',
    title: '치음',
    basicSegments: [
      { label: '상형기본자', symbols: ['ㅅ'] },
      { label: '일반 가획', symbols: ['ㅈ', 'ㅊ'] },
      { label: '이체자', symbols: ['ㅿ'] },
    ],
    extendedSegments: [
      { label: '각자병서', symbols: ['ㅆ', 'ㅉ'] },
      { label: '연서', symbols: ['ㅼ'] },
    ],
  },
  {
    id: 'hu',
    title: '후음',
    basicSegments: [
      { label: '상형기본자', symbols: ['ㅇ'] },
      { label: '일반 가획', symbols: ['ㆆ', 'ㅎ'] },
      { label: '이체자', symbols: ['ㆅ', 'ㆀ'] },
    ],
    extendedSegments: [],
    footnote: 'ㆀ은 해례 예시로만 등장합니다.',
  },
]
