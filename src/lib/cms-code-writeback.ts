import { SITE_TEXT_FILES, type SiteTextTable, type SiteTextType } from '@/data/site-text'
import { GithubConflictError, isGithubContentEnabled, readGithubFile, writeGithubFile } from '@/lib/githubContent'
import { textStamp } from '@/lib/cms-code-sync'

export const RESEARCH_FILE = 'src/data/research-content.json'
/** vercel.json 의 ignoreCommand 가 이 표시로 시작하는 커밋은 다시 빌드하지 않는다. */
export const CMS_COMMIT_MARK = '[cms-save]'

/** 관리자 화면에서 저장했지만 아직 GitHub 코드에 들어가지 않은 글 */
export type CodeOutboxItem = {
  id: string
  /** 글 키(type:id:description:lang) 또는 'research' */
  key: string
  /** 넣을 글. 연구 소개는 JSON 문자열 */
  value: string
  /** GitHub 쪽 글이 이 지문 중 하나일 때만 덮는다. 아니면 코드에서 따로 고친 것이다. */
  accept: string[]
  label: string
  username: string
  at: string
  status?: 'blocked' | 'failed'
  error?: string
}

export type OutboxResult = { done: string[]; blocked: string[]; failed: { id: string; error: string }[] }

type Target = { file: string; read: (doc: unknown) => string | null; write: (doc: unknown, value: string) => void; stamp: (value: string) => string }

function targetOf(key: string): Target | null {
  if (key === 'research') {
    return {
      file: RESEARCH_FILE,
      read: (doc) => canonical(doc),
      write: () => { throw new Error('research is written whole') },
      stamp: textStamp,
    }
  }
  const [type, id, field, lang] = key.split(':')
  const file = SITE_TEXT_FILES[type as SiteTextType]
  if (!file || field !== 'description' || !id || !lang) return null
  return {
    file,
    read: (doc) => {
      const value = (doc as SiteTextTable)[id]?.[lang]
      return typeof value === 'string' ? value : null
    },
    write: (doc, value) => {
      const table = doc as SiteTextTable
      if (!table[id]) throw new Error(`CMS_CODE_ITEM_MISSING ${id}`)
      table[id][lang] = value
    },
    stamp: textStamp,
  }
}

function canonical(value: unknown): string {
  const sort = (v: unknown): unknown => Array.isArray(v) ? v.map(sort)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sort((v as Record<string, unknown>)[k])]))
      : v
  return JSON.stringify(sort(value))
}

/** 덮어써도 되는 GitHub 글인지 비교할 지문. 연구 소개는 키 순서와 무관하게 비교한다. */
export function codeAcceptStamp(key: string, value: string): string {
  return textStamp(key === 'research' ? canonical(JSON.parse(value)) : value)
}

export function codeTargetFile(key: string): string | null {
  return targetOf(key)?.file ?? null
}

function serialize(file: string, doc: unknown): string {
  return JSON.stringify(doc, null, file === RESEARCH_FILE ? 4 : 2) + '\n'
}

function commitMessage(items: CodeOutboxItem[]): string {
  const names = Array.from(new Set(items.map((item) => item.label)))
  const users = Array.from(new Set(items.map((item) => item.username)))
  const head = names.length === 1 ? names[0] : `${names[0]} 외 ${names.length - 1}곳`
  return `${CMS_COMMIT_MARK} 관리자 화면에서 고친 글: ${head} (${users.join(', ')})\n\n`
    + names.map((name) => `- ${name}`).join('\n')
    + '\n\n관리자 화면에서 저장한 글을 코드에도 맞춘 자동 커밋입니다. 코드로 고치기 전에 git pull 을 먼저 하세요.'
}

async function pushFile(file: string, items: CodeOutboxItem[], result: OutboxResult, retry = true): Promise<void> {
  const { text, sha } = await readGithubFile(file)
  let doc: unknown = JSON.parse(text)
  const applied: CodeOutboxItem[] = []
  const already: string[] = []
  const blocked: string[] = []
  for (const item of items) {
    const target = targetOf(item.key)!
    const current = target.read(doc)
    const want = item.key === 'research' ? canonical(JSON.parse(item.value)) : item.value
    if (current === want) { already.push(item.id); continue }
    if (current === null || !item.accept.includes(target.stamp(current))) { blocked.push(item.id); continue }
    if (item.key === 'research') doc = JSON.parse(item.value)
    else target.write(doc, item.value)
    applied.push(item)
  }
  if (applied.length > 0) {
    try {
      await writeGithubFile(file, serialize(file, doc), sha, commitMessage(applied))
    } catch (error) {
      if (error instanceof GithubConflictError && retry) return pushFile(file, items, result, false)
      throw error
    }
  }
  result.done.push(...already, ...applied.map((item) => item.id))
  result.blocked.push(...blocked)
}

/** 파일마다 최신 GitHub 내용을 읽어, 코드에서 따로 고치지 않은 글만 한 번에 커밋한다. */
export async function pushOutboxToGithub(items: CodeOutboxItem[]): Promise<OutboxResult> {
  const result: OutboxResult = { done: [], blocked: [], failed: [] }
  if (!isGithubContentEnabled()) {
    for (const item of items) result.failed.push({ id: item.id, error: 'GITHUB_NOT_CONFIGURED' })
    return result
  }
  const byFile = new Map<string, CodeOutboxItem[]>()
  for (const item of items) {
    const file = codeTargetFile(item.key)
    if (!file) { result.failed.push({ id: item.id, error: 'CMS_CODE_TARGET_UNKNOWN' }); continue }
    byFile.set(file, [...(byFile.get(file) ?? []), item])
  }
  for (const [file, group] of Array.from(byFile.entries())) {
    try {
      await pushFile(file, group, result)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      for (const item of group) result.failed.push({ id: item.id, error: message })
    }
  }
  return result
}
