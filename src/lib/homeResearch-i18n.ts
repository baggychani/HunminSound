import type { Lang } from '@/lib/i18n'
import { homeLine, homeText } from '@/data/home-text'

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
    homeResearchTitle: homeText('homeResearchTitle', 'ko'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'ko', 1),
    homeResearchDesc2: homeLine('homeResearchDesc', 'ko', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'en'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'en', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'en', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'ja'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'ja', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'ja', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'zh'),
    homeResearchDesc1: homeLine('homeResearchDesc', 'zh', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'zh', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'fr'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'fr', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'fr', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'de'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'de', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'de', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'es'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'es', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'es', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'hi'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'hi', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'hi', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'vi'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'vi', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'vi', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'ru'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'ru', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'ru', 2),
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
    homeResearchTitle: homeText('homeResearchTitle', 'ar'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'ar', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'ar', 2),
    homeResearchFeature1Title: 'تصوير رنين 3T',
    homeResearchFeature1Sub: 'ارتباط عالي الدقة',
    homeResearchFeature2Title: 'خط أنابيب الذكاء الاصطناعي',
    homeResearchFeature2Sub: 'تحليل قائم على LSTM',
    homeResearchFeature3Title: 'هندسة الكلام',
    homeResearchFeature3Sub: 'تحليل الفورمانت',
    homeResearchFeature4Title: 'بحث متعدد التخصصات',
    homeResearchFeature4Sub: 'العلوم الإنسانية · الطب · الهندسة',
    homeResearchCta: 'استكشاف البحث',
    homeResearchStatLabel: 'المشاركون',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'سول · جيجو · متحدثو المندرين',
  },
  tr: {
    homeResearchLabel: 'BİLİMSEL YAKLAŞIM',
    homeResearchTitle: homeText('homeResearchTitle', 'tr'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'tr', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'tr', 2),
    homeResearchFeature1Title: '3T MRI çekimi',
    homeResearchFeature1Sub: 'Yüksek çözünürlüklü boğumlanma',
    homeResearchFeature2Title: 'Yapay zekâ hattı',
    homeResearchFeature2Sub: 'LSTM tabanlı analiz',
    homeResearchFeature3Title: 'Konuşma mühendisliği',
    homeResearchFeature3Sub: 'Formant analizi',
    homeResearchFeature4Title: 'Disiplinler arası araştırma',
    homeResearchFeature4Sub: 'Beşeri bilimler · Tıp · Mühendislik',
    homeResearchCta: 'Araştırmayı inceleyin',
    homeResearchStatLabel: 'Katılımcı',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'Seul · Jeju · Mandarin konuşurları',
  },
  id: {
    homeResearchLabel: 'PENDEKATAN ILMIAH',
    homeResearchTitle: homeText('homeResearchTitle', 'id'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'id', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'id', 2),
    homeResearchFeature1Title: 'Pencitraan MRI 3T',
    homeResearchFeature1Sub: 'Artikulasi beresolusi tinggi',
    homeResearchFeature2Title: 'Alur AI',
    homeResearchFeature2Sub: 'Analisis berbasis LSTM',
    homeResearchFeature3Title: 'Rekayasa wicara',
    homeResearchFeature3Sub: 'Analisis forman',
    homeResearchFeature4Title: 'Riset lintas bidang',
    homeResearchFeature4Sub: 'Humaniora · Kedokteran · Teknik',
    homeResearchCta: 'Lihat penelitian',
    homeResearchStatLabel: 'Peserta',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'Seoul · Jeju · penutur Mandarin',
  },
  th: {
    homeResearchLabel: 'แนวทางวิทยาศาสตร์',
    homeResearchTitle: homeText('homeResearchTitle', 'th'),
    homeResearchDesc1:
      homeLine('homeResearchDesc', 'th', 1),
    homeResearchDesc2:
      homeLine('homeResearchDesc', 'th', 2),
    homeResearchFeature1Title: 'การถ่าย MRI 3T',
    homeResearchFeature1Sub: 'ภาพการออกเสียงความละเอียดสูง',
    homeResearchFeature2Title: 'กระบวนการ AI',
    homeResearchFeature2Sub: 'การวิเคราะห์ด้วย LSTM',
    homeResearchFeature3Title: 'วิศวกรรมเสียงพูด',
    homeResearchFeature3Sub: 'การวิเคราะห์ฟอร์แมนต์',
    homeResearchFeature4Title: 'วิจัยบูรณาการ',
    homeResearchFeature4Sub: 'มนุษยศาสตร์ · การแพทย์ · วิศวกรรม',
    homeResearchCta: 'ดูงานวิจัย',
    homeResearchStatLabel: 'ผู้เข้าร่วม',
    homeResearchStatValue: '73',
    homeResearchStatSub: 'โซล · เชจู · ผู้พูดภาษาจีนกลาง',
  },
}
