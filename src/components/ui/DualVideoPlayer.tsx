'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { MEDIA_MANIFEST } from '@/data/mediaManifest'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import {
  CompareOverlay,
  useCompareCatalog,
  type CompareLetter,
  type CompareVideoKind,
} from '@/components/showcase/phonetics/CompareOverlay'
import { VideoPlayer } from './VideoPlayer'

interface DualVideoPlayerProps {
  animationFileName?: string
  mriFileName?: string
  pictogramFileName?: string
  type?: 'consonants' | 'vowels'
  animationLabel: string
  mriLabel: string
  pictogramLabel?: string
  compareLetter?: CompareLetter
}

/** 실제로 준비된 파일만 있다고 취급 — 아직 없는 건 "준비 중" 대신 그 영역 자체를 노출하지 않는다 */
function hasFile(list: readonly string[], fileName?: string): fileName is string {
  return Boolean(fileName) && list.includes(fileName as string)
}

/** ㄱ.jpg → ㄱ-letter.png. 글자만 투명하게 얹은 겹침 그림이 있을 때 */
function letterOverlayName(fileName: string): string | undefined {
  const dot = fileName.lastIndexOf('.')
  if (dot < 0) return undefined
  const candidate = `${fileName.slice(0, dot)}-letter.png`
  return hasFile(MEDIA_MANIFEST.pictograms, candidate) ? candidate : undefined
}

function PictogramImage({ fileName, label }: { fileName: string; label: string }) {
  const [broken, setBroken] = useState(false)
  const [hover, setHover] = useState(false)
  const [held, setHeld] = useState(false)
  const pointer = useRef<'mouse' | 'touch' | 'key'>('mouse')
  const src = `/images/pictograms/${encodeURIComponent(fileName)}`
  const letterName = letterOverlayName(fileName)
  const letterSrc = letterName ? `/images/pictograms/${encodeURIComponent(letterName)}` : undefined

  useEffect(() => {
    setBroken(false)
    setHover(false)
    setHeld(false)
  }, [src])

  if (broken) return null

  const shown = hover || held
  const frame = (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black/90">
      <Image
        src={src}
        alt={letterSrc ? '' : label}
        fill
        className="object-contain"
        sizes="(max-width: 640px) 100vw, 33vw"
        onError={() => setBroken(true)}
      />
      {letterSrc ? (
        <Image
          src={letterSrc}
          alt=""
          fill
          className={`pointer-events-none object-contain transition-opacity duration-700 ease-in-out ${shown ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      ) : null}
    </div>
  )

  if (!letterSrc) return frame

  return (
    <button
      type="button"
      className="group block w-full cursor-pointer touch-manipulation bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-gold/70"
      aria-pressed={shown}
      aria-label={label}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHover(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setHover(false)
      }}
      onPointerDown={(e) => {
        pointer.current = e.pointerType === 'mouse' ? 'mouse' : 'touch'
      }}
      onKeyDown={() => {
        pointer.current = 'key'
      }}
      onClick={() => {
        if (pointer.current === 'mouse') return
        setHeld((v) => !v)
      }}
    >
      {frame}
    </button>
  )
}

/**
 * MRI 영상 · 조음 애니메이션 · 상형도 — 실제로 준비된 것만 균등한 열로 표시.
 * MRI를 맨 앞에 두고, 그 바로 다음에 조음 애니메이션을 둔다.
 * 0.5배속과 비교하기는 영상마다 따로 둔다. 상형도에는 두지 않는다.
 */
export function DualVideoPlayer({
  animationFileName,
  mriFileName,
  pictogramFileName,
  type = 'consonants',
  animationLabel,
  mriLabel,
  pictogramLabel = '상형도',
  compareLetter,
}: DualVideoPlayerProps) {
  const { lang } = useLang()
  const m = getMessages(lang)
  const catalog = useCompareCatalog()
  const showPictogram = hasFile(MEDIA_MANIFEST.pictograms, pictogramFileName)
  const showAnimation = hasFile(MEDIA_MANIFEST[type].animation, animationFileName)
  const showMri = hasFile(MEDIA_MANIFEST[type].mri, mriFileName)
  const mediaKey = `${type}|${mriFileName ?? ''}|${animationFileName ?? ''}`
  const [rates, setRates] = useState<{ mri: number; animation: number }>({ mri: 1, animation: 1 })
  const [compareKind, setCompareKind] = useState<CompareVideoKind | null>(null)

  useEffect(() => {
    setRates({ mri: 1, animation: 1 })
    setCompareKind(null)
  }, [mediaKey])

  const count = [showPictogram, showAnimation, showMri].filter(Boolean).length
  if (count === 0) return null

  const labelClass = 'mb-2 font-sans text-[13px] font-medium text-ink-muted'
  const controlClass =
    'inline-flex items-center rounded-full border px-3.5 py-1.5 font-sans text-[13px] font-medium transition-colors'
  const controlOff =
    'border-hanji-border bg-hanji-card/80 text-ink-soft hover:border-gold/45 hover:text-ink dark:bg-white/[0.04]'
  const controlOn = 'border-gold/55 bg-gold/15 text-ink'
  /* 열 개수는 항상 3 고정 — 1~2개만 있어도 3개 다 있을 때와 같은 칸 크기(1/3)를 유지.
   * 개수에 맞춰 열을 줄이면 남은 항목이 넓어지며(특히 세로로 aspect-video 비율 때문에)
   * 커져 보이는 문제가 생김(2026-09-20 사용자 지적). */

  function videoColumn(kind: CompareVideoKind, fileName: string, label: string) {
    const half = rates[kind] === 0.5
    return (
      <div>
        <p className={labelClass}>{label}</p>
        <VideoPlayer fileName={fileName} type={type} videoType={kind} playbackRate={rates[kind]} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={half}
            aria-label={m.halfSpeedAria}
            onClick={() =>
              setRates((prev) => ({ ...prev, [kind]: prev[kind] === 0.5 ? 1 : 0.5 }))
            }
            className={`${controlClass} ${half ? controlOn : controlOff}`}
          >
            {m.halfSpeed}
          </button>
          <button
            type="button"
            aria-label={m.compareAria}
            onClick={() => setCompareKind(kind)}
            className={`${controlClass} ${controlOff}`}
          >
            {m.compare}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {showMri ? videoColumn('mri', mriFileName, mriLabel) : null}
        {showAnimation ? videoColumn('animation', animationFileName, animationLabel) : null}
        {showPictogram ? (
          <div>
            <p className={labelClass}>{pictogramLabel}</p>
            <PictogramImage fileName={pictogramFileName as string} label={pictogramLabel} />
          </div>
        ) : null}
      </div>
      {compareLetter && compareKind ? (
        <CompareOverlay
          open
          onClose={() => setCompareKind(null)}
          type={type}
          source={{ letter: compareLetter, kind: compareKind }}
          letters={catalog}
        />
      ) : null}
    </div>
  )
}
