'use client'

/**
 * 2막(자음·모음·훈민정음 카드) 배경 — HeroJamoField와 같은 기법, 다른 배치·더 옅은 농도.
 * 카드가 위에 opaque 배경으로 덮이므로(.home-act2-nav-card) 카드 밖 여백·틈에서만 보임.
 * 데스크톱 전용. 위치·타이밍은 고정값 — SSR/hydration 안전.
 */
const GLYPHS = [
  { ch: 'ㆍ', left: '2%', top: '4%', size: '1.3rem', dur: 18, delay: 0.6, rot: -4, op: 0.07 },
  { ch: 'ㆆ', left: '96%', top: '6%', size: '1.5rem', dur: 15, delay: 2.8, rot: 5, op: 0.06 },
  { ch: 'ㅸ', left: '49.5%', top: '18%', size: '1.1rem', dur: 20, delay: 1.4, rot: -6, op: 0.05 },
  { ch: 'ㅿ', left: '1.5%', top: '46%', size: '1.4rem', dur: 17, delay: 3.6, rot: 4, op: 0.06 },
  { ch: 'ㆁ', left: '97%', top: '50%', size: '1.2rem', dur: 14, delay: 0.2, rot: -5, op: 0.07 },
  { ch: 'ㆎ', left: '50%', top: '58%', size: '1rem', dur: 19, delay: 4.4, rot: 6, op: 0.04 },
  { ch: 'ㄷ', left: '3%', top: '82%', size: '1.15rem', dur: 16, delay: 2.0, rot: -3, op: 0.06 },
  { ch: 'ㅎ', left: '95%', top: '86%', size: '1.3rem', dur: 21, delay: 5.2, rot: 4, op: 0.05 },
] as const

export function HomeNavJamoField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="hero-jamo-drift absolute font-jamo text-ink select-none"
          style={{
            left: g.left,
            top: g.top,
            fontSize: g.size,
            ['--drift-dur' as string]: `${g.dur}s`,
            ['--drift-delay' as string]: `${g.delay}s`,
            ['--drift-rot' as string]: `${g.rot}deg`,
            ['--drift-op' as string]: g.op,
            opacity: g.op,
          }}
        >
          {g.ch}
        </span>
      ))}
    </div>
  )
}
