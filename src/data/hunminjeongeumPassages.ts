/**
 * ≪훈민정음≫ 해례본 구절 — 제자해(制字解) · 정인지서(鄭麟趾序) 중 본 페이지에 사용하는 항목.
 *
 * - `originalText`  : 한문 원문(가나다 토씨 포함). 한자만 호버 가능.
 * - `charGlosses`   : 등장 한자 → 한국어 훈음(예: 正 → "바를 정").
 *                     같은 한자가 여러 번 나와도 한 번만 기록.
 * - `korean`        : 한국어 풀이.
 * - `translations`  : 한국어를 제외한 사이트 언어별 풀이(en 필수, 나머지는 비어 있으면 en으로 fallback).
 * - `glyphLinks`    : 본문에 등장하는 한글 자모를 자음/모음 차트 페이지로 보내기 위한 링크 메타.
 *
 * 출처: 세종 외 8인 원저(1446) / 김슬옹 편저(2025). ≪훈민정음 해례본 함께 읽기≫. 마리북스.
 */

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
    ar?: string
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
const INITIAL: HunminPassage[] = [
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
    korean: '정음 스물여덟 자는 각각 그 모양을 본떠서 만들었다.',
    translations: {
      en: 'All of the 28 letters of Hunminjeongeum are each created by imitating their respective shapes.',
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
    korean: '첫소리글자는 모두 열일곱 자다.',
    translations: { en: 'There are 17 initial consonant letters.' },
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
    korean: '어금닛소리글자 ㄱ[기]는 혀뿌리가 목구멍을 막는 모양을 본떴다.',
    translations: {
      en: 'The molar sound (velar consonant) letter ㄱ /k/ resembles the blocking of the throat with the back of the tongue.',
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
    korean: '혓소리글자 ㄴ[니]는 혀가 윗잇몸에 닿는 모양을 본떴다.',
    translations: {
      en: 'The lingual sound (alveolar consonant) letter ㄴ /n/ resembles the tongue touching the upper gums (teeth-ridge).',
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
    korean: '입술소리글자 ㅁ[미]는 입 모양을 본떴다.',
    translations: {
      en: 'The lip sound (labial consonant) letter ㅁ /m/ resembles the shape of the mouth.',
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
    korean: '잇소리글자 ㅅ[시]는 이 모양을 본떴다.',
    translations: {
      en: 'The dental sound (alveolar consonant) letter ㅅ /s/ resembles the shape of a tooth.',
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
    korean: '목구멍소리글자 ㅇ[이]는 목구멍 모양을 본떴다.',
    translations: {
      en: 'The guttural sound (laryngeal consonant) letter ㅇ /ɦ/ resembles the shape of the throat.',
    },
    glyphLinks: [{ symbol: 'ㅇ', target: 'consonants' }],
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
    korean: 'ㅋ[키]는 ㄱ[기]에 비해서 소리가 조금 세게 나는 까닭으로 획을 더하였다.',
    translations: {
      en: 'The sound of ㅋ /kʰ/ is more strongly pronounced than ㄱ /k/, so one more stroke is added to the letter.',
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
    korean:
      'ㄴ[니]에서 ㄷ[디], ㄷ[디]에서 ㅌ[티], ㅁ[미]에서 ㅂ[비], ㅂ[비]에서 ㅍ[피], ㅅ[시]에서 ㅈ[지], ㅈ[지]에서 ㅊ[치], ㅇ[이]에서 ㆆ[ᅙᅵ], ㆆ[ᅙᅵ]에서 ㅎ[히]가 됨도 그 소리로 말미암아 획을 더한 뜻은 같으나, 다만 ㆁ[ᅌᅵ]만은 다르다.',
    translations: {
      en: 'In this system ㄷ /t/ comes from ㄴ /n/, ㅌ /tʰ/ from ㄷ /t/, ㅂ /p/ from ㅁ /m/, ㅍ /pʰ/ from ㅂ /p/, ㅈ /ts/ from ㅅ /s/, ㅊ /tsʰ/ from ㅈ /ts/, ㆆ /ʔ/ from ㅇ /ɦ/, and ㅎ /h/ from ㆆ /ʔ/ — each adding a stroke to mark a stronger sound, with the sole exception of ㆁ /ŋ/.',
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
    korean:
      '반혓소리글자 ㄹ[리], 반잇소리글자 ㅿ[ᅀᅵ]도 또한 혀와 이의 모양을 본떴으나, 그 짜임새를 달리해서 만들었기에 획을 더한 뜻은 없다.',
    translations: {
      en: 'The semi-lingual letter ㄹ /ɾ/ and the semi-dental letter ㅿ /z/ likewise depict the shape of the tongue and tooth, but their forms follow a different system, so the meaning of adding strokes does not apply.',
    },
    glyphLinks: [{ symbol: 'ㄹ', id: 'r', target: 'consonants' }],
  },
]

/* ── 중성자(모음자) [98]–[113] ─────────────────────────────────────── */
const MEDIAL: HunminPassage[] = [
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
    korean: '가운뎃소리글자는 모두 열한 자다.',
    translations: { en: 'As for medial vowel letters, there are eleven letters.' },
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
    korean: 'ㆍ는 혀가 오그라드니 소리가 깊어서, 하늘이 자시(밤 11시~오전 1시)에서 열리는 것과 같다.',
    translations: {
      en: 'ㆍ /ʌ/ is pronounced by contracting the tongue, so the sound becomes deep — like when Heaven opens at the hour of the Rat (11 pm–1 am).',
    },
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
    korean: 'ㅡ는 혀가 조금 오그라드니 소리가 깊지도 얕지도 않으므로 땅이 축시(오전 1시~3시)에서 열리는 것과 같다.',
    translations: {
      en: 'ㅡ /ɨ/ is pronounced by slightly contracting the tongue — neither deep nor shallow, like when the Earth opens at the hour of the Ox (1 am–3 am).',
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
    korean: 'ㅣ는 혀가 오그라지지 않아 소리는 얕으니, 사람이 인시(오전 3시~5시)에서 생기는 것과 같다.',
    translations: {
      en: 'As for ㅣ /i/, the tongue is not contracted so the sound is light — like when humans are born during the hour of the Tiger (3 am–5 am).',
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
    korean: '다음 여덟 가운뎃소리는 어떤 것은 입을 오므려서, 어떤 것은 입을 벌려서 발음한다.',
    translations: {
      en: 'The following eight medial sounds are pronounced — some with the lips puckered (rounded) and others with the lips spread open.',
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
    korean:
      'ㅗ는 ㆍ와 같은 가운뎃소리[양성모음]이나 입을 더 오므리며, 그 모양이 ㆍ가 ㅡ와 합해서 이루어진 것은 하늘과 땅이 처음으로 사귄다는 뜻을 담았다.',
    translations: {
      en: 'ㅗ /o/ shares the same medial quality (positive vowel) as ㆍ /ʌ/, but is pronounced with the lips more puckered; its shape, formed by combining ㆍ with ㅡ /ɨ/, signifies the first interaction of Heaven and Earth.',
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
    korean:
      'ㅏ는 ㆍ와 같은 가운뎃소리[양성모음]이나 입을 더 벌리며, 그 모양은 ㅣ와 ㆍ가 서로 합하여 이루어진 것으로, 하늘과 땅의 작용이 만물로 드러나되 사람이 있어야 비로소 완성된다는 뜻을 담은 것이다.',
    translations: {
      en: 'ㅏ /a/ shares the same medial quality (positive vowel) as ㆍ /ʌ/ but is pronounced with the mouth opened wider; its shape, formed by joining ㅣ /i/ and ㆍ /ʌ/, signifies that the workings of Heaven and Earth manifest in all things yet require humanity to bring them to completion.',
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
    korean:
      'ㅜ는 ㅡ와 같은 가운뎃소리[음성모음]이나 입을 더 오므리며, 그 모양이 ㅡ가 ㆍ와 합해서 이루어진 것은 역시 하늘과 땅이 처음으로 사귄다는 뜻을 담았다.',
    translations: {
      en: 'ㅜ /u/ shares the same medial quality (negative vowel) as ㅡ /ɨ/ but is pronounced with the lips more puckered; its shape, formed by combining ㅡ with ㆍ /ʌ/, also represents the first interaction of Heaven and Earth.',
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
    korean:
      'ㅓ는 ㅡ와 같은 가운뎃소리[음성모음]이나 입을 더 벌리니, 그 모양은 ㆍ와 ㅣ가 합해서 이루어진 것이며, 역시 하늘과 땅의 쓰임이 일과 사물에서 나타나되 사람을 기다려서 이루어진다는 뜻을 담은 것이다.',
    translations: {
      en: 'ㅓ /ə/ is the same medial sound (negative vowel) as ㅡ /ɨ/ but pronounced with the mouth opened wider; the shape is formed by joining ㆍ /ʌ/ and ㅣ /i/, again signifying that all things begin with Heaven and Earth yet wait upon humans for their completion.',
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
    korean: 'ㅛ는 ㅗ와 같은 입을 오므리는 소리로 ㅣ에서 비롯된다.',
    translations: {
      en: 'ㅛ /jo/ is the same lip-rounding sound as ㅗ /o/, but is pronounced by starting with ㅣ /i/.',
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
    korean: 'ㅑ는 ㅏ와 같은 입을 벌리는 소리로 ㅣ에서 비롯된다.',
    translations: {
      en: 'ㅑ /ja/ is the same mouth-opening sound as ㅏ /a/, but is pronounced by starting with ㅣ /i/.',
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
    korean: 'ㅠ는 ㅜ와 같은 입을 오므리는 소리로 ㅣ에서 비롯된다.',
    translations: {
      en: 'ㅠ /ju/ is the same lip-rounding sound as ㅜ /u/, but is pronounced by starting with ㅣ /i/.',
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
    korean: 'ㅕ는 ㅓ와 같은 입을 벌리는 소리로 ㅣ에서 비롯된다.',
    translations: {
      en: 'ㅕ /jə/ is the same mouth-opening sound as ㅓ /ə/, but is pronounced by starting with ㅣ /i/.',
    },
    glyphLinks: [{ symbol: 'ㅕ', id: 'yeo', target: 'vowels' }],
  },
]

/* ── 해례본의 평가(정인지서) [352]–[358] ───────────────────────────── */
const APPRAISAL: HunminPassage[] = [
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
    korean: '스물여덟 자로 끝없이 바꿀 수 있어, 간결하면서도 요점을 잘 드러내고, 정밀한 뜻을 담으면서도 두루 통할 수 있다.',
    translations: {
      en: 'The 28 letters are used in infinite combinations — while simple they express what is vital, while precise they can be easily communicated.',
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
    korean: '그러므로 슬기로운 사람은 아침밥을 먹기 전에 깨치고, 슬기롭지 못한 이라도 열흘이면 배울 수 있다.',
    translations: {
      en: 'Therefore, wise people can master it before finishing their morning meal, and even those who are not wise can learn it within ten days.',
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
    korean: '훈민정음으로 한문을 풀이하면 그 뜻을 알 수 있다.',
    translations: {
      en: 'When written in these characters one can understand the meaning of the Chinese classics.',
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
    korean: '훈민정음으로 소송 사건을 기록하면, 그 속사정을 이해할 수 있다.',
    translations: {
      en: 'Moreover, using these characters when dealing with lawsuit cases allows one to understand the real situation.',
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
    korean: '글자 소리로는 맑고 흐린 소리를 구별할 수 있고, 음악 노래로는 노랫가락을 어울리게 할 수 있다.',
    translations: {
      en: 'As for the phonetics of the characters, they can discern clear and thick sounds; and as for music and songs, they perfectly harmonize with the musical pitches.',
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
    korean: '글을 쓸 때에 글자가 갖추어지지 않은 바가 없으며, 어디서든 뜻을 두루 통하지 못하는 바가 없다.',
    translations: {
      en: 'When writing, there is nothing that cannot be expressed with these letters, and there is nowhere their meaning cannot be thoroughly communicated.',
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
    korean: '비록 바람 소리, 두루미 울음소리, 닭 소리, 개 짖는 소리라도 모두 적을 수 있다.',
    translations: {
      en: 'Whether the sound of wind, the cry of the crane, the cluck of the chicken, or the bark of the dog — all sounds can be written down.',
    },
  },
]

export const HUNMIN_PASSAGE_SECTIONS: HunminPassageSection[] = [
  { id: 'initial', classicLabel: '初聲', passages: INITIAL },
  { id: 'medial', classicLabel: '中聲', passages: MEDIAL },
  { id: 'appraisal', classicLabel: '鄭麟趾序', passages: APPRAISAL },
]
