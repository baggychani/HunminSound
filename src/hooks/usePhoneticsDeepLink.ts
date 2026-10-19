'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import type { PhonemeBase } from '@/lib/phonemeRoutes'

function currentHash() {
  return typeof window === 'undefined' ? '' : window.location.hash
}

/** 선택한 기호의 주소는 /consonants/b 이다. 보기 모드는 ?view= 로 남긴다. */
export function usePhoneticsDeepLink(basePath: PhonemeBase, items: readonly { _id: string }[]) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const segment = pathname.startsWith(`${basePath}/`)
    ? decodeURIComponent(pathname.slice(basePath.length + 1).split('/')[0] ?? '')
    : ''
  const activeId = items.some((item) => item._id === segment) ? segment : null

  const toggle = useCallback((nextId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('id')
    const query = params.toString()
    const path = nextId === activeId ? basePath : `${basePath}/${nextId}`
    router.push(`${path}${query ? `?${query}` : ''}${currentHash()}`, { scroll: false })
  }, [activeId, basePath, router, searchParams])

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
