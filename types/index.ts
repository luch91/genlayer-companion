export type Mode = 'home' | 'ideate' | 'learn' | 'contribute' | 'missions'

export type MissionId =
  | 'tutorial'
  | 'minigame'
  | 'projects'
  | 'research'
  | 'tools'
  | 'community'
  | 'documentation'
  | 'educational'

export type BuildStep = 'ideas' | 'questions' | 'generating' | 'output' | 'export'

export type OutputType = 'contract' | 'frontend' | 'content' | 'full'

export interface GeneratedOutput {
  type: OutputType
  contract?: string
  frontend?: string
  prototype?: string
  markdown?: string
  readme?: string
  test?: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface IdeaItem {
  title: string
  description: string
  contract: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface IdeaConfig {
  missionId: MissionId
}

export interface QuestionOption {
  value: string
  label: string
}

export type QuestionType = 'select' | 'chips' | 'text' | 'textarea'

export interface Question {
  id: string
  label: string
  type: QuestionType
  options?: QuestionOption[]
  required: boolean
  placeholder?: string
  showIf?: { questionId: string; value: string }
}

export interface BuildConfig {
  missionId: MissionId
  idea: IdeaItem | null
  answers: Record<string, string | string[]>
}

export interface Mission {
  id: MissionId
  title: string
  subtitle: string
  type: 'timed' | 'open'
  badge: string
  prize: string
  description: string
  requirements: string[]
  chatSeed: string
  status: 'open' | 'closed'
  deadline: string | null
}

export interface OpenContribution {
  id: MissionId
  title: string
  description: string
  actions: string[]
  chatSeed: string
}

export interface Topic {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export interface ContribPath {
  id: string
  title: string
  description: string
  steps: string[]
}

export interface Background {
  value: string
  label: string
}

export interface Interest {
  value: string
  label: string
}

export interface TimeCommitment {
  value: string
  label: string
}

export interface AuditFinding {
  id: number
  label: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  applies: boolean
  reason: string
  fix: string
}

export interface AuditChecklist {
  summary: string
  critical_count: number
  findings: AuditFinding[]
  top_three: number[]
  deploy_verdict: 'ready' | 'caution' | 'not ready'
}

export interface SavedBuild {
  id: string
  savedAt: string
  missionId: MissionId
  label: string
  buildConfig: BuildConfig
  output: GeneratedOutput
}

export interface AuditArtifactResult {
  passed: boolean
  issues: string[]
}

export interface AuditReport {
  passed: boolean
  score: number
  summary: string
  artifacts: {
    contract: AuditArtifactResult
    frontend: AuditArtifactResult
    markdown: AuditArtifactResult
    readme: AuditArtifactResult
  }
  blockers: string[]
  warnings: string[]
}
