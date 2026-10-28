'use client'

import { useLayoutEffect, useRef } from 'react'

/** 예전 스크롤 보정용 빈칸. 더 이상 넣지 않고, 남아 있으면 지운다. */
const ROOM_VAR = '--symbol-detail-room'

function clearRoomBelow(): void {
  document.documentElement.style.removeProperty(ROOM_VAR)
}

/**
 * 상세는 누른 카드 아래에서 펼친다. 카드를 헤더 아래로 끌어올리지 않는다.
 * ref 는 펼친 줄에 붙여 두기만 한다.
 */
export function useScrollToSymbolDetail(activeId: string | null) {
  const detailRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!activeId) clearRoomBelow()
  }, [activeId])

  useLayoutEffect(() => clearRoomBelow, [])

  return detailRef
}
