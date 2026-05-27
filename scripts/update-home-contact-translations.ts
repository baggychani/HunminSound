/**
 * 문의하기 · 협력 안내(contactDesc) 번역을 overrides에 반영합니다.
 * 실행: npx tsx scripts/update-home-contact-translations.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { HOME_KO_BASE } from '../src/data/home-content'
import { HOME_CONTACT_BY_LANG } from '../src/lib/homeContact-i18n'
import { TRANSLATION_LANGS } from '../src/lib/i18n-overrides'

const OVERRIDES_PATH = path.join(process.cwd(), 'src/data/i18n-overrides.json')
const now = new Date().toISOString()

type Store = Record<
  string,
  { value: string; sourceSnapshot: string; staleDismissed: boolean; updatedAt: string }
>

const store: Store = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'))

for (const { code } of TRANSLATION_LANGS) {
  const key = `home:contactDesc:description:${code}`
  store[key] = {
    value: HOME_CONTACT_BY_LANG[code].contactDesc,
    sourceSnapshot: HOME_KO_BASE.contactDesc,
    staleDismissed: false,
    updatedAt: now,
  }
}

fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8')
console.log('Updated contactDesc overrides for 10 languages')
