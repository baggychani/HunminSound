// public/videos, public/images/pictograms 실제 파일 목록을 스캔해서
// src/data/mediaManifest.ts를 생성한다. 데이터(consonants.ts/vowels.ts)는
// "이 글자엔 이 파일명을 쓴다"는 의도만 담고, 실제로 그 파일이 존재하는지는
// 여기서 만든 매니페스트로 판단한다 — 아직 준비 안 된 영상/그림은 "준비 중"
// 표시 없이 그 영역 자체를 노출하지 않기 위함.
import { readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function listFiles(...segments) {
  const dir = path.join(root, 'public', ...segments)
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && !e.name.startsWith('.'))
    .map((e) => e.name)
}

const manifest = {
  consonants: {
    animation: listFiles('videos', 'consonants', 'animation'),
    mri: listFiles('videos', 'consonants', 'mri'),
  },
  vowels: {
    animation: listFiles('videos', 'vowels', 'animation'),
    mri: listFiles('videos', 'vowels', 'mri'),
  },
  pictograms: listFiles('images', 'pictograms'),
}

const outDir = path.join(root, 'src', 'data')
mkdirSync(outDir, { recursive: true })

const banner = `/**
 * 자동 생성 파일 — 직접 수정하지 말 것.
 * \`npm run dev\`/\`npm run build\` 시 scripts/generate-media-manifest.mjs가
 * public/videos, public/images/pictograms를 스캔해서 다시 씀.
 */
`

const body = `export const MEDIA_MANIFEST = ${JSON.stringify(manifest, null, 2)} as const
`

writeFileSync(path.join(outDir, 'mediaManifest.ts'), banner + body, 'utf8')

const total = manifest.consonants.animation.length + manifest.consonants.mri.length +
  manifest.vowels.animation.length + manifest.vowels.mri.length + manifest.pictograms.length
console.log(`[media-manifest] ${total}개 파일 확인 완료 (자음 애니메이션 ${manifest.consonants.animation.length}, 자음 MRI ${manifest.consonants.mri.length}, 모음 애니메이션 ${manifest.vowels.animation.length}, 모음 MRI ${manifest.vowels.mri.length}, 상형도 ${manifest.pictograms.length})`)
