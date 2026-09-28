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

function wheelDeltaPx(e: WheelEvent) {
  if (e.deltaMode === 1) return e.deltaY * 16
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight
  return e.deltaY
}

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el) return false
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName)
}

/**
 * 홈 1~4막 — 1~3막(과 3·4막 사이 자모 띠)은 "스냅 구간"이라 막 시작점에만 머물 수 있다.
 * - 휠: 스냅 구간에서는 작은 델타도 네이티브 스크롤을 막고, 누적이 기준을 넘으면 다음/이전 막으로.
 * - 키보드(↓ PageDown Space / ↑ PageUp Shift+Space): 한 번에 한 막.
 * - 그 밖의 모든 경로(스크롤바 드래그, 막대 클릭 등): 스크롤이 멈췄을 때 막 사이면 가장 가까운 막으로 붙인다.
 * 4막은 내용(문의 폼) 높이만큼 늘어날 수 있어서 4막 안쪽은 자연 스크롤, 4막 상단에서 위로 가면 3막으로.
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

    /** 막 시작 스크롤 위치들 [1막, 2막, 3막, 4막] */
    const snapPoints = (): number[] | null => {
      const act2 = act2Ref.current
      const act3 = act3Ref.current
      const act4 = act4Ref.current
      if (!act2 || !act3 || !act4) return null
      return [0, actScrollTop(act2), actScrollTop(act3), actScrollTop(act4)]
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
      const points = snapPoints()
      if (!points) return
      const y = window.scrollY
      const act4Top = points[points.length - 1]

      // 4막 안쪽 — 아래로는 자연 스크롤
      if (y >= act4Top - TOLERANCE && e.deltaY > 0) return
      // 4막 안쪽에서 위로 — 4막 상단을 넘어 띠 쪽으로 들어가려 하면 4막 상단에 붙인다
      if (y > act4Top + TOLERANCE && e.deltaY < 0) {
        if (y + wheelDeltaPx(e) < act4Top) {
          e.preventDefault()
          window.scrollTo({ top: act4Top, behavior: 'auto' })
          cooldownUntil = performance.now() + COOLDOWN_GAP_MS
        }
        return
      }

      // 스냅 구간 — 아무리 작은 델타도 네이티브 스크롤을 막는다(막 사이에 멈출 수 없게)
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
      const act4Top = points[points.length - 1]
      if (down && y >= act4Top - TOLERANCE) return
      if (up && y > act4Top + TOLERANCE) return

      e.preventDefault()
      if (locked) return
      const target = nextPoint(y, down ? 1 : -1, points)
      if (target !== undefined) void snapTo(target)
    }

    /** 스크롤이 멈췄는데 스냅 구간의 막 사이라면 가장 가까운 막으로 */
    const settle = () => {
      if (locked) return
      const points = snapPoints()
      if (!points) return
      const y = window.scrollY
      if (y >= points[points.length - 1] - TOLERANCE) return
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
