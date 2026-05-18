'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * 메인 페이지 배경에 깔리는 색감 워시.
 *
 * 동작 원리
 *  - `position: fixed; inset: 0` 로 뷰포트 전체를 덮고 본문 뒤(-z-10)에 배치.
 *  - 3개의 큰 색 블롭(blur 가 큰 radial gradient)을 한지/잉크 위에 띄움.
 *  - `useScroll` 의 `scrollYProgress` (0 → 1) 에 따라 각 블롭의 opacity 를 lerp 해서
 *    구간이 “단으로 잘리지 않고” 스르륵 색이 바뀌는 효과를 낸다.
 *
 * - warm(황톳빛)  : 페이지 상~중단 (자음·모음 카드 부근) 강조
 * - deep(흙·먹빛) : 페이지 중단 (훈민정음 카드 부근) 강조
 * - cool(차분한 한지/잉크) : 페이지 하단 (연구 소개) 강조
 *
 * `prefers-reduced-motion` 인 경우 보간 없이 평균값으로 고정한다.
 */
export function ScrollColorWash() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()

  /* 각 블롭의 가시도(opacity)를 스크롤 구간에 따라 lerp.
   * 키프레임은 0→1 범위의 스크롤 진행도.
   *
   * 디자인 의도: 한 색이 “스르륵 들어와서 한참 머무르다가 다른 색이 겹쳐 들어옴”.
   * 따라서 각 블롭의 plateau(같은 값을 유지하는 구간)를 넓게 잡는다.
   *  - warm  : 상단~중상단을 길게 점유 (0.05–0.55 plateau).
   *  - deep  : 중간 한참을 점유 (0.35–0.75 plateau).
   *  - cool  : 하단부터 끝까지 길게 머무름 (0.65–1 plateau).
   * 이렇게 두면 인접 색끼리 30% 정도 겹쳐 흐르는 듯한 그라데이션이 된다. */
  const warmOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.55, 0.85],
    [0.45, 0.75, 0.65, 0.2],
  )
  const deepOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.75, 0.95],
    [0.15, 0.6, 0.55, 0.22],
  )
  const coolOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.65, 1],
    [0.12, 0.5, 0.6],
  )

  /* 블롭이 스크롤에 따라 위/아래로 살짝 흐르는 듯한 미세한 패럴랙스. */
  const warmY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const deepY = useTransform(scrollYProgress, [0, 1], ['6%', '-2%'])
  const coolY = useTransform(scrollYProgress, [0, 1], ['10%', '0%'])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* warm — 자음·모음 영역에서 강하게 */}
      <motion.div
        style={{
          opacity: reduce ? 0.45 : warmOpacity,
          y: reduce ? '0%' : warmY,
          background:
            'radial-gradient(60% 55% at 28% 32%, rgb(var(--wash-warm-rgb)) 0%, rgb(var(--wash-warm-rgb) / 0) 70%)',
        }}
        className="absolute -left-[18%] top-[4%] h-[70vh] w-[80vw] rounded-full blur-[120px] sm:blur-[160px]"
      />

      {/* deep — 훈민정음 카드 부근 */}
      <motion.div
        style={{
          opacity: reduce ? 0.32 : deepOpacity,
          y: reduce ? '0%' : deepY,
          background:
            'radial-gradient(58% 50% at 72% 50%, rgb(var(--wash-deep-rgb)) 0%, rgb(var(--wash-deep-rgb) / 0) 75%)',
        }}
        className="absolute -right-[20%] top-[28%] h-[75vh] w-[85vw] rounded-full blur-[130px] sm:blur-[170px]"
      />

      {/* cool — 연구 소개·하단 수렴 */}
      <motion.div
        style={{
          opacity: reduce ? 0.32 : coolOpacity,
          y: reduce ? '0%' : coolY,
          background:
            'radial-gradient(60% 55% at 40% 70%, rgb(var(--wash-cool-rgb)) 0%, rgb(var(--wash-cool-rgb) / 0) 75%)',
        }}
        className="absolute left-[5%] bottom-[-10%] h-[70vh] w-[85vw] rounded-full blur-[120px] sm:blur-[160px]"
      />
    </div>
  )
}
