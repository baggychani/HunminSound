/**
 * 홈 CMS 필드 × 10개 외국어 번역을 i18n-overrides.json에 시드합니다.
 * 이미 저장된 오버라이드는 건드리지 않습니다.
 *
 * 실행: npx tsx scripts/seed-home-all-overrides.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { HOME_KO_BASE, type HomeCmsFieldId } from '../src/data/home-content'
import { getHomeFieldBaseTranslation } from '../src/lib/home-i18n-base'
import { TRANSLATION_LANGS } from '../src/lib/i18n-overrides'

const OVERRIDES_PATH = path.join(process.cwd(), 'src/data/i18n-overrides.json')
const now = new Date().toISOString()

type Store = Record<
  string,
  { value: string; sourceSnapshot: string; staleDismissed: boolean; updatedAt: string }
>

let store: Store = {}
try {
  store = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'))
} catch {
  store = {}
}

let added = 0

for (const fieldId of Object.keys(HOME_KO_BASE) as HomeCmsFieldId[]) {
  const koSource = HOME_KO_BASE[fieldId]
  for (const { code } of TRANSLATION_LANGS) {
    const key = `home:${fieldId}:description:${code}`
    if (store[key]?.value?.trim()) continue
    const value = getHomeFieldBaseTranslation(fieldId, code)
    if (!value.trim()) continue
    store[key] = {
      value,
      sourceSnapshot: koSource,
      staleDismissed: false,
      updatedAt: now,
    }
    added++
  }
}

fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8')
console.log(`Seeded ${added} home overrides (${Object.keys(store).filter((k) => k.startsWith('home:')).length} total home keys)`)
