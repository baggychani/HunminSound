'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

export interface CompareLetter {
  id: string
  symbol: string
  name: string
  mriFileName?: string
  animationFileName?: string
}

const CompareCatalogContext = createContext<CompareLetter[]>([])

export function CompareCatalogProvider({
  letters,
  children,
}: {
  letters: CompareLetter[]
  children: ReactNode
}) {
  return <CompareCatalogContext.Provider value={letters}>{children}</CompareCatalogContext.Provider>
}

export function useCompareCatalog() {
  return useContext(CompareCatalogContext)
}

export function toCompareLetter(item: {
  _id: string
  symbol: string
  name: string
  mriFileName?: string
  animationFileName?: string
}): CompareLetter {
  return {
    id: item._id,
    symbol: item.symbol,
    name: item.name,
    mriFileName: item.mriFileName,
    animationFileName: item.animationFileName,
  }
}

interface CompareOverlayProps {
  open: boolean
  onClose: () => void
  type: 'consonants' | 'vowels'
  current: CompareLetter
  letters: CompareLetter[]
}

function LetterPane({
  letter,
  type,
  mriLabel,
  animationLabel,
}: {
  letter: CompareLetter
  type: 'consonants' | 'vowels'
  mriLabel: string
  animationLabel: string
}) {
  return (
    <div className="min-w-0">
      <p className="font-serif text-3xl leading-none text-ink" dir="ltr" lang="ko">
        {letter.symbol}
      </p>
      <p className="mt-1 font-sans text-[13px] text-ink-muted" dir="ltr" lang="ko">
        {letter.name}
      </p>
      <div className="mt-4 grid gap-3">
        {letter.mriFileName ? (
          <div>
            <p className="mb-1.5 font-sans text-[12px] font-medium text-ink-muted">{mriLabel}</p>
            <VideoPlayer fileName={letter.mriFileName} type={type} videoType="mri" />
          </div>
        ) : null}
        {letter.animationFileName ? (
          <div>
            <p className="mb-1.5 font-sans text-[12px] font-medium text-ink-muted">{animationLabel}</p>
            <VideoPlayer fileName={letter.animationFileName} type={type} videoType="animation" />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function CompareOverlay({ open, onClose, type, current, letters }: CompareOverlayProps) {
  const { lang } = useLang()
  const m = getMessages(lang)
  const [otherId, setOtherId] = useState('')

  useEffect(() => {
    if (open) setOtherId('')
  }, [open, current.id])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  const choices = letters.filter(
    (letter) => letter.id !== current.id && (letter.mriFileName || letter.animationFileName),
  )
  const other = choices.find((letter) => letter.id === otherId) ?? null

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex items-end justify-center bg-ink/45 p-3 sm:items-center sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={m.compareAria}
        className="max-h-[min(92vh,52rem)] w-full max-w-5xl overflow-y-auto rounded-md border border-hanji-border bg-hanji px-4 py-4 shadow-2xl sm:px-6 sm:py-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg text-ink">{m.compare}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-hanji-border px-3 py-1 font-sans text-[13px] text-ink-soft hover:border-gold/45 hover:text-ink"
          >
            {m.compareClose}
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <LetterPane
            letter={current}
            type={type}
            mriLabel={m.mriVideo}
            animationLabel={m.animationVideo}
          />
          <div className="min-w-0">
            <label className="mb-2 block font-sans text-[13px] font-medium text-ink-muted" htmlFor="compare-letter">
              {m.comparePick}
            </label>
            <select
              id="compare-letter"
              value={otherId}
              onChange={(event) => setOtherId(event.target.value)}
              className="w-full rounded-sm border border-hanji-border bg-hanji-card px-3 py-2 font-sans text-sm text-ink"
            >
              <option value="">{m.comparePick}</option>
              {choices.map((letter) => (
                <option key={letter.id} value={letter.id}>
                  {letter.name}
                </option>
              ))}
            </select>
            {other ? (
              <div className="mt-4">
                <LetterPane
                  letter={other}
                  type={type}
                  mriLabel={m.mriVideo}
                  animationLabel={m.animationVideo}
                />
              </div>
            ) : (
              <p className="mt-6 rounded-sm border border-dashed border-hanji-border px-4 py-8 text-center font-sans text-sm leading-relaxed text-ink-muted">
                {m.compareEmpty}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
