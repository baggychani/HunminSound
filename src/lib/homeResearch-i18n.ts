import type { Lang } from '@/lib/i18n'

export type HomeResearchMessages = {
  homeResearchLabel: string
  homeResearchTitle: string
  homeResearchDesc1: string
  homeResearchDesc2: string
  homeResearchFeature1Title: string
  homeResearchFeature1Sub: string
  homeResearchFeature2Title: string
  homeResearchFeature2Sub: string
  homeResearchFeature3Title: string
  homeResearchFeature3Sub: string
  homeResearchFeature4Title: string
  homeResearchFeature4Sub: string
  homeResearchCta: string
  homeResearchStatLabel: string
  homeResearchStatValue: string
  homeResearchStatSub: string
}

export const HOME_RESEARCH_BY_LANG: Record<Lang, HomeResearchMessages> = {
  ko: {
    homeResearchLabel: 'SCIENTIFIC APPROACH',
    homeResearchTitle: 'MRI로 밝히는 훈민정음의 비밀',
    homeResearchDesc1:
      '세종대왕은 580년 전, 인간의 발성 기관을 정밀하게 관찰하여 한글을 창제했습니다.',
    homeResearchDesc2: '현대의 3T MRI 기술과 AI 분석으로 그 놀라운 과학적 통찰을 실증합니다.',
    homeResearchFeature1Title: '3T MRI 촬영',
    homeResearchFeature1Sub: '고해상도 발성 영상',
    homeResearchFeature2Title: 'AI 파이프라인',
    homeResearchFeature2Sub: 'LSTM 기반 분석',
    homeResearchFeature3Title: '음성공학',
    homeResearchFeature3Sub: '포먼트 분석',
    homeResearchFeature4Title: '융복합 연구',
    homeResearchFeature4Sub: '인문·의학·공학',
    homeResearchCta: '연구 자세히 보기',
    homeResearchStatLabel: '피험자 규모',
    homeResearchStatValue: '73명',
    homeResearchStatSub: '서울·제주·중국어 화자',
  },
  en: {
    homeResearchLabel: 'SCIENTIFIC APPROACH',
    homeResearchTitle: 'The Secret of Hunminjeongeum, Revealed by MRI',
    homeResearchDesc1:
      '580 years ago, King Sejong observed the human vocal organs with precision and created Hangeul.',
    homeResearchDesc2:
      'Modern 3T MRI and AI analysis now empirically validate that remarkable scientific insight.',
    homeResearchFeature1Title: '3T MRI Imaging',
    homeResearchFeature1Sub: 'High-resolution articulation',
    homeResearchFeature2Title: 'AI Pipeline',
    homeResearchFeature2Sub: 'LSTM-based analysis',
    homeResearchFeature3Title: 'Speech Engineering',
    homeResearchFeature3Sub: 'Formant analysis',
    homeResearchFeature4Title: 'Convergence Research',
    homeResearchFeature4Sub: 'Humanities · Medicine · Engineering',
    homeResearchCta: 'Explore the research',
    homeResearchStatLabel: 'Participants',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'Seoul · Jeju · Mandarin speakers',
  },
  ja: {
    homeResearchLabel: '科学的アプローチ',
    homeResearchTitle: 'MRIが明かす訓民正音の秘密',
    homeResearchDesc1:
      '580年前、世宗大王は人間の発声器官を精確に観察し、ハングルを創製しました。',
    homeResearchDesc2:
      '現代の3T MRI技術とAI分析により、その驚くべき科学的洞察が実証されています。',
    homeResearchFeature1Title: '3T MRI撮影',
    homeResearchFeature1Sub: '高解像度発声映像',
    homeResearchFeature2Title: 'AIパイプライン',
    homeResearchFeature2Sub: 'LSTMベースの分析',
    homeResearchFeature3Title: '音声工学',
    homeResearchFeature3Sub: 'フォルマント分析',
    homeResearchFeature4Title: '融合研究',
    homeResearchFeature4Sub: '人文·医学·工学',
    homeResearchCta: '研究詳細を見る',
    homeResearchStatLabel: '被験者規模',
    homeResearchStatValue: '73名',
    homeResearchStatSub: 'ソウル·済州·中国語話者',
  },
  zh: {
    homeResearchLabel: '科学方法',
    homeResearchTitle: 'MRI揭示的训民正音之谜',
    homeResearchDesc1: '580年前，世宗大王精确观察人类发音器官，创制了韩文。',
    homeResearchDesc2: '现代3T MRI技术与AI分析，实证验证了那一惊人的科学洞察。',
    homeResearchFeature1Title: '3T MRI成像',
    homeResearchFeature1Sub: '高分辨率发音影像',
    homeResearchFeature2Title: 'AI分析流程',
    homeResearchFeature2Sub: '基于LSTM的分析',
    homeResearchFeature3Title: '语音工程',
    homeResearchFeature3Sub: '共振峰分析',
    homeResearchFeature4Title: '融合研究',
    homeResearchFeature4Sub: '人文·医学·工学',
    homeResearchCta: '了解研究详情',
    homeResearchStatLabel: '受试者规模',
    homeResearchStatValue: '73人',
    homeResearchStatSub: '首尔·济州·汉语使用者',
  },
  fr: {
    homeResearchLabel: 'APPROCHE SCIENTIFIQUE',
    homeResearchTitle: "Le secret du Hunminjeongeum révélé par l'IRM",
    homeResearchDesc1:
      'Il y a 580 ans, le roi Sejong observa avec précision les organes vocaux humains et créa le hangeul.',
    homeResearchDesc2:
      "L'IRM 3T et l'analyse par IA valident aujourd'hui empiriquement cette remarquable intuition scientifique.",
    homeResearchFeature1Title: 'Imagerie IRM 3T',
    homeResearchFeature1Sub: 'Articulation haute résolution',
    homeResearchFeature2Title: 'Pipeline IA',
    homeResearchFeature2Sub: 'Analyse basée sur LSTM',
    homeResearchFeature3Title: 'Ingénierie vocale',
    homeResearchFeature3Sub: 'Analyse des formants',
    homeResearchFeature4Title: 'Recherche convergente',
    homeResearchFeature4Sub: 'Humanités · Médecine · Ingénierie',
    homeResearchCta: 'Explorer la recherche',
    homeResearchStatLabel: 'Participants',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'Séoul · Jeju · locuteurs mandarin',
  },
  de: {
    homeResearchLabel: 'WISSENSCHAFTLICHER ANSATZ',
    homeResearchTitle: 'Das Geheimnis des Hunminjeongeum – enthüllt durch MRT',
    homeResearchDesc1:
      'Vor 580 Jahren beobachtete König Sejong die menschlichen Sprechorgane präzise und schuf Hangeul.',
    homeResearchDesc2:
      'Moderne 3T-MRT und KI-Analyse bestätigen empirisch diese bemerkenswerte wissenschaftliche Einsicht.',
    homeResearchFeature1Title: '3T-MRT-Aufnahme',
    homeResearchFeature1Sub: 'Hochauflösende Artikulation',
    homeResearchFeature2Title: 'KI-Pipeline',
    homeResearchFeature2Sub: 'LSTM-basierte Analyse',
    homeResearchFeature3Title: 'Sprachtechnik',
    homeResearchFeature3Sub: 'Formantanalyse',
    homeResearchFeature4Title: 'Konvergenzforschung',
    homeResearchFeature4Sub: 'Geisteswissenschaften · Medizin · Technik',
    homeResearchCta: 'Forschung entdecken',
    homeResearchStatLabel: 'Teilnehmer',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'Seoul · Jeju · Mandarinsprecher',
  },
  es: {
    homeResearchLabel: 'ENFOQUE CIENTÍFICO',
    homeResearchTitle: 'El secreto del Hunminjeongeum revelado por la RM',
    homeResearchDesc1:
      'Hace 580 años, el rey Sejong observó con precisión los órganos vocales humanos y creó el hangeul.',
    homeResearchDesc2:
      'La RM 3T y el análisis con IA validan empíricamente esa notable intuición científica.',
    homeResearchFeature1Title: 'Imagen RM 3T',
    homeResearchFeature1Sub: 'Articulación de alta resolución',
    homeResearchFeature2Title: 'Pipeline de IA',
    homeResearchFeature2Sub: 'Análisis basado en LSTM',
    homeResearchFeature3Title: 'Ingeniería del habla',
    homeResearchFeature3Sub: 'Análisis de formantes',
    homeResearchFeature4Title: 'Investigación convergente',
    homeResearchFeature4Sub: 'Humanidades · Medicina · Ingeniería',
    homeResearchCta: 'Explorar la investigación',
    homeResearchStatLabel: 'Participantes',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'Seúl · Jeju · hablantes de mandarín',
  },
  hi: {
    homeResearchLabel: 'वैज्ञानिक दृष्टिकोण',
    homeResearchTitle: 'MRI द्वारा उजागर हुन्मिन्जŏनग्‍यम् का रहस्य',
    homeResearchDesc1:
      '580 वर्ष पहले राजा सेजोंग ने मानव उच्चारण अंगों का सटीक अवलोकन कर हंगुल की रचना की।',
    homeResearchDesc2:
      'आधुनिक 3T MRI और AI विश्लेषण उस अद्भुत वैज्ञानिक अंतर्दृष्टि की empirically पुष्टि करते हैं।',
    homeResearchFeature1Title: '3T MRI imaging',
    homeResearchFeature1Sub: 'उच्च-रिज़ॉल्यूशन उच्चारण',
    homeResearchFeature2Title: 'AI pipeline',
    homeResearchFeature2Sub: 'LSTM-आधारित विश्लेषण',
    homeResearchFeature3Title: 'Speech engineering',
    homeResearchFeature3Sub: 'Formant analysis',
    homeResearchFeature4Title: 'Convergence research',
    homeResearchFeature4Sub: 'Humanities · Medicine · Engineering',
    homeResearchCta: 'अनुसंधान देखें',
    homeResearchStatLabel: 'प्रतिभागी',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'सियोल · जेजू · मंदारिन वक्ता',
  },
  vi: {
    homeResearchLabel: 'TIẾP CẬN KHOA HỌC',
    homeResearchTitle: 'Bí mật Hunminjeongeum được MRI hé lộ',
    homeResearchDesc1:
      '580 năm trước, vua Sejong quan sát chính xác cơ quan phát âm của con người và sáng tạo Hangeul.',
    homeResearchDesc2:
      'MRI 3T hiện đại và phân tích AI nay chứng minh empirically sự thấu hiểu khoa học đáng kinh ngạc đó.',
    homeResearchFeature1Title: 'Chụp MRI 3T',
    homeResearchFeature1Sub: 'Hình ảnh phát âm độ phân giải cao',
    homeResearchFeature2Title: 'Pipeline AI',
    homeResearchFeature2Sub: 'Phân tích dựa trên LSTM',
    homeResearchFeature3Title: 'Kỹ thuật giọng nói',
    homeResearchFeature3Sub: 'Phân tích formant',
    homeResearchFeature4Title: 'Nghiên cứu hội tụ',
    homeResearchFeature4Sub: 'Nhân văn · Y học · Kỹ thuật',
    homeResearchCta: 'Khám phá nghiên cứu',
    homeResearchStatLabel: 'Người tham gia',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'Seoul · Jeju · người nói tiếng Quan thoại',
  },
  ru: {
    homeResearchLabel: 'НАУЧНЫЙ ПОДХОД',
    homeResearchTitle: 'Тайна Хунминчонъыма, раскрытая МРТ',
    homeResearchDesc1:
      '580 лет назад король Сечон с точностью изучил речевой аппарат человека и создал хангыль.',
    homeResearchDesc2:
      'Современная 3T МРТ и анализ с ИИ подтверждают это поразительное научное прозрение.',
    homeResearchFeature1Title: '3T МРТ-съёмка',
    homeResearchFeature1Sub: 'Высокое разрешение артикуляции',
    homeResearchFeature2Title: 'ИИ-конвейер',
    homeResearchFeature2Sub: 'Анализ на основе LSTM',
    homeResearchFeature3Title: 'Речевая инженерия',
    homeResearchFeature3Sub: 'Анализ формант',
    homeResearchFeature4Title: 'Междисциплинарное исследование',
    homeResearchFeature4Sub: 'Гуманитарные науки · Медицина · Инженерия',
    homeResearchCta: 'Подробнее об исследовании',
    homeResearchStatLabel: 'Участники',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'Сеул · Чеджу · носители мандаринского',
  },
  ar: {
    homeResearchLabel: 'نهج علمي',
    homeResearchTitle: 'سر هونمينجونغئوم كما يكشفه التصوير بالرنين',
    homeResearchDesc1:
      'منذ 580 عامًا، راقب الملك سيجونغ أعضاء النطق البشري بدقة وابتكر الهانغول.',
    homeResearchDesc2:
      'يؤكد تصوير الرنين 3T والتحليل بالذكاء الاصطناعي اليوم تلك البصيرة العلمية البارزة.',
    homeResearchFeature1Title: 'تصوير رنين 3T',
    homeResearchFeature1Sub: 'ارتباط عالي الدقة',
    homeResearchFeature2Title: 'خط أنابيب الذكاء الاصطناعي',
    homeResearchFeature2Sub: 'تحليل قائم على LSTM',
    homeResearchFeature3Title: 'هندسة الكلام',
    homeResearchFeature3Sub: 'تحليل الفورmant',
    homeResearchFeature4Title: 'بحث متعدد التخصصات',
    homeResearchFeature4Sub: 'العلوم الإنسانية · الطب · الهندسة',
    homeResearchCta: 'استكشاف البحث',
    homeResearchStatLabel: 'المشاركون',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'سول · جيجu · متحدثو Mandarin',
  },
}
