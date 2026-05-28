'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/** `/vowels?id=eo` · `/consonants?id=g` 등 URL 쿼리로 차트 항목을 연다. */
export function usePhoneticsDeepLink(
  items: readonly { _id: string }[],
  setActiveId: (id: string | null) => void,
) {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    if (!id) return
    if (items.some((item) => item._id === id)) {
      setActiveId(id)
    }
  }, [id, items, setActiveId])
}
