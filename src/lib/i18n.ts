export type Lang = 'ko' | 'en' | 'zh' | 'ja' | 'fr' | 'de' | 'es' | 'hi'

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'hi', label: 'हिन्दी' },
]

/** 헤더 네비 상단 줄 — 항상 한글 고정 */
export const NAV_LABEL_KO = {
  consonants: '자음',
  vowels: '모음',
  language: '언어',
} as const

const ko = {
  siteTitle: '세종말소리',
  consonants: '자음',
  vowels: '모음',
  homeSubtitle: '한국어 조음 음성학 연구 아카이브',
  homeDescription:
    '한국어 자음과 모음의 조음(調音) 과정을 MRI 영상을 통해 탐구하는\n한국어 음성학 연구 아카이브입니다.',
  homeSub: '훈민정음 연구 프로젝트 · 세종대왕 1443년',
  homeIntroPart1:
    '훈민정음(訓民正音)의 창제 원리를 현대 음성학의 시각으로 재조명하며,',
  homeIntroPart2: 'MRI 영상 기술을 통해 조음 기관의 움직임을 시각화합니다.',
  navSubConsonants: 'Consonants',
  navSubVowels: 'Vowels',
  navSubLanguage: 'Language',
  categories: {
    파열음: '파열음',
    마찰음: '마찰음',
    파찰음: '파찰음',
    비음: '비음',
    유음: '유음',
    단모음: '단모음',
    이중모음: '이중모음',
  } as Record<string, string>,
  categoriesEn: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  } as Record<string, string>,
  mriVideo: 'MRI 영상',
  animationVideo: '조음 애니메이션',
  videoComingSoon: 'MRI 영상 준비 중',
  animationComingSoon: '애니메이션 준비 중',
  explore: '탐구하기',
  consonantsCount: '19개',
  vowelsCount: '21개',
  consonantsCardDesc:
    '파열음, 마찰음, 파찰음, 비음, 유음 등 19개 자음의 조음 과정을 탐구합니다.',
  vowelsCardDesc:
    '단모음과 이중모음 21개 모음의 혀 위치와 조음 특성을 살펴봅니다.',
  clickToExplore: '기호를 클릭하면 조음 설명과 MRI 영상을 확인할 수 있습니다.',
  monophthongDesc: '단일 조음 위치로 발음되는 순수 모음',
  diphthongDesc: '반모음과 단모음이 결합한 복합 모음',
  consonantsPageDesc:
    '한국어의 19개 자음은 조음 방법에 따라 파열음, 마찰음, 파찰음, 비음, 유음으로 분류됩니다.',
  vowelsPageDesc:
    '한국어의 모음은 단모음 10개와 이중모음 11개로 구성됩니다. 혀의 높낮이, 전후 위치, 원순성의 조합으로 각 모음이 변별됩니다.',
  language: '언어',
  footerRight: '한국어 조음 음성학 연구 아카이브',
  themeLight: '라이트',
  themeDark: '다크',
  themeSystem: '시스템',
  themeToggleAria: '표시 테마 선택',
  languagePickerAria: '언어 선택',
  siteNavMenuAria: '사이트 메뉴',
}

export type Messages = typeof ko

const en: Messages = {
  siteTitle: '세종말소리',
  consonants: 'Consonants',
  vowels: 'Vowels',
  homeSubtitle: 'Korean Articulatory Phonetics Research Archive',
  homeDescription:
    'A research archive exploring the articulation of\nKorean consonants and vowels through MRI imaging.',
  homeSub: 'Hunminjeongeum Research Project · King Sejong, 1443',
  homeIntroPart1:
    'Re-examining the principles of Hunminjeongeum (訓民正音) through the lens of modern phonetics,',
  homeIntroPart2:
    'we visualize the movement of articulatory organs using MRI imaging.',
  navSubConsonants: 'Consonants',
  navSubVowels: 'Vowels',
  navSubLanguage: 'Language',
  categories: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  },
  categoriesEn: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  },
  mriVideo: 'MRI Video',
  animationVideo: 'Articulation Animation',
  videoComingSoon: 'MRI video coming soon',
  animationComingSoon: 'Animation coming soon',
  explore: 'Explore',
  consonantsCount: '19',
  vowelsCount: '21',
  consonantsCardDesc:
    'Explore the articulation of 19 Korean consonants: plosives, fricatives, affricates, nasals, and liquids.',
  vowelsCardDesc:
    'Explore the tongue position and articulatory features of 21 Korean vowels.',
  clickToExplore: 'Click a symbol to view articulation details and MRI video.',
  monophthongDesc: 'Pure vowels with a single articulatory target',
  diphthongDesc: 'Vowels combining a glide and a monophthong',
  consonantsPageDesc:
    'Korean consonants are classified into plosives, fricatives, affricates, nasals, and liquids based on manner of articulation.',
  vowelsPageDesc:
    'Korean vowels consist of 10 monophthongs and 11 diphthongs, distinguished by tongue height, backness, and lip rounding.',
  language: 'Language',
  footerRight: 'Korean Articulatory Phonetics Research Archive',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  themeToggleAria: 'Choose display theme',
  languagePickerAria: 'Choose language',
  siteNavMenuAria: 'Open site menu',
}

const zh: Messages = {
  siteTitle: '세종말소리',
  consonants: '辅音',
  vowels: '元音',
  homeSubtitle: '韩语发音音声学研究档案',
  homeDescription: '通过MRI影像探索韩语辅音和元音\n发音过程的音声学研究档案。',
  homeSub: '训民正音研究项目 · 世宗大王 1443年',
  homeIntroPart1: '以现代语音学的视角重新审视《训民正音》的创制原理，',
  homeIntroPart2: '并通过MRI影像技术呈现发音器官的运动。',
  navSubConsonants: '辅音',
  navSubVowels: '元音',
  navSubLanguage: '语言',
  categories: {
    파열음: '爆破音',
    마찰음: '摩擦音',
    파찰음: '塞擦音',
    비음: '鼻音',
    유음: '流音',
    단모음: '单元音',
    이중모음: '复元音',
  },
  categoriesEn: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  },
  mriVideo: 'MRI影像',
  animationVideo: '发音动画',
  videoComingSoon: 'MRI影像准备中',
  animationComingSoon: '动画准备中',
  explore: '探索',
  consonantsCount: '19个',
  vowelsCount: '21个',
  consonantsCardDesc: '探索19个韩语辅音（爆破音、摩擦音、塞擦音、鼻音、流音）的发音过程。',
  vowelsCardDesc: '了解21个韩语元音的舌位和发音特点。',
  clickToExplore: '点击符号查看发音说明和MRI影像。',
  monophthongDesc: '单一发音目标的纯元音',
  diphthongDesc: '滑音与单元音结合的复合元音',
  consonantsPageDesc: '韩语辅音分为爆破音、摩擦音、塞擦音、鼻音和流音。',
  vowelsPageDesc: '韩语元音由10个单元音和11个复元音组成。',
  language: '语言',
  footerRight: '韩语发音音声学研究档案',
  themeLight: '浅色',
  themeDark: '深色',
  themeSystem: '跟随系统',
  themeToggleAria: '选择显示主题',
  languagePickerAria: '选择语言',
  siteNavMenuAria: '打开网站菜单',
}

const ja: Messages = {
  siteTitle: '세종말소리',
  consonants: '子音',
  vowels: '母音',
  homeSubtitle: '韓国語調音音声学研究アーカイブ',
  homeDescription: 'MRI映像で韓国語の子音と母音の\n調音過程を探求する音声学研究アーカイブ。',
  homeSub: '訓民正音研究プロジェクト · 世宗大王 1443年',
  homeIntroPart1: '訓民正音の創製原理を現代音声学の視点から再照明し、',
  homeIntroPart2: 'MRI映像技術を通じて調音器官の動きを可視化します。',
  navSubConsonants: '子音',
  navSubVowels: '母音',
  navSubLanguage: '言語',
  categories: {
    파열음: '閉鎖音',
    마찰음: '摩擦音',
    파찰음: '破擦音',
    비음: '鼻音',
    유음: '流音',
    단모음: '単母音',
    이중모음: '二重母音',
  },
  categoriesEn: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  },
  mriVideo: 'MRI映像',
  animationVideo: '調音アニメーション',
  videoComingSoon: 'MRI映像準備中',
  animationComingSoon: 'アニメーション準備中',
  explore: '探求する',
  consonantsCount: '19個',
  vowelsCount: '21個',
  consonantsCardDesc: '19個の韓国語子音（閉鎖音・摩擦音・破擦音・鼻音・流音）の調音を探求します。',
  vowelsCardDesc: '21個の韓国語母音の舌の位置と調音特性を学びます。',
  clickToExplore: '記号をクリックすると調音説明とMRI映像が表示されます。',
  monophthongDesc: '単一の調音目標を持つ純粋な母音',
  diphthongDesc: '半母音と単母音が結合した複合母音',
  consonantsPageDesc: '韓国語の子音は閉鎖音・摩擦音・破擦音・鼻音・流音に分類されます。',
  vowelsPageDesc: '韓国語の母音は10個の単母音と11個の二重母音で構成されます。',
  language: '言語',
  footerRight: '韓国語調音音声学研究アーカイブ',
  themeLight: 'ライト',
  themeDark: 'ダーク',
  themeSystem: 'システム',
  themeToggleAria: 'テーマを選択',
  languagePickerAria: '言語を選択',
  siteNavMenuAria: 'サイトメニュー',
}

const fr: Messages = {
  siteTitle: '세종말소리',
  consonants: 'Consonnes',
  vowels: 'Voyelles',
  homeSubtitle: 'Archive de phonétique articulatoire coréenne',
  homeDescription:
    "Une archive de recherche explorant l'articulation\ndes consonnes et voyelles coréennes par IRM.",
  homeSub: 'Projet Hunminjeongeum · Roi Sejong, 1443',
  homeIntroPart1:
    'Nous réexaminons les principes de création du Hunminjeongeum (訓民正音) du point de vue de la phonétique moderne,',
  homeIntroPart2:
    "et nous visualisons les mouvements des organes articulatoires grâce à l'imagerie par IRM.",
  navSubConsonants: 'Consonnes',
  navSubVowels: 'Voyelles',
  navSubLanguage: 'Langue',
  categories: {
    파열음: 'Occlusives',
    마찰음: 'Fricatives',
    파찰음: 'Affriquées',
    비음: 'Nasales',
    유음: 'Liquides',
    단모음: 'Monophtongues',
    이중모음: 'Diphtongues',
  },
  categoriesEn: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  },
  mriVideo: 'Vidéo IRM',
  animationVideo: 'Animation articulatoire',
  videoComingSoon: 'Vidéo IRM à venir',
  animationComingSoon: 'Animation à venir',
  explore: 'Explorer',
  consonantsCount: '19',
  vowelsCount: '21',
  consonantsCardDesc:
    "Explorez l'articulation de 19 consonnes coréennes : occlusives, fricatives, affriquées, nasales et liquides.",
  vowelsCardDesc:
    "Explorez la position de la langue et les caractéristiques articulatoires des 21 voyelles coréennes.",
  clickToExplore: "Cliquez sur un symbole pour voir les détails d'articulation et la vidéo IRM.",
  monophthongDesc: 'Voyelles pures avec une cible articulatoire unique',
  diphthongDesc: 'Voyelles combinant une semi-voyelle et une monophtongue',
  consonantsPageDesc:
    'Les consonnes coréennes sont classées en occlusives, fricatives, affriquées, nasales et liquides.',
  vowelsPageDesc:
    'Les voyelles coréennes comprennent 10 monophtongues et 11 diphtongues.',
  language: 'Langue',
  footerRight: 'Archive de phonétique articulatoire coréenne',
  themeLight: 'Clair',
  themeDark: 'Sombre',
  themeSystem: 'Système',
  themeToggleAria: 'Choisir le thème d’affichage',
  languagePickerAria: 'Choisir la langue',
  siteNavMenuAria: 'Ouvrir le menu du site',
}

const de: Messages = {
  siteTitle: '세종말소리',
  consonants: 'Konsonanten',
  vowels: 'Vokale',
  homeSubtitle: 'Forschungsarchiv zur koreanischen artikulatorischen Phonetik',
  homeDescription:
    'Ein Forschungsarchiv zur Artikulation koreanischer Konsonanten und Vokale\nmithilfe von MRT-Bildgebung.',
  homeSub: 'Hunminjeongeum-Forschungsprojekt · König Sejong, 1443',
  homeIntroPart1:
    'Wir beleuchten die Schöpfungsprinzipien des Hunminjeongeum (訓民正音) neu aus der Perspektive der modernen Phonetik,',
  homeIntroPart2:
    'und visualisieren die Bewegungen der Artikulationsorgane mit MRT-Bildgebung.',
  navSubConsonants: 'Konsonanten',
  navSubVowels: 'Vokale',
  navSubLanguage: 'Sprache',
  categories: {
    파열음: 'Plosive',
    마찰음: 'Frikative',
    파찰음: 'Affrikaten',
    비음: 'Nasale',
    유음: 'Liquide',
    단모음: 'Monophthonge',
    이중모음: 'Diphthonge',
  },
  categoriesEn: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  },
  mriVideo: 'MRT-Video',
  animationVideo: 'Artikulationsanimation',
  videoComingSoon: 'MRT-Video folgt in Kürze',
  animationComingSoon: 'Animation folgt in Kürze',
  explore: 'Erkunden',
  consonantsCount: '19',
  vowelsCount: '21',
  consonantsCardDesc:
    'Erkunden Sie die Artikulation von 19 koreanischen Konsonanten: Plosive, Frikative, Affrikaten, Nasale und Liquide.',
  vowelsCardDesc:
    'Erkunden Sie Zungenstellung und artikulatorische Merkmale der 21 koreanischen Vokale.',
  clickToExplore:
    'Klicken Sie auf ein Symbol für Artikulationsdetails und das MRT-Video.',
  monophthongDesc: 'Reine Vokale mit einem einzigen artikulatorischen Ziel',
  diphthongDesc: 'Vokale aus Halbvokal und Monophthong',
  consonantsPageDesc:
    'Die koreanischen Konsonanten werden nach Artikulationsweise in Plosive, Frikative, Affrikaten, Nasale und Liquide eingeteilt.',
  vowelsPageDesc:
    'Die koreanischen Vokale bestehen aus 10 Monophthongen und 11 Diphthongen und unterscheiden sich durch Zungenhöhe, Vorder-/Hinterzungenstellung und Lippenrundung.',
  language: 'Sprache',
  footerRight: 'Forschungsarchiv zur koreanischen artikulatorischen Phonetik',
  themeLight: 'Hell',
  themeDark: 'Dunkel',
  themeSystem: 'System',
  themeToggleAria: 'Darstellungsthema wählen',
  languagePickerAria: 'Sprache wählen',
  siteNavMenuAria: 'Seitenmenü öffnen',
}

const es: Messages = {
  siteTitle: '세종말소리',
  consonants: 'Consonantes',
  vowels: 'Vocales',
  homeSubtitle: 'Archivo de investigación de fonética articulatoria coreana',
  homeDescription:
    'Un archivo de investigación que explora la articulación de las consonantes\ny vocales coreanas mediante imágenes por resonancia magnética.',
  homeSub: 'Proyecto Hunminjeongeum · Rey Sejong, 1443',
  homeIntroPart1:
    'Reexaminamos los principios de creación del Hunminjeongeum (訓民正音) desde la perspectiva de la fonética moderna,',
  homeIntroPart2:
    'y visualizamos el movimiento de los órganos articulatorios mediante tecnología de imagen por RM.',
  navSubConsonants: 'Consonantes',
  navSubVowels: 'Vocales',
  navSubLanguage: 'Idioma',
  categories: {
    파열음: 'Oclusivas',
    마찰음: 'Fricativas',
    파찰음: 'Africadas',
    비음: 'Nasales',
    유음: 'Líquidas',
    단모음: 'Monoptongos',
    이중모음: 'Diptongos',
  },
  categoriesEn: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  },
  mriVideo: 'Video de RM',
  animationVideo: 'Animación articulatoria',
  videoComingSoon: 'Video de RM próximamente',
  animationComingSoon: 'Animación próximamente',
  explore: 'Explorar',
  consonantsCount: '19',
  vowelsCount: '21',
  consonantsCardDesc:
    'Explore la articulación de 19 consonantes coreanas: oclusivas, fricativas, africadas, nasales y líquidas.',
  vowelsCardDesc:
    'Explore la posición de la lengua y los rasgos articulatorios de las 21 vocales coreanas.',
  clickToExplore:
    'Pulse un símbolo para ver los detalles articulatorios y el video de RM.',
  monophthongDesc: 'Vocales puras con un único objetivo articulatorio',
  diphthongDesc: 'Vocales que combinan un semivocal y un monoptongo',
  consonantsPageDesc:
    'Las consonantes coreanas se clasifican en oclusivas, fricativas, africadas, nasales y líquidas según el modo de articulación.',
  vowelsPageDesc:
    'Las vocales coreanas constan de 10 monoptongos y 11 diptongos, diferenciadas por altura de lengua, posición anterior/posterior y redondeo labial.',
  language: 'Idioma',
  footerRight: 'Archivo de investigación de fonética articulatoria coreana',
  themeLight: 'Claro',
  themeDark: 'Oscuro',
  themeSystem: 'Sistema',
  themeToggleAria: 'Elegir tema de visualización',
  languagePickerAria: 'Elegir idioma',
  siteNavMenuAria: 'Abrir menú del sitio',
}

const hi: Messages = {
  siteTitle: '세종말소리',
  consonants: 'व्यंजन',
  vowels: 'स्वर',
  homeSubtitle: 'कोरियाई उच्चारण स्वर विज्ञान शोध संग्रह',
  homeDescription:
    'MRI इमेजिंग के माध्यम से कोरियाई व्यंजनों और\nस्वरों के उच्चारण की खोज करने वाला शोध संग्रह।',
  homeSub: 'हुनमिनजोंगऊम शोध परियोजना · राजा सेजोंग, 1443',
  homeIntroPart1:
    'हुनमिनजोंगअम् (訓民正音) की रचना के सिद्धांतों को आधुनिक स्वरविज्ञान की दृष्टि से पुनः प्रकाशित करते हुए,',
  homeIntroPart2:
    'MRI इमेजिंग के माध्यम से उच्चारण अंगों की गति का दृश्यीकरण करते हैं।',
  navSubConsonants: 'व्यंजन',
  navSubVowels: 'स्वर',
  navSubLanguage: 'भाषा',
  categories: {
    파열음: 'विस्फोटक',
    마찰음: 'घर्षणी',
    파찰음: 'स्पर्श-घर्षणी',
    비음: 'अनुनासिक',
    유음: 'तरल',
    단모음: 'एकल स्वर',
    이중모음: 'द्विस्वर',
  },
  categoriesEn: {
    파열음: 'Plosives',
    마찰음: 'Fricatives',
    파찰음: 'Affricates',
    비음: 'Nasals',
    유음: 'Liquids',
    단모음: 'Monophthongs',
    이중모음: 'Diphthongs',
  },
  mriVideo: 'MRI वीडियो',
  animationVideo: 'उच्चारण एनीमेशन',
  videoComingSoon: 'MRI वीडियो शीघ्र आएगा',
  animationComingSoon: 'एनीमेशन शीघ्र आएगा',
  explore: 'अन्वेषण',
  consonantsCount: '19',
  vowelsCount: '21',
  consonantsCardDesc: '19 कोरियाई व्यंजनों के उच्चारण का अन्वेषण करें।',
  vowelsCardDesc: '21 कोरियाई स्वरों की जीभ की स्थिति और उच्चारण विशेषताओं का अन्वेषण करें।',
  clickToExplore: 'उच्चारण विवरण और MRI वीडियो देखने के लिए किसी प्रतीक पर क्लिक करें।',
  monophthongDesc: 'एकल उच्चारण लक्ष्य वाले शुद्ध स्वर',
  diphthongDesc: 'अर्धस्वर और एकल स्वर का संयोजन',
  consonantsPageDesc: 'कोरियाई व्यंजनों को विस्फोटक, घर्षणी, स्पर्श-घर्षणी, अनुनासिक और तरल में वर्गीकृत किया जाता है।',
  vowelsPageDesc: 'कोरियाई स्वर में 10 एकल स्वर और 11 द्विस्वर होते हैं।',
  language: 'भाषा',
  footerRight: 'कोरियाई उच्चारण स्वर विज्ञान शोध संग्रह',
  themeLight: 'लाइट',
  themeDark: 'डार्क',
  themeSystem: 'सिस्टम',
  themeToggleAria: 'थीम चुनें',
  languagePickerAria: 'भाषा चुनें',
  siteNavMenuAria: 'साइट मेनू खोलें',
}

export const messages: Record<Lang, Messages> = {
  ko,
  en,
  zh,
  ja,
  fr,
  de,
  es,
  hi,
}

export function getMessages(lang: Lang): Messages {
  return messages[lang]
}

/** 현재 언어에 맞는 설명 텍스트를 반환. 번역 없으면 한국어 원문을 fallback. */
export function getDescription(
  item: { description: string; [key: string]: unknown },
  lang: Lang,
): { text: string; isFallback: boolean } {
  if (lang === 'ko') return { text: item.description, isFallback: false }
  const key = `description_${lang}`
  const translated = item[key]
  if (typeof translated === 'string' && translated.trim()) {
    return { text: translated, isFallback: false }
  }
  return { text: item.description, isFallback: true }
}
