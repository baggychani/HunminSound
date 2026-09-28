'use client'

/**
 * 홈 배경 — 한지 위에 은은히 떠 있는 자모(옛글자 포함) 장식. 데스크톱 전용.
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

interface HomeJamoFieldProps {
  /** ink: 한지 배경용(기본). inverse: 3막 다크 배경용 — 같은 자리에 흰 글자로 */
  tone?: 'ink' | 'inverse'
}

export function HomeJamoField({ tone = 'ink' }: HomeJamoFieldProps) {
  const inverse = tone === 'inverse'
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden lg:block">
      {GLYPHS.map((g, i) => {
        const op = inverse ? Math.min(g.op * 1.4, 0.24) : g.op
        return (
          <span
            key={i}
            className={`hero-jamo-drift absolute select-none font-jamo ${inverse ? 'text-white' : 'text-ink'}`}
            style={{
              left: g.left,
              top: g.top,
              fontSize: g.size,
              ['--drift-dur' as string]: `${g.dur}s`,
              ['--drift-delay' as string]: `${g.delay}s`,
              ['--drift-rot' as string]: `${g.rot}deg`,
              ['--drift-op' as string]: op,
              opacity: op,
            }}
          >
            {g.ch}
          </span>
        )
      })}
    </div>
  )
}
