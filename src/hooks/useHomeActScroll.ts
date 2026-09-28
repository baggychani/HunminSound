import { useEffect, type RefObject } from 'react'

const WHEEL_THRESHOLD = 36
const SCROLL_TIMEOUT_MS = 900
/** 막 시작점과 이 정도(px) 이내면 "막에 붙어 있음"으로 본다 */
const TOLERANCE = 4
/** 스냅 직후 트랙패드 관성 이벤트가 이만큼(ms) 끊길 때까지는 다음 스냅을 받지 않는다(두 막 건너뜀 방지) */
const COOLDOWN_GAP_MS = 140

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

/** 휠 방향으로 아직 더 스크롤할 수 있는 내부 요소(메시지 칸 등) 위인지 */
function canScrollInside(target: EventTarget | null, deltaY: number) {
  let el = target instanceof Element ? target : null
  while (el && el !== document.body && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el)
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      if (deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
      if (deltaY < 0 && el.scrollTop > 0) return true
    }
    el = el.parentElement
  }
  return false
}

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el) return false
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName)
}

/**
 * 홈 전체를 계단식으로만 이동 — 머물 수 있는 곳은 1·2·3·4막 시작점과 페이지 맨 아래(꼬리말까지) 다섯 칸뿐.
 * (3·4막 사이 자모 띠, 4막과 꼬리말 사이 등 칸 사이에는 멈출 수 없다)
 * - 휠: 작은 델타도 네이티브 스크롤을 막고, 누적이 기준을 넘으면 다음/이전 칸으로.
 * - 키보드(↓ PageDown Space / ↑ PageUp Shift+Space): 한 번에 한 칸.
 * - 그 밖의 모든 경로(스크롤바 드래그 등): 스크롤이 멈췄을 때 칸 사이면 가장 가까운 칸으로 붙인다.
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
    let cooldownUntil = 0
    let settleTimer = 0

    /** 머물 수 있는 스크롤 위치 [1막, 2막, 3막, 4막, 페이지 맨 아래(꼬리말까지)] */
    const snapPoints = (): number[] | null => {
      const act2 = act2Ref.current
      const act3 = act3Ref.current
      const act4 = act4Ref.current
      if (!act2 || !act3 || !act4) return null
      const act4Top = actScrollTop(act4)
      const bottom = document.documentElement.scrollHeight - window.innerHeight
      const points = [0, actScrollTop(act2), actScrollTop(act3), act4Top]
      if (bottom > act4Top + TOLERANCE) points.push(bottom)
      return points
    }

    const nextPoint = (y: number, dir: number, points: number[]) =>
      dir > 0
        ? points.find((t) => t > y + TOLERANCE)
        : [...points].reverse().find((t) => t < y - TOLERANCE)

    const snapTo = async (top: number) => {
      if (locked) return
      locked = true
      wheelAcc = 0
      try {
        await smoothScrollTo(top)
      } finally {
        locked = false
        cooldownUntil = performance.now() + COOLDOWN_GAP_MS
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
      // 메시지 칸처럼 안에서 스크롤되는 요소 위에서는 그 요소가 스크롤되게 둔다
      if (canScrollInside(e.target, e.deltaY)) return
      const points = snapPoints()
      if (!points) return
      const y = window.scrollY

      // 아무리 작은 델타도 네이티브 스크롤을 막는다(칸 사이에 멈출 수 없게)
      e.preventDefault()
      const now = performance.now()
      if (now < cooldownUntil) {
        // 관성 스크롤이 이어지는 동안은 계속 무시
        cooldownUntil = now + COOLDOWN_GAP_MS
        wheelAcc = 0
        return
      }
      wheelAcc += e.deltaY
      resetWheelAcc()
      if (Math.abs(wheelAcc) < WHEEL_THRESHOLD) return

      const target = nextPoint(y, Math.sign(wheelAcc), points)
      wheelAcc = 0
      if (target !== undefined) void snapTo(target)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTypingTarget(e.target)) return
      const down = e.key === 'PageDown' || e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey)
      const up = e.key === 'PageUp' || e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey)
      if (!down && !up) return

      const points = snapPoints()
      if (!points) return
      const y = window.scrollY

      e.preventDefault()
      if (locked) return
      const target = nextPoint(y, down ? 1 : -1, points)
      if (target !== undefined) void snapTo(target)
    }

    /** 스크롤이 멈췄는데 칸 사이라면 가장 가까운 칸으로 */
    const settle = () => {
      if (locked) return
      const points = snapPoints()
      if (!points) return
      const y = window.scrollY
      if (points.some((t) => Math.abs(t - y) <= TOLERANCE)) return
      const nearest = points.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a))
      void snapTo(nearest)
    }

    const scheduleSettle = (ms: number) => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, ms)
    }

    const hasScrollEnd = 'onscrollend' in window
    const onScrollEnd = () => settle()
    const onScroll = () => scheduleSettle(160)
    const onResize = () => scheduleSettle(200)

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    if (hasScrollEnd) window.addEventListener('scrollend', onScrollEnd)
    else window.addEventListener('scroll', onScroll, { passive: true })
    // 새로고침으로 막 사이 위치가 복원된 경우
    scheduleSettle(300)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(wheelAccTimer)
      window.clearTimeout(settleTimer)
    }
  }, [_act1Ref, act2Ref, act3Ref, act4Ref])
}
