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
  }
  taskInfo: {
    rows: TaskInfoRow[]
  }
  /**
   * Flat translation map: lang → { "dot.path": "translated text" }
   * e.g. translations["en"]["motivation.paragraphs.0"] = "..."
   */
  translations: Record<string, Record<string, string>>
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
