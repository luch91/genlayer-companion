import type { BuildConfig } from '@/types'

export function getEducationalPrompts(config: BuildConfig): [string, string] {
  const system = `You are an instructional designer and GenLayer educator. You are generating an educational content package for the GenLayer Builder Companion educational contribution track.

The package includes a working example contract, an interactive frontend demo, full lesson content, and a facilitator guide. Generate content that is specific to the GenLayer concept being taught, accurate about GenLayer's APIs and behaviour, and appropriate for the specified learner level.`

  const answers = config.answers
  const user = `Generate a complete educational content package with these specifications:

Educational format: ${answers['content-type'] || 'explainer video or article series'}
GenLayer concept being taught: ${answers.concept || 'Intelligent Contracts from scratch'}
Learner skill level: ${answers['learner-level'] || 'beginner — no prior blockchain knowledge required'}
${config.idea ? `Content focus: ${config.idea.title} — ${config.idea.description}` : ''}

The package must include:
- A working Python Intelligent Contract that demonstrates the concept being taught, with detailed inline explanation comments
- An interactive frontend demo that lets learners see the contract in action, with full demo mode when CONTRACT_ADDRESS is not set
- Complete lesson content covering the concept, code walkthrough, hands-on exercises, and assessments
- A facilitator or publisher guide covering how to run the lesson, deploy the demo contract on Shipyard, and host the frontend on Netlify`

  return [system, user]
}
