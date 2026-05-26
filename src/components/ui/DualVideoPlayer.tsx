'use client'

import { VideoPlayer } from './VideoPlayer'

interface DualVideoPlayerProps {
  animationFileName?: string
  mriFileName?: string
  type?: 'consonants' | 'vowels'
  animationLabel: string
  mriLabel: string
}

/**
 * 조음 애니메이션(좌)과 MRI 영상(우)을 나란히 표시하는 컴포넌트
 */
export function DualVideoPlayer({
  animationFileName,
  mriFileName,
  type = 'consonants',
  animationLabel,
  mriLabel,
}: DualVideoPlayerProps) {
  const showAnimation = Boolean(animationFileName)
  const showMri = Boolean(mriFileName)

  if (!showAnimation && !showMri) return null

  const labelClass = 'mb-2 font-sans text-[11px] uppercase tracking-widest text-ink-muted'
  const slotSpacer = <div className="aspect-video w-full" aria-hidden />

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
