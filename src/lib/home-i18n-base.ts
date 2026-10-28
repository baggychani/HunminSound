import type { Lang } from '@/lib/i18n'
import { homeText } from '@/data/home-text'
import type { HomeCmsFieldId } from '@/data/home-content'
import { TRANSLATION_LANGS, type SupportedTranslationLang } from '@/lib/i18n-overrides'

/** CMS TranslationDrawer용 — src/data/text/home.json 의 기본 번역 */
export function getHomeFieldBaseTranslation(
  fieldId: HomeCmsFieldId,
  lang: SupportedTranslationLang,
): string {
  return homeText(fieldId, lang)
}

export function getHomeFieldBaseValues(
  fieldId: HomeCmsFieldId,
): Partial<Record<SupportedTranslationLang, string>> {
  return Object.fromEntries(
    TRANSLATION_LANGS.map(({ code }) => [code, getHomeFieldBaseTranslation(fieldId, code)]),
  ) as Partial<Record<SupportedTranslationLang, string>>
}

/** 한국어 포함 전체 Lang 기본값 */
export function getHomeFieldForLang(fieldId: HomeCmsFieldId, lang: Lang): string {
  return homeText(fieldId, lang)
}
