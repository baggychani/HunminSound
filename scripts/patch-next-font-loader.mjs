// next/font 는 구글이 돌려준 주소가 .woff2 로 끝날 때만 빌드가 된다.
// 구글이 https://fonts.gstatic.com/l/font?kit=... 처럼 확장자 없는 주소를
// 주면 loader.js:112 에서 null[1] 로 프로덕션 빌드가 죽는다.
// 그 파일은 크롬 UA 로 받은 woff2 이므로, 확장자가 없으면 woff2 로 저장한다.
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const file = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../node_modules/next/dist/compiled/@next/font/dist/google/loader.js',
)

const broken = 'const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];'
const fixed =
  "const ext = (/\\.(woff|woff2|eot|ttf|otf)(?:$|[?#])/.exec(googleFontFileUrl) || [null, 'woff2'])[1];"

const source = readFileSync(file, 'utf8')
if (source.includes(fixed)) {
  console.log('[next-font] loader already patched')
  process.exit(0)
}
if (!source.includes(broken)) {
  console.error('[next-font] loader.js pattern not found; next version may have changed')
  process.exit(1)
}
writeFileSync(file, source.replace(broken, fixed))
console.log('[next-font] loader patched for extensionless Google font URLs')
