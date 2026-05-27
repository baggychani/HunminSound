import type { ResearchContent } from '@/lib/research-content'
import { readResearchContent } from '@/lib/cms-storage'

export async function loadResearchContent(): Promise<ResearchContent> {
  return readResearchContent()
}
