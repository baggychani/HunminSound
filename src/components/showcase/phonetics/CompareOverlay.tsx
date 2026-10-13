'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { MEDIA_MANIFEST } from '@/data/mediaManifest'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages, type Messages } from '@/lib/i18n'

export type CompareVideoKind = 'mri' | 'animation'

export interface CompareLetter {
  id: string
  symbol: string
  name: string
  mriFileName?: string
  animationFileName?: string
}

export interface CompareSource {
  letter: CompareLetter
  kind: CompareVideoKind
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
  source: CompareSource
  letters: CompareLetter[]
}

function fileFor(letter: CompareLetter, kind: CompareVideoKind) {
  return kind === 'mri' ? letter.mriFileName : letter.animationFileName
}

function hasMedia(
  letter: CompareLetter,
  kind: CompareVideoKind,
  type: 'consonants' | 'vowels',
) {
  const fileName = fileFor(letter, kind)
  if (!fileName) return false
  return (MEDIA_MANIFEST[type][kind] as readonly string[]).includes(fileName)
}

/** 왼쪽에서 보고 있는 종류가 있으면 그 종류를 먼저 고른다. */
function preferredKind(
  letter: CompareLetter,
  preferred: CompareVideoKind,
  type: 'consonants' | 'vowels',
): CompareVideoKind | null {
  if (hasMedia(letter, preferred, type)) return preferred
  const other: CompareVideoKind = preferred === 'mri' ? 'animation' : 'mri'
  if (hasMedia(letter, other, type)) return other
  return null
}

function SpeedButtons({
  rate,
  onChange,
  m,
}: {
  rate: number
  onChange: (rate: number) => void
  m: Messages
}) {
  const controlClass =
    'inline-flex items-center rounded-full border px-3.5 py-1.5 font-sans text-[13px] font-medium transition-colors'
  const controlOff =
    'border-hanji-border bg-hanji-card/80 text-ink-soft hover:border-gold/45 hover:text-ink dark:bg-white/[0.04]'
  const controlOn = 'border-gold/55 bg-gold/15 text-ink'
  const options = [
    { value: 0.5, label: m.halfSpeed, aria: m.halfSpeedAria },
    { value: 0.7, label: m.slow07, aria: m.slow07Aria },
  ]
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const on = rate === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            aria-label={option.aria}
            onClick={() => onChange(on ? 1 : option.value)}
            className={`${controlClass} ${on ? controlOn : controlOff}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function CompareOverlay({ open, onClose, type, source, letters }: CompareOverlayProps) {
  const { lang } = useLang()
  const m = getMessages(lang)
  const [leftId, setLeftId] = useState(source.letter.id)
  const [leftKind, setLeftKind] = useState<CompareVideoKind>(source.kind)
  const [rightId, setRightId] = useState('')
  const [rightKind, setRightKind] = useState<CompareVideoKind | null>(null)
  const [leftRate, setLeftRate] = useState(1)
  const [rightRate, setRightRate] = useState(1)

  useEffect(() => {
    if (!open) return
    setLeftId(source.letter.id)
    setLeftKind(source.kind)
    setRightId('')
    setRightKind(null)
    setLeftRate(1)
    setRightRate(1)
  }, [open, source.letter.id, source.kind])

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
    (letter) =>
      letter.id === source.letter.id ||
      hasMedia(letter, 'mri', type) ||
      hasMedia(letter, 'animation', type),
  )
  const left = choices.find((letter) => letter.id === leftId) ?? source.letter
  const right = choices.find((letter) => letter.id === rightId) ?? null
  const leftFile = fileFor(left, leftKind)
  const rightFile = right && rightKind ? fileFor(right, rightKind) : undefined

  function pickLeft(id: string) {
    setLeftId(id)
    const letter = choices.find((item) => item.id === id)
    if (!letter) return
    const next = preferredKind(letter, leftKind, type)
    if (next) setLeftKind(next)
    setLeftRate(1)
  }

  function pickRight(id: string) {
    setRightId(id)
    const letter = choices.find((item) => item.id === id)
    setRightKind(letter ? preferredKind(letter, leftKind, type) : null)
    setRightRate(1)
  }

  const kindButton = (
    letter: CompareLetter | null,
    kind: CompareVideoKind,
    selected: CompareVideoKind | null,
    onPick: (kind: CompareVideoKind) => void,
  ) => {
    const ready = letter ? hasMedia(letter, kind, type) : false
    const on = ready && selected === kind
    return (
      <button
        key={kind}
        type="button"
        aria-pressed={on}
        disabled={!ready}
        onClick={() => onPick(kind)}
        className={`inline-flex items-center rounded-full border px-3.5 py-1.5 font-sans text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          on
            ? 'border-gold/55 bg-gold/15 text-ink'
            : 'border-hanji-border bg-hanji-card/80 text-ink-soft hover:border-gold/45 hover:text-ink disabled:hover:border-hanji-border disabled:hover:text-ink-soft dark:bg-white/[0.04]'
        }`}
      >
        {kind === 'mri' ? m.mriVideo : m.animationVideo}
      </button>
    )
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex items-end justify-center bg-ink/45 p-3 sm:items-center sm:p-5"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={m.compareAria}
        className="max-h-[94vh] w-[min(96vw,90rem)] overflow-y-auto rounded-md border border-hanji-border bg-hanji px-4 py-4 shadow-2xl sm:px-7 sm:py-5"
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
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-x-8">
          <div className="flex flex-col">
            <label className="mb-2 block font-sans text-[13px] font-medium text-ink-muted" htmlFor="compare-left">
              {m.comparePick}
            </label>
            <select
              id="compare-left"
              value={left.id}
              onChange={(event) => pickLeft(event.target.value)}
              className="h-10 w-full rounded-sm border border-hanji-border bg-hanji-card px-3 font-sans text-sm text-ink"
            >
              {choices.map((letter) => (
                <option key={letter.id} value={letter.id}>
                  {letter.name}
                </option>
              ))}
            </select>
            <div className="mt-2 flex min-h-9 flex-wrap gap-2">
              {kindButton(left, 'mri', leftKind, setLeftKind)}
              {kindButton(left, 'animation', leftKind, setLeftKind)}
            </div>
            <div className="mt-3 aspect-video w-full overflow-hidden rounded-sm bg-black">
              {leftFile ? (
                <VideoPlayer fileName={leftFile} type={type} videoType={leftKind} playbackRate={leftRate} />
              ) : null}
            </div>
            <div className="mt-2 min-h-9">
              <SpeedButtons rate={leftRate} onChange={setLeftRate} m={m} />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 block font-sans text-[13px] font-medium text-ink-muted" htmlFor="compare-jamo">
              {m.comparePick}
            </label>
            <select
              id="compare-jamo"
              value={rightId}
              onChange={(event) => pickRight(event.target.value)}
              className="h-10 w-full rounded-sm border border-hanji-border bg-hanji-card px-3 font-sans text-sm text-ink"
            >
              <option value="">{m.comparePick}</option>
              {choices.map((letter) => (
                <option key={letter.id} value={letter.id}>
                  {letter.name}
                </option>
              ))}
            </select>
            <div className="mt-2 flex min-h-9 flex-wrap gap-2">
              {kindButton(right, 'mri', rightKind, setRightKind)}
              {kindButton(right, 'animation', rightKind, setRightKind)}
            </div>
            <div className="mt-3 aspect-video w-full overflow-hidden rounded-sm bg-black">
              {right && rightKind && rightFile ? (
                <VideoPlayer fileName={rightFile} type={type} videoType={rightKind} playbackRate={rightRate} />
              ) : (
                <p className="flex h-full items-center justify-center px-6 text-center font-sans text-sm leading-relaxed text-white/70">
                  {m.compareEmpty}
                </p>
              )}
            </div>
            <div className="mt-2 min-h-9">
              <SpeedButtons rate={rightRate} onChange={setRightRate} m={m} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
