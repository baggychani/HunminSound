export interface AchievementEntry {
  title: string
  lines: string[]
}

export interface BulletEntry {
  label: string
  text: string
}

export interface MethodRow {
  field: string
  role: string
  methods: string[]
}

export interface TeamRow {
  role: string
  name: string
  nameEn?: string
  affiliation: string
  task: string
  field: string
}

export interface TeamDirectoryGroup {
  role: string
  /** 직급 아래 보조 설명 (예: 연구지원인력) */
  subtitle?: string
  names: string[]
}

export interface TaskInfoRow {
  label: string
  value: string
}

export interface ResearchContent {
  motivation: {
    paragraphs: string[]
  }
  goals: {
    final: string
    specific: BulletEntry[]
  }
  overview: {
    method: {
      intro: string
      rows: MethodRow[]
    }
    scale: BulletEntry[]
    achievements: {
      vowels: AchievementEntry[]
      consonants: AchievementEntry[]
      tech: AchievementEntry[]
    }
  }
  significance: {
    paragraphs: string[]
  }
  team: {
    rows: TeamRow[]
    directory?: TeamDirectoryGroup[]
  }
  taskInfo: {
    rows: TaskInfoRow[]
  }
  /**
   * Flat translation map: lang → { "dot.path": "translated text" }
   * e.g. translations["en"]["motivation.paragraphs.0"] = "..."
   */
  translations: Record<string, Record<string, string>>
  /**
   * Korean source snapshots at time of translation save.
   * key → Korean text recorded when any translation for that key was last saved.
   * Used for stale detection: if current Korean differs from snapshot, warn.
   */
  translationSnapshots?: Record<string, string>
}

/** Helper: returns translated value if available, else Korean original */
export function tr(
  translations: Record<string, Record<string, string>> | undefined,
  lang: string,
  key: string,
  koValue: string
): string {
  if (lang === 'ko' || !translations) return koValue
  return translations[lang]?.[key] ?? koValue
}

/* ── 관리자 저장 검증 — 깨진 모양이 GitHub→재배포로 공개 페이지까지 가지 않게 ── */

const isStr = (v: unknown): v is string => typeof v === 'string'
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr)
const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v)

function isBullet(v: unknown): boolean {
  return isObj(v) && isStr(v.label) && isStr(v.text)
}
function isMethodRow(v: unknown): boolean {
  return (
    isObj(v) && isStr(v.field) && isStr(v.role) && Array.isArray(v.methods) &&
    (v.methods as unknown[]).every(isStr)
  )
}
function isTeamRow(v: unknown): boolean {
  return (
    isObj(v) && isStr(v.role) && isStr(v.name) && isStr(v.affiliation) &&
    isStr(v.task) && isStr(v.field) && (v.nameEn === undefined || isStr(v.nameEn))
  )
}

/**
 * 관리자 PUT 본문 검증. 통과하면 true, 실패하면 사유 문자열.
 * 의도적으로 관대하게: 선택 필드(directory·translationSnapshots·nameEn) 없어도 통과,
 * 모양이 완전히 깨진 것만 막는다.
 */
export function validateResearchContent(data: unknown): true | string {
  if (!isObj(data)) return '전체 모양이 객체가 아님'
  const { motivation, goals, overview, significance, team, taskInfo, translations } = data
  if (!isObj(motivation) || !isStrArr(motivation.paragraphs)) return 'motivation.paragraphs'
  if (!isObj(goals) || !isStr(goals.final)) return 'goals.final'
  if (!isObj(goals) || !Array.isArray(goals.specific) || !goals.specific.every(isBullet))
    return 'goals.specific'
  if (!isObj(overview)) return 'overview'
  const { method, scale, achievements } = overview as Record<string, unknown>
  if (!isObj(method) || !isStr(method.intro)) return 'overview.method.intro'
  if (!Array.isArray(method.rows) || !(method.rows as unknown[]).every(isMethodRow))
    return 'overview.method.rows'
  if (!Array.isArray(scale) || !(scale as unknown[]).every(isBullet)) return 'overview.scale'
  if (!isObj(achievements)) return 'overview.achievements'
  for (const k of ['vowels', 'consonants', 'tech'] as const) {
    const list = (achievements as Record<string, unknown>)[k]
    if (
      !Array.isArray(list) ||
      !(list as unknown[]).every(
        (e) => isObj(e) && isStr(e.title) && isStrArr(e.lines),
      )
    )
      return `overview.achievements.${k}`
  }
  if (!isObj(significance) || !isStrArr(significance.paragraphs)) return 'significance.paragraphs'
  if (!isObj(team) || !Array.isArray(team.rows) || !(team.rows as unknown[]).every(isTeamRow))
    return 'team.rows'
  if (
    team.directory !== undefined &&
    (!Array.isArray(team.directory) ||
      !(team.directory as unknown[]).every(
        (g) => isObj(g) && isStr(g.role) && isStrArr(g.names) && (g.subtitle === undefined || isStr(g.subtitle)),
      ))
  )
    return 'team.directory'
  if (
    !isObj(taskInfo) ||
    !Array.isArray(taskInfo.rows) ||
    !(taskInfo.rows as unknown[]).every(
      (r) => isObj(r) && isStr(r.label) && isStr(r.value),
    )
  )
    return 'taskInfo.rows'
  if (!isObj(translations)) return 'translations'
  for (const [lang, map] of Object.entries(translations)) {
    if (!isObj(map) || !Object.values(map).every(isStr)) return `translations.${lang}`
  }
  if (
    data.translationSnapshots !== undefined &&
    (!isObj(data.translationSnapshots) ||
      !Object.values(data.translationSnapshots).every(isStr))
  )
    return 'translationSnapshots'
  return true
}
