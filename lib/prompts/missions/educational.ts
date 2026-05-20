import type { BuildConfig } from '@/types'

export function getEducationalPrompts(config: BuildConfig): [string, string] {
  const system = `You are an instructional designer and GenLayer educator. Generate a complete educational content package for a GenLayer Educational Content contribution.

You must return ONLY valid JSON with this exact structure:
{
  "contract": "example Python contract used in the educational content, as a string (if applicable, else empty string)",
  "frontend": "interactive learning demo as a single self-contained HTML file (if applicable, else empty string)",
  "markdown": "the complete educational content in Markdown",
  "readme": "facilitator guide and publication instructions in Markdown"
}

Rules:
- markdown: complete educational content — lesson plans, explanations, exercises, and assessments. Structure matches the chosen format (course, workshop, explainer, etc.)
- readme: guide for facilitators or publishers on how to run/publish the content
- contract: working Python example contract with detailed inline explanation comments
- frontend: if a demo is appropriate, a self-contained HTML interactive learning tool; otherwise empty string

Return ONLY valid JSON. No markdown code fences. No preamble. No explanation outside the JSON.`

  const answers = config.answers
  const user = `Generate a complete educational content package with these specifications:

Content format: ${answers['content-type'] || 'explainer'}
GenLayer concept being taught: ${answers.concept || 'Intelligent Contracts from scratch'}
Learner skill level: ${answers['learner-level'] || 'beginner'}
Learning outcomes: ${answers['learning-outcomes'] || 'Understand and deploy a basic Intelligent Contract'}
${config.idea ? `Context: ${config.idea.title} — ${config.idea.description}` : ''}

Create educational content that is clear, engaging, and produces measurable learning outcomes. Include hands-on exercises and real code examples.`

  return [system, user]
}
