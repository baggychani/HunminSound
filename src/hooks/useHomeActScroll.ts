import { useEffect, type RefObject } from 'react'

const TOP_BAND = 48
const WHEEL_THRESHOLD = 36
const SCROLL_TIMEOUT_MS = 900

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-h').trim()
  const px = parseFloat(raw)
  return Number.isFinite(px) ? px : 64
}

function actScrollTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY - headerOffset()
}

function smoothScrollTo(top: number): Promise<void> {
  const target = Math.max(0, top)

  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      window.removeEventListener('scrollend', onScrollEnd)
      window.clearTimeout(fallback)
      resolve()
    }

    const onScrollEnd = () => finish()
    window.addEventListener('scrollend', onScrollEnd, { once: true })
    const fallback = window.setTimeout(finish, SCROLL_TIMEOUT_MS)

    window.scrollTo({ top: target, behavior: 'smooth' })
  })
}

/**
 * 홈 1~3막 — 각 막 1뷰포트, 막 경계에서만 부드럽게 스냅.
 * 4막은 내용(문의 폼) 높이만큼 확장 가능 — 4막 상단에서만 3막으로 스냅.
 */
export function useHomeActScroll(
  _act1Ref: RefObject<HTMLElement | null>,
  act2Ref: RefObject<HTMLElement | null>,
  act3Ref: RefObject<HTMLElement | null>,
  act4Ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktopMq = window.matchMedia('(min-width: 640px)')
    if (mq.matches || !desktopMq.matches) return undefined

    let locked = false
    let wheelAcc = 0
    let wheelAccTimer = 0

    const snapTo = async (top: number) => {
      if (locked) return
      locked = true
      wheelAcc = 0
      try {
        if (mq.matches) {
          window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
        } else {
          await smoothScrollTo(top)
        }
      } finally {
        locked = false
      }
    }

    const resetWheelAcc = () => {
      window.clearTimeout(wheelAccTimer)
      wheelAccTimer = window.setTimeout(() => {
        wheelAcc = 0
      }, 120)
    }

    const onWheel = (e: WheelEvent) => {
      if (locked) {
        e.preventDefault()
        return
      }

      const act2 = act2Ref.current
      const act3 = act3Ref.current
      const act4 = act4Ref.current
      if (!act2 || !act3 || !act4) return

      wheelAcc += e.deltaY
      resetWheelAcc()
      if (Math.abs(wheelAcc) < WHEEL_THRESHOLD) return

      const y = window.scrollY
      const t2 = actScrollTop(act2)
      const t3 = actScrollTop(act3)
      const t4 = actScrollTop(act4)
      const inAct1 = y < t2 - 16
      const inAct2 = y >= t2 - 16 && y < t3 - 16
      const inAct3 = y >= t3 - 16 && y < t4 - 16
      const inAct3Top = y >= t3 - 16 && y <= t3 + TOP_BAND
      const inAct4Top = y >= t4 - 16 && y <= t4 + TOP_BAND

      if (e.deltaY > 0) {
        if (inAct1) {
          e.preventDefault()
          wheelAcc = 0
          void snapTo(t2)
          return
        }
        if (inAct2) {
          e.preventDefault()
          wheelAcc = 0
          void snapTo(t3)
          return
        }
        if (inAct3) {
          e.preventDefault()
          wheelAcc = 0
          void snapTo(t4)
        }
        return
      }

      if (e.deltaY < 0) {
        if (inAct4Top) {
          e.preventDefault()
          wheelAcc = 0
          void snapTo(t3)
          return
        }
        if (inAct3Top) {
          e.preventDefault()
          wheelAcc = 0
          void snapTo(t2)
          return
        }
        if (inAct2) {
          e.preventDefault()
          wheelAcc = 0
          void snapTo(0)
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.clearTimeout(wheelAccTimer)
    }
  }, [_act1Ref, act2Ref, act3Ref, act4Ref])
}
