import { consonantsData } from '@/data/consonants'
import { vowelsData } from '@/data/vowels'
import { readOverridesStore } from '@/lib/cms-storage'

/** 구조·영상은 코드, 편집 가능한 설명은 관리자와 동일한 현재 저장소에서 읽는다. */
async function currentItems<T extends { _id: string; description: string }>(type: string, items: T[]): Promise<T[]> {
  const store = await readOverridesStore()
  return items.map((item) => {
    const fields: Record<string, string> = {}
    for (const [key, entry] of Object.entries(store)) {
      const [kind, id, field, lang] = key.split(':')
      if (kind === type && id === item._id && field === 'description') {
        fields[lang === 'ko' ? 'description' : `description_${lang}`] = entry.value
      }
    }
    return { ...item, ...fields }
  })
}
export const loadConsonantList = () => currentItems('consonant', consonantsData)
export const loadVowelList = () => currentItems('vowel', vowelsData)
export const getConsonants = loadConsonantList
export const getVowels = loadVowelList
