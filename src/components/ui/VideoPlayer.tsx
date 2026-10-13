'use client'

import { useEffect, useRef, useState } from 'react'
import { MEDIA_MANIFEST } from '@/data/mediaManifest'

interface VideoPlayerProps {
  fileName?: string
  type?: 'consonants' | 'vowels'
  videoType?: 'animation' | 'mri'
  /** 1이면 보통 속도. 카드의 0.5배속 스위치가 켜지면 0.5 */
  playbackRate?: number
}

function applyPlaybackRate(el: HTMLVideoElement, rate: number) {
  el.defaultPlaybackRate = rate
  el.playbackRate = rate
}

export function VideoPlayer({
  fileName,
  type = 'consonants',
  videoType = 'mri',
  playbackRate = 1,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [broken, setBroken] = useState(false)

  const available =
    Boolean(fileName) &&
    (MEDIA_MANIFEST[type][videoType] as readonly string[]).includes(fileName as string)
  // 파일 경로: /videos/{type}/{videoType}/{fileName} — 예: /videos/vowels/animation/ani_a.mp4
  const src = available ? `/videos/${type}/${videoType}/${encodeURIComponent(fileName as string)}` : null

  /* 같은 그리드 슬롯에서 다른 기호로 갔다가 다시 오면 컴포넌트 인스턴스가 재사용되며
   * 이전 onError로 broken=true가 남을 수 있음 → 소스가 바뀔 때마다 초기화 */
  useEffect(() => {
    setBroken(false)
  }, [src])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    applyPlaybackRate(el, playbackRate)
  }, [playbackRate, src])

  // 준비 안 됐거나(매니페스트에 없음) 로드 중 깨진 경우 — "준비 중" 문구 없이 그냥 아무것도 렌더링하지 않는다
  if (!src || broken) return null

  return (
    <div className="rounded-sm overflow-hidden bg-ink/5">
      <video
        ref={videoRef}
        key={src}
        src={src}
        controls
        playsInline
        onLoadedMetadata={(event) => applyPlaybackRate(event.currentTarget, playbackRate)}
        onPlay={(event) => applyPlaybackRate(event.currentTarget, playbackRate)}
        onError={() => setBroken(true)}
        className="w-full aspect-video object-contain bg-black/80"
        aria-label={`${videoType === 'animation' ? '조음 애니메이션' : 'MRI'} 영상`}
      />
    </div>
  )
}
