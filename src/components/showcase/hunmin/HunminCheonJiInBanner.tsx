const CHEON_JI_IN_ITEMS = [
  { glyph: '\u00B7', title: '\uD558\uB298', hanja: '\u5929', desc: '\uB91C\uADFC \uC810 \u2014 \uD558\uB298\uC744 \uC0C1\uC9D5' },
  { glyph: '\u3161', title: '\uB545', hanja: '\u5730', desc: '\uD3C9\uD3C9\uD55C \uC120 \u2014 \uB545\uC744 \uC0C1\uC9D5' },
  { glyph: '\u3163', title: '\uC0AC\uB78C', hanja: '\u4EBA', desc: '\uC138\uC6B4 \uC120 \u2014 \uC0AC\uB78C\uC744 \uC0C1\uC9D5' },
] as const

export function HunminCheonJiInBanner() {
  return (
    <section
      className="overflow-hidden rounded-sm bg-[#1e3a5f] px-5 py-5 sm:px-8 sm:py-6"
      aria-label="\uCC9C\uC9C0\uC778(\u5929\u5730\u4EBA)"
    >
      <div className="grid gap-6 sm:grid-cols-3 sm:gap-5 lg:gap-8">
        {CHEON_JI_IN_ITEMS.map((item) => (
          <div key={item.hanja} className="flex min-w-0 items-center gap-3.5 sm:gap-4">
            <span
              className="w-7 shrink-0 text-center font-jamo text-[1.35rem] leading-none text-white sm:w-8 sm:text-[1.5rem]"
              aria-hidden
            >
              {item.glyph}
            </span>
            <div className="min-w-0">
              <p className="font-serif text-[15px] leading-snug tracking-wide text-white sm:text-base">
                {item.title}{' '}
                <span className="text-white/90">{item.hanja}</span>
              </p>
              <p className="mt-0.5 font-sans text-[11px] leading-snug tracking-wide text-white/55 sm:text-xs">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
