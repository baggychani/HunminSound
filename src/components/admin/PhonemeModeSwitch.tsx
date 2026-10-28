'use client'

export type PhonemeAdminMode = 'modern' | 'hunmin'

export function PhonemeModeSwitch({
  mode,
  onChange,
  label,
}: {
  mode: PhonemeAdminMode
  onChange: (mode: PhonemeAdminMode) => void
  label: string
}) {
  const options: { id: PhonemeAdminMode; label: string }[] = [
    { id: 'hunmin', label: '훈민정음 제자해' },
    { id: 'modern', label: '현대 음성학' },
  ]
  return (
    <div role="tablist" aria-label={label} className="mb-10 inline-flex border border-hanji-border">
      {options.map((option) => {
        const selected = mode === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.id)}
            className={`px-4 py-2 font-sans text-sm ${
              selected ? 'bg-hanji-warm text-ink' : 'bg-hanji text-ink-muted hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
