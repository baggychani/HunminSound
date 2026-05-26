'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { VideoPlayer } from './VideoPlayer'

interface DualVideoPlayerProps {
  animationFileName?: string
  mriFileName?: string
  pictogramFileName?: string
  type?: 'consonants' | 'vowels'
  animationLabel: string
  mriLabel: string
  pictogramLabel?: string
}

function PictogramImage({ fileName, label }: { fileName: string; label: string }) {
  const [missing, setMissing] = useState(false)
  const src = `/images/pictograms/${encodeURIComponent(fileName)}`

  useEffect(() => {
    setMissing(false)
  }, [src])

  if (missing) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-sm border border-hanji-border bg-hanji-warm/20">
        <p className="font-sans text-xs text-ink-muted/50">상형도 준비 중</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black/90">
      <Image
        src={src}
        alt={label}
        fill
        className="object-contain"
        sizes="(max-width: 640px) 100vw, 33vw"
        onError={() => setMissing(true)}
      />
    </div>
  )
}

/**
 * 상형도(있을 때) · 조음 애니메이션 · MRI 영상을 한 줄에 표시
 */
export function DualVideoPlayer({
  animationFileName,
  mriFileName,
  pictogramFileName,
  type = 'consonants',
  animationLabel,
  mriLabel,
  pictogramLabel = '상형도',
}: DualVideoPlayerProps) {
  const showPictogram = Boolean(pictogramFileName)
  const showAnimation = Boolean(animationFileName)
  const showMri = Boolean(mriFileName)

  if (!showPictogram && !showAnimation && !showMri) return null

  const labelClass = 'mb-2 font-sans text-[11px] uppercase tracking-widest text-ink-muted'
  const slotSpacer = <div className="aspect-video w-full" aria-hidden />
  const pictogramOnly = showPictogram && !showAnimation && !showMri

  if (pictogramOnly) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className={labelClass}>{pictogramLabel}</p>
          <PictogramImage fileName={pictogramFileName!} label={pictogramLabel} />
        </div>
      </div>
    )
  }

  const gridClass = showPictogram
    ? 'grid grid-cols-1 gap-4 sm:grid-cols-3'
    : 'grid grid-cols-1 gap-4 sm:grid-cols-2'

  return (
    <div className={gridClass}>
      {showPictogram ? (
        <div>
          <p className={labelClass}>{pictogramLabel}</p>
          <PictogramImage fileName={pictogramFileName!} label={pictogramLabel} />
        </div>
      ) : null}
      <div>
        <p className={`${labelClass} ${showAnimation ? '' : 'invisible'}`} aria-hidden={!showAnimation}>
          {animationLabel}
        </p>
        {showAnimation ? (
          <VideoPlayer fileName={animationFileName} type={type} videoType="animation" />
        ) : (
          slotSpacer
        )}
      </div>
      <div>
        <p className={`${labelClass} ${showMri ? '' : 'invisible'}`} aria-hidden={!showMri}>
          {mriLabel}
        </p>
        {showMri ? (
          <VideoPlayer fileName={mriFileName} type={type} videoType="mri" />
        ) : (
          slotSpacer
        )}
      </div>
    </div>
  )
}
