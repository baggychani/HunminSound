import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { cmsError, cmsUser } from '@/lib/cms-api'
import { writeTeamPhoto } from '@/lib/cms-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 4 * 1024 * 1024

function sniff(bytes: Buffer): 'jpg' | 'png' | 'webp' | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg'
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png'
  if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  return null
}

export async function POST(req: Request) {
  if (!(await cmsUser())) {
    return NextResponse.json(
      { message: '로그인이 만료되었습니다. 이 탭은 그대로 두고 새 탭에서 다시 로그인한 뒤, 사진을 다시 올려 주세요.' },
      { status: 401 },
    )
  }

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ message: '사진 파일이 필요합니다.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: '사진은 4MB 이하만 올릴 수 있습니다.' }, { status: 400 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = sniff(bytes)
  if (!ext) {
    return NextResponse.json({ message: 'jpg, png, webp 사진만 올릴 수 있습니다.' }, { status: 400 })
  }

  try {
    const src = await writeTeamPhoto(`${randomUUID()}.${ext}`, bytes)
    return NextResponse.json({ ok: true, src })
  } catch (error) {
    console.error('[cms] team photo write failed:', error)
    return cmsError(error)
  }
}
