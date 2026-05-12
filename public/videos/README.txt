──────────────────────────────────────────────────────
세종말소리 영상 파일 관리 안내
──────────────────────────────────────────────────────

[현재 구조]
public/
  videos/
    placeholder.mp4       ← 테스트용 임시 영상 (이 파일을 넣어두세요)
    consonants/           ← 자음 영상 폴더
      giyeok.mp4          (ㄱ)
      nieun.mp4           (ㄴ)
      digeut.mp4          (ㄷ)
      rieul.mp4           (ㄹ)
      mieum.mp4           (ㅁ)
      bieup.mp4           (ㅂ)
      siot.mp4            (ㅅ)
      ieung.mp4           (ㅇ)
      jieuj.mp4           (ㅈ)
      chieut.mp4          (ㅊ)
      kieuk.mp4           (ㅋ)
      tieut.mp4           (ㅌ)
      pieup.mp4           (ㅍ)
      hieut.mp4           (ㅎ)
      ssanggiyeok.mp4     (ㄲ)
      ssangdigeut.mp4     (ㄸ)
      ssangbieup.mp4      (ㅃ)
      ssangsiot.mp4       (ㅆ)
      ssangjieuj.mp4      (ㅉ)
    vowels/               ← 모음 영상 폴더
      a.mp4               (ㅏ)
      ae.mp4              (ㅐ)
      eo.mp4              (ㅓ)
      e.mp4               (ㅔ)
      o.mp4               (ㅗ)
      oe.mp4              (ㅚ)
      u.mp4               (ㅜ)
      wi.mp4              (ㅟ)
      eu.mp4              (ㅡ)
      i.mp4               (ㅣ)
      ya.mp4, yae.mp4, yeo.mp4, ye.mp4, yo.mp4, yu.mp4
      wa.mp4, wae.mp4, wo.mp4, we.mp4, ui.mp4

[현재 동작 방식]
- placeholder.mp4 파일이 있으면 모든 자음/모음 클릭 시 해당 영상이 재생됩니다.
- 실제 MRI 영상 준비 후: src/components/ui/VideoPlayer.tsx 파일에서
  "TODO" 주석 부분의 코드를 활성화하고 placeholder 라인을 제거하세요.

──────────────────────────────────────────────────────
