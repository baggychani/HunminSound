'use client'

import { motion } from 'framer-motion'
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

function MethodTable({ intro, rows }: { intro: string; rows: { field: string; role: string; methods: string[] }[] }) {
  return (
    <>
      <p className="mb-6 font-sans text-[0.95rem] leading-relaxed text-ink-soft"><RichText text={intro} /></p>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="min-w-max w-full border-collapse font-sans text-[0.875rem]">
          <thead>
            <tr className="border-b border-ink/15">
              {['분야', '역할', '주요 방법'].map((h) => (
                <th key={h} className="pb-3 pr-8 text-left font-medium text-ink-muted/55 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.field} className="border-b border-hanji-border/60 last:border-0">
                <td className="py-3 pr-8 align-top font-semibold text-ink w-20">{row.field}</td>
                <td className="py-3 pr-8 align-top text-ink-soft leading-relaxed"><RichText text={row.role} /></td>
                <td className="py-3 align-top">
                  <ul className="space-y-1">
                    {row.methods.map((m) => (
                      <li key={m} className="text-ink-muted/70 leading-relaxed">{m}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function TeamTable({ rows }: { rows: { role: string; name: string; affiliation: string; task: string; field: string }[] }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="min-w-max w-full border-collapse font-sans text-[0.875rem]">
        <thead>
          <tr className="border-b border-ink/15">
            {['구분', '성명', '소속', '역할', '전공 분야'].map((h) => (
              <th key={h} className="pb-3 pr-6 last:pr-0 text-left font-medium text-ink-muted/55 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((mem, i) => (
            <tr key={i} className="border-b border-hanji-border/60 last:border-0">
              <td className="py-3 pr-6 align-top whitespace-nowrap text-ink-muted/60">{mem.role}</td>
              <td className="py-3 pr-6 align-top whitespace-nowrap font-semibold text-ink">{mem.name}</td>
              <td className="py-3 pr-6 align-top text-ink-muted/70 leading-relaxed">{mem.affiliation}</td>
              <td className="py-3 pr-6 align-top text-ink-soft leading-relaxed"><RichText text={mem.task} /></td>
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

  /** Shorthand: resolve translated text or fall back to Korean */
  const t = (key: string, koValue: string) => tr(translations, lang, key, koValue)

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
              <div className="space-y-4">
                {goals.specific.map((item, i) => (
                  <BulletItem
                    key={i}
                    label={t(`goals.specific.${i}.label`, item.label)}
                    text={t(`goals.specific.${i}.text`, item.text)}
                  />
                ))}
              </div>
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
            rows={team.rows.map((row, i) => ({
              ...row,
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