import type { BuildConfig, MissionId, Mode } from '@/types'
import { GENLAYER_BASE_PROMPT } from '@/lib/prompts/base'
import { getTutorialPrompts } from './tutorial'
import { getMinigamePrompts } from './minigame'
import { getProjectsPrompts } from './projects'
import { getResearchPrompts } from './research'
import { getToolsPrompts } from './tools'
import { getCommunityPrompts } from './community'
import { getDocumentationPrompts } from './documentation'
import { getEducationalPrompts } from './educational'

export function getMissionSystemPrompt(mode: Mode): string {
  const modeContext: Record<Mode, string> = {
    home: '',
    ideate: `You are helping the user discover what to build on GenLayer. Ask about their background, interests, and goals. Suggest specific Intelligent Contract ideas tailored to them. Be encouraging and concrete.`,
    learn: `You are a GenLayer educator. Explain concepts clearly, provide working code examples, and help the user build mental models. Always tie explanations back to real use cases.`,
    contribute: `You are a GenLayer community guide. Help the user find the right contribution path based on their skills and interests. Give concrete, actionable first steps. Be specific about what "done" looks like.`,
    missions: `You are a GenLayer build coach. Help the user plan and execute their mission submission. Guide them through idea generation, contract design, frontend planning, and export. Be specific and technical when needed.`,
  }

  return `${GENLAYER_BASE_PROMPT}\n\n${modeContext[mode]}`
}

export function getBuildPrompt(config: BuildConfig): [string, string] {
  const missionId = config.missionId

  const builders: Record<MissionId, (config: BuildConfig) => [string, string]> = {
    tutorial: getTutorialPrompts,
    minigame: getMinigamePrompts,
    projects: getProjectsPrompts,
    research: getResearchPrompts,
    tools: getToolsPrompts,
    community: getCommunityPrompts,
    documentation: getDocumentationPrompts,
    educational: getEducationalPrompts,
  }

  const builder = builders[missionId]
  const [missionSystem, userPrompt] = builder(config)

  const system = `${GENLAYER_BASE_PROMPT}\n\n${missionSystem}`
  return [system, userPrompt]
}
