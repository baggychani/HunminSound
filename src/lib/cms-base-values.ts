import type { SupportedTranslationLang } from '@/lib/i18n-overrides'
import { TRANSLATION_LANGS } from '@/lib/i18n-overrides'

type PhonemeDescFields = Partial<Record<`description_${SupportedTranslationLang}`, string>>

/** 자음·모음 CMS drawer용 — description_{lang} 필드 수집 */
export function buildPhonemeDescriptionBaseValues(
  item: PhonemeDescFields,
): Partial<Record<SupportedTranslationLang, string>> {
  return Object.fromEntries(
    TRANSLATION_LANGS.map(({ code }) => {
      const val = item[`description_${code}`]
      return [code, typeof val === 'string' ? val : '']
    }),
  ) as Partial<Record<SupportedTranslationLang, string>>
}

/** 훈민정음 단락 CMS drawer용 */
export function buildHunminPassageBaseValues(
  translations: Partial<Record<SupportedTranslationLang, string | undefined>>,
  excludeLangs: SupportedTranslationLang[] = [],
): Partial<Record<SupportedTranslationLang, string>> {
  return Object.fromEntries(
    TRANSLATION_LANGS.filter(({ code }) => !excludeLangs.includes(code)).map(({ code }) => [
      code,
      translations[code] ?? '',
    ]),
  ) as Partial<Record<SupportedTranslationLang, string>>
}
