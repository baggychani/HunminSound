'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import type { ResearchContent } from '@/lib/research-content'
import { tr } from '@/lib/research-content'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

/** <b>텍스트</b> 를 <strong>으로 렌더링 */
function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(<b>.*?<\/b>)/g)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('<b>') ? (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(3, -4)}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  )
}

function SectionTitle({ id, muted, children }: { id: string; muted?: boolean; children: React.ReactNode }) {
  return (
    <h2 id={id} className={`font-serif tracking-tight leading-snug ${muted ? 'text-lg text-ink-muted sm:text-xl' : 'text-2xl text-ink sm:text-[1.75rem]'}`}>
      {children}
    </h2>
  )
}

function BlockLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 font-sans text-sm font-medium text-ink-muted/65">{children}</p>
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="h-px flex-1 bg-hanji-border/70" />
      <p className="font-sans text-sm font-normal tracking-normal text-ink-muted/60">{children}</p>
      <span className="h-px flex-1 bg-hanji-border/70" />
    </div>
  )
}

function BodyText({ text }: { text: string }) {
  return <p className="font-sans text-[0.95rem] leading-[1.9] text-ink-soft"><RichText text={text} /></p>
}

function BulletItem({ label, text }: { label?: string; text: string }) {
  return (
    <div className="flex gap-3 font-sans text-[0.95rem] leading-relaxed text-ink-soft">
      <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60" />
      <span>{label && <span className="font-semibold text-ink">{label}: </span>}<RichText text={text} /></span>
    </div>
  )
}

function AchievementItem({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div>
      <p className="mb-3 font-sans text-[0.95rem] font-semibold text-ink">{title}</p>
      <div className="space-y-2 pl-1">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3 font-sans text-[0.95rem] leading-relaxed text-ink-soft">
            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/40" />
            <RichText text={line} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-hanji-border/50" />
}

/** 엠블럼 부유 — 분야마다 진폭·주기·위상을 달리해 살짝 어긋나게 */
const EMBLEM_FLOAT = [
  { y: [0, -5, 0], duration: 4.4, delay: 0 },
  { y: [0, -7, 0], duration: 5.15, delay: 0.38 },
  { y: [0, -4, 0], duration: 3.85, delay: 0.72 },
] as const

type MethodTone = {
  emblemBg: string
  emblemBorder: string
  indexColor: string
  fieldColor: string
  dotColor: string
  tagClass: string
}

/** 엠블럼 연결선 — 열 중앙 고정, 필터·RAF 없음(부유 원과 분리해 일렁임 방지) */
function MethodEmblemConnections() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="16.67" y1="50" x2="50" y2="50" className="method-link-halo" />
      <line x1="50" y1="50" x2="83.33" y2="50" className="method-link-halo" />
      <line x1="16.67" y1="50" x2="50" y2="50" className="method-link-core" />
      <line x1="50" y1="50" x2="83.33" y2="50" className="method-link-core" />
    </svg>
  )
}

function FloatingMethodEmblem({
  index,
  field,
  tone,
  innerRef,
}: {
  index: number
  field: string
  tone: MethodTone
  innerRef: (el: HTMLDivElement | null) => void
}) {
  const reduceMotion = useReducedMotion()
  const preset = EMBLEM_FLOAT[index % EMBLEM_FLOAT.length]

  return (
    <motion.div
      ref={innerRef}
      className="relative z-10 will-change-transform"
      animate={reduceMotion ? undefined : { y: [...preset.y] }}
      transition={
        reduceMotion
          ? undefined
          : {
              duration: preset.duration,
              delay: preset.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }
      }
    >
      <div
        className={`relative flex h-[9rem] w-[9rem] items-center justify-center rounded-full border ${tone.emblemBg} ${tone.emblemBorder}`}
      >
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 font-sans text-[0.62rem] tracking-[0.22em] ${tone.indexColor}`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={`font-serif text-[1.08rem] leading-none tracking-wide ${tone.fieldColor}`}>
          {field}
        </span>
        <span
          aria-hidden
          className={`absolute -bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${tone.dotColor}`}
        />
      </div>
    </motion.div>
  )
}

/**
 * 「세부 목표」 사분(四) 인포그래픽 — 2×2 그리드.
 *
 *  설계 결정
 *   • 단순 bullet 목록을 버리고, 「상형·인문·교육·응용」 네 축을 한지 사분면처럼 배치.
 *   • 카드마다 별도의 한지 톤(호박·청회·풀빛·갈홍)으로 분야 매칭의 잔향을 유지.
 *   • 좌상단에 옅은 **인덱스 워터마크**(01~04)와 작은 dot/인덱스 라벨로 정보 위계.
 *   • 코너 ㄱ/ㄴ 장식 — 옛 책의 광곽(匡郭) 모서리 모티프를 가볍게.
 *   • 카드는 정지(부유 없음) — 연구 방법 엠블럼과 구분.
 *   • 단어 단위 줄바꿈(`break-keep`).
 */
type GoalTone = {
  cardBg: string
  cardBorder: string
  indexColor: string
  watermark: string
  dot: string
  labelColor: string
  bodyColor: string
  cornerColor: string
}

function GoalQuadCard({
  index,
  label,
  text,
  tone,
}: {
  index: number
  label: string
  text: string
  tone: GoalTone
}) {
  return (
    <article
      className={`goal-quad-card group relative overflow-hidden rounded-2xl border ${tone.cardBorder} ${tone.cardBg} px-6 py-7 sm:px-7 sm:py-8`}
    >
      {/* 인덱스 워터마크 */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[6.5rem] leading-none ${tone.watermark}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* 코너 장식 — 광곽 모티프 */}
      <span
        aria-hidden
        className={`pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t ${tone.cornerColor}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r ${tone.cornerColor}`}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
          <span className={`font-sans text-[0.68rem] tracking-[0.22em] ${tone.indexColor}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3
          lang="ko"
          className={`break-keep [overflow-wrap:break-word] font-serif text-[1.08rem] leading-snug ${tone.labelColor}`}
        >
          <RichText text={label} />
        </h3>
        <p
          lang="ko"
          className={`break-keep [overflow-wrap:break-word] font-sans text-[0.9rem] leading-[1.85] ${tone.bodyColor}`}
        >
          <RichText text={text} />
        </p>
      </div>
    </article>
  )
}

function SpecificGoalsGrid({
  items,
}: {
  items: { label: string; text: string }[]
}) {
  const tones: GoalTone[] = [
    {
      cardBg: 'bg-[#faf3e3]',
      cardBorder: 'border-[#e6cf9c]/70',
      indexColor: 'text-[#a98551]',
      watermark: 'text-[#d9c094]/35',
      dot: 'bg-[#c8a26b]',
      labelColor: 'text-[#7a5a2b]',
      bodyColor: 'text-[#6b5340]',
      cornerColor: 'border-[#d9c094]',
    },
    {
      cardBg: 'bg-[#eef3f8]',
      cardBorder: 'border-[#b8c8d6]/70',
      indexColor: 'text-[#5a7791]',
      watermark: 'text-[#a7bccd]/35',
      dot: 'bg-[#8ca6ba]',
      labelColor: 'text-[#3d5870]',
      bodyColor: 'text-[#4a6278]',
      cornerColor: 'border-[#a7bccd]',
    },
    {
      cardBg: 'bg-[#eef3e8]',
      cardBorder: 'border-[#bccab0]/70',
      indexColor: 'text-[#647955]',
      watermark: 'text-[#b3c2a4]/35',
      dot: 'bg-[#97a986]',
      labelColor: 'text-[#4d6041]',
      bodyColor: 'text-[#4f6345]',
      cornerColor: 'border-[#b3c2a4]',
    },
    {
      cardBg: 'bg-[#f5ece2]',
      cardBorder: 'border-[#d3b7a3]/70',
      indexColor: 'text-[#8a5a48]',
      watermark: 'text-[#c9a995]/35',
      dot: 'bg-[#b48570]',
      labelColor: 'text-[#704a3a]',
      bodyColor: 'text-[#6f4f42]',
      cornerColor: 'border-[#c9a995]',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      {items.map((item, i) => (
        <GoalQuadCard
          key={i}
          index={i}
          label={item.label}
          text={item.text}
          tone={tones[i % tones.length]}
        />
      ))}
    </div>
  )
}

/**
 * 「연구 방법」 시각화 — 3분야 트라이어드(Triad).
 *
 *  설계 결정
 *   • 표/겹친 원 등 시각 노이즈를 모두 버리고, **상단 원형 엠블럼 + 하단 정렬된
 *     역할/방법 칼럼** 구조로 3개를 일렬 배치한다. 정보 위계가 분명해지고
 *     모바일에서도 단순 1열로 떨어진다.
 *   • 원은 **이름표(엠블럼)** 역할만. 텍스트가 원 안에서 잘리거나 어색하게
 *     줄바꿈되는 문제를 피한다. 원 안에는 **분야명 + 일련번호**만.
 *   • 분야 색은 한지 톤에 맞춰 옅게: 인문(호박/세피아)·의(차분한 청회)·공(옅은 풀빛).
 *     테두리/도트 컬러는 분야별로 분리하되 본문 텍스트는 ink 계열로 통일.
 *   • 「주요 방법」은 더 이상 점-목록이 아니라 **칩(pill) 태그**. 키워드성이 강해
 *     스캔 가독성이 좋아진다.
 *   • 데스크톱: 엠블럼끼리 빛나는 연결선 + 각기 다른 Y축 부유; 선은 RAF로 따라감.
 */
function MethodTable({ intro, rows }: {
  intro: string
  rows: { field: string; role: string; methods: string[] }[]
}) {
  const tones: MethodTone[] = [
    {
      emblemBg: 'bg-[#f6efe2]',
      emblemBorder: 'border-[#d9c094]',
      indexColor: 'text-[#a98551]',
      fieldColor: 'text-[#3a2a16]',
      dotColor: 'bg-[#c8a26b]',
      tagClass: 'bg-[#f6efe2]/70 text-[#7a5a2b] border-[#d9c094]/70',
    },
    {
      emblemBg: 'bg-[#eaf0f6]',
      emblemBorder: 'border-[#a7bccd]',
      indexColor: 'text-[#5a7791]',
      fieldColor: 'text-[#1f2f44]',
      dotColor: 'bg-[#8ca6ba]',
      tagClass: 'bg-[#eaf0f6]/70 text-[#3d5870] border-[#a7bccd]/70',
    },
    {
      emblemBg: 'bg-[#eef3e8]',
      emblemBorder: 'border-[#b3c2a4]',
      indexColor: 'text-[#647955]',
      fieldColor: 'text-[#2a3a22]',
      dotColor: 'bg-[#97a986]',
      tagClass: 'bg-[#eef3e8]/70 text-[#4d6041] border-[#b3c2a4]/70',
    },
  ]

  return (
    <div>
      <p className="mb-12 max-w-3xl break-keep font-sans text-[0.95rem] leading-relaxed text-ink-soft sm:mb-14">
        <RichText text={intro} />
      </p>

      <div
        className="relative mb-8 hidden min-h-[10.5rem] sm:mb-10 sm:grid sm:grid-cols-3 sm:items-center"
      >
        <MethodEmblemConnections />
        {rows.map((row, i) => {
          const tone = tones[i % tones.length]
          return (
            <div key={`emblem-${row.field}`} className="flex justify-center">
              <FloatingMethodEmblem
                index={i}
                field={row.field}
                tone={tone}
                innerRef={() => {}}
              />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-y-14 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 md:gap-x-10">
        {rows.map((row, i) => {
          const tone = tones[i % tones.length]
          return (
            <article
              key={row.field}
              className="relative flex h-full flex-col items-center text-center"
            >
              <div className="mb-7 sm:hidden">
                <FloatingMethodEmblem
                  index={i}
                  field={row.field}
                  tone={tone}
                  innerRef={() => {}}
                />
              </div>

              {/* 역할 — 3열일 때 최소 높이를 맞춰 pill 첫 줄이 같은 높이에서 시작 */}
              <div
                className="mb-6 flex w-full max-w-[28ch] flex-col justify-start sm:min-h-[6rem]"
                lang="ko"
              >
                <p className="break-keep [overflow-wrap:break-word] font-sans text-[0.92rem] leading-[1.85] text-ink-soft">
                  <RichText text={row.role} />
                </p>
              </div>

              {/* 주요 방법 — 칩 (짧은 태그는 한 줄에 여러 개) */}
              <ul className="flex w-full flex-wrap justify-center gap-1.5 px-1">
                {row.methods.map((m) => (
                  <li
                    key={m}
                    className={`break-keep rounded-full border px-2.5 py-1 font-sans text-[0.78rem] leading-snug ${tone.tagClass}`}
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function TeamTable({ rows, t }: {
  rows: { role: string; name: string; affiliation: string; task: string; field: string }[]
  t: (key: string, ko: string) => string
}) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="min-w-max w-full border-collapse font-sans text-[0.875rem]">
        <thead>
          <tr className="border-b border-ink/15">
            {([
              ['table.category', '구분'],
              ['table.name', '성명'],
              ['table.affiliation', '소속'],
              ['table.task', '역할'],
              ['table.major', '전공 분야'],
            ] as [string, string][]).map(([key, ko]) => (
              <th key={key} className="pb-3 pr-6 last:pr-0 text-left font-medium text-ink-muted/55 whitespace-nowrap">{t(key, ko)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((mem, i) => (
            <tr key={i} className="border-b border-hanji-border/60 last:border-0">
              <td className="py-3 pr-5 align-top whitespace-nowrap text-ink-muted/60">{mem.role}</td>
              <td className="py-3 pr-4 align-top max-w-[8rem] whitespace-pre-line font-semibold text-ink">{mem.name}</td>
              <td className="py-3 pr-6 align-top text-ink-muted/70 leading-relaxed min-w-[16rem] max-w-[26rem] whitespace-nowrap">
                {mem.affiliation.trim() === '' || mem.affiliation.trim() === '—' || mem.affiliation.trim() === '-' ? (
                  <span className="text-ink-muted/25" aria-hidden> </span>
                ) : (
                  mem.affiliation
                )}
              </td>
              <td className="py-3 pr-6 align-top text-ink-soft leading-relaxed min-w-[17rem] whitespace-pre-line"><RichText text={mem.task} /></td>
              <td className="py-3 align-top text-ink-muted/70 whitespace-nowrap">{mem.field}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InfoTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <table className="w-full border-collapse font-sans text-[0.95rem]">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-hanji-border/60 last:border-0">
            <td className="py-3 pr-8 align-top whitespace-nowrap text-ink-muted/60 font-medium w-48">{row.label}</td>
            <td className="py-3 text-ink leading-relaxed"><RichText text={row.value} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface Props {
  content: ResearchContent
}

export function ResearchPageClient({ content }: Props) {
  const { lang } = useLang()
  const m = getMessages(lang)
  const { motivation, goals, overview, significance, team, taskInfo, translations } = content

  /** Auto-translated fallbacks: localStorage-cached results from /api/translate */
  const [autoTrans, setAutoTrans] = useState<Record<string, string>>({})

  useEffect(() => {
    if (lang === 'ko') { setAutoTrans({}); return }

    const allKeys: { key: string; ko: string }[] = [
      // 섹션 제목
      { key: 'section.motivation', ko: '연구 동기' },
      { key: 'section.goals', ko: '연구 목표' },
      { key: 'section.overview', ko: '연구 개요' },
      { key: 'section.significance', ko: '연구의 의의' },
      // 블록 라벨
      { key: 'label.finalGoal', ko: '최종 목표' },
      { key: 'label.specificGoals', ko: '세부 목표' },
      { key: 'label.method', ko: '연구 방법' },
      { key: 'label.scale', ko: '연구 규모' },
      { key: 'label.achievements', ko: '주요 성과' },
      { key: 'label.vowelSystem', ko: '모음 체계' },
      { key: 'label.consonantSystem', ko: '자음 체계' },
      { key: 'label.techDev', ko: '기술 개발' },
      // 테이블 헤더
      { key: 'table.field', ko: '분야' },
      { key: 'table.methodRole', ko: '역할' },
      { key: 'table.methods', ko: '주요 방법' },
      { key: 'table.category', ko: '구분' },
      { key: 'table.name', ko: '성명' },
      { key: 'table.affiliation', ko: '소속' },
      { key: 'table.task', ko: '역할' },
      { key: 'table.major', ko: '전공 분야' },
      // 본문 콘텐츠
      ...motivation.paragraphs.map((p, i) => ({ key: `motivation.paragraphs.${i}`, ko: p })),
      { key: 'goals.final', ko: goals.final },
      ...goals.specific.flatMap((item, i) => [
        { key: `goals.specific.${i}.label`, ko: item.label },
        { key: `goals.specific.${i}.text`, ko: item.text },
      ]),
      { key: 'overview.method.intro', ko: overview.method.intro },
      ...overview.method.rows.flatMap((row, i) => [
        { key: `overview.method.rows.${i}.field`, ko: row.field },
        { key: `overview.method.rows.${i}.role`, ko: row.role },
        ...row.methods.map((mm, j) => ({ key: `overview.method.rows.${i}.methods.${j}`, ko: mm })),
      ]),
      ...overview.scale.flatMap((item, i) => [
        { key: `overview.scale.${i}.label`, ko: item.label },
        { key: `overview.scale.${i}.text`, ko: item.text },
      ]),
      ...(['vowels', 'consonants', 'tech'] as const).flatMap((group) =>
        overview.achievements[group].flatMap((a, i) => [
          { key: `overview.achievements.${group}.${i}.title`, ko: a.title },
          ...a.lines.map((l, j) => ({ key: `overview.achievements.${group}.${i}.lines.${j}`, ko: l })),
        ])
      ),
      ...significance.paragraphs.map((p, i) => ({ key: `significance.paragraphs.${i}`, ko: p })),
      ...team.rows.map((row, i) => ({ key: `team.rows.${i}.task`, ko: row.task })),
    ]

    const toFetch: { key: string; ko: string }[] = []
    const fromCache: Record<string, string> = {}

    for (const { key, ko } of allKeys) {
      if (translations?.[lang]?.[key]) continue
      try {
        const c = JSON.parse(localStorage.getItem(`rmt:${lang}:${key}`) ?? 'null') as { src?: string; v?: string } | null
        if (c?.src === ko && c?.v) { fromCache[key] = c.v; continue }
      } catch {}
      toFetch.push({ key, ko })
    }

    if (Object.keys(fromCache).length > 0) setAutoTrans(prev => ({ ...prev, ...fromCache }))
    if (toFetch.length === 0) return

    let cancelled = false
    ;(async () => {
      for (const { key, ko } of toFetch) {
        if (cancelled) break
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: ko, target: lang }),
          })
          const data = await res.json() as { translated?: string | null }
          if (typeof data.translated === 'string' && data.translated.trim()) {
            const v = data.translated
            setAutoTrans(prev => ({ ...prev, [key]: v }))
            try { localStorage.setItem(`rmt:${lang}:${key}`, JSON.stringify({ src: ko, v })) } catch {}
          }
        } catch {}
        await new Promise(r => setTimeout(r, 150))
      }
    })()

    return () => { cancelled = true }
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Stored translation > auto-translated fallback > Korean original */
  const t = (key: string, koValue: string) => {
    if (lang === 'ko') return koValue
    return translations?.[lang]?.[key] || autoTrans[key] || koValue
  }

  return (
    <>
      <div className="pt-16 pb-12 mb-14 sm:mb-16">
        <h1 className="font-serif text-[2.1rem] leading-tight tracking-tight text-ink sm:text-4xl mb-3">
          {m.research}
        </h1>
        <p className="max-w-2xl break-keep font-sans text-sm leading-relaxed text-ink-muted [overflow-wrap:break-word]">
          {m.researchPageDesc}
        </p>
      </div>

      <div className="space-y-20 pb-28 sm:space-y-24 sm:pb-36">

        {/* 연구 동기 */}
        <motion.section custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          <div className="mb-10">
            <SectionTitle id="section-motivation">{t('section.motivation', '연구 동기')}</SectionTitle>
          </div>
          <div className="space-y-5">
            {motivation.paragraphs.map((p, i) => (
              <BodyText key={i} text={t(`motivation.paragraphs.${i}`, p)} />
            ))}
          </div>
        </motion.section>

        {/* 연구 목표 */}
        <motion.section custom={1} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          <div className="mb-10">
            <SectionTitle id="section-goals">{t('section.goals', '연구 목표')}</SectionTitle>
          </div>
          <div className="space-y-12">
            <div>
              <BlockLabel>{t('label.finalGoal', '최종 목표')}</BlockLabel>
              <BodyText text={t('goals.final', goals.final)} />
            </div>
            <div>
              <BlockLabel>{t('label.specificGoals', '세부 목표')}</BlockLabel>
              <SpecificGoalsGrid
                items={goals.specific.map((item, i) => ({
                  label: t(`goals.specific.${i}.label`, item.label),
                  text: t(`goals.specific.${i}.text`, item.text),
                }))}
              />
            </div>
          </div>
        </motion.section>

        {/* 연구 개요 */}
        <motion.section custom={2} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          <div className="mb-10">
            <SectionTitle id="section-overview">{t('section.overview', '연구 개요')}</SectionTitle>
          </div>
          <div className="space-y-14">

            <div>
              <BlockLabel>{t('label.method', '연구 방법')}</BlockLabel>
              <MethodTable
                intro={t('overview.method.intro', overview.method.intro)}
                rows={overview.method.rows.map((row, i) => ({
                  field: t(`overview.method.rows.${i}.field`, row.field),
                  role: t(`overview.method.rows.${i}.role`, row.role),
                  methods: row.methods.map((mm, j) =>
                    t(`overview.method.rows.${i}.methods.${j}`, mm)
                  ),
                }))}
              />
            </div>

            <Divider />

            <div>
              <BlockLabel>{t('label.scale', '연구 규모')}</BlockLabel>
              <div className="space-y-3.5">
                {overview.scale.map((item, i) => (
                  <BulletItem
                    key={i}
                    label={t(`overview.scale.${i}.label`, item.label)}
                    text={t(`overview.scale.${i}.text`, item.text)}
                  />
                ))}
              </div>
            </div>

            <Divider />

            <div>
              <BlockLabel>{t('label.achievements', '주요 성과')}</BlockLabel>
              <div className="space-y-10">
                <div>
                  <GroupLabel>{t('label.vowelSystem', '모음 체계')}</GroupLabel>
                  <div className="space-y-7">
                    {overview.achievements.vowels.map((a, i) => (
                      <AchievementItem
                        key={i}
                        title={t(`overview.achievements.vowels.${i}.title`, a.title)}
                        lines={a.lines.map((l, j) =>
                          t(`overview.achievements.vowels.${i}.lines.${j}`, l)
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <GroupLabel>{t('label.consonantSystem', '자음 체계')}</GroupLabel>
                  <div className="space-y-7">
                    {overview.achievements.consonants.map((a, i) => (
                      <AchievementItem
                        key={i}
                        title={t(`overview.achievements.consonants.${i}.title`, a.title)}
                        lines={a.lines.map((l, j) =>
                          t(`overview.achievements.consonants.${i}.lines.${j}`, l)
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <GroupLabel>{t('label.techDev', '기술 개발')}</GroupLabel>
                  <div className="space-y-7">
                    {overview.achievements.tech.map((a, i) => (
                      <AchievementItem
                        key={i}
                        title={t(`overview.achievements.tech.${i}.title`, a.title)}
                        lines={a.lines.map((l, j) =>
                          t(`overview.achievements.tech.${i}.lines.${j}`, l)
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* 연구의 의의 */}
        <motion.section custom={3} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          <div className="mb-10">
            <SectionTitle id="section-significance">{t('section.significance', '연구의 의의')}</SectionTitle>
          </div>
          <div className="space-y-5">
            {significance.paragraphs.map((p, i) => (
              <BodyText key={i} text={t(`significance.paragraphs.${i}`, p)} />
            ))}
          </div>
        </motion.section>

        {/* 연구진 소개 */}
        <motion.section custom={4} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          <div className="mb-10">
            <SectionTitle id="section-team" muted>{m.researchSec1}</SectionTitle>
          </div>
          <TeamTable
            t={t}
            rows={team.rows.map((row, i) => ({
              ...row,
              name: lang !== 'ko' && row.nameEn ? row.nameEn : row.name,
              task: t(`team.rows.${i}.task`, row.task),
            }))}
          />
        </motion.section>

        {/* 과제 정보 */}
        <motion.section custom={5} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          <div className="mb-10">
            <SectionTitle id="section-nrf" muted>{m.researchSec3}</SectionTitle>
          </div>
          <InfoTable
            rows={taskInfo.rows.map((row, i) => ({
              label: row.label,
              value: t(`taskInfo.rows.${i}.value`, row.value),
            }))}
          />
        </motion.section>

      </div>
    </>
  )
}