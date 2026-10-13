'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

/**
 * 홈 배경 — 한지 위에 은은히 떠 있는 자모(옛글자 포함) 장식.
 * 데스크톱(lg)은 화면 전체에 두고 세로 스크롤에 맞춰 위아래로 조금 흐른다.
 * 폰은 헤더 바로 아래 띠에만 두고, 좌우로 넘길 때 가로로만 조금 흐른다.
 * `fixed`로 뷰포트에 고정해서, 막을 넘나들어도 흩뿌린 위치가 그대로 유지된다
 * (예전엔 막마다 따로 자기 자리에 절대배치돼서 2막에서 배치가 확 바뀌어 보였음).
 * 1·2·4막은 이 ink 필드가 그대로 보이고, 3막은 불투명한 다크 배경이 이 필드를 덮는 대신
 * 3막 안에 같은 좌표의 inverse(흰 글자) 필드를 3막 영역으로 clip해서 깐다 — 스크롤하면
 * 3막 경계선을 따라 같은 글자가 흑백 반전돼 보인다(HomeResearchAct 참고).
 *
 * @stacking-context-note — 반드시 1막 `<section>` 안, `HeroActBackdrop` 바로 다음에
 * 렌더할 것(페이지 루트로 옮기지 말 것). 1막 section은 `relative z-10`로 자체
 * 스태킹 컨텍스트를 만들기 때문에, 이 필드를 페이지 루트로 빼면 1막 내부의
 * z-[1]<->z-0(backdrop) 관계가 아니라 "1막 section(z-10) 전체" 대 "필드"로
 * 비교가 바뀌어서, backdrop의 불투명한 feather 오버레이가 필드를 통째로 덮어버린다
 * (실제로 한 번 이렇게 배치했다가 1막에서 안 보이는 회귀가 났었음). `fixed`는
 * 위치만 뷰포트 기준이고 페인트 순서는 원래 DOM 위치의 스태킹 규칙을 그대로 따르므로,
 * 1막 안에 그대로 두면 1막에서는 backdrop 위·본문 아래로, 2막으로 스크롤해도 화면에
 * 남아있으면서 2막의 불투명 카드 아래로 자연스럽게 깔린다(2막 section이 DOM에서
 * 나중이라 같은 z-10끼리는 2막이 위에 그려짐).
 */
/**
 * 스크롤 시차 — `depth`(px / 스크롤 px)만큼 세로로만 일정하게 흐른다(페이지 끝까지 최대 약 60px).
 * 방향(+아래/−위)을 화면 위치와 무관하게 섞어서, 전체가 한쪽으로 모이지 않고 막마다 배치만 조금씩 바뀐다.
 * 가로 이동·곡선 궤적은 정신없어 보여서 뺐다. 맨 위(scrollY=0)에서는 이동 0 — 1막 배치 그대로.
 */
const GLYPHS = [
  { ch: 'ㆍ', left: '6%', top: '16%', size: '1.5rem', dur: 16, delay: 0, rot: 4, op: 0.16, depth: -0.012 },
  { ch: 'ㅿ', left: '11%', top: '34%', size: '2.1rem', dur: 19, delay: 2.4, rot: -6, op: 0.11, depth: 0.02 },
  { ch: 'ㆁ', left: '4%', top: '55%', size: '1.7rem', dur: 14, delay: 1.1, rot: 5, op: 0.13, depth: -0.018 },
  { ch: 'ㆆ', left: '13%', top: '72%', size: '1.4rem', dur: 17, delay: 3.6, rot: -4, op: 0.12, depth: 0.012 },
  { ch: 'ㄱ', left: '8%', top: '88%', size: '1.2rem', dur: 15, delay: 0.8, rot: 7, op: 0.1, depth: -0.022 },
  { ch: 'ㅅ', left: '19%', top: '12%', size: '1.15rem', dur: 18, delay: 4.2, rot: -5, op: 0.1, depth: 0.016 },
  { ch: 'ㅁ', left: '95%', top: '32%', size: '1.3rem', dur: 20, delay: 2.0, rot: 3, op: 0.09, depth: -0.02 },
  { ch: 'ㆍ', left: '30%', top: '7%', size: '1rem', dur: 13, delay: 5.0, rot: -3, op: 0.12, depth: 0.018 },
  { ch: 'ㄴ', left: '86%', top: '9%', size: '1.25rem', dur: 17, delay: 1.6, rot: 5, op: 0.08, depth: 0.01 },
  { ch: 'ㆁ', left: '93%', top: '78%', size: '1.5rem', dur: 15, delay: 3.0, rot: -6, op: 0.09, depth: -0.014 },
] as const

/**
 * 폰 — 헤더 바로 아래 띠에만 둔다. 아래쪽에는 두지 않는다.
 * depth는 덱의 가로 스크롤(px)에 곱한다. PC의 세로 시차와 같은 크기다.
 */
const GLYPHS_MOBILE = [
  { ch: 'ㆍ', left: '6%', top: '0.1rem', size: '1.7rem', dur: 16, delay: 0, rot: 4, op: 0.13, depth: -0.01 },
  { ch: 'ㅅ', left: '20%', top: '0.28rem', size: '1.55rem', dur: 18, delay: 4.2, rot: -5, op: 0.11, depth: -0.006 },
  { ch: 'ㅿ', left: '36%', top: '0.16rem', size: '2.05rem', dur: 19, delay: 2.4, rot: -6, op: 0.14, depth: 0.01 },
  { ch: 'ㅁ', left: '52%', top: '0.42rem', size: '1.5rem', dur: 20, delay: 3.2, rot: -4, op: 0.1, depth: 0.004 },
  { ch: 'ㆁ', left: '72%', top: '0.08rem', size: '1.9rem', dur: 14, delay: 1.1, rot: 5, op: 0.13, depth: -0.008 },
  { ch: 'ㆍ', left: '88%', top: '0.3rem', size: '1.6rem', dur: 13, delay: 5, rot: -3, op: 0.12, depth: -0.008 },
] as const

/** 1막·4막은 한지 글씨와 겹쳐 보여 더 옅게. 2·3막은 그대로. */
function mobileEdgeFade(progress: number) {
  const t = Math.min(1, Math.max(0, progress))
  const third = 1 / 3
  if (t <= third) return 0.58 + (0.42 * t) / third
  if (t >= third * 2) return 0.58 + (0.42 * (1 - t)) / third
  return 1
}

type Glyph = (typeof GLYPHS)[number] | (typeof GLYPHS_MOBILE)[number]

/** 폰 덱의 scrollLeft. 세로 스크롤이 잠겨 있어 scrollY는 움직이지 않는다. */
function useDeckScrollX() {
  const x = useMotionValue(0)
  const fade = useMotionValue(mobileEdgeFade(0))
  useEffect(() => {
    const deck = document.querySelector('.home-mobile-deck')
    if (!deck) return
    const onScroll = () => {
      x.set(deck.scrollLeft)
      const span = deck.clientWidth * 3
      fade.set(mobileEdgeFade(span > 0 ? deck.scrollLeft / span : 0))
    }
    onScroll()
    deck.addEventListener('scroll', onScroll, { passive: true })
    return () => deck.removeEventListener('scroll', onScroll)
  }, [x, fade])
  return { x, fade }
}

/** 시차 이동은 바깥 래퍼, 둥실거림(hero-jamo-drift)은 안쪽 글자 — transform이 서로 덮어쓰지 않게 분리 */
function JamoGlyph({
  g,
  inverse,
  scroll,
  fade,
  axis,
}: {
  g: Glyph
  inverse: boolean
  scroll: MotionValue<number>
  fade: MotionValue<number>
  axis: 'x' | 'y'
}) {
  const reduce = useReducedMotion()
  const shift = useTransform(scroll, (v) => (reduce ? 0 : v * g.depth))
  // 3막(다크)에서는 흰 글자라 조금만 낮춘다. 폰 1·4막은 fade로 한 번 더 옅게.
  const base = inverse ? g.op * (axis === 'x' ? 0.85 : 0.7) : g.op
  const op = useTransform(fade, (f) => base * (axis === 'x' ? f : 1))
  return (
    <motion.div
      className="absolute"
      style={{ left: g.left, top: g.top, x: axis === 'x' ? shift : 0, y: axis === 'y' ? shift : 0 }}
    >
      <motion.span
        className={`hero-jamo-drift block select-none font-jamo ${axis === 'x' ? 'hero-jamo-drift-x' : ''} ${inverse ? 'text-white' : 'text-ink'}`}
        style={{
          fontSize: g.size,
          ['--drift-dur' as string]: `${g.dur}s`,
          ['--drift-delay' as string]: `${g.delay}s`,
          ['--drift-rot' as string]: `${g.rot}deg`,
          ['--drift-op' as string]: op,
          opacity: op,
        }}
      >
        {g.ch}
      </motion.span>
    </motion.div>
  )
}

interface HomeJamoFieldProps {
  /** ink: 한지 배경용(기본). inverse: 3막 다크 배경용 — 같은 자리에 흰 글자로 */
  tone?: 'ink' | 'inverse'
}

export function HomeJamoField({ tone = 'ink' }: HomeJamoFieldProps) {
  const { scrollY } = useScroll()
  const { x: scrollX, fade } = useDeckScrollX()
  const desktopFade = useMotionValue(1)
  const inverse = tone === 'inverse'
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden lg:block">
        {GLYPHS.map((g, i) => (
          <JamoGlyph key={i} g={g} inverse={inverse} scroll={scrollY} fade={desktopFade} axis="y" />
        ))}
      </div>
      <div
        aria-hidden
        className="home-jamo-mobile pointer-events-none fixed inset-x-0 z-[1] overflow-hidden sm:hidden"
      >
        {GLYPHS_MOBILE.map((g, i) => (
          <JamoGlyph key={i} g={g} inverse={inverse} scroll={scrollX} fade={fade} axis="x" />
        ))}
      </div>
    </>
  )
}
