import fs from 'node:fs'
import path from 'node:path'

function joinHomeLines(...parts) {
  return parts.map((p) => p.trim()).filter(Boolean).join('\n')
}

const HOME_KO = {
  homeIntro:
    '1443년 세종이 훈민정음(訓民正音)을 창제하며 제시한 상형 원리를,\n580여 년이 지난 오늘 MRI 영상·음성공학·AI 융합 기술로 실증합니다.',
  homeResearchDesc:
    '세종대왕은 580년 전, 인간의 발성 기관을 정밀하게 관찰하여 한글을 창제했습니다.\n현대의 3T MRI 기술과 AI 분석으로 그 놀라운 과학적 통찰을 실증합니다.',
}

const OVERRIDES_PATH = path.join(process.cwd(), 'src/data/i18n-overrides.json')
const LANGS = ['en', 'zh', 'ja', 'fr', 'de', 'es', 'hi', 'vi', 'ru', 'ar']
const MERGE_FIELDS = [
  { from: ['homeIntroPart1', 'homeIntroPart2'], to: 'homeIntro', ko: HOME_KO.homeIntro },
  { from: ['homeResearchDesc1', 'homeResearchDesc2'], to: 'homeResearchDesc', ko: HOME_KO.homeResearchDesc },
]

let store = {}
try {
  store = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'))
} catch {
  store = {}
}

const now = new Date().toISOString()

for (const { from, to, ko } of MERGE_FIELDS) {
  for (const lang of LANGS) {
    const oldKey1 = `home:${from[0]}:description:${lang}`
    const oldKey2 = `home:${from[1]}:description:${lang}`
    const newKey = `home:${to}:description:${lang}`
    const v1 = store[oldKey1]?.value
    const v2 = store[oldKey2]?.value
    if (v1 || v2) {
      store[newKey] = {
        value: joinHomeLines(v1 ?? '', v2 ?? ''),
        sourceSnapshot: ko,
        staleDismissed: false,
        updatedAt: now,
      }
    }
    delete store[oldKey1]
    delete store[oldKey2]
  }
  delete store[`home:${from[0]}:description:ko`]
  delete store[`home:${from[1]}:description:ko`]
}

const HERO_INTRO = {
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
    '580 से अधिक वर्षों बाद आज, एमआरआई छवियों, वाक्-इंजीनियर링 और एआई संलयन तकनीक से सिद्ध किया जा रहा है।',
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
}

for (const lang of LANGS) {
  const key = `home:homeIntro:description:${lang}`
  if (!store[key]?.value && HERO_INTRO[lang]) {
    store[key] = {
      value: HERO_INTRO[lang],
      sourceSnapshot: HOME_KO.homeIntro,
      staleDismissed: false,
      updatedAt: now,
    }
  }
}

fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8')
console.log('Migrated overrides. homeIntro keys:', Object.keys(store).filter((k) => k.includes('homeIntro')).length)
