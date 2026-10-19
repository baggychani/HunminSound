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
export function PhonemeTextIndex({ items }: { items: readonly PhonemeTextEntry[] }) {
  return (
    <div hidden>
      {items.map((item) => {
        const place = [item.category, item.articulationGroup].filter(Boolean).join(' · ')
        return (
          <article key={item._id}>
            <h2>
              {item.symbol} {item.name}
            </h2>
            {place ? <p>{place}</p> : null}
            {item.description ? <p>{item.description}</p> : null}
          </article>
        )
      })}
    </div>
  )
}
