'use client'

import { useEffect, useState } from 'react'

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

  /* 같은 그리드 슬롯에서 다른 기호로 갔다가 다시 오면 컴포넌트 인스턴스가 재사용되며
   * 이전 onError 로 missing=true 가 남아 “준비 중”만 보일 수 있음 → 소스가 바뀔 때마다 초기화 */
  useEffect(() => {
    setMissing(false)
  }, [src])

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
