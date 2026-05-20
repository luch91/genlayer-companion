import type { BuildConfig } from '@/types'

export function getDocumentationPrompts(config: BuildConfig): [string, string] {
  const system = `You are a technical writer and GenLayer expert. Generate a complete documentation contribution for the GenLayer ecosystem.

You must return ONLY valid JSON with this exact structure:
{
  "markdown": "the complete documentation content in Markdown",
  "readme": "submission guide and contribution instructions in Markdown"
}

Rules:
- markdown: complete, accurate, well-structured documentation — include code examples, diagrams (as ASCII or Mermaid), and clear explanations. Write as if for the official GenLayer docs.
- readme: guide on how to submit the contribution to the GenLayer GitHub repository

Return ONLY valid JSON. No markdown code fences. No preamble. No explanation outside the JSON.`

  const answers = config.answers
  const translationNote = answers['target-language']
    ? `\nThis is a translation to: ${answers['target-language']}`
    : ''

  const user = `Generate complete documentation with these specifications:

Documentation type: ${answers['doc-type'] || 'how-to guide'}
Topic / gap being covered: ${answers.topic || 'Getting started with Intelligent Contracts'}${translationNote}
Outline / sections: ${answers.outline || 'Introduction, prerequisites, step-by-step, examples, troubleshooting'}
${config.idea ? `Context: ${config.idea.title} — ${config.idea.description}` : ''}

Write documentation that meets the quality bar for the official GenLayer docs. Be precise, include working code examples, and anticipate common confusion points.`

  return [system, user]
}
