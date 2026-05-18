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
      '\'비\'에서와 같이 첫소리로 나는 소리로, 첫소리에서는 목젖으로 콧길을 막고 두 입술을 다물었다가 벌려 입안의 공기를 밖으로 터뜨릴 때 나는 안울림 입술 파열음입니다. \'읍\'에서와 같이 끝소리로 날 때는 입안의 공기를 밖으로 터뜨리지 않고 발음합니다.',
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
      '\'피\'에서와 같이 첫소리로 목젖으로 콧길을 막고 두 입술을 다물었다가 뗄 때 거세게 나는 안울림 파열음(터짐소리)입니다. 끝소리 글자로 쓰일 때는 \'읍\'의 경우와 같습니다.',
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
      '\'삐\'에서와 같이 첫소리에서만 나는 소리로, 목젖으로 콧길을 막고 성대 쪽의 후두 근육에 힘을 준 상태로 두 입술을 다물었다가 벌려 입안의 공기를 밖으로 터뜨릴 때 나는 안울림 파열음입니다.',
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
      '\'디\'에서와 같이 첫소리로 나는 소리로, 목젖으로 콧길을 막고 혀끝을 윗잇몸에 대어 입길을 막았다가 터뜨리면서 내는 파열음입니다. \'읃\'에서와 같이 끝소리로 날 때는 마지막에 터뜨리지 않고 발음합니다.',
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
      '\'티\'에서와 같이 첫소리로만 나는 소리로, 목젖으로 콧길을 막고 혀끝을 윗잇몸(치경)에 대었다가 뗄 때 거세게 나는 안울림 파열음입니다. 끝소리 글자로 쓰일 때는 혀끝과 윗잇몸(치경) 사이를 막기만 해서 내는 소리로 \'ㄷ[읃]\'의 경우와 같습니다.',
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
      '\'띠\'에서와 같이 첫소리에서만 나는 소리로, 목젖으로 콧길을 막고 성대 쪽의 후두 근육에 힘을 준 상태로 혀끝을 윗잇몸에 대어 입길을 막았다가 세게 터뜨려 내는 안울림 파열음입니다.',
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
      '\'기\'에서와 같이 첫소리로 나는 소리로, 목젖으로 콧길을 막고 혀뿌리를 높여 여린입천장(연구개)에 붙였다가 날숨을 막았다가 뗄 때 나는 안울림소리이며, \'윽\'에서와 같은 끝소리에서는 혀뿌리를 떼지 않고 발음합니다. \'아기\'에서의 \'ㄱ[기]\'와 같이 모음 사이에서는 울림소리로 납니다.',
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
      '\'키\'에서와 같이 첫소리로 나는 소리로, 목젖으로 콧길을 막고 혀뿌리를 높여 여린입천장(연구개)에 붙여 입길을 막았다가 뗄 때 거세게 나는 안울림 파열음입니다. 끝소리 자리에 쓰일 때는 \'ㄱ[윽]\'의 경우와 같습니다.',
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
      '\'끼\'에서와 같이 첫소리에서만 나는 소리로, 목젖으로 콧길을 막고 성대 쪽의 후두 근육에 힘을 준 상태로 혓바닥 뒤쪽으로 여린입천장을 막았다가 날숨을 터뜨려 내는 여린입천장소리(연구개음) 파열음입니다. 끝소리 자리에 쓰일 때는 \'ㄱ[윽]\'과 같은 받침소리로 납니다.',
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
      '\'시\'에서와 같이 첫소리로 나는 소리로, 혀끝을 윗잇몸에 닿을 듯 말 듯, 거의 붙이다시피 올려 날숨이 그사이를 비집고 나오면서 마찰하여 나는 안울림소리입니다. \'옷\'에서와 같이 끝소리 글자로 쓰일 때는 혀끝이 윗잇몸을 막아서 \'ㄷ[읃]\'과 같아집니다.',
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
      '\'씨\'에서와 같이 첫소리에서만 나는 소리로, 목젖으로 콧길을 막고 성대 쪽의 후두 근육에 힘을 준 상태로 혀끝을 윗잇몸이나 센입천장에 거의 붙이다시피 올려 날숨이 그사이를 비집고 나오면서 마찰하여 나는 안울림소리입니다.',
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
      '\'히\'에서와 같이 첫소리로만 나는 소리로, 목청을 좁히어 숨을 내쉴 때 나오는 안울림 마찰음입니다. 끝소리 글자로 쓰일 때는 혀끝과 윗잇몸을 떼지 않고 막기만 하여서 내는 소리로 \'ㄷ[읃]\'의 경우와 같습니다.',
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
      '\'지\'에서와 같이 첫소리로만 나는 소리로, 혓바닥의 앞쪽을 센입천장(경구개)에 넓게 대었다가 터뜨리면서 마찰도 함께 일으키며 내는 안울림 파찰음입니다. 끝소리로 날 때는 혀끝으로 잇몸을 막아서 \'ㄷ[읃]\'과 같아집니다. \'모자\'에서의 \'ㅈ\'과 같이 모음 사이에서는 울림소리로 납니다.',
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
      '\'치\'에서와 같이 첫소리로만 나는 소리로, 혓바닥의 앞쪽을 센입천장에 대었다가 터뜨릴 때, 날숨을 거세게 내며 마찰도 함께 일어나는 안울림 파찰음입니다. 끝소리로 날 때는 혀끝으로 윗잇몸(치경)을 막아서 \'ㄷ[읃]\'과 같아집니다.',
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
      '\'찌\'에서와 같이 첫소리에서만 나는 소리로, 목젖으로 콧길을 막고 성대 쪽의 후두 근육에 힘을 준 상태로 혓바닥의 앞쪽을 입천장에 붙여 날숨을 막았다가 터뜨릴 때 마찰도 함께 일어나는 안울림 파찰음입니다.',
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
      '\'니\'에서와 같이 첫소리로 나는 소리로, 혀끝을 윗잇몸(치경)에 붙였다가 떼면서 날숨을 콧구멍으로 나오게 하여 코안을 울려서 내는 울림소리이며, 끝소리에서는 혀끝을 떼지 않고 발음합니다.',
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
      '\'미\'에서와 같이 첫소리로 나는 소리로, 입을 다물고 날숨을 코안으로 내보내며 목청을 울려서 내는 울림소리이며, 끝소리에서는 입술을 떼지 않고 발음합니다.',
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
      '\'이\'에서와 같이 첫소리로 날 때는 음가가 없고, \'응\'에서와 같이 끝소리에서는 혀뿌리를 높여 여린입천장에 붙여 날숨을 막았다가 코안으로 내보낼 때 나는 울림소리 콧소리입니다.',
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
      '\'리\'에서와 같이 첫소리로 나는 소리로, 첫소리 날 때는 혀끝이 윗잇몸을 한 번 가볍게 치면서 진동하는 소리이며, \'을\'에서와 같이 끝소리로 날 때는 혀끝을 윗잇몸에 꼭 붙이고 혀의 양쪽으로 공기를 내보내는 흐름소리입니다.',
    animationFileName: 'ㄹ.mp4',
    mriFileName: 'ㄹ.mp4',
  },
]
