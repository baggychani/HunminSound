/**
 * 관리자 저장 → GitHub 저장소 파일에 직접 커밋.
 * main에 커밋되면 Vercel이 자동 재배포하므로, 코드와 관리자 페이지가 같은 파일 하나를 원본으로 쓴다.
 *
 * 필요한 환경 변수(서버 전용):
 *   GITHUB_CONTENT_TOKEN  — 이 저장소 Contents 읽기/쓰기 권한이 있는 fine-grained 토큰
 *   GITHUB_CONTENT_REPO   — 기본 'baggychani/HunminSound'
 *   GITHUB_CONTENT_BRANCH — 기본 'main'
 */

const API = 'https://api.github.com'

export class GithubConflictError extends Error {
  constructor() {
    super('GITHUB_CONFLICT')
  }
}

function config() {
  const token = process.env.GITHUB_CONTENT_TOKEN
  if (!token) return null
  return {
    token,
    repo: process.env.GITHUB_CONTENT_REPO || 'baggychani/HunminSound',
    branch: process.env.GITHUB_CONTENT_BRANCH || 'main',
  }
}

export function isGithubContentEnabled(): boolean {
  return config() !== null
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

function contentsUrl(repo: string, path: string) {
  return `${API}/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`
}

/** 브랜치 최신 파일 내용과 sha(동시 수정 감지용) */
export async function readGithubFile(path: string): Promise<{ text: string; sha: string }> {
  const cfg = config()
  if (!cfg) throw new Error('GITHUB_NOT_CONFIGURED')
  const res = await fetch(`${contentsUrl(cfg.repo, path)}?ref=${encodeURIComponent(cfg.branch)}`, {
    headers: headers(cfg.token),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`GITHUB_READ_FAILED ${res.status}`)
  const body = (await res.json()) as { content: string; sha: string }
  return { text: Buffer.from(body.content, 'base64').toString('utf8'), sha: body.sha }
}

/** sha가 브랜치 최신과 다르면(그 사이 코드로 수정됨) GithubConflictError. 성공 시 새 sha 반환 */
export async function writeGithubFile(
  path: string,
  text: string,
  sha: string,
  message: string,
): Promise<string> {
  const cfg = config()
  if (!cfg) throw new Error('GITHUB_NOT_CONFIGURED')
  const res = await fetch(contentsUrl(cfg.repo, path), {
    method: 'PUT',
    headers: headers(cfg.token),
    cache: 'no-store',
    body: JSON.stringify({
      message,
      content: Buffer.from(text, 'utf8').toString('base64'),
      sha,
      branch: cfg.branch,
    }),
  })
  if (res.status === 409 || res.status === 422) throw new GithubConflictError()
  if (!res.ok) throw new Error(`GITHUB_WRITE_FAILED ${res.status}`)
  const body = (await res.json()) as { content: { sha: string } }
  return body.content.sha
}
