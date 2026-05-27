import fs from 'node:fs'
import path from 'node:path'

function joinHomeLines(...parts) {
  return parts.map((p) => p.trim()).filter(Boolean).join('\n')
}

const KO = {
  homeSubtitle: '훈민정음 창제 원리의 과학적 재조명',
  homeIntro:
    '1443년 세종이 훈민정음(訓民正音)을 창제하며 제시한 상형 원리를,\n580여 년이 지난 오늘 MRI 영상·음성공학·AI 융합 기술로 실증합니다.',
}

const TRANSLATIONS = {
  homeSubtitle: {
    en: 'A Scientific Reillumination of the Creation Principles of Hunminjeongeum',
    zh: '科学再探训民正音的创制原理',
    ja: '訓民正音創製原理の科学的再照明',
    fr: 'Nouvel éclairage scientifique sur les principes de création du Hunminjeongeum',
    hi: 'हुनमिंजेओंगम के निर्माण सिद्धांतों पर वैज्ञानिक पुनर्दृष्टि',
    vi: 'Tái chiếu rọi khoa học về nguyên lý cấu tạo của Hunminjeongeum',
    ru: 'Научное переосмысление принципов создания Хунмин чёныма',
    ar: 'إعادة تسليط الضوء العلمي على مبادئ إنشاء الهونمين جيونغوم',
  },
  homeIntro: {
    en: joinHomeLines(
      'The principles of Sanghyeong proposed by King Sejong during the creation of Hunminjeongeum in 1443—',
      'are empirically validated today, after 580 years, through the convergence of MRI, speech engineering, and AI.',
    ),
    zh: joinHomeLines(
      '1443年世宗大王创制《训民正音》时所提出的"象形原理"，',
      '历经580余年后的今天，通过MRI图像、语音工程及AI融合技术得以科学实证。',
    ),
    ja: joinHomeLines(
      '1443年に世宗大王が『訓民正音』を創製する際に提示した「象形の原理」を、',
      '580余年が経過した今日、MRI画像・音声工学・AIの融合技術によって実証します。',
    ),
    fr: joinHomeLines(
      'Les principes de Sanghyeong (imitation des formes) proposés par le roi Sejong lors de la création du Hunminjeongeum en 1443,',
      "sont validés empiriquement aujourd'hui, plus de 580 ans après, par la convergence de l'imagerie RM, de la technologie vocale et de l'IA.",
    ),
    hi: joinHomeLines(
      "1443 में राजा सेजोंग द्वारा 'हुनमिंजे오ंगम' के निर्माण के समय प्रस्तुत किए गए 'सांघियोंग' के सिद्धांतों को,",
      '580 से अधिक वर्षों बाद आज, एमआरआई छवियों, वाक्-इंजीनियरिंग और एआई संलयन तकनीक से सिद्ध किया जा रहा है।',
    ),
    vi: joinHomeLines(
      "Nguyên lý 'Sanghyeong' (Tượng hình) được vua Sejong đề xuất khi sáng tạo Hunminjeongeum vào năm 1443,",
      'sau hơn 580 năm, nay được thực nghiệm hóa thông qua công nghệ kết hợp giữa hình ảnh MRI, công nghệ giọng nói và AI.',
    ),
    ru: joinHomeLines(
      'Принципы «Санхёна» (подражания формам), предложенные королем Седжоном при создании «Хунмин чёныма» в 1443 году,',
      'спустя более 580 лет эмпирически подтверждаются сегодня с помощью конвергенции МРТ-визуализации, речевых технологий и ИИ.',
    ),
    ar: joinHomeLines(
      'إن مبادئ "سانغهيونغ" (محاكاة الأشكال) التي طرحها الملك سيجونغ عند إنشاء "الهونمين جيونغوم" عام 1443،',
      'نثبتها اليوم تجريبيًا، بعد مرور أكثر من 580 عامًا، عبر تكامل تقنيات صور الرنين المغناطيسي (MRI)، وهندسة الصوت، والذكاء الاصطناعي (AI).',
    ),
  },
}

const OVERRIDES_PATH = path.join(process.cwd(), 'src/data/i18n-overrides.json')
const now = new Date().toISOString()

let store = {}
try {
  store = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'))
} catch {
  store = {}
}

for (const [fieldId, byLang] of Object.entries(TRANSLATIONS)) {
  const koSource = KO[fieldId]
  for (const [lang, value] of Object.entries(byLang)) {
    store[`home:${fieldId}:description:${lang}`] = {
      value,
      sourceSnapshot: koSource,
      staleDismissed: false,
      updatedAt: now,
    }
  }
}

fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8')
console.log('Seeded', Object.keys(store).filter((k) => k.startsWith('home:')).length, 'home hero overrides')
