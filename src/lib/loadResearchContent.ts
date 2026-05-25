import fs from 'fs'
import path from 'path'
import type { ResearchContent } from '@/lib/research-content'

export function loadResearchContent(): ResearchContent {
  const filePath = path.join(process.cwd(), 'src', 'data', 'research-content.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ResearchContent
}
