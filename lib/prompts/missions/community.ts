import type { BuildConfig } from '@/types'

export function getCommunityPrompts(config: BuildConfig): [string, string] {
  const system = `You are a community building expert and GenLayer advocate. Generate a complete community contribution package for a GenLayer Community & Growth contribution.

You must return ONLY valid JSON with this exact structure:
{
  "markdown": "full community contribution plan and content in Markdown",
  "readme": "execution guide and tracking template in Markdown"
}

Rules:
- markdown: detailed contribution plan including content calendar, messaging strategy, specific post/video scripts or outlines, and success metrics
- readme: execution checklist, platform-specific tips, and tracking template

Return ONLY valid JSON. No markdown code fences. No preamble. No explanation outside the JSON.`

  const answers = config.answers
  const platforms = Array.isArray(answers.platforms)
    ? answers.platforms.join(', ')
    : answers.platforms || 'Twitter/X, Discord'

  const user = `Generate a complete community contribution package with these specifications:

Activity type: ${answers['activity-type'] || 'content creation'}
Target community / audience: ${answers['target-community'] || 'Web3 developers'}
Contribution plan: ${answers['content-plan'] || 'Regular educational content about GenLayer'}
Platforms: ${platforms}
${config.idea ? `Context: ${config.idea.title} — ${config.idea.description}` : ''}

Create a concrete, actionable plan that would meaningfully grow the GenLayer ecosystem. Include specific content outlines, not just general advice.`

  return [system, user]
}
