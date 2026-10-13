'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MEDIA_MANIFEST } from '@/data/mediaManifest'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
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

/** 실제로 준비된 파일만 있다고 취급 — 아직 없는 건 "준비 중" 대신 그 영역 자체를 노출하지 않는다 */
function hasFile(list: readonly string[], fileName?: string): fileName is string {
  return Boolean(fileName) && list.includes(fileName as string)
}

function PictogramImage({ fileName, label }: { fileName: string; label: string }) {
  const [broken, setBroken] = useState(false)
  const src = `/images/pictograms/${encodeURIComponent(fileName)}`

  useEffect(() => {
    setBroken(false)
  }, [src])

  if (broken) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black/90">
      <Image
        src={src}
        alt={label}
        fill
        className="object-contain"
        sizes="(max-width: 640px) 100vw, 33vw"
        onError={() => setBroken(true)}
      />
    </div>
  )
}

/**
 * MRI 영상 · 조음 애니메이션 · 상형도 — 실제로 준비된 것만 균등한 열로 표시.
 * MRI를 맨 앞에 두고, 그 바로 다음에 조음 애니메이션을 둔다.
 * 준비 안 된 항목은 자리 자체를 만들지 않는다.
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
  const { lang } = useLang()
  const m = getMessages(lang)
  const showPictogram = hasFile(MEDIA_MANIFEST.pictograms, pictogramFileName)
  const showAnimation = hasFile(MEDIA_MANIFEST[type].animation, animationFileName)
  const showMri = hasFile(MEDIA_MANIFEST[type].mri, mriFileName)
  const mediaKey = `${type}|${mriFileName ?? ''}|${animationFileName ?? ''}`
  const [halfSpeed, setHalfSpeed] = useState(false)

  useEffect(() => {
    setHalfSpeed(false)
  }, [mediaKey])

  const count = [showPictogram, showAnimation, showMri].filter(Boolean).length
  if (count === 0) return null

  const hasVideo = showMri || showAnimation
  const playbackRate = halfSpeed ? 0.5 : 1
  const labelClass = 'mb-2 font-sans text-[13px] font-medium text-ink-muted'
  const controlClass =
    'inline-flex items-center rounded-full border px-3.5 py-1.5 font-sans text-[13px] font-medium transition-colors'
  const controlOff =
    'border-hanji-border bg-hanji-card/80 text-ink-soft hover:border-gold/45 hover:text-ink dark:bg-white/[0.04]'
  const controlOn = 'border-gold/55 bg-gold/15 text-ink'
  /* 열 개수는 항상 3 고정 — 1~2개만 있어도 3개 다 있을 때와 같은 칸 크기(1/3)를 유지.
   * 개수에 맞춰 열을 줄이면 남은 항목이 넓어지며(특히 세로로 aspect-video 비율 때문에)
   * 커져 보이는 문제가 생김(2026-09-20 사용자 지적). */

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {showMri ? (
          <div>
            <p className={labelClass}>{mriLabel}</p>
            <VideoPlayer fileName={mriFileName} type={type} videoType="mri" playbackRate={playbackRate} />
          </div>
        ) : null}
        {showAnimation ? (
          <div>
            <p className={labelClass}>{animationLabel}</p>
            <VideoPlayer
              fileName={animationFileName}
              type={type}
              videoType="animation"
              playbackRate={playbackRate}
            />
          </div>
        ) : null}
        {showPictogram ? (
          <div>
            <p className={labelClass}>{pictogramLabel}</p>
            <PictogramImage fileName={pictogramFileName as string} label={pictogramLabel} />
          </div>
        ) : null}
      </div>
      {hasVideo ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={halfSpeed}
            aria-label={m.halfSpeedAria}
            onClick={() => setHalfSpeed((on) => !on)}
            className={`${controlClass} ${halfSpeed ? controlOn : controlOff}`}
          >
            {m.halfSpeed}
          </button>
          {/* 비교 창은 다음 작업에서 연다. 지금은 자리만 둔다. */}
          <button type="button" aria-label={m.compareAria} className={`${controlClass} ${controlOff}`}>
            {m.compare}
          </button>
        </div>
      ) : null}
    </div>
  )
}
