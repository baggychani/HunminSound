import type { Lang } from '@/lib/i18n'
import type { Messages } from '@/lib/i18n'
import type { V2Messages } from '@/lib/v2-i18n'
import type { HomeCmsFieldId } from '@/data/home-content'
import { getHomeFieldForLang } from '@/lib/home-i18n-base'
import { makeOverrideKey, isSupportedTranslationLang, type OverridesStore, type SupportedTranslationLang } from '@/lib/i18n-overrides'
import { makeHomeKoreanKey } from '@/lib/overrides-store'

export type HomeMessages = Messages & {
  homeIntro: string
  homeResearchDesc: string
}

function applyField(
  store: OverridesStore,
  fieldId: HomeCmsFieldId,
  lang: Lang,
  fallback: string,
): string {
  if (lang === 'ko') {
    return store[makeHomeKoreanKey(fieldId)]?.value ?? fallback
  }
  if (!isSupportedTranslationLang(lang)) return fallback
  const key = makeOverrideKey('home', fieldId, lang)
  return store[key]?.value ?? fallback
}

export function applyHomeOverridesToMessages(
  base: Messages,
  lang: Lang,
  store: OverridesStore,
): HomeMessages {
  return {
    ...base,
    homeSubtitle: applyField(store, 'homeSubtitle', lang, getHomeFieldForLang('homeSubtitle', lang)),
    homeIntro: applyField(store, 'homeIntro', lang, getHomeFieldForLang('homeIntro', lang)),
    homeResearchTitle: applyField(
      store,
      'homeResearchTitle',
      lang,
      getHomeFieldForLang('homeResearchTitle', lang),
    ),
    homeResearchDesc: applyField(
      store,
      'homeResearchDesc',
      lang,
      getHomeFieldForLang('homeResearchDesc', lang),
    ),
  }
}

export function applyHomeOverridesToV2(
  base: V2Messages,
  lang: Lang,
  store: OverridesStore,
): V2Messages {
  const fallback = base.contactDesc
  const contactDesc = applyField(store, 'contactDesc', lang, fallback)
  return {
    ...base,
    contactDesc: contactDesc as typeof base.contactDesc,
  }
}
