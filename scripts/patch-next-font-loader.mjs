// next/font 두 가지를 빌드 전에 고친다.
// 1. 구글이 https://fonts.gstatic.com/l/font?kit=... 처럼 확장자 없는 주소를
//    주면 loader가 null[1]로 프로덕션 빌드가 죽는다. 크롬 UA로 받은 woff2이므로
//    확장자가 없으면 woff2로 저장한다.
// 2. 클래스 해시가 받아온 CSS 본문으로 만들어진다. 서버 컴파일과 클라이언트
//    컴파일이 구글에서 서로 다른 CSS를 받으면 클래스 이름이 갈라지고,
//    html에는 없는 클래스가 붙어 --font-serif가 비어 명조가 고딕으로 떨어진다.
//    해시는 폰트 함수 인자만으로 만든다. 양쪽이 항상 같은 클래스를 쓴다.
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function patchFile(rel, replacements) {
  const file = path.join(root, rel)
  let source = readFileSync(file, 'utf8')
  let changed = false
  for (const { from, to, label } of replacements) {
    if (source.includes(to)) continue
    if (!source.includes(from)) {
      console.error(`[next-font] ${label} pattern not found in ${rel}`)
      process.exit(1)
    }
    source = source.replace(from, to)
    changed = true
  }
  if (changed) writeFileSync(file, source)
  return changed
}

export function patchNextFontLoader() {
  const extChanged = patchFile('node_modules/next/dist/compiled/@next/font/dist/google/loader.js', [
    {
      label: 'extensionless url',
      from: 'const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];',
      to: "const ext = (/\\.(woff|woff2|eot|ttf|otf)(?:$|[?#])/.exec(googleFontFileUrl) || [null, 'woff2'])[1];",
    },
  ])

  const hashTo = 'Buffer.from(functionName + JSON.stringify(data))'
  const cjsChanged = patchFile('node_modules/next/dist/build/webpack/loaders/next-font-loader/index.js', [
    {
      label: 'cjs font hash',
      from: 'const fontFamilyHash = _loaderutils3.default.getHashDigest(Buffer.from(css), "sha1", "hex", 6);',
      to: `const fontFamilyHash = _loaderutils3.default.getHashDigest(${hashTo}, "sha1", "hex", 6);`,
    },
  ])
  const esmChanged = patchFile('node_modules/next/dist/esm/build/webpack/loaders/next-font-loader/index.js', [
    {
      label: 'esm font hash',
      from: 'const fontFamilyHash = loaderUtils.getHashDigest(Buffer.from(css), "sha1", "hex", 6);',
      to: `const fontFamilyHash = loaderUtils.getHashDigest(${hashTo}, "sha1", "hex", 6);`,
    },
  ])

  if (extChanged || cjsChanged || esmChanged) {
    console.log('[next-font] loader patched')
  }
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirect) patchNextFontLoader()
