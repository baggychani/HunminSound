import { NextResponse } from 'next/server'
import { readTeamPhoto } from '@/lib/cms-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TYPES = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' } as const

export async function GET(_req: Request, { params }: { params: { file: string } }) {
  const ext = params.file.split('.').pop()
  const type = ext === 'jpg' || ext === 'png' || ext === 'webp' ? TYPES[ext] : null
  if (!type) return new NextResponse(null, { status: 404 })
  try {
    const bytes = await readTeamPhoto(params.file)
    if (!bytes) return new NextResponse(null, { status: 404 })
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[cms] team photo read failed:', error)
    return new NextResponse(null, { status: 503 })
  }
}
