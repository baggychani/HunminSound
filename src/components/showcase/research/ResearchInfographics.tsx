'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { teamPhotoSrc } from '@/lib/teamSlugs'

/** 연구 페이지 인포그래픽 — 성과·규모 (연구 방법 MethodTable 팔레트와 분리, 한지 중립 톤) */

const FINAL_GOAL_IMAGE = '/images/research/mri-ana.jpg'
function RichText({ text }: { text: string }) {
  const parts = text.split(/(<b>.*?<\/b>)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('<b>') ? (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(3, -4)}
          </strong>
        ) : (
          part
        )
      )}
    </>
  )
}

/* ── 연구 규모: 라벨 | 본문 정의 목록 ── */

export function ScaleInfographic({ items }: { items: { label: string; text: string }[] }) {
  return (
    <dl className="overflow-hidden rounded-lg border border-hanji-border/70">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`grid sm:grid-cols-[9.5rem_minmax(0,1fr)] ${i > 0 ? 'border-t border-hanji-border/50' : ''}`}
        >
          <dt className="bg-hanji/35 px-4 py-4 font-sans text-[0.82rem] font-medium leading-snug text-ink-muted sm:px-5 sm:py-5">
            {item.label}
          </dt>
          <dd className="break-keep bg-hanji/10 px-4 py-4 font-sans text-[0.88rem] leading-[1.9] text-ink-soft [overflow-wrap:break-word] sm:px-5 sm:py-5">
            <RichText text={item.text} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function FinalGoalBlock({ label, text }: { label: string; text: string }) {
  return (
    <figure className="final-goal-block group relative overflow-hidden rounded-xl border border-hanji-border/80 bg-hanji-warm/30 shadow-[0_1px_0_rgb(var(--ink-rgb)/0.03)]">
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-stretch">
        <div className="final-goal-media relative aspect-[16/9] max-h-[11.5rem] overflow-hidden bg-ink/[0.04] sm:aspect-auto sm:max-h-none sm:h-full sm:min-h-0">
          <Image
            src={FINAL_GOAL_IMAGE}
            alt="조음 MRI 영상 — /ㄴ, 아나/ [a n a]"
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover object-center"
            priority
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-hanji-warm/90 sm:to-hanji-warm/80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/[0.12] via-transparent to-transparent sm:hidden"
          />
          {/* MRI 촬영 스캔 라인 — 홈 3막과 같은 연출 */}
          <span className="mri-scan-sweep hidden lg:block" aria-hidden />
        </div>

        <figcaption className="flex flex-col justify-center px-6 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
          <h3 className="font-serif text-xl leading-snug tracking-tight text-ink sm:text-[1.35rem]">
            {label}
          </h3>
          <span className="mt-3 mb-4 block h-px w-10 bg-gold/70 sm:mb-5" aria-hidden />
          <p className="break-keep font-display text-[0.94rem] font-normal leading-[2.12] text-ink-soft [overflow-wrap:break-word] sm:text-[0.98rem] sm:leading-[2.18]">
            <RichText text={text} />
          </p>
        </figcaption>
      </div>
    </figure>
  )
}
/* ── 주요 성과 — 연구 규모와 같은 한지 톤, 글리프·색 구분 없음 ── */

function AchievementCell({ title, lines }: { title: string; lines: string[] }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-hanji-border/60 bg-hanji/20 p-4 sm:p-5">
      <h4 className="break-keep font-serif text-[0.95rem] leading-snug text-ink [overflow-wrap:break-word] sm:text-[1rem]">
        <RichText text={title} />
      </h4>
      <ul className="mt-2.5 flex flex-1 flex-col justify-start gap-2 sm:mt-3 sm:gap-2.5">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-2 font-sans text-[0.82rem] leading-[1.8] text-ink-soft sm:gap-2.5 sm:text-[0.88rem] sm:leading-[1.85]">
            <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink-muted/35" aria-hidden />
            <span className="break-keep [overflow-wrap:break-word]">
              <RichText text={line} />
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function TechPipelineStrip() {
  const steps = ['음성 입력', 'Mel-spectrogram', 'LSTM 모델', 'MR 영상', 'Optical Flow']
  return (
    <div aria-label="AI 파이프라인" className="col-span-full mt-1 border-t border-hanji-border/50 pt-5 sm:pt-6">
      <p className="mb-3 font-sans text-[10px] tracking-[0.16em] text-ink-muted/60">AI 파이프라인</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        {steps.map((step, i) => (
          <div
            key={step}
            className="relative rounded border border-hanji-border/70 bg-hanji/25 px-3 py-2.5 text-center font-sans text-[11px] leading-snug text-ink-soft sm:text-xs"
          >
            {step}
            {i < steps.length - 1 ? (
              <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-ink-muted/30 sm:inline" aria-hidden>
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function achievementGridClass(count: number) {
  if (count === 3) return 'grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4'
  return 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'
}

type PanelAccent = {
  headerBg: string
  headerBorder: string
  titleColor: string
  wrapBorder: string
}

const VOWEL_ACCENT: PanelAccent = {
  headerBg: 'bg-[#faf3e8]',
  headerBorder: 'border-[#e6dcc8]',
  titleColor: 'text-[#6b5340]',
  wrapBorder: 'border-[#e8dcc8]/75',
}

const CONSONANT_ACCENT: PanelAccent = {
  headerBg: 'bg-[#eef3f8]',
  headerBorder: 'border-[#d4dfe8]',
  titleColor: 'text-[#3d5870]',
  wrapBorder: 'border-[#d4dfe8]/75',
}

const TECH_ACCENT: PanelAccent = {
  headerBg: 'bg-[#eef3ea]',
  headerBorder: 'border-[#d0dcc4]',
  titleColor: 'text-[#4d6041]',
  wrapBorder: 'border-[#d0dcc4]/75',
}

function AchievementPanel({
  label,
  items,
  tone,
  showPipeline,
}: {
  label: string
  items: { title: string; lines: string[] }[]
  tone: PanelAccent
  showPipeline?: boolean
}) {
  return (
    <section className={`overflow-hidden rounded-lg border ${tone.wrapBorder}`}>
      <header className={`border-b px-4 py-3.5 sm:px-5 sm:py-4 ${tone.headerBg} ${tone.headerBorder}`}>
        <h3 className={`font-serif text-base sm:text-[1.05rem] ${tone.titleColor}`}>{label}</h3>
      </header>

      <div className="bg-hanji/10 px-4 py-5 sm:px-5 sm:py-6">
        <div className={achievementGridClass(items.length)}>
          {items.map((item) => (
            <AchievementCell key={item.title} title={item.title} lines={item.lines} />
          ))}
          {showPipeline ? <TechPipelineStrip /> : null}
        </div>
      </div>
    </section>
  )
}

export function AchievementsShowcase({
  vowelLabel,
  consonantLabel,
  techLabel,
  vowels,
  consonants,
  tech,
}: {
  vowelLabel: string
  consonantLabel: string
  techLabel: string
  vowels: { title: string; lines: string[] }[]
  consonants: { title: string; lines: string[] }[]
  tech: { title: string; lines: string[] }[]
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <AchievementPanel label={vowelLabel} items={vowels} tone={VOWEL_ACCENT} />
      <AchievementPanel label={consonantLabel} items={consonants} tone={CONSONANT_ACCENT} />
      <AchievementPanel label={techLabel} items={tech} tone={TECH_ACCENT} showPipeline />
    </div>
  )
}

/* ── 연구진 — 명함형 카드 4×2 ── */

function MemberAvatarFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-hanji/55 to-hanji-warm/45">
      <div
        className="flex aspect-square w-[38%] min-w-[3.25rem] max-w-[4.5rem] items-center justify-center rounded-full bg-ink/[0.05] ring-1 ring-ink/[0.09]"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-[52%] w-[52%] text-ink/28" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    </div>
  )
}

function MemberPhoto({ name }: { name: string }) {
  const [failed, setFailed] = useState(false)
  const src = teamPhotoSrc(name)

  return (
    <div className="absolute inset-0">
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover object-[center_14%]"
          onError={() => setFailed(true)}
        />
      ) : (
        <MemberAvatarFallback />
      )}
    </div>
  )
}

function TeamMemberCard({
  member,
}: {
  member: { role: string; name: string; affiliation: string; task: string; field: string }
}) {
  const isLead = member.role.includes('책임')
  const affiliation = member.affiliation.trim()
  const showAffiliation = affiliation !== '' && affiliation !== '—' && affiliation !== '-'
  const displayName = member.name.replace(/\s*\n\s*/g, ', ').replace(/\s+/g, ' ').trim()

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className="h-full"
    >
      <article className="team-member-card flex h-full flex-col overflow-hidden rounded-lg border border-hanji-border/75 bg-hanji/25 shadow-[0_1px_0_rgb(var(--ink-rgb)/0.03)]">
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden border-b border-hanji-border/60 bg-hanji/40">
        <MemberPhoto name={member.name} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3.5 py-3.5 sm:px-4 sm:py-4">
        <div className="shrink-0">
          <p
            className={`h-3.5 font-sans text-[10px] font-medium leading-[0.875rem] tracking-[0.12em] ${
              isLead ? 'text-gold' : 'text-ink-muted/70'
            }`}
          >
            {member.role}
          </p>
          <h3 className="mt-1 min-h-[2.125rem] line-clamp-2 break-keep font-serif text-[0.95rem] leading-snug text-ink [overflow-wrap:break-word] sm:text-base">
            {displayName}
          </h3>
          <p
            className={`mt-0.5 min-h-[1.75rem] line-clamp-2 break-keep font-sans text-[11px] leading-snug [overflow-wrap:break-word] sm:text-xs ${
              showAffiliation ? 'text-ink-muted/75' : 'text-transparent select-none'
            }`}
            aria-hidden={!showAffiliation}
          >
            {showAffiliation ? affiliation : '\u00A0'}
          </p>
        </div>

        <div className="min-h-0 flex-1" aria-hidden />

        <div className="mt-3 shrink-0 border-t border-hanji-border/50 pt-3">
          <p className="min-h-[2.625rem] line-clamp-3 break-keep font-sans text-[11px] leading-[1.6] text-ink-soft [overflow-wrap:break-word] sm:text-[0.78rem] sm:leading-[1.65]">
            <RichText text={member.task} />
          </p>
          <div className="mt-2 flex h-6 items-center">
            <span className="inline-flex max-w-full rounded-full border border-hanji-border/70 bg-hanji/40 px-2.5 py-0.5 font-sans text-[10px] leading-snug text-ink-muted/80">
              {member.field}
            </span>
          </div>
        </div>
      </div>
      </article>
    </motion.div>
  )
}

export function TeamCardGrid({
  rows,
}: {
  rows: { role: string; name: string; affiliation: string; task: string; field: string }[]
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '-60px' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const animateState = mounted && inView ? 'visible' : 'hidden'
  const leadIndex = rows.findIndex((row) => row.role.includes('책임'))
  const lead = leadIndex >= 0 ? rows[leadIndex] : null
  const members = leadIndex >= 0 ? rows.filter((_, i) => i !== leadIndex) : rows

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.06,
      },
    },
  }

  return (
    <div ref={gridRef} className="space-y-2 sm:space-y-2.5 lg:space-y-3">
      {lead ? (
        <motion.div
          initial="hidden"
          animate={animateState}
          variants={containerVariants}
          className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 lg:gap-3"
        >
          <TeamMemberCard member={lead} />
        </motion.div>
      ) : null}

      {members.length > 0 ? (
        <motion.div
          initial="hidden"
          animate={animateState}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.14,
                delayChildren: lead ? 0.2 : 0.06,
              },
            },
          }}
          className="grid grid-cols-2 items-stretch gap-2 sm:gap-2.5 lg:grid-cols-4 lg:gap-3"
        >
          {members.map((member, i) => (
            <TeamMemberCard key={`${member.name}-${i}`} member={member} />
          ))}
        </motion.div>
      ) : null}
    </div>
  )
}

/* ── 연구진 — 직급별 이름 목록 (2단) ── */

export function TeamDirectoryList({
  groups,
}: {
  groups: { role: string; subtitle?: string; names: string[] }[]
}) {
  if (groups.length === 0) return null

  return (
    <div className="mt-10 space-y-6 border-t border-hanji-border/55 pt-9 sm:mt-12 sm:space-y-7 sm:pt-10">
      {groups.map((group, i) => (
        <div key={`${group.role}-${i}`}>
          <div className="mb-2.5 sm:mb-3">
            <p className="font-sans text-[10px] font-medium tracking-[0.12em] text-ink-muted/70">
              {group.role}
            </p>
            {group.subtitle?.trim() ? (
              <p className="mt-0.5 font-sans text-[10px] leading-snug text-ink-muted/50">
                ({group.subtitle.trim()})
              </p>
            ) : null}
          </div>
          <p className="break-keep font-serif text-[0.9rem] leading-[1.85] text-ink/90 sm:text-[0.9375rem]">
            {group.names.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  )
}
