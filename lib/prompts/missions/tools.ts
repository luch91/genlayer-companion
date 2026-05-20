import type { BuildConfig } from '@/types'

export function getToolsPrompts(config: BuildConfig): [string, string] {
  const system = `You are a senior developer who builds developer tooling for the GenLayer ecosystem. Generate a complete tool package for a GenLayer Tools & Infrastructure contribution.

You must return ONLY valid JSON with this exact structure:
{
  "contract": "example GenLayer contract that demonstrates the tool's use, as a string (if applicable, else empty string)",
  "markdown": "full technical specification and implementation guide in Markdown",
  "readme": "README for the tool with installation, usage, and contribution guide in Markdown"
}

Rules:
- markdown: detailed spec covering the problem, design decisions, API surface, implementation guide, and examples
- readme: complete README a developer would use to install and use the tool
- contract: only include if the tool is demonstrated by a contract example; otherwise empty string

Return ONLY valid JSON. No markdown code fences. No preamble. No explanation outside the JSON.`

  const answers = config.answers
  const techStack = Array.isArray(answers['tech-stack'])
    ? answers['tech-stack'].join(', ')
    : answers['tech-stack'] || 'TypeScript'

  const user = `Generate a complete developer tool package with these specifications:

Tool type: ${answers['tool-type'] || 'CLI tool'}
Pain point solved: ${answers['problem-solved'] || 'Repetitive boilerplate when starting a GenLayer project'}
Tech stack: ${techStack}
Key features: ${answers['key-features'] || 'Fast scaffolding, type-safe contract helpers, one-command deploy'}
${config.idea ? `Based on idea: ${config.idea.title} — ${config.idea.description}` : ''}

Design a tool that genuinely improves the GenLayer developer experience. Include real implementation code, not just pseudocode.`

  return [system, user]
}
