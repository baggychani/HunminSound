'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MEDIA_MANIFEST } from '@/data/mediaManifest'
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
 * 상형도 · 조음 애니메이션 · MRI 영상 — 실제로 준비된 것만 균등한 열로 표시.
 * 준비 안 된 항목은 자리 자체를 만들지 않는다(스포일러성 "준비 중" 문구 없음).
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
  const showPictogram = hasFile(MEDIA_MANIFEST.pictograms, pictogramFileName)
  const showAnimation = hasFile(MEDIA_MANIFEST[type].animation, animationFileName)
  const showMri = hasFile(MEDIA_MANIFEST[type].mri, mriFileName)

  const count = [showPictogram, showAnimation, showMri].filter(Boolean).length
  if (count === 0) return null

  const labelClass = 'mb-2 font-sans text-[13px] font-medium text-ink-muted'
  const gridColsClass = count >= 3 ? 'sm:grid-cols-3' : count === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridColsClass}`}>
      {showPictogram ? (
        <div>
          <p className={labelClass}>{pictogramLabel}</p>
          <PictogramImage fileName={pictogramFileName as string} label={pictogramLabel} />
        </div>
      ) : null}
      {showAnimation ? (
        <div>
          <p className={labelClass}>{animationLabel}</p>
          <VideoPlayer fileName={animationFileName} type={type} videoType="animation" />
        </div>
      ) : null}
      {showMri ? (
        <div>
          <p className={labelClass}>{mriLabel}</p>
          <VideoPlayer fileName={mriFileName} type={type} videoType="mri" />
        </div>
      ) : null}
    </div>
  )
}
