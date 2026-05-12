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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p className="font-sans text-[11px] text-ink-muted tracking-widest uppercase mb-2">
          {animationLabel}
        </p>
        <VideoPlayer
          fileName={animationFileName}
          type={type}
          videoType="animation"
        />
      </div>
      <div>
        <p className="font-sans text-[11px] text-ink-muted tracking-widest uppercase mb-2">
          {mriLabel}
        </p>
        <VideoPlayer
          fileName={mriFileName}
          type={type}
          videoType="mri"
        />
      </div>
    </div>
  )
}
