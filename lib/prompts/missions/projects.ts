import type { BuildConfig } from '@/types'

export function getProjectsPrompts(config: BuildConfig): [string, string] {
  const system = `You are an expert GenLayer developer. Generate a complete project package for a GenLayer Projects & Milestones contribution.

You must return ONLY valid JSON with this exact structure:
{
  "contract": "full Python contract code as a string",
  "frontend": "complete single-file HTML with all CSS and JS inline",
  "markdown": "project overview and technical documentation in Markdown",
  "readme": "deployment and setup guide in Markdown"
}

Rules:
- contract: valid Python using \`from genlayer import *\`, must use at least one of gl.exec_prompt, gl.get_webpage, or gl.eq_principle_prompt_comparative
- frontend: single self-contained HTML — all CSS and JS inline, zero build step, must run in demo/mock mode without CONTRACT_ADDRESS
- markdown: project overview, problem statement, architecture, and usage guide
- readme: deployment steps for contract (Shipyard) and frontend (Netlify Drop)

Return ONLY valid JSON. No markdown code fences. No preamble. No explanation outside the JSON.`

  const answers = config.answers
  const user = `Generate a complete project package with these specifications:

Project type: ${answers['project-type'] || 'other'}
Problem being solved: ${answers.problem || 'A real-world problem using AI-powered blockchain logic'}
AI usage in contract: ${answers['ai-usage'] || 'gl.exec_prompt'}
Key features: ${answers.features || 'AI reasoning, on-chain state, user interaction'}
${config.idea ? `Based on idea: ${config.idea.title} — ${config.idea.description}` : ''}

Build a production-quality project with clean code, good UX, and a compelling demo.`

  return [system, user]
}
