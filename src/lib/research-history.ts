import type { ResearchContent, TeamRow } from '@/lib/research-content'

const FIELD: Record<string, string> = {
  role: '직위', name: '이름', nameEn: '영어 이름', affiliation: '소속',
  task: '역할', field: '분야', photo: '사진', label: '항목', value: '내용',
  text: '내용', title: '제목', subtitle: '보조 설명', intro: '소개', final: '최종 목표',
  methods: '방법', lines: '내용', names: '이름', namesEn: '영어 이름',
}
const LANG: Record<string, string> = {
  en: '영어', zh: '중국어', ja: '일본어', fr: '프랑스어', de: '독일어', es: '스페인어',
  hi: '힌디어', vi: '베트남어', ru: '러시아어', ar: '아랍어', tr: '터키어', id: '인도네시아어', th: '태국어',
}
const ACHIEVEMENT: Record<string, string> = { vowels: '모음 성과', consonants: '자음 성과', tech: '기술 성과' }

type Line = { label: string; before: string; after: string }

function clip(value: string, max: number): string {
  const flat = value.replace(/\s+/g, ' ').trim()
  if (!flat) return '없음'
  return flat.length <= max ? flat : `${flat.slice(0, max)}…`
}

function showPhoto(value: string, side: 'before' | 'after'): string {
  if (!value.trim() || value.startsWith('/images/team/')) return '기본 사진'
  if (value.startsWith('/media/team/')) return side === 'before' ? '이전 올린 사진' : '새로 올린 사진'
  return clip(value, 160)
}

function personName(before: ResearchContent, after: ResearchContent, index: number): string {
  return before.team.rows[index]?.name.trim() || after.team.rows[index]?.name.trim() || `${index + 1}번째`
}

function rowText(row: TeamRow): string {
  const bits = [row.role, row.name, row.nameEn, row.affiliation, row.task, row.field].map((item) => item?.trim()).filter(Boolean)
  return bits.join(' · ') || '내용 없음'
}

function diffTeam(before: ResearchContent, after: ResearchContent, lines: Line[]) {
  const count = Math.max(before.team.rows.length, after.team.rows.length)
  const fields = ['role', 'name', 'nameEn', 'affiliation', 'task', 'field', 'photo'] as const
  for (let index = 0; index < count; index += 1) {
    const prev = before.team.rows[index]
    const next = after.team.rows[index]
    if (!prev || !next) {
      const row = next ?? prev
      const name = row?.name.trim() || `${index + 1}번째`
      lines.push({
        label: `${name} · ${next ? '연구진 추가' : '연구진 삭제'}`,
        before: prev ? rowText(prev) : '없음',
        after: next ? rowText(next) : '없음',
      })
      continue
    }
    const name = personName(before, after, index)
    for (const field of fields) {
      const left = prev[field] ?? ''
      const right = next[field] ?? ''
      if (left === right) continue
      lines.push({
        label: `${name} · ${FIELD[field]}`,
        before: field === 'photo' ? showPhoto(left, 'before') : clip(left, 160),
        after: field === 'photo' ? showPhoto(right, 'after') : clip(right, 160),
      })
    }
  }
}

function flatten(value: unknown, path: string, into: Map<string, string>) {
  if (path === 'translationSnapshots' || path.startsWith('translationSnapshots.') || path.startsWith('team.rows')) return
  if (typeof value === 'string') {
    into.set(path, value)
    return
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    into.set(path, String(value))
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${path}.${index}`, into))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      flatten(child, path ? `${path}.${key}` : key, into)
    }
  }
}

function labelPath(path: string, before: ResearchContent, after: ResearchContent): string {
  const translated = path.match(/^translations\.([^.]+)\.(.+)$/)
  if (translated) {
    const lang = LANG[translated[1]] ?? translated[1]
    return `${lang} 번역 · ${labelPath(translated[2], before, after)}`
  }
  const member = path.match(/^team\.rows\.(\d+)\.(\w+)$/)
  if (member) return `${personName(before, after, Number(member[1]))} · ${FIELD[member[2]] ?? member[2]}`
  const directory = path.match(/^team\.directory\.(\d+)\.(role|subtitle|names|namesEn)(?:\.(\d+))?$/)
  if (directory) {
    const index = Number(directory[1])
    const group = after.team.directory?.[index] ?? before.team.directory?.[index]
    const title = group?.role?.trim() || `${index + 1}번째 명단`
    const field = FIELD[directory[2]] ?? directory[2]
    return directory[3] ? `${title} · ${field} ${Number(directory[3]) + 1}` : `${title} · ${field}`
  }
  const task = path.match(/^taskInfo\.rows\.(\d+)\.(label|value)$/)
  if (task) {
    const index = Number(task[1])
    const row = after.taskInfo.rows[index] ?? before.taskInfo.rows[index]
    return `과제 정보 · ${row?.label.trim() || `${index + 1}번째 항목`} · ${FIELD[task[2]]}`
  }
  const motivation = path.match(/^motivation\.paragraphs\.(\d+)$/)
  if (motivation) return `연구 동기 ${Number(motivation[1]) + 1}`
  const significance = path.match(/^significance\.paragraphs\.(\d+)$/)
  if (significance) return `연구 의의 ${Number(significance[1]) + 1}`
  if (path === 'goals.final') return '최종 목표'
  const goal = path.match(/^goals\.specific\.(\d+)\.(label|text)$/)
  if (goal) return `세부 목표 ${Number(goal[1]) + 1} · ${FIELD[goal[2]]}`
  if (path === 'overview.method.intro') return '연구 방법'
  const method = path.match(/^overview\.method\.rows\.(\d+)\.(field|role|methods)(?:\.(\d+))?$/)
  if (method) {
    const field = FIELD[method[2]] ?? method[2]
    return method[3]
      ? `연구 방법 ${Number(method[1]) + 1} · ${field} ${Number(method[3]) + 1}`
      : `연구 방법 ${Number(method[1]) + 1} · ${field}`
  }
  const scale = path.match(/^overview\.scale\.(\d+)\.(label|text)$/)
  if (scale) return `연구 규모 ${Number(scale[1]) + 1} · ${FIELD[scale[2]]}`
  const achievement = path.match(/^overview\.achievements\.(vowels|consonants|tech)\.(\d+)\.(title|lines)(?:\.(\d+))?$/)
  if (achievement) {
    const title = ACHIEVEMENT[achievement[1]] ?? achievement[1]
    const field = FIELD[achievement[3]] ?? achievement[3]
    return achievement[4]
      ? `${title} ${Number(achievement[2]) + 1} · ${field} ${Number(achievement[4]) + 1}`
      : `${title} ${Number(achievement[2]) + 1} · ${field}`
  }
  return path
}

/** 연구 소개 저장 이력에 보여줄 바뀐 항목. 한 번에 너무 길면 앞부분만 남긴다. */
export function summarizeResearchChange(before: ResearchContent, after: ResearchContent): { label: string; oldValue: string; newValue: string } {
  const lines: Line[] = []
  diffTeam(before, after, lines)
  const left = new Map<string, string>()
  const right = new Map<string, string>()
  flatten(before, '', left)
  flatten(after, '', right)
  const paths = Array.from(new Set(Array.from(left.keys()).concat(Array.from(right.keys())))).sort()
  for (const path of paths) {
    const prev = left.get(path) ?? ''
    const next = right.get(path) ?? ''
    if (prev === next) continue
    const photo = path.endsWith('.photo')
    lines.push({
      label: labelPath(path, before, after),
      before: photo ? showPhoto(prev, 'before') : clip(prev, 160),
      after: photo ? showPhoto(next, 'after') : clip(next, 160),
    })
  }
  const shown = lines.slice(0, 12)
  const extra = lines.length - shown.length
  const side = (key: 'before' | 'after') => {
    const body = shown.map((line) => `${line.label}\n${line[key]}`).join('\n\n')
    const text = extra > 0 ? `${body}\n\n외 ${extra}곳` : body
    if (!text) return '바꾼 문장이 없습니다.'
    return text.length <= 3000 ? text : `${text.slice(0, 3000)}…`
  }
  const first = lines[0]?.label ?? '연구 소개'
  return {
    label: lines.length > 1 ? `${first} 외 ${lines.length - 1}곳` : first,
    oldValue: side('before'),
    newValue: side('after'),
  }
}
