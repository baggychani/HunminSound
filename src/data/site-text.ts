/**
 * 관리자 화면에서 고칠 수 있는 글은 모두 src/data/text/*.json 에만 둔다.
 * 관리자 화면에서 저장한 글도 이 파일들에 자동으로 커밋되므로, 코드로 고치기 전에 git pull 을 먼저 한다.
 * 페이지마다 필요한 JSON만 싣도록, 각 데이터 파일이 자기 JSON을 직접 불러온다.
 */

export type SiteTextType = 'consonant' | 'vowel' | 'hunminPassage' | 'home'
export type SiteTextTable = Record<string, Record<string, string>>

export const SITE_TEXT_FILES: Record<SiteTextType, string> = {
  consonant: 'src/data/text/consonants.json',
  vowel: 'src/data/text/vowels.json',
  hunminPassage: 'src/data/text/hunmin-passages.json',
  home: 'src/data/text/home.json',
}

export function withPhonemeText<T extends { _id: string; description: string }>(
  items: Omit<T, 'description'>[],
  table: SiteTextTable,
): T[] {
  return items.map((item) => {
    const row = table[item._id] ?? {}
    const fields: Record<string, string> = { description: row.ko ?? '' }
    for (const [lang, text] of Object.entries(row)) {
      if (lang !== 'ko' && text.trim()) fields[`description_${lang}`] = text
    }
    return { ...item, ...fields } as unknown as T
  })
}
