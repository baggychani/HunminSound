import type { Lang } from '@/lib/i18n'

/**
 * 단모음 음성학 보조 문구 — 언어별 학술 속성 순서에 맞춘 고정 번역.
 * - 中文: 舌位(전후) → 舌高 → 唇形
 * - 日本語: 円唇性 → 舌の前後 → 高さ
 * - français: hauteur → antériorité → labialisation
 * - Deutsch: Rundung → Höhe → Artikulationsort
 * - español: altura → anterioridad → redondez
 * - हिन्दी: 높이–전후–원순(영문 표기 순에 대응하는 학술 표현)
 * - Tiếng Việt: vị trí lưỡi(trước/sau) → môi tròn/không → độ mở
 * - русский: ряд → подъём → лабиализация
 * - العربية: خلفي/أمامي → مستوى الارتفاع/الانفتاح → مدور/غير مدور
 */
export const VOWEL_ARTICULATION_BY_LANG: Record<
  Exclude<Lang, 'ko' | 'en'>,
  Record<string, string>
> = {
  zh: {
    'ㅏ': '后舌、低、不圆唇元音 [a]',
    'ㅓ': '后舌、半低、不圆唇元音 [ʌ]',
    'ㅗ': '后舌、半高、圆唇元音 [o]',
    'ㅜ': '后舌、高、圆唇元音 [u]',
    'ㅡ': '后舌、高、不圆唇元音 [ɯ]',
    'ㅣ': '前舌、高、不圆唇元音 [i]',
    'ㅔ': '前舌、半高、不圆唇元音 [e]',
    'ㅐ': '前舌、半低、不圆唇元音 [ɛ]',
    'ㅟ': '前舌、高、圆唇元音 [y]',
    'ㅚ': '前舌、半高、圆唇元音 [ø]',
  },
  ja: {
    'ㅏ': '非円唇・後舌・広母音 [a]',
    'ㅓ': '非円唇・後舌・半広母音 [ʌ]',
    'ㅗ': '円唇・後舌・半狭母音 [o]',
    'ㅜ': '円唇・後舌・狭母音 [u]',
    'ㅡ': '非円唇・後舌・狭母音 [ɯ]',
    'ㅣ': '非円唇・前舌・狭母音 [i]',
    'ㅔ': '非円唇・前舌・半狭母音 [e]',
    'ㅐ': '非円唇・前舌・半広母音 [ɛ]',
    'ㅟ': '円唇・前舌・狭母音 [y]',
    'ㅚ': '円唇・前舌・半狭母音 [ø]',
  },
  fr: {
    'ㅏ': 'Voyelle basse postérieure non arrondie [a]',
    'ㅓ': 'Voyelle mi-ouverte postérieure non arrondie [ʌ]',
    'ㅗ': 'Voyelle mi-fermée postérieure arrondie [o]',
    'ㅜ': 'Voyelle haute postérieure arrondie [u]',
    'ㅡ': 'Voyelle haute postérieure non arrondie [ɯ]',
    'ㅣ': 'Voyelle haute antérieure non arrondie [i]',
    'ㅔ': 'Voyelle mi-fermée antérieure non arrondie [e]',
    'ㅐ': 'Voyelle mi-ouverte antérieure non arrondie [ɛ]',
    'ㅟ': 'Voyelle haute antérieure arrondie [y]',
    'ㅚ': 'Voyelle mi-fermée antérieure arrondie [ø]',
  },
  de: {
    'ㅏ': 'Ungerundeter offener Hinterzungenvokal [a]',
    'ㅓ': 'Ungerundeter halb offener Hinterzungenvokal [ʌ]',
    'ㅗ': 'Gerundeter halb geschlossener Hinterzungenvokal [o]',
    'ㅜ': 'Gerundeter geschlossener Hinterzungenvokal [u]',
    'ㅡ': 'Ungerundeter geschlossener Hinterzungenvokal [ɯ]',
    'ㅣ': 'Ungerundeter geschlossener Vorderzungenvokal [i]',
    'ㅔ': 'Ungerundeter halb geschlossener Vorderzungenvokal [e]',
    'ㅐ': 'Ungerundeter halb offener Vorderzungenvokal [ɛ]',
    'ㅟ': 'Gerundeter geschlossener Vorderzungenvokal [y]',
    'ㅚ': 'Gerundeter halb geschlossener Vorderzungenvokal [ø]',
  },
  es: {
    'ㅏ': 'Vocal baja posterior no redondeada [a]',
    'ㅓ': 'Vocal media abierta posterior no redondeada [ʌ]',
    'ㅗ': 'Vocal media cerrada posterior redondeada [o]',
    'ㅜ': 'Vocal alta posterior redondeada [u]',
    'ㅡ': 'Vocal alta posterior no redondeada [ɯ]',
    'ㅣ': 'Vocal alta anterior no redondeada [i]',
    'ㅔ': 'Vocal media cerrada anterior no redondeada [e]',
    'ㅐ': 'Vocal media abierta anterior no redondeada [ɛ]',
    'ㅟ': 'Vocal alta anterior redondeada [y]',
    'ㅚ': 'Vocal media cerrada anterior redondeada [ø]',
  },
  hi: {
    'ㅏ': 'निम्न पश्च अवृत्त स्वर [a]',
    'ㅓ': 'विवृत पश्च अवृत्त स्वर [ʌ]',
    'ㅗ': 'समीप-मध्यम पश्च वृत्त स्वर [o]',
    'ㅜ': 'उच्च पश्च वृत्त स्वर [u]',
    'ㅡ': 'उच्च पश्च अवृत्त स्वर [ɯ]',
    'ㅣ': 'उच्च अग्र अवृत्त स्वर [i]',
    'ㅔ': 'समीप-मध्यम अग्र अवृत्त स्वर [e]',
    'ㅐ': 'विवृत अग्र अवृत्त स्वर [ɛ]',
    'ㅟ': 'उच्च अग्र वृत्त स्वर [y]',
    'ㅚ': 'समीप-मध्यम अग्र वृत्त स्वर [ø]',
  },
  vi: {
    'ㅏ': 'Nguyên âm dòng sau, không tròn môi, mở rộng [a]',
    'ㅓ': 'Nguyên âm dòng sau, không tròn môi, độ mở vừa [ʌ]',
    'ㅗ': 'Nguyên âm dòng sau, tròn môi, độ mở vừa [o]',
    'ㅜ': 'Nguyên âm dòng sau, tròn môi, hẹp [u]',
    'ㅡ': 'Nguyên âm dòng sau, không tròn môi, hẹp [ɯ]',
    'ㅣ': 'Nguyên âm dòng trước, không tròn môi, hẹp [i]',
    'ㅔ': 'Nguyên âm dòng trước, không tròn môi, độ mở vừa-hẹp [e]',
    'ㅐ': 'Nguyên âm dòng trước, không tròn môi, độ mở vừa [ɛ]',
    'ㅟ': 'Nguyên âm dòng trước, tròn môi, hẹp [y]',
    'ㅚ': 'Nguyên âm dòng trước, tròn môi, độ mở vừa-hẹp [ø]',
  },
  ru: {
    'ㅏ': 'Гласный заднего ряда низкого подъёма нелабиализованный [a]',
    'ㅓ': 'Гласный заднего ряда среднего подъёма нелабиализованный [ʌ]',
    'ㅗ': 'Гласный заднего ряда среднего подъёма лабиализованный [o]',
    'ㅜ': 'Гласный заднего ряда высокого подъёма лабиализованный [u]',
    'ㅡ': 'Гласный заднего ряда высокого подъёма нелабиализованный [ɯ]',
    'ㅣ': 'Гласный переднего ряда высокого подъёма нелабиализованный [i]',
    'ㅔ': 'Гласный переднего ряда среднего подъёма нелабиализованный [e]',
    'ㅐ': 'Гласный переднего ряда средне-открытого подъёма нелабиализованный [ɛ]',
    'ㅟ': 'Гласный переднего ряда высокого подъёма лабиализованный [y]',
    'ㅚ': 'Гласный переднего ряда среднего подъёма лабиализованный [ø]',
  },
  ar: {
    'ㅏ': 'صائت خلفي، مفتوح، غير مدور [a]',
    'ㅓ': 'صائت خلفي، نصف مفتوح، غير مدور [ʌ]',
    'ㅗ': 'صائت خلفي، شبه مرتفع، مدور [o]',
    'ㅜ': 'صائت خلفي، مرتفع، مدور [u]',
    'ㅡ': 'صائت خلفي، مرتفع، غير مدور [ɯ]',
    'ㅣ': 'صائت أمامي، مرتفع، غير مدور [i]',
    'ㅔ': 'صائت أمامي، شبه مرتفع، غير مدور [e]',
    'ㅐ': 'صائت أمامي، نصف مفتوح، غير مدور [ɛ]',
    'ㅟ': 'صائت أمامي، مرتفع، مدور [y]',
    'ㅚ': 'صائت أمامي، شبه مرتفع، مدور [ø]',
  },
}
