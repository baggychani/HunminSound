/**
 * 사이트에 지금 보이는 글(관리자 화면에서 저장한 글 포함)을 코드 파일로 받아 온다.
 * GitHub 토큰이 만료돼 자동 커밋이 멈췄을 때, 코드로 고치기 전에 실행한다.
 *
 *   npm run pull-site-text
 *   npm run pull-site-text -- https://다른-주소
 */
import fs from 'fs'

const site = (process.argv[2] || 'https://www.sejongsound.org').replace(/\/$/, '')
const FILES = {
  consonant: 'src/data/text/consonants.json',
  vowel: 'src/data/text/vowels.json',
  hunminPassage: 'src/data/text/hunmin-passages.json',
  home: 'src/data/text/home.json',
}
const RESEARCH_FILE = 'src/data/research-content.json'

async function getJson(path) {
  const res = await fetch(`${site}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`${path} 를 받지 못했습니다 (${res.status})`)
  return res.json()
}

const overrides = await getJson('/api/i18n-overrides')
const tables = Object.fromEntries(Object.entries(FILES).map(([type, file]) => [type, JSON.parse(fs.readFileSync(file, 'utf8'))]))
const changed = []
for (const [key, entry] of Object.entries(overrides)) {
  const [type, id, field, lang] = key.split(':')
  const table = tables[type]
  if (!table || field !== 'description' || !table[id] || typeof entry?.value !== 'string') continue
  if ((table[id][lang] ?? '') === entry.value) continue
  table[id][lang] = entry.value
  changed.push(key)
}
for (const [type, file] of Object.entries(FILES)) {
  fs.writeFileSync(file, JSON.stringify(tables[type], null, 2) + '\n')
}

const research = await getJson('/api/research-content')
const researchText = JSON.stringify(research, null, 4) + '\n'
const researchChanged = fs.readFileSync(RESEARCH_FILE, 'utf8') !== researchText
if (researchChanged) fs.writeFileSync(RESEARCH_FILE, researchText)

console.log(`사이트(${site})의 현재 글을 받았습니다.`)
console.log(`바뀐 글 ${changed.length}개${researchChanged ? ', 연구 소개 포함' : ''}`)
for (const key of changed) console.log(`  ${key}`)
if (changed.length || researchChanged) console.log('이 변경을 커밋한 뒤 원하는 글을 고치세요.')
