/**
 * 크롬 안드로이드의 「데스크톱 사이트」는 viewport 메타를 무시하고 가로를 980px로 고정한다.
 * 그러면 (max-width: 639px) 모바일 스타일이 빠지고, 640px부터인 데스크톱 스타일이 폰에 깔린다.
 * 삼성 인터넷은 이 모드가 아니라 폰 너비 그대로라 좌우로 넘기는 메인이 보인다.
 *
 * device-width는 그 980px 뷰포트가 아니라 기기 화면 너비다.
 * 짧은 폰 화면(520px 이하)이면 뷰포트가 넓어도 모바일 스타일을 쓰고,
 * 640·768px 데스크톱 스타일은 기기 화면이 그보다 넓을 때만 쓴다.
 */

const PHONE_MAX = '520px'
const DESKTOP_MIN = '521px'

function handsetViewport() {
  return {
    postcssPlugin: 'handset-viewport',
    Once(root) {
      root.walkAtRules('media', (at) => {
        const params = at.params.trim()
        if (params.includes('device-width')) return

        const notMin = params.match(/^not all and \(min-width:\s*(640px|768px)\)$/)
        if (notMin) {
          at.params = `${params}, (max-device-width: ${PHONE_MAX})`
          return
        }

        if (/\(min-width:\s*(640px|768px)\)/.test(params) && !/^not all and\b/.test(params)) {
          at.params = `${params} and (min-device-width: ${DESKTOP_MIN})`
          return
        }

        if (/\(max-width:\s*(639px|767px)\)/.test(params)) {
          const asPhone = params
            .replace(/\(max-width:\s*639px\)/g, `(max-device-width: ${PHONE_MAX})`)
            .replace(/\(max-width:\s*767px\)/g, `(max-device-width: ${PHONE_MAX})`)
          at.params = `${params}, ${asPhone}`
        }
      })
    },
  }
}

handsetViewport.postcss = true

module.exports = handsetViewport
