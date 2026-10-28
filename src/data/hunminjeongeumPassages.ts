/**
 * ≪훈민정음≫ 해례본 구절 — 제자해(制字解) · 정인지서(鄭麟趾序) 중 본 페이지에 사용하는 항목.
 *
 * - `originalText`  : 한문 원문(가나다 토씨 포함). 한자만 호버 가능.
 * - `charGlosses`   : 등장 한자 → 한국어 훈음(예: 正 → "바를 정").
 *                     같은 한자가 여러 번 나와도 한 번만 기록.
 * - `korean`, `translations` : 풀이 글. src/data/text/hunmin-passages.json 에서 번호로 붙인다.
 * - `glyphLinks`    : 본문에 등장하는 한글 자모를 자음/모음 차트 페이지로 보내기 위한 링크 메타.
 *
 * 출처: 세종 외 8인 원저(1446) / 김슬옹 편저(2025). ≪훈민정음 해례본 함께 읽기≫. 마리북스.
 */

import passageText from '@/data/text/hunmin-passages.json'

export type HunminPassageSectionId = 'initial' | 'medial' | 'appraisal'

export type GlyphLinkTarget = 'consonants' | 'vowels'

export interface GlyphLink {
  symbol: string
  /** /consonants 또는 /vowels 페이지의 해당 글자 _id (선택). */
  id?: string
  target: GlyphLinkTarget
}

export interface HunminPassage {
  /** 일련번호(예: '52'). */
  number: string
  /** 해례본 위치 주석(예: '정음해례1ㄴ:2-3 제자해'). */
  reference: string
  /** 한문 원문 — 한자 + 한글 토씨가 섞인 형태. */
  originalText: string
  /** 등장 한자 → 한국어 훈음. */
  charGlosses: Record<string, string>
  /** 한국어 풀이. */
  korean: string
  /** 사이트 언어별 풀이(en 필수). */
  translations: {
    en: string
    zh?: string
    ja?: string
    fr?: string
    de?: string
    es?: string
    hi?: string
    vi?: string
    ru?: string
    ar?: string
    tr?: string
    id?: string
    th?: string
  }
  /** 차트 페이지로 보낼 한글 자모. 카드 푸터에 작은 링크로 노출. */
  glyphLinks?: GlyphLink[]
}

export interface HunminPassageSection {
  id: HunminPassageSectionId
  /** 한자 부제(작은 글씨). */
  classicLabel: string
  passages: HunminPassage[]
}

/* ── 초성자(자음자) [52]–[61] ─────────────────────────────────────────── */
const INITIAL: PassageSource[] = [
  {
    number: '52',
    reference: '정음해례1ㄴ:2-3 · 제자해',
    originalText: '正音二十八字는 各象其形而制之니라.',
    charGlosses: {
      正: '바를 정',
      音: '소리 음',
      二: '두 이',
      十: '열 십',
      八: '여덟 팔',
      字: '글자 자',
      各: '각각 각',
      象: '본뜰 상',
      其: '그 기',
      形: '모양 형',
      而: '말이을 이',
      制: '만들 제',
      之: '그것 지',
    },
  },
  {
    number: '53',
    reference: '정음해례1ㄴ:3 · 제자해',
    originalText: '初聲凡十七字니라.',
    charGlosses: {
      初: '처음 초',
      聲: '소리 성',
      凡: '모두 범',
      十: '열 십',
      七: '일곱 칠',
      字: '글자 자',
    },
  },
  {
    number: '54',
    reference: '정음해례1ㄴ:4 · 제자해',
    originalText: '牙音ㄱ[기]는 象舌根閉喉之形이니라.',
    charGlosses: {
      牙: '어금니 아',
      音: '소리 음',
      象: '본뜰 상',
      舌: '혀 설',
      根: '뿌리 근',
      閉: '닫을 폐',
      喉: '목구멍 후',
      之: '어조사 지',
      形: '모양 형',
    },
    glyphLinks: [{ symbol: 'ㄱ', id: 'g', target: 'consonants' }],
  },
  {
    number: '55',
    reference: '정음해례1ㄴ:4-5 · 제자해',
    originalText: '舌音ㄴ[니]는 象舌附上腭之形이니라.',
    charGlosses: {
      舌: '혀 설',
      音: '소리 음',
      象: '본뜰 상',
      附: '닿을 부',
      上: '위 상',
      腭: '잇몸 악',
      之: '어조사 지',
      形: '모양 형',
    },
    glyphLinks: [{ symbol: 'ㄴ', id: 'n', target: 'consonants' }],
  },
  {
    number: '56',
    reference: '정음해례1ㄴ:5-6 · 제자해',
    originalText: '脣音ㅁ[미]는 象口形이니라.',
    charGlosses: {
      脣: '입술 순',
      音: '소리 음',
      象: '본뜰 상',
      口: '입 구',
      形: '모양 형',
    },
    glyphLinks: [{ symbol: 'ㅁ', id: 'm', target: 'consonants' }],
  },
  {
    number: '57',
    reference: '정음해례1ㄴ:6 · 제자해',
    originalText: '齒音ㅅ[시]는 象齒形이니라.',
    charGlosses: {
      齒: '이 치',
      音: '소리 음',
      象: '본뜰 상',
      形: '모양 형',
    },
    glyphLinks: [{ symbol: 'ㅅ', id: 's', target: 'consonants' }],
  },
  {
    number: '58',
    reference: '정음해례1ㄴ:6 · 제자해',
    originalText: '喉音ㅇ[이]는 象喉形이니라.',
    charGlosses: {
      喉: '목구멍 후',
      音: '소리 음',
      象: '본뜰 상',
      形: '모양 형',
    },
    glyphLinks: [{ symbol: 'ㅇ', id: 'ng', target: 'consonants' }],
  },
  {
    number: '59',
    reference: '정음해례1ㄴ:6-7 · 제자해',
    originalText: 'ㅋ[키]比ㄱ[기], 聲出稍厲하니 故加畫이니라.',
    charGlosses: {
      比: '견줄 비',
      聲: '소리 성',
      出: '날 출',
      稍: '조금 초',
      厲: '셀 려',
      故: '연고 고',
      加: '더할 가',
      畫: '그을 획',
    },
    glyphLinks: [
      { symbol: 'ㅋ', id: 'k', target: 'consonants' },
      { symbol: 'ㄱ', id: 'g', target: 'consonants' },
    ],
  },
  {
    number: '60',
    reference: '정음해례1ㄴ:7–2ㄱ:1-2 · 제자해',
    originalText:
      'ㄴ而ㄷ, ㄷ而ㅌ, ㅁ而ㅂ, ㅂ而ㅍ, ㅅ而ㅈ, ㅈ而ㅊ, ㅇ而ㆆ, ㆆ而ㅎ, 其因聲加畫之義皆同이나 而唯ㆁ[ᅌᅵ]爲異니라.',
    charGlosses: {
      而: '말이을 이',
      其: '그 기',
      因: '인할 인',
      聲: '소리 성',
      加: '더할 가',
      畫: '그을 획',
      之: '어조사 지',
      義: '뜻 의',
      皆: '모두 개',
      同: '같을 동',
      唯: '오직 유',
      爲: '될 위',
      異: '다를 이',
    },
  },
  {
    number: '61',
    reference: '정음해례2ㄱ:2-4 · 제자해',
    originalText: '半舌音ㄹ[리], 半齒音ㅿ[ᅀᅵ], 亦象舌齒之形而異其體이나 無加畫之義焉이니라.',
    charGlosses: {
      半: '반 반',
      舌: '혀 설',
      音: '소리 음',
      齒: '이 치',
      亦: '또 역',
      象: '본뜰 상',
      之: '어조사 지',
      形: '모양 형',
      而: '말이을 이',
      異: '다를 이',
      其: '그 기',
      體: '몸 체',
      無: '없을 무',
      加: '더할 가',
      畫: '그을 획',
      義: '뜻 의',
      焉: '따름 언',
    },
    glyphLinks: [{ symbol: 'ㄹ', id: 'r', target: 'consonants' }],
  },
]

/* ── 중성자(모음자) [98]–[113] ─────────────────────────────────────── */
const MEDIAL: PassageSource[] = [
  {
    number: '98',
    reference: '정음해례4ㄴ:5 · 제자해',
    originalText: '中聲凡十一字니라.',
    charGlosses: {
      中: '가운데 중',
      聲: '소리 성',
      凡: '모두 범',
      十: '열 십',
      一: '한 일',
      字: '글자 자',
    },
  },
  {
    number: '99',
    reference: '정음해례4ㄴ:5-6 · 제자해',
    originalText: 'ㆍ는 舌縮而聲深하여 天開於子也니라.',
    charGlosses: {
      舌: '혀 설',
      縮: '오그릴 축',
      而: '말이을 이',
      聲: '소리 성',
      深: '깊을 심',
      天: '하늘 천',
      開: '열 개',
      於: '어조사 어',
      子: '첫째지지 자',
      也: '어조사 야',
    },
    glyphLinks: [{ symbol: 'ㆍ', id: 'araea', target: 'vowels' }],
  },
  {
    number: '101',
    reference: '정음해례4ㄴ:7-8 · 제자해',
    originalText: 'ㅡ는 舌小縮而聲不深不淺이니 地闢於丑也니라.',
    charGlosses: {
      舌: '혀 설',
      小: '작을 소',
      縮: '오그릴 축',
      而: '말이을 이',
      聲: '소리 성',
      不: '아니 불',
      深: '깊을 심',
      淺: '얕을 천',
      地: '땅 지',
      闢: '열 벽',
      於: '어조사 어',
      丑: '둘째지지 축',
      也: '어조사 야',
    },
    glyphLinks: [{ symbol: 'ㅡ', id: 'eu', target: 'vowels' }],
  },
  {
    number: '103',
    reference: '정음해례4ㄴ:8–5ㄱ:1 · 제자해',
    originalText: 'ㅣ는 舌不縮而聲淺하니 人生於寅也니라.',
    charGlosses: {
      舌: '혀 설',
      不: '아니 불',
      縮: '오그릴 축',
      而: '말이을 이',
      聲: '소리 성',
      淺: '얕을 천',
      人: '사람 인',
      生: '날 생',
      於: '어조사 어',
      寅: '셋째지지 인',
      也: '어조사 야',
    },
    glyphLinks: [{ symbol: 'ㅣ', id: 'i', target: 'vowels' }],
  },
  {
    number: '105',
    reference: '정음해례5ㄱ:2 · 제자해',
    originalText: '此下八聲은 一闔一闢이니라.',
    charGlosses: {
      此: '이 차',
      下: '아래 하',
      八: '여덟 팔',
      聲: '소리 성',
      一: '한 일',
      闔: '거의 닫을 합',
      闢: '열 벽',
    },
  },
  {
    number: '106',
    reference: '정음해례5ㄱ:2-4 · 제자해',
    originalText:
      'ㅗ는 與ㆍ同而口蹙이며, 其形則ㆍ與ㅡ合而成은 取天地初交之義也니라.',
    charGlosses: {
      與: '더불어 여',
      同: '같을 동',
      而: '말이을 이',
      口: '입 구',
      蹙: '오므릴 축',
      其: '그 기',
      形: '모양 형',
      則: '곧 즉',
      合: '합할 합',
      成: '이룰 성',
      取: '담을 취',
      天: '하늘 천',
      地: '땅 지',
      初: '처음 초',
      交: '사귈 교',
      之: '어조사 지',
      義: '뜻 의',
      也: '어조사 야',
    },
    glyphLinks: [{ symbol: 'ㅗ', id: 'o', target: 'vowels' }],
  },
  {
    number: '107',
    reference: '정음해례5ㄱ:4-6 · 제자해',
    originalText:
      'ㅏ는 與ㆍ同而口張이며, 其形則ㅣ與ㆍ合而成이니 取天地之用發於事物待人而成也니라.',
    charGlosses: {
      與: '더불어 여',
      同: '같을 동',
      而: '말이을 이',
      口: '입 구',
      張: '벌릴 장',
      其: '그 기',
      形: '모양 형',
      則: '곧 즉',
      合: '합할 합',
      成: '이룰 성',
      取: '가질 취',
      天: '하늘 천',
      地: '땅 지',
      之: '어조사 지',
      用: '쓰임새 용',
      發: '필 발',
      於: '어조사 어',
      事: '일 사',
      物: '물건 물',
      待: '기다릴 대',
      人: '사람 인',
      也: '어조사 야',
    },
    glyphLinks: [{ symbol: 'ㅏ', id: 'a', target: 'vowels' }],
  },
  {
    number: '108',
    reference: '정음해례5ㄱ:7-8 · 제자해',
    originalText:
      'ㅜ는 與ㅡ同而口蹙이며, 其形則ㅡ與ㆍ合而成이니 亦取天地初交之義也니라.',
    charGlosses: {
      與: '더불어 여',
      同: '같을 동',
      而: '말이을 이',
      口: '입 구',
      蹙: '오므릴 축',
      其: '그 기',
      形: '모양 형',
      則: '곧 즉',
      合: '합할 합',
      成: '이룰 성',
      亦: '또 역',
      取: '가질 취',
      天: '하늘 천',
      地: '땅 지',
      初: '처음 초',
      交: '사귈 교',
      之: '어조사 지',
      義: '뜻 의',
      也: '어조사 야',
    },
    glyphLinks: [{ symbol: 'ㅜ', id: 'u', target: 'vowels' }],
  },
  {
    number: '109',
    reference: '정음해례5ㄱ:8–5ㄴ:1-3 · 제자해',
    originalText:
      'ㅓ는 與ㅡ同而口張이며, 其形則ㆍ與ㅣ合而成이니 亦取天地之用發於事物待人而成也니라.',
    charGlosses: {
      與: '더불어 여',
      同: '같을 동',
      而: '말이을 이',
      口: '입 구',
      張: '벌릴 장',
      其: '그 기',
      形: '모양 형',
      則: '곧 즉',
      合: '합할 합',
      成: '이룰 성',
      亦: '또 역',
      取: '가질 취',
      天: '하늘 천',
      地: '땅 지',
      之: '어조사 지',
      用: '쓰임새 용',
      發: '필 발',
      於: '어조사 어',
      事: '일 사',
      物: '물건 물',
      待: '기다릴 대',
      人: '사람 인',
      也: '어조사 야',
    },
    glyphLinks: [{ symbol: 'ㅓ', id: 'eo', target: 'vowels' }],
  },
  {
    number: '110',
    reference: '정음해례5ㄴ:3 · 제자해',
    originalText: 'ㅛ는 與ㅗ同而起於ㅣ니라.',
    charGlosses: {
      與: '더불어 여',
      同: '같을 동',
      而: '말이을 이',
      起: '일어날 기',
      於: '어조사 어',
    },
    glyphLinks: [{ symbol: 'ㅛ', id: 'yo', target: 'vowels' }],
  },
  {
    number: '111',
    reference: '정음해례5ㄴ:3-4 · 제자해',
    originalText: 'ㅑ는 與ㅏ同而起於ㅣ니라.',
    charGlosses: {
      與: '더불어 여',
      同: '같을 동',
      而: '말이을 이',
      起: '일어날 기',
      於: '어조사 어',
    },
    glyphLinks: [{ symbol: 'ㅑ', id: 'ya', target: 'vowels' }],
  },
  {
    number: '112',
    reference: '정음해례5ㄴ:4-5 · 제자해',
    originalText: 'ㅠ는 與ㅜ同而起於ㅣ니라.',
    charGlosses: {
      與: '더불어 여',
      同: '같을 동',
      而: '말이을 이',
      起: '일어날 기',
      於: '어조사 어',
    },
    glyphLinks: [{ symbol: 'ㅠ', id: 'yu', target: 'vowels' }],
  },
  {
    number: '113',
    reference: '정음해례5ㄴ:5 · 제자해',
    originalText: 'ㅕ는 與ㅓ同而起於ㅣ니라.',
    charGlosses: {
      與: '더불어 여',
      同: '같을 동',
      而: '말이을 이',
      起: '일어날 기',
      於: '어조사 어',
    },
    glyphLinks: [{ symbol: 'ㅕ', id: 'yeo', target: 'vowels' }],
  },
]

/* ── 해례본의 평가(정인지서) [352]–[358] ───────────────────────────── */
const APPRAISAL: PassageSource[] = [
  {
    number: '352',
    reference: '정음해례28ㄱ:1-2 · 정인지서',
    originalText: '以二十八字而轉換無窮하고, 簡而要하며, 精而通이라.',
    charGlosses: {
      以: '써 이',
      二: '두 이',
      十: '열 십',
      八: '여덟 팔',
      字: '글자 자',
      而: '말이을 이',
      轉: '구를 전',
      換: '바꿀 환',
      無: '없을 무',
      窮: '다할 궁',
      簡: '간략할 간',
      要: '요긴할 요',
      精: '정할 정',
      通: '통할 통',
    },
  },
  {
    number: '353',
    reference: '정음해례28ㄱ:2-3 · 정인지서',
    originalText: '故智者不終朝而會요, 愚者可浹旬而學이니라.',
    charGlosses: {
      故: '연고 고',
      智: '슬기 지',
      者: '사람 자',
      不: '아니 부',
      終: '끝 종',
      朝: '아침 조',
      而: '말이을 이',
      會: '깨달을 회',
      愚: '어리석을 우',
      可: '가할 가',
      浹: '두루미칠 협',
      旬: '열흘 순',
      學: '배울 학',
    },
  },
  {
    number: '354',
    reference: '정음해례28ㄱ:3-4 · 정인지서',
    originalText: '以是解書면, 可以知其義요.',
    charGlosses: {
      以: '써 이',
      是: '이 시',
      解: '풀 해',
      書: '글 서',
      可: '가할 가',
      知: '알 지',
      其: '그 기',
      義: '뜻 의',
    },
  },
  {
    number: '355',
    reference: '정음해례28ㄱ:4-5 · 정인지서',
    originalText: '以是聽訟이면 可以得其情이니라.',
    charGlosses: {
      以: '써 이',
      是: '이 시',
      聽: '들을 청',
      訟: '송사할 송',
      可: '옳을 가',
      得: '알 득',
      其: '그 기',
      情: '실정 정',
    },
  },
  {
    number: '356',
    reference: '정음해례28ㄱ:5-6 · 정인지서',
    originalText: '字韻則淸濁之能辨하고 樂歌則律呂之克諧니라.',
    charGlosses: {
      字: '글자 자',
      韻: '소리 운',
      則: '곧 즉',
      淸: '맑을 청',
      濁: '흐릴 탁',
      之: '어조사 지',
      能: '능할 능',
      辨: '분별할 변',
      樂: '노래 악',
      歌: '노래 가',
      律: '음률 률',
      呂: '음률 려',
      克: '능할 극',
      諧: '어울릴 해',
    },
  },
  {
    number: '357',
    reference: '정음해례28ㄱ:6-7 · 정인지서',
    originalText: '無所用而不備하고, 無所往而不達이니라.',
    charGlosses: {
      無: '없을 무',
      所: '바 소',
      用: '쓸 용',
      而: '말이을 이',
      不: '아니 불',
      備: '갖출 비',
      往: '갈 왕',
      達: '통달할 달',
    },
  },
  {
    number: '358',
    reference: '정음해례28ㄱ:7-8 · 정인지서',
    originalText: '雖風聲鶴唳와 雞鳴狗吠라도 皆可得而書矣니라.',
    charGlosses: {
      雖: '비록 수',
      風: '바람 풍',
      聲: '소리 성',
      鶴: '두루미 학',
      唳: '울 려',
      雞: '닭 계',
      鳴: '울 명',
      狗: '개 구',
      吠: '짖을 폐',
      皆: '다 개',
      可: '가할 가',
      得: '알 득',
      而: '말이을 이',
      書: '쓸 서',
      矣: '어조사 의',
    },
  },
]

export const HUNMIN_PASSAGE_SECTIONS: HunminPassageSection[] = [
  { id: 'initial', classicLabel: '初聲', passages: applyHunminPassageI18n(INITIAL) },
  { id: 'medial', classicLabel: '中聲', passages: applyHunminPassageI18n(MEDIAL) },
  { id: 'appraisal', classicLabel: '鄭麟趾序', passages: applyHunminPassageI18n(APPRAISAL) },
]

type PassageSource = Omit<HunminPassage, 'korean' | 'translations'>

function applyHunminPassageI18n(passages: PassageSource[]): HunminPassage[] {
  const table: Record<string, Record<string, string>> = passageText
  return passages.map((passage) => {
    const { ko = '', ...rest } = table[passage.number] ?? {}
    const translations: Record<string, string> = {}
    for (const [lang, text] of Object.entries(rest)) if (text.trim()) translations[lang] = text
    return { ...passage, korean: ko, translations: translations as HunminPassage['translations'] }
  })
}
