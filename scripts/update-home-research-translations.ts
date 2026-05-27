/**
 * 3막 연구 소개 제목·본문 번역을 overrides에 반영합니다.
 * 실행: npx tsx scripts/update-home-research-translations.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { HOME_KO_BASE } from '../src/data/home-content'
import { joinHomeLines } from '../src/data/home-content'
import { HOME_RESEARCH_BY_LANG } from '../src/lib/homeResearch-i18n'
import { TRANSLATION_LANGS } from '../src/lib/i18n-overrides'

const OVERRIDES_PATH = path.join(process.cwd(), 'src/data/i18n-overrides.json')
const now = new Date().toISOString()

type Store = Record<
  string,
  { value: string; sourceSnapshot: string; staleDismissed: boolean; updatedAt: string }
>

const store: Store = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'))

for (const { code } of TRANSLATION_LANGS) {
  const r = HOME_RESEARCH_BY_LANG[code]
  const titleKey = `home:homeResearchTitle:description:${code}`
  const descKey = `home:homeResearchDesc:description:${code}`

  store[titleKey] = {
    value: r.homeResearchTitle,
    sourceSnapshot: HOME_KO_BASE.homeResearchTitle,
    staleDismissed: false,
    updatedAt: now,
  }
  store[descKey] = {
    value: joinHomeLines(r.homeResearchDesc1, r.homeResearchDesc2),
    sourceSnapshot: HOME_KO_BASE.homeResearchDesc,
    staleDismissed: false,
    updatedAt: now,
  }
}

fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8')
console.log('Updated homeResearchTitle + homeResearchDesc overrides for 10 languages')
