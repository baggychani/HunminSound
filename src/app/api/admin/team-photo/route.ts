import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import { isGithubContentEnabled, readGithubFileSha, writeGithubBytes } from '@/lib/githubContent'
import { teamMemberSlug } from '@/lib/teamSlugs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 4 * 1024 * 1024

function sniff(bytes: Buffer): { ext: 'jpg' | 'png' | 'webp' } | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: 'jpg' }
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { ext: 'png' }
  if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return { ext: 'webp' }
  return null
}

async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(getAdminSessionSecret(), token)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const name = String(form.get('name') ?? '').trim() || '새 연구원'
  const nameEn = String(form.get('nameEn') ?? '').trim()
  const currentPhoto = String(form.get('photo') ?? '').trim()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ message: '사진 파일이 필요합니다.' }, { status: 400 })
  }
  const fromPhoto = currentPhoto.match(/^\/images\/team\/([a-z0-9-]+)\.(jpg|png|webp)$/)?.[1] ?? null
  const fromEn = nameEn
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const slug = fromPhoto || teamMemberSlug(name) || (fromEn ? fromEn.slice(0, 80) : `member-${Date.now()}`)
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: '사진은 4MB 이하만 올릴 수 있습니다.' }, { status: 400 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const kind = sniff(bytes)
  if (!kind) {
    return NextResponse.json({ message: 'jpg, png, webp 사진만 올릴 수 있습니다.' }, { status: 400 })
  }

  const ext = kind.ext
  const repoPath = `public/images/team/${slug}.${ext}`
  const publicPath = `/images/team/${slug}.${ext}`

  try {
    if (isGithubContentEnabled()) {
      const sha = await readGithubFileSha(repoPath)
      await writeGithubBytes(repoPath, bytes, sha, `content: 관리자 페이지에서 ${name} 사진 교체 (${session})`)
    } else if (process.env.VERCEL === '1') {
      return NextResponse.json(
        { message: '저장 설정(GITHUB_CONTENT_TOKEN)이 되어 있지 않습니다. 개발자에게 문의해 주세요.' },
        { status: 503 },
      )
    } else {
      const full = path.join(process.cwd(), 'public', 'images', 'team', `${slug}.${ext}`)
      fs.mkdirSync(path.dirname(full), { recursive: true })
      fs.writeFileSync(full, bytes)
    }
  } catch (err) {
    console.error('[cms] team photo write failed:', err)
    return NextResponse.json({ message: '사진을 저장하지 못했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, src: publicPath })
}
