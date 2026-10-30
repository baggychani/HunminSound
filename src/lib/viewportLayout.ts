/**
 * 폰 레이아웃. 크롬 「데스크톱 사이트」는 창 너비를 980px로 두므로
 * width만 보면 데스크톱이다. device-width는 기기 화면이라 폰은 520px 이하다.
 * postcss/handset-viewport.cjs 와 같은 기준이다.
 */
export const PHONE_MQ = '(max-width: 639px), (max-device-width: 520px)'

/** 창도 넓고 기기 화면도 폰보다 클 때. 폰에서 크롬이 980px로 연 경우는 제외 */
export const DESKTOP_MQ = '(min-width: 640px) and (min-device-width: 521px)'

export function isPhoneLayout(): boolean {
  return window.matchMedia(PHONE_MQ).matches
}

export function isDesktopLayout(): boolean {
  return window.matchMedia(DESKTOP_MQ).matches
}

/**
 * 크롬 데스크톱 사이트는 창을 980px로 두고 화면 너비에 맞춰 축소한다.
 * 루트 글자를 그 비율만큼 키우면, 줄어든 뒤의 크기가 폰 레이아웃과 같다.
 */
export function fitHandsetFont() {
  const root = document.documentElement
  const phone = window.matchMedia('(max-device-width: 520px)').matches
  const wide = window.innerWidth >= 640
  if (phone && wide && screen.width > 0) {
    root.style.fontSize = `${(16 * window.innerWidth) / screen.width}px`
  } else {
    root.style.removeProperty('font-size')
  }
}
