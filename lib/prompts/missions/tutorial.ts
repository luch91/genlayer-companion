import type { BuildConfig } from '@/types'

export function getTutorialPrompts(config: BuildConfig): [string, string] {
  const system = `You are an expert GenLayer developer and educator. Generate a complete tutorial package for the GenLayer Builder Portal "From Zero to GenLayer" mission.

You must return ONLY valid JSON with this exact structure:
{
  "contract": "full Python contract code as a string",
  "frontend": "complete single-file HTML with all CSS and JS inline",
  "markdown": "the full tutorial content in Markdown",
  "readme": "deployment and setup guide in Markdown"
}

Rules:
- contract: valid Python using \`from genlayer import *\`, with __init__, at least one @gl.public.write and one @gl.public.read, must use gl.exec_prompt OR gl.get_webpage OR gl.eq_principle_prompt_comparative
- frontend: single self-contained HTML file — all CSS and JS inline, zero CDN imports, zero build step required. Must work in demo/mock mode when CONTRACT_ADDRESS is not set.
- markdown: full multi-part tutorial covering the concept, the contract code with explanation, the frontend code, and deployment steps
- readme: step-by-step deployment guide covering Studio, Shipyard, and Netlify/Vercel

Return ONLY valid JSON. No markdown code fences. No preamble. No explanation outside the JSON.`

  const answers = config.answers
  const user = `Generate a complete tutorial package with these specifications:

Audience: ${answers.audience || 'general learners'}
Format: ${answers.format || 'written guide'}
Topic / GenLayer aspect to teach: ${answers.topic || 'Intelligent Contracts basics'}
Demo contract concept: ${answers['contract-idea'] || 'a simple sentiment analysis contract'}
Number of parts: ${answers.parts || '1'}
${config.idea ? `Inspired by idea: ${config.idea.title} — ${config.idea.description}` : ''}

Create a tutorial that:
1. Explains Optimistic Democracy and the Equivalence Principle in plain language
2. Walks through building the demo contract step by step in Python
3. Shows how to test it in GenLayer Studio
4. Builds a genlayer-js frontend that connects to the deployed contract
5. Guides deployment on Shipyard (contract) and Netlify Drop (frontend)

The tutorial must be thorough enough to qualify for the official GenLayer documentation feature prize.`

  return [system, user]
}
