'use client'

import { useState } from 'react'

interface VideoPlayerProps {
  fileName?: string
  type?: 'consonants' | 'vowels'
  videoType?: 'animation' | 'mri'
  label?: string
}

export function VideoPlayer({
  fileName,
  type = 'consonants',
  videoType = 'mri',
}: VideoPlayerProps) {
  const [missing, setMissing] = useState(false)

  // 파일 경로: /videos/{type}/{videoType}/{fileName}
  // 예: /videos/vowels/animation/ani_a.mp4
  const src = fileName ? `/videos/${type}/${videoType}/${fileName}` : null

  if (!src || missing) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-sm border border-hanji-border bg-hanji-warm/20">
        <p className="font-sans text-xs text-ink-muted/50">
          {videoType === 'animation' ? '애니메이션 준비 중' : 'MRI 영상 준비 중'}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-sm overflow-hidden bg-ink/5">
      <video
        key={src}
        controls
        playsInline
        onError={() => setMissing(true)}
        className="w-full aspect-video object-contain bg-black/80"
        aria-label={`${videoType === 'animation' ? '조음 애니메이션' : 'MRI'} 영상`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
