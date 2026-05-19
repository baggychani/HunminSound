/**
 * ≪훈민정음≫ 해례본 중성자(모음) — 양성·음성·양음성 각 1행(기본자+합용자 가로).
 * 합용 모음(ㆍㅣ 등)은 compound 슬롯 1칸·글자 밀착. mapTo 있으면 해당 현대 모음과 연결.
 */

export type HunminVowelSlot =
  | { kind: 'symbol'; value: string; ipa?: string }
  | { kind: 'reserved' }
  | { kind: 'compound'; jamo: string; mapTo?: string }
  /** images/hunmin/vowels/{asset}.png — 훈민 모음 필기 이미지 */
  | { kind: 'image'; asset: string; mapTo?: string; ipa?: string }

export type HunminVowelSegment = {
  /** 비우면 직전 구간(예: ㅣ 합용자)의 하위 — groupLine만 표시 */
  label?: string
  groupLine?: string
  slots: HunminVowelSlot[]
}

export type HunminVowelRow = {
  id: 'yang' | 'yin' | 'neutral'
  title: string
  basicSegments: HunminVowelSegment[]
  combinedSegments: HunminVowelSegment[]
}

const sym = (value: string, ipa?: string): HunminVowelSlot =>
  ipa ? { kind: 'symbol', value, ipa } : { kind: 'symbol', value }
/** 옛한글 자모 — IPA는 대응 PNG asset 명명 규칙과 동일 (파일은 유지, UI만 교체) */
const jamo = (value: string, asset: string): HunminVowelSlot => sym(value, ipaLabel(asset))
const res = (): HunminVowelSlot => ({ kind: 'reserved' })
const cmp = (jamoStr: string, mapTo?: string): HunminVowelSlot => ({ kind: 'compound', jamo: jamoStr, mapTo })

/** 합용자 IPA: 파일명 m→ɨ, e→ə (vj 등 예외는 overrides) */
const IPA_OVERRIDES: Record<string, string> = {
  v: '/ʌ/, /ɔ/',
  i: '/i/',
  vj: '/ʌj/',
}

function ipaLabel(asset: string): string {
  if (IPA_OVERRIDES[asset]) return IPA_OVERRIDES[asset]
  return `/${asset.replace(/m/g, 'ɨ').replace(/e/g, 'ə')}/`
}

const img = (asset: string, mapTo?: string, ipa?: string): HunminVowelSlot => ({
  kind: 'image',
  asset,
  mapTo,
  ipa: ipa ?? ipaLabel(asset),
})

export const HUNMIN_VOWEL_ROWS: HunminVowelRow[] = [
  {
    id: 'yang',
    title: '양성',
    basicSegments: [
      { label: '상형기본자', slots: [img('v')] },
      { label: '합성자', groupLine: '초출자', slots: [sym('ㅗ'), sym('ㅏ')] },
      { groupLine: '재출자', slots: [sym('ㅛ'), sym('ㅑ')] },
    ],
    combinedSegments: [
      { label: '동출합용자', slots: [jamo('ㅘ', 'wa'), jamo('ㆇ', 'joja')] },
      {
        label: 'ㅣ 합용자',
        groupLine: '기본 중성자와 ㅣ',
        slots: [jamo('ㆎ', 'vj'), jamo('ㅚ', 'oj'), jamo('ㅐ', 'aj'), jamo('ㆉ', 'joj'), jamo('ㅒ', 'jaj')],
      },
      {
        groupLine: '동출합용자와 ㅣ',
        slots: [jamo('ㅙ', 'waj'), jamo('ㆈ', 'jojaj')],
      },
    ],
  },
  {
    id: 'yin',
    title: '음성',
    basicSegments: [
      { label: '상형기본자', slots: [sym('ㅡ')] },
      { label: '합성자', groupLine: '초출자', slots: [sym('ㅜ'), sym('ㅓ')] },
      { groupLine: '재출자', slots: [sym('ㅠ'), sym('ㅕ')] },
    ],
    combinedSegments: [
      { label: '동출합용자', slots: [jamo('ㅝ', 'we'), jamo('ㆊ', 'juje')] },
      {
        label: 'ㅣ 합용자',
        groupLine: '기본 중성자와 ㅣ',
        slots: [jamo('ㅢ', 'mj'), jamo('ㅟ', 'uj'), jamo('ㅔ', 'ej'), jamo('ㆌ', 'juj'), jamo('ㅖ', 'jej')],
      },
      {
        groupLine: '동출합용자와 ㅣ',
        slots: [jamo('ㅞ', 'wej'), jamo('ㆋ', 'jujej')],
      },
    ],
  },
  {
    id: 'neutral',
    title: '양음성',
    basicSegments: [{ label: '상형기본자', slots: [img('i')] }],
    combinedSegments: [],
  },
]

export function hunminVowelRowContainsSymbol(row: HunminVowelRow, symbol: string | undefined): boolean {
  if (!symbol) return false
  const hit = (segs: HunminVowelSegment[]) =>
    segs.some((s) =>
      s.slots.some(
        (sl) =>
          (sl.kind === 'symbol' && sl.value === symbol) ||
          (sl.kind === 'compound' && sl.mapTo === symbol) ||
          (sl.kind === 'image' && sl.mapTo === symbol),
      ),
    )
  return hit(row.basicSegments) || hit(row.combinedSegments)
}
