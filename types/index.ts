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
