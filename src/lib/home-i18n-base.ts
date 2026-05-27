import type { Lang } from '@/lib/i18n'
import { messages } from '@/lib/i18n'
import { HOME_RESEARCH_BY_LANG } from '@/lib/homeResearch-i18n'
import { HOME_CONTACT_BY_LANG } from '@/lib/homeContact-i18n'
import { joinHomeLines, type HomeCmsFieldId } from '@/data/home-content'
import { TRANSLATION_LANGS, type SupportedTranslationLang } from '@/lib/i18n-overrides'

/** CMS TranslationDrawer용 — 정적 i18n 파일에서 수집한 기본 번역 */
export function getHomeFieldBaseTranslation(
  fieldId: HomeCmsFieldId,
  lang: SupportedTranslationLang,
): string {
  if (fieldId === 'homeSubtitle') {
    return messages[lang].homeSubtitle
  }
  if (fieldId === 'homeIntro') {
    const m = messages[lang]
    return joinHomeLines(m.homeIntroPart1, m.homeIntroPart2)
  }
  if (fieldId === 'homeResearchTitle') {
    return HOME_RESEARCH_BY_LANG[lang].homeResearchTitle
  }
  if (fieldId === 'homeResearchDesc') {
    const r = HOME_RESEARCH_BY_LANG[lang]
    return joinHomeLines(r.homeResearchDesc1, r.homeResearchDesc2)
  }
  if (fieldId === 'contactDesc') {
    return HOME_CONTACT_BY_LANG[lang].contactDesc
  }
  return ''
}

export function getHomeFieldBaseValues(
  fieldId: HomeCmsFieldId,
): Partial<Record<SupportedTranslationLang, string>> {
  return Object.fromEntries(
    TRANSLATION_LANGS.map(({ code }) => [code, getHomeFieldBaseTranslation(fieldId, code)]),
  ) as Partial<Record<SupportedTranslationLang, string>>
}

/** de/es 등 drawer 외 언어 포함 전체 Lang 기본값 */
export function getHomeFieldForLang(fieldId: HomeCmsFieldId, lang: Lang): string {
  if (fieldId === 'homeSubtitle') return messages[lang].homeSubtitle
  if (fieldId === 'homeIntro') {
    const m = messages[lang]
    return joinHomeLines(m.homeIntroPart1, m.homeIntroPart2)
  }
  if (fieldId === 'homeResearchTitle') return HOME_RESEARCH_BY_LANG[lang].homeResearchTitle
  if (fieldId === 'homeResearchDesc') {
    const r = HOME_RESEARCH_BY_LANG[lang]
    return joinHomeLines(r.homeResearchDesc1, r.homeResearchDesc2)
  }
  return HOME_CONTACT_BY_LANG[lang].contactDesc
}
