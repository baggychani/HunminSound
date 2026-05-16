import type { Vowel } from '@/types'

export const vowelsData: Vowel[] = [
  // 단모음 (Monophthongs) ──────────────────────────────────────────────────────
  {
    _id: 'a',
    name: 'ㅏ (아)',
    symbol: 'ㅏ',
    category: '단모음',
    description:
      '한국어의 가장 기본적인 단모음으로, 혀를 낮은 위치 중앙에 두고 입을 크게 벌려 발음합니다. 비원순 중설 저모음 [a]에 가깝습니다. 한국 모음 중 가장 중립적인 조음 위치를 가진 핵심 모음입니다.',
    animationFileName: 'ani_a.mp4',
    mriFileName: 'mri_a.mp4',
  },
  {
    _id: 'ae',
    name: 'ㅐ (애)',
    symbol: 'ㅐ',
    category: '단모음',
    description:
      '중저 전설 비원순 모음으로, IPA로는 [ɛ]로 표기합니다. 현재 서울 방언에서는 ㅔ와의 구분이 차차 소실되어 두 모음의 합류(merger)가 뚜렷하게 관찰됩니다.',
    animationFileName: 'ani_ae.mp4',
    mriFileName: 'mri_ae.mp4',
  },
  {
    _id: 'eo',
    name: 'ㅓ (어)',
    symbol: 'ㅓ',
    category: '단모음',
    description:
      '중후설 비원순 모음으로, IPA로는 [ʌ]에 가깝게 표기합니다. 혀 중간 높이에서 입술을 평순한 채로 발음합니다. ㅡ와 대립을 이루며 한국어 모음 체계의 중요한 축을 구성합니다.',
    animationFileName: 'ani_v.mp4',
    mriFileName: 'mri_v.mp4',
  },
  {
    _id: 'e',
    name: 'ㅔ (에)',
    symbol: 'ㅔ',
    category: '단모음',
    description:
      '중전설 비원순 모음으로, IPA로는 [e]로 표기합니다. 현재 서울 방언에서 ㅐ와 차차 합류하는 경향이 있으며, 두 모음을 구분하지 않는 화자가 증가하고 있습니다.',
    animationFileName: 'ani_e.mp4',
    mriFileName: 'mri_e.mp4',
  },
  {
    _id: 'o',
    name: 'ㅗ (오)',
    symbol: 'ㅗ',
    category: '단모음',
    description:
      '고후설 원순 모음으로, 혀의 뒤쪽 높은 위치에서 입술을 둥글게 모아 발음합니다. IPA로는 [o]로 표기합니다. ㅜ와 함께 한국어의 원순 모음 체계를 구성합니다.',
    animationFileName: 'ani_o.mp4',
    mriFileName: 'mri_o.mp4',
  },
  {
    _id: 'oe',
    name: 'ㅚ (외)',
    symbol: 'ㅚ',
    category: '단모음',
    description:
      '전통적으로 중전설 원순 단모음 [oe]로 분류되나, 현재 서울 방언에서는 대부분이 이중모음 [we]로 발음합니다. 원래의 단모음 발음을 보존하는 화자는 차차 감소하는 경향입니다.',
    animationFileName: 'ani_oe.mp4',
    mriFileName: 'mri_oe.mp4',
  },
  {
    _id: 'u',
    name: 'ㅜ (우)',
    symbol: 'ㅜ',
    category: '단모음',
    description:
      '고후설 원순 모음으로, 입술을 강하게 둥글게 오므려 발음합니다. IPA로는 [u]로 표기합니다. ㅗ와 함께 한국어의 원순 모음 체계를 형성합니다.',
    animationFileName: 'ani_u.mp4',
    mriFileName: 'mri_u.mp4',
  },
  {
    _id: 'wi',
    name: 'ㅟ (위)',
    symbol: 'ㅟ',
    category: '단모음',
    description:
      '전통적으로 고전설 원순 단모음 [y]로 분류되나, 현재 서울 방언에서는 이중모음 [wi]로 발음됩니다. 단모음으로 발화되는 경우는 격식체나 느린 발화에서 간헐적으로 관찰됩니다.',
    animationFileName: 'ani_wi.mp4',
    mriFileName: 'mri_wi.mp4',
  },
  {
    _id: 'eu',
    name: 'ㅡ (으)',
    symbol: 'ㅡ',
    category: '단모음',
    description:
      '고후설 비원순 모음으로, IPA로는 [eu]로 표기합니다. 입술을 평순하게 유지하면서 혀를 뒤쪽 높은 곳에 두어 발음합니다. 한국어에서 독특한 위치를 차지하는 특징적인 모음입니다.',
    animationFileName: 'ani_w.mp4',
    mriFileName: 'mri_w.mp4',
  },
  {
    _id: 'i',
    name: 'ㅣ (이)',
    symbol: 'ㅣ',
    category: '단모음',
    description:
      '고전설 비원순 모음으로, 혀를 앞쪽 높은 위치에 두고 입술을 평순하게 발음합니다. IPA로는 [i]로 표기합니다. 이중모음 조음 시 활음 /j/의 기저 형태 역할도 합니다.',
    animationFileName: 'ani_i.mp4',
    mriFileName: 'mri_i.mp4',
  },

  // 이중모음 j계 (j-Diphthongs) ─────────────────────────────────────────────
  {
    _id: 'ya',
    name: 'ㅑ (야)',
    symbol: 'ㅑ',
    category: '이중모음',
    description:
      '활음 [j] 뒤에 ㅏ[a]가 결합하는 이중모음입니다. 조음 시 혀가 [i] 위치에서 시작해 빠르게 [a] 위치로 이동합니다. IPA로는 [ja]로 표기합니다.',
    animationFileName: 'ani_ja.mp4',
    mriFileName: 'mri_ja.mp4',
  },
  {
    _id: 'yae',
    name: 'ㅒ (얘)',
    symbol: 'ㅒ',
    category: '이중모음',
    description:
      '활음 [j] 뒤에 ㅐ가 결합하는 이중모음입니다. 현재 서울 방언에서는 ㅖ와의 구분이 모호해지는 경향이 있으며, 두 소리를 동일하게 발음하는 화자가 증가하고 있습니다.',
    animationFileName: 'ani_jae.mp4',
    mriFileName: 'mri_jae.mp4',
  },
  {
    _id: 'yeo',
    name: 'ㅕ (여)',
    symbol: 'ㅕ',
    category: '이중모음',
    description:
      '활음 [j] 뒤에 ㅓ가 결합하는 이중모음으로, IPA로는 [jeo]에 가깝게 표기합니다. 구어에서 매우 자주 사용되는 이중모음입니다.',
    animationFileName: 'ani_jv.mp4',
    mriFileName: 'mri_jv.mp4',
  },
  {
    _id: 'ye',
    name: 'ㅖ (예)',
    symbol: 'ㅖ',
    category: '이중모음',
    description:
      '활음 [j] 뒤에 ㅔ[e]가 결합하는 이중모음으로, IPA로는 [je]로 표기합니다. 자음 뒤에서는 단모음 [e]로 발화되는 경우가 많습니다.',
    animationFileName: 'ani_je.mp4',
    mriFileName: 'mri_je.mp4',
  },
  {
    _id: 'yo',
    name: 'ㅛ (요)',
    symbol: 'ㅛ',
    category: '이중모음',
    description:
      '활음 [j] 뒤에 ㅗ[o]가 결합하는 이중모음으로, IPA로는 [jo]로 표기합니다. 조음 시 혀가 [i] 위치에서 시작해 빠르게 원순 후설 위치로 이동합니다.',
    animationFileName: 'ani_jo.mp4',
    mriFileName: 'mri_jo.mp4',
  },
  {
    _id: 'yu',
    name: 'ㅠ (유)',
    symbol: 'ㅠ',
    category: '이중모음',
    description:
      '활음 [j] 뒤에 ㅜ[u]가 결합하는 이중모음으로, IPA로는 [ju]로 표기합니다. ㅛ와 함께 j계 원순 이중모음 쌍을 이룹니다.',
    animationFileName: 'ani_ju.mp4',
    mriFileName: 'mri_ju.mp4',
  },

  // 이중모음 w계 (w-Diphthongs) ─────────────────────────────────────────────
  {
    _id: 'wa',
    name: 'ㅘ (와)',
    symbol: 'ㅘ',
    category: '이중모음',
    description:
      'ㅗ에 ㅏ가 결합하는 이중모음으로 활음 [w]로 시작합니다. IPA로는 [wa]로 표기합니다. 구어에서 자연스럽게 발화되며 자주 사용됩니다.',
    animationFileName: 'ani_wa.mp4',
    mriFileName: 'mri_wa.mp4',
  },
  {
    _id: 'wae',
    name: 'ㅙ (왜)',
    symbol: 'ㅙ',
    category: '이중모음',
    description:
      'ㅗ에 ㅐ가 결합하는 이중모음으로, IPA로는 [wae]로 표기합니다. 현재 서울 방언에서는 ㅞ 및 ㅚ와 구분 없이 [we]로 발음하는 경향이 강합니다.',
    animationFileName: 'ani_wae.mp4',
    mriFileName: 'mri_wae.mp4',
  },
  {
    _id: 'wo',
    name: 'ㅝ (워)',
    symbol: 'ㅝ',
    category: '이중모음',
    description:
      'ㅜ에 ㅓ가 결합하는 이중모음으로 활음 [w]로 시작합니다. IPA로는 [wo]에 가깝게 표기합니다. 구어에서 자연스럽게 발화되며 자주 사용됩니다.',
    animationFileName: 'ani_wv.mp4',
    mriFileName: 'mri_wv.mp4',
  },
  {
    _id: 'we',
    name: 'ㅞ (웨)',
    symbol: 'ㅞ',
    category: '이중모음',
    description:
      'ㅜ에 ㅔ가 결합하는 이중모음으로, IPA로는 [we]로 표기합니다. 현재 서울 방언에서는 ㅙ 및 ㅚ와 합류하여 모두 [we]로 발음되는 경향이 있습니다.',
    animationFileName: 'ani_we.mp4',
    mriFileName: 'mri_we.mp4',
  },
  {
    _id: 'ui',
    name: 'ㅢ (의)',
    symbol: 'ㅢ',
    category: '이중모음',
    description:
      'ㅡ에 ㅣ가 결합하는 이중모음으로, IPA로는 [ui]로 표기합니다. 조사 "의"로 쓰일 때는 [e]로 발화되는 등 문법적 위치에 따라 발음 변이가 큰 특수한 이중모음입니다.',
    animationFileName: 'ani_Gi.mp4',
    mriFileName: 'mri_Gi.mp4',
  },
]