import { consonantsData } from '@/data/consonants'
import { vowelsData } from '@/data/vowels'
import { HUNMIN_PASSAGE_SECTIONS } from '@/data/hunminjeongeumPassages'
import { HOME_CMS_FIELDS, HOME_KO_BASE } from '@/data/home-content'
import { getHomeFieldBaseValues } from '@/lib/home-i18n-base'
import { TRANSLATION_LANGS, type OverridesStore } from '@/lib/i18n-overrides'
import research from '@/data/research-content.json'
import type { ResearchContent } from '@/lib/research-content'

/** 최초 저장소 생성에만 사용한다. 재배포는 현재 콘텐츠를 덮어쓰지 않는다. */
export function codeBaseline(): { overrides: OverridesStore; research: ResearchContent } {
  const overrides: OverridesStore = {}
  const add = (type: string, id: string, lang: string, value: string, source: string) => {
    overrides[`${type}:${id}:description:${lang}`] = {
      value, sourceSnapshot: source, staleDismissed: false, updatedAt: '',
    }
  }
  for (const [type, items] of [['consonant', consonantsData], ['vowel', vowelsData]] as const) {
    for (const item of items) {
      add(type, item._id, 'ko', item.description, item.description)
      for (const { code } of TRANSLATION_LANGS) {
        add(type, item._id, code, String(item[`description_${code}`] ?? ''), item.description)
      }
    }
  }
  for (const passage of HUNMIN_PASSAGE_SECTIONS.flatMap((s) => s.passages)) {
    add('hunminPassage', passage.number, 'ko', passage.korean, passage.korean)
    for (const { code } of TRANSLATION_LANGS) add('hunminPassage', passage.number, code, passage.translations[code] ?? '', passage.korean)
  }
  for (const { id } of HOME_CMS_FIELDS) {
    add('home', id, 'ko', HOME_KO_BASE[id], HOME_KO_BASE[id])
    for (const [lang, text] of Object.entries(getHomeFieldBaseValues(id))) add('home', id, lang, text ?? '', HOME_KO_BASE[id])
  }
  return { overrides, research: structuredClone(research) as ResearchContent }
}
