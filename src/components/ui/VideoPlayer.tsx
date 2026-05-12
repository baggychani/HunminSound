'use client'

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
  // ──────────────────────────────────────────────────────────────────
  // TODO: 실제 영상 파일이 준비되면 아래 주석을 해제하고 placeholder 라인을 제거하세요.
  // 파일 경로 구조: /videos/{type}/{videoType}/{fileName}
  // 예: /videos/consonants/animation/ㄱ.mp4
  //
  // const src = fileName
  //   ? `/videos/${type}/${videoType}/${fileName}`
  //   : '/videos/placeholder.mp4'
  // ──────────────────────────────────────────────────────────────────
  const src = '/videos/placeholder.mp4'

  return (
    <div className="rounded-sm overflow-hidden bg-ink/5">
      <video
        key={src}
        controls
        playsInline
        muted
        loop
        className="w-full aspect-video object-contain bg-black/80"
        aria-label={`${videoType === 'animation' ? '조음 애니메이션' : 'MRI'} 영상`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
