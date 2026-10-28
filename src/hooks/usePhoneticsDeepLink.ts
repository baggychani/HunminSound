'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import type { PhonemeBase } from '@/lib/phonemeRoutes'

function currentHash() {
  return typeof window === 'undefined' ? '' : window.location.hash
}

function segmentOf(basePath: string, path: string) {
  if (!path.startsWith(`${basePath}/`)) return ''
  return decodeURIComponent(path.slice(basePath.length + 1).split('/')[0] ?? '')
}

function knownId(items: readonly { _id: string }[], segment: string) {
  return items.some((item) => item._id === segment) ? segment : null
}

/**
 * 선택한 기호의 주소는 /consonants/b 이다. 보기 모드는 ?view= 로 남긴다.
 * 카드를 누를 때는 페이지를 다시 열지 않고 주소만 바꾼다. 내용은 그 자리에서 펼쳐진다.
 */
export function usePhoneticsDeepLink(basePath: PhonemeBase, items: readonly { _id: string }[]) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const itemsRef = useRef(items)
  itemsRef.current = items
  const [activeId, setActiveId] = useState<string | null>(() => knownId(items, segmentOf(basePath, pathname)))

  useEffect(() => {
    setActiveId(knownId(itemsRef.current, segmentOf(basePath, pathname)))
  }, [pathname, basePath])

  useEffect(() => {
    const onPop = () => {
      setActiveId(knownId(itemsRef.current, segmentOf(basePath, window.location.pathname)))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [basePath])

  const toggle = useCallback((nextId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('id')
    const query = params.toString()
    const closing = nextId === activeId
    const path = closing ? basePath : `${basePath}/${nextId}`
    const url = `${path}${query ? `?${query}` : ''}${currentHash()}`
    window.history.pushState(null, '', url)
    setActiveId(closing ? null : nextId)
  }, [activeId, basePath, searchParams])

  return { activeId, toggle }
}

/** 보기를 바꾸면 선택 기호는 풀어, 목록 주소로 돌아간다. */
export function usePhoneticsViewMode(basePath: PhonemeBase) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const viewMode: ChartViewMode = searchParams.get('view') === 'hunmin' ? 'hunmin' : 'modern'
  const setViewMode = useCallback((mode: ChartViewMode) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('id')
    if (mode === 'hunmin') params.set('view', mode)
    else params.delete('view')
    const query = params.toString()
    router.push(`${basePath}${query ? `?${query}` : ''}${currentHash()}`, { scroll: false })
  }, [basePath, router, searchParams])
  return { viewMode, setViewMode }
}
