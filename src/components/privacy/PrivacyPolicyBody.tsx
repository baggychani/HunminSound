'use client'

import { useLang } from '@/contexts/LanguageContext'
import { PRIVACY } from '@/lib/privacy'
import { getPrivacyPolicy, type PolicyPart } from '@/lib/privacy-policy'

const cell = 'border border-hanji-border/70 px-3 py-2 align-top'

function fill(text: string, email: string, phone: string) {
  return text.replaceAll('{email}', email).replaceAll('{phone}', phone)
}

function Parts({ parts, email, phone }: { parts: PolicyPart[]; email: string; phone: string }) {
  const policy = getPrivacyPolicy(useLang().lang)
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'p') {
          return <p key={index}>{fill(part.text, email, phone)}</p>
        }
        if (part.type === 'ul') {
          return (
            <ul key={index} className="list-disc space-y-1.5 ps-5 marker:text-ink-muted">
              {part.items.map((item) => (
                <li key={item}>{fill(item, email, phone)}</li>
              ))}
            </ul>
          )
        }
        if (part.type === 'table') {
          const rows = [policy.vercel, policy.google]
          return (
            <div key={index} className="-mx-1 overflow-x-auto px-1" dir="ltr">
              <table className="w-full min-w-[36rem] border-collapse text-[0.85rem] leading-relaxed">
                <thead>
                  <tr className="bg-hanji-border/20 text-ink">
                    {policy.tableHead.map((head) => (
                      <th key={head} className={cell}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((value, cellIndex) => (
                        <td key={cellIndex} className={cell}>
                          {fill(value, email, phone)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        return (
          <ul key={index} className="list-disc space-y-1.5 ps-5 marker:text-ink-muted">
            <li>
              {policy.labelName}: {policy.officerName} ({policy.officerRole})
            </li>
            <li>
              {policy.labelPhone}: {phone}
            </li>
            <li>
              {policy.labelEmail}: {email}
            </li>
          </ul>
        )
      })}
    </>
  )
}

export function PrivacyPolicyBody() {
  const { lang } = useLang()
  const policy = getPrivacyPolicy(lang)
  const { email, phone } = PRIVACY.officer

  return (
    <div className="site-container page-shell" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl pb-24">
        <div className="border-b border-hanji-border pb-10 pt-16">
          <h1
            className="font-serif leading-tight tracking-tight text-ink"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 3rem)' }}
          >
            {policy.title}
          </h1>
          <p className="mt-6 break-keep font-sans text-[0.95rem] leading-[1.9] text-ink-soft">
            {fill(policy.intro, email, phone)}
          </p>
        </div>

        {policy.articles.map((article, index) => (
          <section key={article.title} className="border-t border-hanji-border/60 py-8">
            <h2 className="font-serif text-[1.15rem] font-bold text-ink">
              {policy.articleLabel(index + 1)} {article.title}
            </h2>
            <div className="mt-4 space-y-3 break-keep font-sans text-[0.95rem] leading-[1.9] text-ink-soft [overflow-wrap:break-word]">
              <Parts parts={article.parts} email={email} phone={phone} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
