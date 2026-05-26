──────────────────────────────────────────────────────
세종말소리 MRI · 조음 애니메이션 파일 안내
──────────────────────────────────────────────────────

[폴더 구조]
public/videos/
  consonants/
    mri/          ← 자음 MRI (파일명 = 자모, 예: ㄱ.mp4)
    animation/    ← 자음 조음 애니메이션 (준비 중)
  vowels/
    mri/          ← 모음 MRI (파일명 = mri_{id}.mp4, 예: mri_a.mp4)
    animation/    ← 모음 조음 애니메이션 (ani_*.mp4)

[자음 MRI — 음절 → 자모 매핑]
  가→ㄱ  까→ㄲ  카→ㅋ  나→ㄴ  다→ㄷ  따→ㄸ  라→ㄹ
  마→ㅁ  바→ㅂ  빠→ㅃ  사→ㅅ  싸→ㅆ  자→ㅈ  짜→ㅉ
  차→ㅊ  파→ㅍ  하→ㅎ  타→ㅌ
  (ㅇ MRI — 미수록)

[모음 MRI — 현재 수록]
  ㅏ ㅐ ㅓ ㅔ ㅗ ㅜ ㅡ ㅣ
  ㅑ ㅕ ㅛ ㅠ ㅘ ㅢ
  (ㅚ ㅟ ㅒ ㅖ ㅙ ㅝ ㅞ — 미수록)

[데이터 연동]
  src/data/consonants.ts  → mriFileName
  src/data/vowels.ts      → mriFileName
  src/components/ui/VideoPlayer.tsx → /videos/{type}/{videoType}/{file}

──────────────────────────────────────────────────────
