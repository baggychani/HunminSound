import type { Vowel } from '@/types'

export const vowelsData: Vowel[] = [
  // ─── 단모음 (Monophthongs) ───────────────────────────────────────
  {
    _id: 'a',
    name: 'ㅏ (아)',
    symbol: 'ㅏ',
    category: '단모음',
    description:
      '한국어의 대표적인 저모음으로, 혀가 낮은 위치 후부에 놓이고 입을 크게 벌려 발음합니다. 비원순 후설 저모음 [ɑ]에 가깝습니다. 한국어 모음 중 가장 중립적인 조음 위치를 가지는 핵심 모음입니다.',
    animationFileName: 'ㅏ.mp4',
    mriFileName: 'ㅏ.mp4',
  },
  {
    _id: 'ae',
    name: 'ㅐ (애)',
    symbol: 'ㅐ',
    category: '단모음',
    description:
      '중저전설 비원순 모음으로, IPA로는 [ɛ]로 표기됩니다. 현대 서울 방언에서는 ㅔ(에)와의 음성적 구분이 점차 소실되어 두 모음이 합류(merger)하는 경향이 뚜렷하게 관찰됩니다.',
    animationFileName: 'ㅐ.mp4',
    mriFileName: 'ㅐ.mp4',
  },
  {
    _id: 'eo',
    name: 'ㅓ (어)',
    symbol: 'ㅓ',
    category: '단모음',
    description:
      '중후설 비원순 모음으로, IPA로는 [ʌ]에 가깝게 표기됩니다. 혀의 중간 높이 후부에서 입술을 편 채로 발음합니다. ㅏ(아)와 대립을 이루며 한국어 모음 체계의 중요한 축을 구성합니다.',
    animationFileName: 'ㅓ.mp4',
    mriFileName: 'ㅓ.mp4',
  },
  {
    _id: 'e',
    name: 'ㅔ (에)',
    symbol: 'ㅔ',
    category: '단모음',
    description:
      '중전설 비원순 모음으로, IPA로는 [e]로 표기됩니다. 현대 서울 방언에서 ㅐ(애)와 점차 합류하는 경향이 있으며, 두 모음을 구분하지 않는 화자가 증가하고 있습니다.',
    animationFileName: 'ㅔ.mp4',
    mriFileName: 'ㅔ.mp4',
  },
  {
    _id: 'o',
    name: 'ㅗ (오)',
    symbol: 'ㅗ',
    category: '단모음',
    description:
      '고후설 원순 모음으로, 혀의 높은 위치 후부에서 입술을 둥글게 모아 발음합니다. IPA로는 [o]로 표기됩니다. ㅜ(우)와 함께 한국어의 원순 모음 체계를 구성합니다.',
    animationFileName: 'ㅗ.mp4',
    mriFileName: 'ㅗ.mp4',
  },
  {
    _id: 'oe',
    name: 'ㅚ (외)',
    symbol: 'ㅚ',
    category: '단모음',
    description:
      '전통적으로 중전설 원순 단모음 [ø]로 분류되나, 현대 서울 방언에서는 대부분 이중모음 [we]로 발음됩니다. 원래의 단모음 발음을 보존하는 화자는 점차 감소하는 경향입니다.',
    animationFileName: 'ㅚ.mp4',
    mriFileName: 'ㅚ.mp4',
  },
  {
    _id: 'u',
    name: 'ㅜ (우)',
    symbol: 'ㅜ',
    category: '단모음',
    description:
      '고후설 원순 모음으로, 입술을 강하게 앞으로 내밀고 둥글게 모아 발음합니다. IPA로는 [u]로 표기됩니다. ㅗ(오)와 함께 한국어의 원순 모음 체계를 형성합니다.',
    animationFileName: 'ㅜ.mp4',
    mriFileName: 'ㅜ.mp4',
  },
  {
    _id: 'wi',
    name: 'ㅟ (위)',
    symbol: 'ㅟ',
    category: '단모음',
    description:
      '전통적으로 고전설 원순 단모음 [y]로 분류되나, 현대 서울 방언에서는 주로 이중모음 [wi]로 발음됩니다. 단모음 발음을 유지하는 화자는 전국적으로 감소하는 추세입니다.',
    animationFileName: 'ㅟ.mp4',
    mriFileName: 'ㅟ.mp4',
  },
  {
    _id: 'eu',
    name: 'ㅡ (으)',
    symbol: 'ㅡ',
    category: '단모음',
    description:
      '고중설 비원순 모음으로, IPA로는 [ɯ]로 표기됩니다. 혀의 높은 위치 중앙부에서 입술을 편 채로 발음하는 한국어 고유의 독특한 모음으로, 많은 외국어에는 존재하지 않습니다.',
    animationFileName: 'ㅡ.mp4',
    mriFileName: 'ㅡ.mp4',
  },
  {
    _id: 'i',
    name: 'ㅣ (이)',
    symbol: 'ㅣ',
    category: '단모음',
    description:
      '고전설 비원순 모음으로, IPA로는 [i]로 표기됩니다. 혀의 높은 위치 전부에서 입술을 편 채로 발음합니다. 세계 여러 언어에서 보편적으로 나타나는 가장 안정적인 모음 중 하나입니다.',
    animationFileName: 'ㅣ.mp4',
    mriFileName: 'ㅣ.mp4',
  },

  // ─── 이중모음 (Diphthongs) ──────────────────────────────────────
  {
    _id: 'ya',
    name: 'ㅑ (야)',
    symbol: 'ㅑ',
    category: '이중모음',
    description:
      '반모음 [j]와 단모음 ㅏ[ɑ]가 결합한 이중모음입니다. 혀의 전방 고위치에서 시작하여 저후설 모음 ㅏ로 빠르게 이동하며 발음합니다. IPA로는 [jɑ]로 표기됩니다.',
    animationFileName: 'ㅑ.mp4',
    mriFileName: 'ㅑ.mp4',
  },
  {
    _id: 'yae',
    name: 'ㅒ (얘)',
    symbol: 'ㅒ',
    category: '이중모음',
    description:
      '반모음 [j]와 단모음 ㅐ[ɛ]가 결합한 이중모음입니다. 현대 서울 방언에서 ㅖ(예)와 음성적 구분이 거의 소실되어 같은 발음으로 실현되는 경향이 있습니다.',
    animationFileName: 'ㅒ.mp4',
    mriFileName: 'ㅒ.mp4',
  },
  {
    _id: 'yeo',
    name: 'ㅕ (여)',
    symbol: 'ㅕ',
    category: '이중모음',
    description:
      '반모음 [j]와 단모음 ㅓ[ʌ]가 결합한 이중모음으로, IPA로는 [jʌ]로 표기됩니다. 반모음에서 중후설 모음으로 이동하는 조음 과정이 특징적입니다.',
    animationFileName: 'ㅕ.mp4',
    mriFileName: 'ㅕ.mp4',
  },
  {
    _id: 'ye',
    name: 'ㅖ (예)',
    symbol: 'ㅖ',
    category: '이중모음',
    description:
      '반모음 [j]와 단모음 ㅔ[e]가 결합한 이중모음으로, IPA로는 [je]로 표기됩니다. 현대 서울 방언에서 ㅒ(얘)와 합류하는 경향이 있습니다.',
    animationFileName: 'ㅖ.mp4',
    mriFileName: 'ㅖ.mp4',
  },
  {
    _id: 'yo',
    name: 'ㅛ (요)',
    symbol: 'ㅛ',
    category: '이중모음',
    description:
      '반모음 [j]와 단모음 ㅗ[o]가 결합한 이중모음으로, IPA로는 [jo]로 표기됩니다. 전방 고위치에서 시작하여 원순 후설 모음으로 이동하는 조음 특성을 가집니다.',
    animationFileName: 'ㅛ.mp4',
    mriFileName: 'ㅛ.mp4',
  },
  {
    _id: 'yu',
    name: 'ㅠ (유)',
    symbol: 'ㅠ',
    category: '이중모음',
    description:
      '반모음 [j]와 단모음 ㅜ[u]가 결합한 이중모음으로, IPA로는 [ju]로 표기됩니다. 고전설 반모음에서 고후설 원순 모음으로 이동합니다.',
    animationFileName: 'ㅠ.mp4',
    mriFileName: 'ㅠ.mp4',
  },
  {
    _id: 'wa',
    name: 'ㅘ (와)',
    symbol: 'ㅘ',
    category: '이중모음',
    description:
      '원순 반모음 [w]와 단모음 ㅏ[ɑ]가 결합한 이중모음으로, IPA로는 [wɑ]로 표기됩니다. 입술이 둥글게 모인 고후설 반모음에서 시작하여 저모음으로 이동합니다.',
    animationFileName: 'ㅘ.mp4',
    mriFileName: 'ㅘ.mp4',
  },
  {
    _id: 'wae',
    name: 'ㅙ (왜)',
    symbol: 'ㅙ',
    category: '이중모음',
    description:
      '원순 반모음 [w]와 단모음 ㅐ[ɛ]가 결합한 이중모음으로, IPA로는 [wɛ]로 표기됩니다. 현대 서울 방언에서 ㅞ(웨), ㅚ(외)와 합류하여 모두 [we]로 실현되는 경우가 많습니다.',
    animationFileName: 'ㅙ.mp4',
    mriFileName: 'ㅙ.mp4',
  },
  {
    _id: 'wo',
    name: 'ㅝ (워)',
    symbol: 'ㅝ',
    category: '이중모음',
    description:
      '원순 반모음 [w]와 단모음 ㅓ[ʌ]가 결합한 이중모음으로, IPA로는 [wʌ]로 표기됩니다. 원순 반모음에서 중후설 비원순 모음으로 이동하는 독특한 조음 경로를 가집니다.',
    animationFileName: 'ㅝ.mp4',
    mriFileName: 'ㅝ.mp4',
  },
  {
    _id: 'we',
    name: 'ㅞ (웨)',
    symbol: 'ㅞ',
    category: '이중모음',
    description:
      '원순 반모음 [w]와 단모음 ㅔ[e]가 결합한 이중모음으로, IPA로는 [we]로 표기됩니다. 현대 서울 방언에서 ㅙ(왜), ㅚ(외)와 음성적으로 합류하는 경향이 강하게 관찰됩니다.',
    animationFileName: 'ㅞ.mp4',
    mriFileName: 'ㅞ.mp4',
  },
  {
    _id: 'ui',
    name: 'ㅢ (의)',
    symbol: 'ㅢ',
    category: '이중모음',
    description:
      '고중설 비원순 반모음 [ɰ]와 단모음 ㅣ[i]가 결합한 이중모음으로, IPA로는 [ɰi]로 표기됩니다. 문법적 기능에 따라 실현 방식이 달라지며, 조사 "의"는 맥락에 따라 [e]로도 발음됩니다.',
    animationFileName: 'ㅢ.mp4',
    mriFileName: 'ㅢ.mp4',
  },
]
