'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'

function useChartNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const navigate = useCallback((update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    update(params)
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ''}${window.location.hash}`, { scroll: false })
  }, [pathname, router, searchParams])
  return { searchParams, navigate }
}

/** URL을 선택 상태의 원본으로 사용해 새로고침·공유·뒤로가기를 일치시킨다. */
export function usePhoneticsDeepLink(items: readonly { _id: string }[]) {
  const { searchParams, navigate } = useChartNavigation()
  const id = searchParams.get('id')
  const activeId = items.some((item) => item._id === id) ? id : null
  const toggle = useCallback((nextId: string) => {
    navigate((params) => {
      if (nextId === activeId) params.delete('id')
      else params.set('id', nextId)
    })
  }, [activeId, navigate])
  return { activeId, toggle }
}

/** 아래아 등 제자해 전용 글자도 같은 보기로 공유한다. */
export function usePhoneticsViewMode() {
  const { searchParams, navigate } = useChartNavigation()
  const viewMode: ChartViewMode = searchParams.get('view') === 'hunmin' ? 'hunmin' : 'modern'
  const setViewMode = useCallback((mode: ChartViewMode) => {
    navigate((params) => {
      if (mode === 'hunmin') params.set('view', mode)
      else params.delete('view')
      params.delete('id')
    })
  }, [navigate])
  return { viewMode, setViewMode }
}
