import type { Consonant } from '@/types'

export const consonantsData: Consonant[] = [
  // ─── 파열음 (Plosives) ────────────────────────────────────────────
  // 양순 (Bilabial)
  {
    _id: 'b',
    name: 'ㅂ (비읍)',
    symbol: 'ㅂ',
    category: '파열음',
    articulationGroup: '양순',
    description:
      '두 입술(양순)이 완전히 닫혀 기류를 차단했다가 개방하는 양순 평음 파열음입니다. 어두 위치에서는 무성 무기음 [p]으로, 유성음 사이에서는 유성음 [b]으로 실현됩니다. 평음·격음·경음 삼중 대립 중 기식이 가장 약한 계열입니다.',
    animationFileName: 'ㅂ.mp4',
    mriFileName: 'ㅂ.mp4',
  },
  {
    _id: 'p',
    name: 'ㅍ (피읖)',
    symbol: 'ㅍ',
    category: '파열음',
    articulationGroup: '양순',
    description:
      '두 입술이 닫혀 기류를 차단했다가 강한 기식(aspiration)과 함께 개방하는 양순 격음 파열음입니다. VOT(Voice Onset Time)가 평음·경음에 비해 현저히 길게 나타납니다.',
    animationFileName: 'ㅍ.mp4',
    mriFileName: 'ㅍ.mp4',
  },
  {
    _id: 'bb',
    name: 'ㅃ (쌍비읍)',
    symbol: 'ㅃ',
    category: '파열음',
    articulationGroup: '양순',
    description:
      '양순에서 조음되는 경음 파열음입니다. 강한 후두 긴장(glottal constriction)을 동반하며 무기(無氣)입니다. 발화 후 후행 모음의 기본 주파수(F0)가 높게 시작되는 것이 특징입니다.',
    animationFileName: 'ㅃ.mp4',
    mriFileName: 'ㅃ.mp4',
  },
  // 치조 (Alveolar)
  {
    _id: 'd',
    name: 'ㄷ (디귿)',
    symbol: 'ㄷ',
    category: '파열음',
    articulationGroup: '치조',
    description:
      '혀끝이 치조(齒槽)에 닿아 기류를 완전히 차단했다가 개방하는 치조 평음 파열음입니다. 어두에서는 무성 무기음 [t]으로, 모음 사이에서는 유성음 [d]으로 실현됩니다.',
    animationFileName: 'ㄷ.mp4',
    mriFileName: 'ㄷ.mp4',
  },
  {
    _id: 't',
    name: 'ㅌ (티읕)',
    symbol: 'ㅌ',
    category: '파열음',
    articulationGroup: '치조',
    description:
      '혀끝이 치조에 닿아 기류를 차단했다가 강한 기식과 함께 개방하는 치조 격음 파열음입니다. 한국어 파열음 중 VOT 값이 가장 긴 계열에 속합니다.',
    animationFileName: 'ㅌ.mp4',
    mriFileName: 'ㅌ.mp4',
  },
  {
    _id: 'dd',
    name: 'ㄸ (쌍디귿)',
    symbol: 'ㄸ',
    category: '파열음',
    articulationGroup: '치조',
    description:
      '치조에서 조음되는 경음 파열음으로, 강한 후두 긴장을 동반하며 무기(無氣)입니다. 평음 ㄷ 및 격음 ㅌ과 삼중 후두 대립(three-way laryngeal contrast)을 이룹니다.',
    animationFileName: 'ㄸ.mp4',
    mriFileName: 'ㄸ.mp4',
  },
  // 연구개 (Velar)
  {
    _id: 'g',
    name: 'ㄱ (기역)',
    symbol: 'ㄱ',
    category: '파열음',
    articulationGroup: '연구개',
    description:
      '연구개(軟口蓋)와 혀의 후방부(설근)가 접촉하여 기류를 완전히 차단했다가 개방하는 연구개 평음 파열음입니다. 어두에서는 무성 무기음, 유성음 환경에서는 유성음 [ɡ]으로 실현됩니다.',
    animationFileName: 'ㄱ.mp4',
    mriFileName: 'ㄱ.mp4',
  },
  {
    _id: 'k',
    name: 'ㅋ (키읔)',
    symbol: 'ㅋ',
    category: '파열음',
    articulationGroup: '연구개',
    description:
      '연구개와 혀의 후방부가 접촉하여 기류를 차단했다가 강한 기식과 함께 개방하는 연구개 격음 파열음입니다. 한국어 연구개 파열음 삼중 대립 중 기식이 가장 강합니다.',
    animationFileName: 'ㅋ.mp4',
    mriFileName: 'ㅋ.mp4',
  },
  {
    _id: 'gg',
    name: 'ㄲ (쌍기역)',
    symbol: 'ㄲ',
    category: '파열음',
    articulationGroup: '연구개',
    description:
      '연구개에서 조음되는 경음 파열음으로, 강한 후두 긴장을 동반하며 무기(無氣)입니다. 후행 모음의 높은 F0 시작이 특징적이며, 평음 ㄱ·격음 ㅋ과 함께 삼중 대립을 이룹니다.',
    animationFileName: 'ㄲ.mp4',
    mriFileName: 'ㄲ.mp4',
  },

  // ─── 마찰음 (Fricatives) ──────────────────────────────────────────
  {
    _id: 's',
    name: 'ㅅ (시옷)',
    symbol: 'ㅅ',
    category: '마찰음',
    articulationGroup: '치조',
    description:
      '혀끝이 치조에 근접하여 좁은 공간을 만들어 기류를 마찰시키는 치조 평음 마찰음입니다. 모음 [i, j] 앞에서 구개음화되어 [ɕ]으로 실현되는 것이 대표적인 변이음 규칙입니다.',
    animationFileName: 'ㅅ.mp4',
    mriFileName: 'ㅅ.mp4',
  },
  {
    _id: 'ss',
    name: 'ㅆ (쌍시옷)',
    symbol: 'ㅆ',
    category: '마찰음',
    articulationGroup: '치조',
    description:
      '치조에서 조음되는 경음 마찰음으로, 강한 후두 긴장을 동반합니다. 한국어 마찰음 체계에서 격음 짝이 없는 독특한 계열에 속하며, 평음 ㅅ보다 강하고 날카로운 음색을 가집니다.',
    animationFileName: 'ㅆ.mp4',
    mriFileName: 'ㅆ.mp4',
  },
  {
    _id: 'h',
    name: 'ㅎ (히읗)',
    symbol: 'ㅎ',
    category: '마찰음',
    articulationGroup: '성문',
    description:
      '성문(聲門)에서 기류의 마찰이 일어나는 성문 마찰음입니다. 후행 모음의 조음 위치에 따라 조음 특성이 변화하는 양상을 보이며, 모음 사이에서는 유성 성문 마찰음 [ɦ]으로 실현됩니다.',
    animationFileName: 'ㅎ.mp4',
    mriFileName: 'ㅎ.mp4',
  },

  // ─── 파찰음 (Affricates) ─────────────────────────────────────────
  {
    _id: 'j',
    name: 'ㅈ (지읒)',
    symbol: 'ㅈ',
    category: '파찰음',
    articulationGroup: '치조경구개',
    description:
      '혀가 치조와 경구개 사이에서 접촉을 이루었다가 마찰을 일으키며 개방되는 치조 경구개 평음 파찰음입니다. 후행 [i, j] 모음 앞에서 조음 위치가 더욱 경구개 쪽으로 이동합니다.',
    animationFileName: 'ㅈ.mp4',
    mriFileName: 'ㅈ.mp4',
  },
  {
    _id: 'ch',
    name: 'ㅊ (치읓)',
    symbol: 'ㅊ',
    category: '파찰음',
    articulationGroup: '치조경구개',
    description:
      '파찰음 ㅈ에 강한 기식이 동반된 격음 계열의 치조 경구개 파찰음입니다. 개방 시 강한 기류가 함께 방출되며, VOT가 평음·경음에 비해 현저히 깁니다.',
    animationFileName: 'ㅊ.mp4',
    mriFileName: 'ㅊ.mp4',
  },
  {
    _id: 'jj',
    name: 'ㅉ (쌍지읒)',
    symbol: 'ㅉ',
    category: '파찰음',
    articulationGroup: '치조경구개',
    description:
      '치조 경구개에서 조음되는 경음 파찰음으로, 강한 후두 긴장을 동반하며 무기(無氣)입니다. 평음 ㅈ, 격음 ㅊ과 함께 한국어 파찰음의 삼중 후두 대립을 이룹니다.',
    animationFileName: 'ㅉ.mp4',
    mriFileName: 'ㅉ.mp4',
  },

  // ─── 비음 (Nasals) ───────────────────────────────────────────────
  {
    _id: 'n',
    name: 'ㄴ (니은)',
    symbol: 'ㄴ',
    category: '비음',
    articulationGroup: '치조',
    description:
      '혀끝이 치조에 닿아 구강 기류를 차단하고, 연구개를 내려 기류가 비강(鼻腔)을 통해 흘러나오는 치조 비음입니다. 어두·어중·어말 모두에서 안정적으로 나타납니다.',
    animationFileName: 'ㄴ.mp4',
    mriFileName: 'ㄴ.mp4',
  },
  {
    _id: 'm',
    name: 'ㅁ (미음)',
    symbol: 'ㅁ',
    category: '비음',
    articulationGroup: '양순',
    description:
      '두 입술이 완전히 닫혀 구강 기류를 차단하고, 비강으로 공기가 공명하며 나오는 양순 비음입니다. 모든 발화 위치에서 안정적으로 실현되며, 세계 언어에서 가장 보편적인 자음 중 하나입니다.',
    animationFileName: 'ㅁ.mp4',
    mriFileName: 'ㅁ.mp4',
  },
  {
    _id: 'ng',
    name: 'ㅇ (이응)',
    symbol: 'ㅇ',
    category: '비음',
    articulationGroup: '연구개',
    description:
      '초성 위치에서는 음가가 없으나, 종성 위치에서는 연구개 비음 [ŋ]으로 실현됩니다. 종성 ㅇ은 연구개와 혀의 후방부가 접촉하여 구강 기류를 막고 비강으로 기류를 내보내는 방식으로 조음됩니다.',
    animationFileName: 'ㅇ.mp4',
    mriFileName: 'ㅇ.mp4',
  },

  // ─── 유음 (Liquids) ──────────────────────────────────────────────
  {
    _id: 'r',
    name: 'ㄹ (리을)',
    symbol: 'ㄹ',
    category: '유음',
    articulationGroup: '치조',
    description:
      '한국어의 유일한 유음으로, 두 가지 주요 변이음을 가집니다. 모음 사이에서는 혀끝을 치조에 빠르게 한 번 두드리는 탄음(flap) [ɾ]으로, 음절말 또는 [l] 앞에서는 혀끝이 치조에 닿은 설측음(lateral) [l]으로 실현됩니다.',
    animationFileName: 'ㄹ.mp4',
    mriFileName: 'ㄹ.mp4',
  },
]
