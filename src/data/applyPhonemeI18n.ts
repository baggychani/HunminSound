/** 자음·모음 설명 번역을 description_{lang} 필드로 붙인다. 이미 있는 번역은 덮지 않는다. */
export function applyPhonemeI18n<T extends { _id: string }>(
  items: T[],
  byLang: Record<string, Record<string, string>>,
): T[] {
  const byId: Record<string, Record<string, string>> = {}
  for (const [lang, map] of Object.entries(byLang)) {
    for (const [id, text] of Object.entries(map)) {
      if (!text.trim()) continue
      const row = byId[id] ?? {}
      row[lang] = text
      byId[id] = row
    }
  }

  return items.map((item) => {
    const extra = byId[item._id]
    if (!extra) return item
    const fields: Record<string, string> = {}
    const current = item as Record<string, unknown>
    for (const [lang, text] of Object.entries(extra)) {
      const key = `description_${lang}`
      if (typeof current[key] === 'string' && String(current[key]).trim()) continue
      fields[key] = text
    }
    return { ...item, ...fields }
  })
}
