'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getV2Messages } from '@/lib/v2-i18n'
import type { ResearchContent } from '@/lib/research-content'
import { tr } from '@/lib/research-content'
import { teamInitials, teamPhotoSrc } from '@/lib/teamSlugs'

interface TeamSectionProps {
  content: ResearchContent
}

function MemberAvatar({ name }: { name: string }) {
  const [failed, setFailed] = useState(false)
  const src = teamPhotoSrc(name)
  const initials = teamInitials(name)

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-indigo-200"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white ring-2 ring-indigo-200">
      {initials}
    </span>
  )
}

export function TeamSection({ content }: TeamSectionProps) {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)
  const t = content.translations
  const rows = content.team.rows
    .map((member, index) => ({ member, index }))
    .filter(({ member }) => member.role !== '팀')

  return (
    <section id="team" data-snap className="relative bg-v2-lavender py-20 text-stone-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(99,102,241,0.12),transparent_45%)]" />
      <div className="v2-section-inner relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">{v2.teamLabel}</p>
          <h2 className="v2-title mt-4">{v2.teamTitle}</h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ member, index }, i) => (
            <motion.article
              key={`${member.name}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="flex gap-4 rounded-xl bg-white/70 p-4 transition hover:bg-white/85 sm:p-5"
            >
              <MemberAvatar name={member.name} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {tr(t, lang, `team.rows.${index}.role`, member.role)}
                </p>
                <h3 className="mt-1 font-serif text-base font-semibold">{member.name}</h3>
                {member.affiliation && (
                  <p className="mt-1 text-xs text-stone-500">{member.affiliation}</p>
                )}
                <p className="v2-body mt-2 text-stone-600">
                  {tr(t, lang, `team.rows.${index}.task`, member.task.replace(/\n/g, ' '))}
                </p>
                <span className="mt-3 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-medium text-indigo-700">
                  {member.field}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
