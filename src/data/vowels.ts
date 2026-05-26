import type { Vowel } from '@/types'

export const vowelsData: Vowel[] = [
  // 천지인 — 아래아 (훈민정음 전용, 현대 음성학 차트에는 미표시) ─────────────────
  {
    _id: 'araea',
    name: '아래아 (·)',
    symbol: '·',
    category: '천지인',
    description:
      '입은 ‘ㅏ’보다는 좁히고 ‘ㅗ’보다는 더 벌려 냅니다. 입술 모양은 ‘ㅏ’처럼 벌어지지도 않고 ‘ㅗ’처럼 오므라지지도 않는 중간쯤 됩니다. 혀는 ㅗ와 같이 안쪽으로 오그리되, ㅡ를 낼 때보다 더 오그리고 혀를 아예 오그리지 않는 ㅣ보다는 훨씬 더 오그립니다. 혀중앙을 혀 안쪽으로 오그리며 발음하므로 성대가 살짝 열리면서 소리는 성대 깊숙이 울려 나옵니다.',
    pictogramFileName: '아래아.jpg',
  },

  // 단모음 (Monophthongs) ──────────────────────────────────────────────────────
  {
    _id: 'a',
    name: 'ㅏ (아)',
    symbol: 'ㅏ',
    category: '단모음',
    description:
      '평순 중설 저모음입니다. 아래턱을 최대한 내려 입을 크게 벌리고, 혓몸을 입천장으로부터 많이 떨어뜨리고, 혀뿌리를 뒤로 당겨 발음합니다. 이때 혀끝은 아랫니의 뒤쪽에 위치하나 아랫니에는 닿지 않습니다. 혀의 양옆은 윗 어금니로부터 완전히 떨어뜨립니다.',
    animationFileName: 'ani_a.mp4',
    mriFileName: 'mri_a.mp4',
  },
  {
    _id: 'ae',
    name: 'ㅐ (애)',
    symbol: 'ㅐ',
    category: '단모음',
    description:
      '평순 전설 저모음입니다. 혀를 ‘ㅏ’ 소리를 내는 위치보다 조금 높은 자리에서 약간 내밀고 입을 약간 크게 벌려 숨을 내쉬어 내는 단모음입니다.',
    animationFileName: 'ani_ae.mp4',
    mriFileName: 'mri_ae.mp4',
  },
  {
    _id: 'eo',
    name: 'ㅓ (어)',
    symbol: 'ㅓ',
    category: '단모음',
    description:
      '평순 중설 중모음입니다. 혀를 조금 올리고 입술을 중간에 놓은 뒤 입을 약간 크게 벌려 입안의 안쪽을 넓게 하면서 냅니다. 입술을 예사로 하고 입아귀를 조금 크게 벌리어 입안의 앞쪽을 넓게 하여 냅니다. 혓바닥을 조금 올려 혀는 입안에 떠 있으면서 뒤로 약간 당겨지고, 입술은 [ㅡ] 소리보다 조금 더 벌립니다.',
    animationFileName: 'ani_v.mp4',
    mriFileName: 'mri_eo.mp4',
  },
  {
    _id: 'e',
    name: 'ㅔ (에)',
    symbol: 'ㅔ',
    category: '단모음',
    description:
      '평순 전설 중모음입니다. 혀를 ‘ㅓ’ 소리를 내는 위치보다 조금 높은 자리에서 약간 내밀고 입을 보통으로 벌려 숨을 내쉬어 내는 단모음입니다.',
    animationFileName: 'ani_e.mp4',
    mriFileName: 'mri_e.mp4',
  },
  {
    _id: 'o',
    name: 'ㅗ (오)',
    symbol: 'ㅗ',
    category: '단모음',
    description:
      '원순 후설 중고모음입니다. 입술을 둥글게 하여 입술이 앞으로 약간 나오면서 입아귀를 조금 크게 벌리고 혀 뒤를 연구개에 접근시켜 조음합니다. /ㅗ/를 조음할 때에는 /ㅜ/나 /ㅡ/를 조음할 때보다 혀 뒤를 연구개에 덜 접근시킵니다. 혀끝은 아랫니 뒤쪽에 위치하지만 아랫니에는 닿지 않습니다. 혀의 양옆은 어금니에 닿지 않을 정도로 내립니다. 턱은 새끼손가락이 조금 들어갈 정도로 조금만 벌립니다.',
    animationFileName: 'ani_o.mp4',
    mriFileName: 'mri_o.mp4',
  },
  {
    _id: 'oe',
    name: 'ㅚ (외)',
    symbol: 'ㅚ',
    category: '단모음',
    description:
      '원순 전설 중모음입니다. 혀를 ‘ㅗ’ 소리를 내는 위치보다 조금 앞의 자리에 놓고 입술을 둥글게 하여 숨을 내쉬어 내는 단모음입니다. 혀와 입 모양을 ‘ㅗ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅐ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 내는 이중모음으로도 발음할 수 있습니다.',
    animationFileName: 'ani_oe.mp4',
  },
  {
    _id: 'u',
    name: 'ㅜ (우)',
    symbol: 'ㅜ',
    category: '단모음',
    description:
      '원순 후설 고모음입니다. 입술을 좀 둥글게 오므리어 앞으로 얼마간 내밀고 입아귀는 가장 작게 벌리고 혀 뒤를 연구개에 바짝 접근시켜 조음합니다. 이때 혀끝은 아랫니 뒤쪽에 위치하지만, 아랫니에는 닿지 않습니다. 혀의 양옆은 윗 어금니에 살짝 닿습니다. 턱은 아래 어금니와 윗 어금니가 거의 맞닿을 정도로 닫습니다.',
    animationFileName: 'ani_u.mp4',
    mriFileName: 'mri_u.mp4',
  },
  {
    _id: 'wi',
    name: 'ㅟ (위)',
    symbol: 'ㅟ',
    category: '단모음',
    description:
      '원순 전설 고모음입니다. 혀를 ‘ㅜ’ 소리를 내는 위치보다 조금 앞의 자리에 놓고 입술을 둥글게 하여 앞으로 내밀고 숨을 내쉬어 내는 단모음입니다. 혀와 입 모양을 ‘ㅜ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅣ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 내는 이중모음으로도 발음할 수 있습니다.',
    animationFileName: 'ani_wi.mp4',
  },
  {
    _id: 'eu',
    name: 'ㅡ (으)',
    symbol: 'ㅡ',
    category: '단모음',
    description:
      '평순 중설 고모음입니다. 입술은 작게 옆으로 평평하게 벌리고 입아귀를 가장 작게 벌리어 냅니다. 혀뒤를 여린입천장(연구개)에 바짝 접근시켜 조음합니다. 이때 혀끝은 아랫니 뒤쪽에 위치하지만 아랫니에는 닿지 않는 상황에서 혀를 안쪽으로 살짝 당기듯이 합니다. 혀의 양옆은 어금니에 살짝 닿을 정도로 접근시키고, 턱은 아래 어금니와 윗어금니가 거의 맞닿을 정도로 닫습니다.',
    animationFileName: 'ani_w.mp4',
    mriFileName: 'mri_eu.mp4',
    pictogramFileName: 'ㅡ.jpg',
  },
  {
    _id: 'i',
    name: 'ㅣ (이)',
    symbol: 'ㅣ',
    category: '단모음',
    description:
      '평순 전설 고모음입니다. 입술은 양옆으로 작게 벌리고 혀를 앞으로 다가 내면서 앞 바닥을 아주 높이어 센입천장에 가깝게 하고 입가를 앞쪽으로 조금 당기는 듯이 하고, 입아귀를 가장 작게 벌리어 냅니다. 이때 혀끝은 아랫니 뒤에 대고 혀의 양옆은 윗어금니에 단단하게 밀착시킵니다. 턱은 아랫니와 윗니가 거의 맞닿을 정도로 닫습니다.',
    animationFileName: 'ani_i.mp4',
    mriFileName: 'mri_i.mp4',
    pictogramFileName: 'ㅣ.jpg',
  },

  // 이중모음 j계 (j-Diphthongs) ─────────────────────────────────────────────
  {
    _id: 'ya',
    name: 'ㅑ (야)',
    symbol: 'ㅑ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅣ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅏ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_ja.mp4',
    mriFileName: 'mri_ya.mp4',
  },
  {
    _id: 'yae',
    name: 'ㅒ (얘)',
    symbol: 'ㅒ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅣ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅐ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_jae.mp4',
  },
  {
    _id: 'yeo',
    name: 'ㅕ (여)',
    symbol: 'ㅕ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅣ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅓ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_jv.mp4',
    mriFileName: 'mri_yeo.mp4',
  },
  {
    _id: 'ye',
    name: 'ㅖ (예)',
    symbol: 'ㅖ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅣ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅔ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_je.mp4',
  },
  {
    _id: 'yo',
    name: 'ㅛ (요)',
    symbol: 'ㅛ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅣ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅗ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_jo.mp4',
    mriFileName: 'mri_yo.mp4',
  },
  {
    _id: 'yu',
    name: 'ㅠ (유)',
    symbol: 'ㅠ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅣ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅜ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_ju.mp4',
    mriFileName: 'mri_yu.mp4',
  },

  // 이중모음 w계 (w-Diphthongs) ─────────────────────────────────────────────
  {
    _id: 'wa',
    name: 'ㅘ (와)',
    symbol: 'ㅘ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅗ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅏ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_wa.mp4',
    mriFileName: 'mri_wa.mp4',
  },
  {
    _id: 'wae',
    name: 'ㅙ (왜)',
    symbol: 'ㅙ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅗ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅐ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_wae.mp4',
  },
  {
    _id: 'wo',
    name: 'ㅝ (워)',
    symbol: 'ㅝ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅜ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅓ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_wv.mp4',
  },
  {
    _id: 'we',
    name: 'ㅞ (웨)',
    symbol: 'ㅞ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅜ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅔ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_we.mp4',
  },
  {
    _id: 'ui',
    name: 'ㅢ (의)',
    symbol: 'ㅢ',
    category: '이중모음',
    description:
      '혀와 입 모양을 ‘ㅡ’ 소리를 낼 때와 같이 하고 있다가 ‘ㅣ’ 소리를 낼 때와 같이 옮기면서 숨을 내쉬어 냅니다.',
    animationFileName: 'ani_Gi.mp4',
    mriFileName: 'mri_ui.mp4',
  },
]