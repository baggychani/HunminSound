'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

function SectionPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex min-h-[140px] items-center justify-center rounded-sm border border-dashed border-hanji-border bg-hanji-warm/25 sm:min-h-[160px]">
      <p className="font-sans text-sm text-ink-muted/55">{label}</p>
    </div>
  )
}

function InfoTable() {
  const rows = [
    { label: '과제번호', value: 'NRF-2023S1A5A2A21086078' },
    { label: '사업명', value: '한국연구재단 글로벌인문사회융합연구지원사업(연구그룹형)' },
    { label: '연구과제명 (국문)', value: '훈민정음 제자 원리의 융복합적 실증 및 응용' },
    {
      label: '연구과제명 (영문)',
      value: 'A Convergence Demonstration and Application of the Principles of the Creation of Hunminjeongeum Characters',
    },
    { label: '총 연구기간', value: '2023. 6. 1. ~ 2026. 5. 31. (3년)' },
    { label: '연구 유형', value: '융복합연구(인문학 + 의학 + 공학)' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-sans text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-hanji-border/60 last:border-0">
              <td className="py-3 pr-6 align-top whitespace-nowrap text-ink-muted/70 font-medium w-44">
                {row.label}
              </td>
              <td className="py-3 text-ink leading-relaxed">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TeamTable() {
  const members = [
    {
      role: '연구책임자',
      name: '김슬옹',
      affiliation: '세종국어문화원',
      task: '연구 총괄 · 훈민정음학 분석',
      field: '훈민정음학',
    },
    {
      role: '공동연구원',
      name: '최홍식',
      affiliation: '(사)세종대왕기념사업회',
      task: 'MRI 영상분석 · 음성의학적 검증',
      field: '음성의학',
    },
    {
      role: '공동연구원',
      name: '이호영',
      affiliation: '서울대학교 인문대학 언어학과',
      task: '음성학적 분석 · 다국어 비교 연구',
      field: '음성학',
    },
    {
      role: '공동연구원',
      name: '김진아',
      affiliation: '연세대학교 의과대학 영상의학교실',
      task: 'MRI 촬영 프로토콜 · 영상 획득 및 분석',
      field: '영상의학',
    },
    {
      role: '일반연구원',
      name: '이정민',
      affiliation: '천지인발성연구소',
      task: 'MRI 데이터 측정 · 영상 분석',
      field: '언어병리학',
    },
    {
      role: '일반연구원',
      name: '이승수',
      affiliation: '연세대학교 대학원 언어병리협동과정',
      task: '상형도 일러스트 · 영상 시각화',
      field: '언어병리학 / 일러스트',
    },
    {
      role: '일반연구원',
      name: '이호현',
      affiliation: '—',
      task: '표준상형도 제작 · 첨가도 그림 · 영상 분석/시각화',
      field: '음성공학',
    },
    {
      role: '팀',
      name: '윤국진, 정병인, 오창균 외',
      affiliation: '—',
      task: 'AI 파이프라인 개발 · 2D 애니메이션 생성 · 웹 데모 시스템 구현',
      field: '음성공학 · AI/웹 개발',
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b border-ink/20">
            <th className="pb-2 pr-5 text-left font-medium text-ink-muted/70 whitespace-nowrap">구분</th>
            <th className="pb-2 pr-5 text-left font-medium text-ink-muted/70 whitespace-nowrap">성명</th>
            <th className="pb-2 pr-5 text-left font-medium text-ink-muted/70">소속</th>
            <th className="pb-2 pr-5 text-left font-medium text-ink-muted/70">역할</th>
            <th className="pb-2 text-left font-medium text-ink-muted/70 whitespace-nowrap">전공 분야</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i} className="border-b border-hanji-border/60 last:border-0">
              <td className="py-3 pr-5 align-top whitespace-nowrap text-ink-muted/70">{m.role}</td>
              <td className="py-3 pr-5 align-top whitespace-nowrap text-ink font-medium">{m.name}</td>
              <td className="py-3 pr-5 align-top text-ink-muted/80 leading-relaxed">{m.affiliation}</td>
              <td className="py-3 pr-5 align-top text-ink leading-relaxed">{m.task}</td>
              <td className="py-3 align-top text-ink-muted/80 whitespace-nowrap">{m.field}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ResearchPageClient() {
  const { lang } = useLang()
  const m = getMessages(lang)

  return (
    <>
      <div className="pt-16 pb-12 mb-14 sm:mb-16">
        <h1 className="font-serif text-[2.1rem] leading-tight tracking-tight text-ink sm:text-4xl mb-3">
          {m.research}
        </h1>
        <p className="font-sans text-sm leading-relaxed text-ink-muted max-w-2xl">
          {m.researchPageDesc}
        </p>
      </div>

      <div className="space-y-16 pb-28 sm:space-y-20 sm:pb-32">
        {/* 연구진 소개 */}
        <motion.section
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          aria-labelledby="section-team"
        >
          <div className="mb-8 pb-4 sm:mb-10">
            <h2 id="section-team" className="font-serif text-xl tracking-tight leading-snug text-ink sm:text-2xl">
              {m.researchSec1}
            </h2>
          </div>
          <TeamTable />
        </motion.section>

        {/* 연구 목적과 의의 */}
        <motion.section
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          aria-labelledby="section-objectives"
        >
          <div className="mb-8 pb-4 sm:mb-10">
            <h2 id="section-objectives" className="font-serif text-xl tracking-tight leading-snug text-ink sm:text-2xl">
              {m.researchSec2}
            </h2>
          </div>
          <SectionPlaceholder label={m.comingSoon} />
        </motion.section>

        {/* 과제 정보 */}
        <motion.section
          custom={2}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          aria-labelledby="section-nrf"
        >
          <div className="mb-8 pb-4 sm:mb-10">
            <h2 id="section-nrf" className="font-serif text-lg tracking-tight leading-snug text-ink-muted sm:text-xl">
              {m.researchSec3}
            </h2>
          </div>
          <InfoTable />
        </motion.section>
      </div>
    </>
  )
}
