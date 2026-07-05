'use client'

/**
 * 1막 배경 — 한지 위에 은은히 떠 있는 자모(옛글자 포함) 장식. 데스크톱 전용.
 * 중앙(제목·3D 책)과 우측(세종상)을 피해 좌측·가장자리에 배치.
 * 위치·타이밍은 고정값 — SSR/hydration 안전.
 */
const GLYPHS = [
  { ch: 'ㆍ', left: '6%', top: '16%', size: '1.5rem', dur: 16, delay: 0, rot: 4, op: 0.16 },
  { ch: 'ㅿ', left: '11%', top: '34%', size: '2.1rem', dur: 19, delay: 2.4, rot: -6, op: 0.11 },
  { ch: 'ㆁ', left: '4%', top: '55%', size: '1.7rem', dur: 14, delay: 1.1, rot: 5, op: 0.13 },
  { ch: 'ㆆ', left: '13%', top: '72%', size: '1.4rem', dur: 17, delay: 3.6, rot: -4, op: 0.12 },
  { ch: 'ㄱ', left: '8%', top: '88%', size: '1.2rem', dur: 15, delay: 0.8, rot: 7, op: 0.1 },
  { ch: 'ㅅ', left: '19%', top: '12%', size: '1.15rem', dur: 18, delay: 4.2, rot: -5, op: 0.1 },
  { ch: 'ㅁ', left: '24%', top: '82%', size: '1.3rem', dur: 20, delay: 2.0, rot: 3, op: 0.09 },
  { ch: 'ㆍ', left: '30%', top: '7%', size: '1rem', dur: 13, delay: 5.0, rot: -3, op: 0.12 },
  { ch: 'ㄴ', left: '86%', top: '9%', size: '1.25rem', dur: 17, delay: 1.6, rot: 5, op: 0.08 },
  { ch: 'ㆁ', left: '93%', top: '78%', size: '1.5rem', dur: 15, delay: 3.0, rot: -6, op: 0.09 },
] as const

export function HeroJamoField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden lg:block"
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
