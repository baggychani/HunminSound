import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { ResearchPageClient } from '@/components/showcase/ResearchPageClient'
import type { ResearchContent } from '@/lib/research-content'

export const metadata: Metadata = {
  title: '연구 소개',
  description: 'NRF 과제 정보, 연구진 소개, 연구 목적과 의의를 소개합니다.',
}

export const dynamic = 'force-dynamic'

function loadContent(): ResearchContent {
  const filePath = path.join(process.cwd(), 'src', 'data', 'research-content.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ResearchContent
}

export default function ResearchPage() {
  const content = loadContent()
  return (
    <div className="max-w-5xl mx-auto px-6">
      <ResearchPageClient content={content} />
    </div>
  )
}
