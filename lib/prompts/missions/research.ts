import type { BuildConfig } from '@/types'

export function getResearchPrompts(config: BuildConfig): [string, string] {
  const system = `You are an expert in blockchain technology, AI systems, and the GenLayer ecosystem. Generate a complete research package for a GenLayer Research & Analysis contribution.

You must return ONLY valid JSON with this exact structure:
{
  "markdown": "the full research document in Markdown",
  "readme": "publication and submission guide in Markdown"
}

Rules:
- markdown: rigorous, well-structured research document with abstract, introduction, analysis, findings, and conclusion — include code examples where relevant
- readme: guide for publishing the research and submitting to the GenLayer community

Return ONLY valid JSON. No markdown code fences. No preamble. No explanation outside the JSON.`

  const answers = config.answers
  const user = `Generate a complete research package with these specifications:

Research area: ${answers['research-area'] || 'Optimistic Democracy consensus mechanics'}
Core research question: ${answers['research-question'] || 'How does GenLayer achieve consensus on non-deterministic AI outputs?'}
Publication format: ${answers['output-format'] || 'long-form blog post'}
Methodology: ${answers.methodology || 'Conceptual analysis with code examples'}
${config.idea ? `Context: ${config.idea.title} — ${config.idea.description}` : ''}

Produce original, insightful research that would be valuable to the GenLayer community and developers.`

  return [system, user]
}
