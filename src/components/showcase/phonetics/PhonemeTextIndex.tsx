export interface PhonemeTextEntry {
  _id: string
  symbol: string
  name: string
  category: string
  articulationGroup?: string
  description: string
}

/**
 * 차트는 고른 기호만 그리므로, 검색엔진과 AI가 읽도록 전 설명을 HTML에만 남긴다.
 * 훈민정음 페이지의 숨긴 본문과 같다. 화면에는 나오지 않는다.
 */
export function PhonemeTextIndex({
  items,
  basePath,
}: {
  items: readonly PhonemeTextEntry[]
  /** 있으면 각 기호 이름이 /consonants/b 같은 주소로 연결된다. */
  basePath?: '/consonants' | '/vowels'
}) {
  return (
    <div hidden>
      {items.map((item) => {
        const place = [item.category, item.articulationGroup].filter(Boolean).join(' · ')
        const href = basePath ? `${basePath}/${item._id}` : null
        return (
          <article key={item._id}>
            <h2>{href ? <a href={href}>{item.name}</a> : item.name}</h2>
            {place ? <p>{place}</p> : null}
            {item.description ? <p>{item.description}</p> : null}
          </article>
        )
      })}
    </div>
  )
}
