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

export function getMissionChatContext(missionId: MissionId): string {
  const contexts: Record<MissionId, string> = {
    tutorial: `The user is working on the "From Zero to GenLayer" featured mission. This is an educational content contribution: they must create a multi-part walkthrough taking a complete beginner from zero to a deployed Intelligent Contract. Requirements: explain Optimistic Democracy and the Equivalence Principle, include a working Python Intelligent Contract, build a genlayer-js frontend, and verify in GenLayer Studio and Shipyard. Help them design a tutorial that stands out and qualifies for official docs inclusion.`,

    minigame: `The user is working on the "Mini-Games for Community" special mission. They must build a multiplayer on-chain mini-game where an Intelligent Contract is the core game engine — handling all state, turns, and outcomes via Optimistic Democracy. Requirements: 2+ players, 5–15 minute sessions, replayable weekly, XP leaderboard on-chain. Help them design the game concept, contract architecture, and frontend.`,

    projects: `The user is working on the "Projects & Milestones" open contribution track. They need to build a real-world application that solves a genuine problem using an Intelligent Contract — DeFi, social, gaming, tooling, or any domain. Help them identify a specific problem, design the Intelligent Contract using gl primitives, and plan the frontend or CLI interface.`,

    research: `The user is working on the "Research & Analysis" open contribution track. They need to publish original research on GenLayer — consensus analysis, AI alignment, use case exploration, or comparative studies — as a paper, blog post, or technical thread. Help them frame a specific research question, outline methodology, and structure their findings.`,

    tools: `The user is working on the "Tools & Infrastructure" open contribution track. They need to build developer tooling — CLIs, libraries, npm packages, templates, or testing frameworks — that reduces friction for GenLayer developers. Help them identify a specific pain point, design the tool interface, and plan documentation and examples.`,

    community: `The user is working on the "Community & Growth" open contribution track. They need to expand the GenLayer ecosystem through content, events, onboarding, or ambassador activities. Help them identify their strengths, choose a concrete deliverable (video series, meetup, translation project, etc.), and plan how to maximise reach and impact.`,

    documentation: `The user is working on the "Documentation" open contribution track. They need to improve or expand GenLayer's official documentation — new guides, API references, concept explainers, or translations — submitted via the GenLayer GitHub repository. Help them identify documentation gaps and write clear, accurate technical content.`,

    educational: `The user is working on the "Educational Content" open contribution track. They need to create standalone educational resources — video courses, workshops, explainer series, or interactive lessons — that teach GenLayer concepts. Help them choose a concept to teach, design the learning path, and build content with working examples.`,
  }

  return contexts[missionId]
}

export function getMissionIdeasContext(missionId: MissionId): string {
  const contexts: Record<MissionId, string> = {
    tutorial: `This is for the "From Zero to GenLayer" featured mission — an educational content contribution.
Ideas MUST be tutorial concepts: multi-part walkthroughs that take a complete beginner from zero to a deployed Intelligent Contract.
Each idea must name a specific GenLayer concept or use case to teach (e.g. "sentiment analysis contract", "on-chain price oracle", "AI-powered voting"), define a clear learning arc, and use a contract that demonstrates Optimistic Democracy and the Equivalence Principle.
Valid output formats: written guide, video series, or both. Must include a Python Intelligent Contract and a genlayer-js frontend, verifiable in GenLayer Studio and Shipyard.`,

    minigame: `This is for the "Mini-Games for Community" special mission — an on-chain game contribution.
Ideas MUST be multiplayer mini-games where an Intelligent Contract IS the core game engine — handling all state, turns, and outcomes.
Each idea must name a concrete game concept (e.g. "rock-paper-scissors with AI referee", "on-chain trivia blitz", "word-guessing with AI judge"), explain how Optimistic Democracy is integral to gameplay (not bolted on), and describe how the contract manages turns and results.
Requirements: 2+ players, 5–15 minute sessions, replayable weekly, XP leaderboard stored on-chain.`,

    projects: `This is for the "Projects & Milestones" open contribution track.
Ideas MUST be real-world applications that solve a genuine problem using an Intelligent Contract — DeFi, social, gaming, tooling, or any domain.
Each idea must identify the specific problem being solved, explain how the contract's AI capabilities (gl.exec_prompt, gl.get_webpage, gl.eq_principle_prompt_comparative) add unique value over a traditional smart contract, and describe the frontend or CLI interface.`,

    research: `This is for the "Research & Analysis" open contribution track.
Ideas MUST be original research topics publishable as a paper, blog post, or technical thread — not apps or tools.
Each idea must name a specific open question in the GenLayer ecosystem (e.g. consensus analysis, AI alignment, use-case exploration, comparative studies vs other L1s), outline the research methodology, and describe the expected publication format and audience.`,

    tools: `This is for the "Tools & Infrastructure" open contribution track.
Ideas MUST be developer tools that reduce friction for GenLayer builders — CLIs, libraries, npm packages, templates, testing frameworks, IDE extensions.
Each idea must identify a specific pain point for GenLayer developers, describe the tool's interface and how it works, and explain how it integrates with GenLayer Studio, Shipyard, or genlayer-js.`,

    community: `This is for the "Community & Growth" open contribution track.
Ideas MUST be community-building activities — content series, events, onboarding flows, ambassador programs, or translation projects. Not apps or contracts.
Each idea must name a concrete deliverable (e.g. "10-part Twitter thread series", "monthly GenLayer meetup in Lagos", "Spanish translation of the docs"), the target audience and expected reach, and how it grows the GenLayer ecosystem.`,

    documentation: `This is for the "Documentation" open contribution track.
Ideas MUST be documentation improvements for the official GenLayer docs — new guides, API references, concept explainers, how-tos, or translations.
Each idea must identify a specific gap or weakness in the current documentation, name the format (reference page, how-to guide, concept explainer, translation into a specific language), and describe how it would be submitted via the GenLayer GitHub repository.`,

    educational: `This is for the "Educational Content" open contribution track.
Ideas MUST be standalone educational resources — video courses, workshops, explainer series, or interactive lessons — distinct from the official docs.
Each idea must name a specific GenLayer concept or workflow to teach, specify the format (video course, written workshop, interactive demo, live workshop), and state the target skill level and expected learning outcomes.`,
  }

  return contexts[missionId]
}

export function getMissionArtifacts(missionId: MissionId): string[] {
  const map: Record<MissionId, string[]> = {
    tutorial:       ['contract', 'frontend', 'prototype', 'markdown', 'readme'],
    minigame:       ['contract', 'frontend', 'prototype', 'markdown', 'readme'],
    projects:       ['contract', 'frontend', 'prototype', 'markdown', 'readme'],
    educational:    ['contract', 'frontend', 'prototype', 'markdown', 'readme'],
    tools:          ['markdown', 'readme'],
    research:       ['markdown', 'readme'],
    community:      ['markdown', 'readme'],
    documentation:  ['markdown', 'readme'],
  }
  return map[missionId]
}

export function getArtifactBuildPrompt(config: BuildConfig, artifact: string): [string, string] {
  const [, contextPrompt] = getBuildPrompt(config)

  const instructions: Record<string, string> = {
    contract: `From the specifications above, generate ONLY the Python Intelligent Contract.
- The FIRST line must be exactly: # { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
- Second line: \`from genlayer import *\`
- Must include __init__, at least one @gl.public.write and one @gl.public.read
- Must use gl.exec_prompt, gl.get_webpage, or gl.eq_principle_prompt_comparative
Output raw Python code only — no JSON wrapping, no markdown fences, no explanation outside the code.`,

    frontend: `From the specifications above, generate ONLY a standalone app.js JavaScript file.
OUTPUT RAW JAVASCRIPT ONLY — not HTML. This is a .js file that runs in the browser without a bundler.

File structure (in this exact order):
1. const CONTRACT_ADDRESS = 'CONTRACT_ADDRESS';
2. Inject all CSS: const _s = document.createElement('style'); _s.textContent = \`/* all styles */\`; document.head.appendChild(_s);
3. Build and inject all HTML into document.querySelector('#root') or document.body
4. All app logic, state management, event handlers, and contract interaction patterns

Contract interaction:
- Use fetch() calls to the GenLayer JSON-RPC endpoint for real contract reads/writes
- Import nothing — write self-contained vanilla ES6 that runs without a bundler or CDN

DEMO MODE — MOST IMPORTANT:
- if (CONTRACT_ADDRESS === 'CONTRACT_ADDRESS') → run in full demo mode with hardcoded realistic data
- In demo mode render the COMPLETE UI immediately — never a blank, loading, or waiting screen
- Hardcode realistic mock state: names, scores, content, lists, active game state — whatever makes the UI look live
- Do NOT show "connect wallet", "loading", or "waiting for contract" as the initial view
- All sections must be visible on first load — never use display:none as a default state

Output raw JavaScript only. No HTML wrapper. No markdown fences. No explanation before or after.`,

    prototype: `From the specifications above, generate ONLY a high-fidelity visual prototype of the frontend UI as a single self-contained HTML file.
This is a DESIGN PROTOTYPE — not a functional app. Optimise for visual quality and design fidelity.
- Output a COMPLETE HTML document starting with <!DOCTYPE html> and containing <html>, <head>, and <body> tags.
- All CSS in a <style> tag in <head>. Minimal JS (UI interactions only, no blockchain calls) in a <script> tag at end of <body>.
- Use realistic hardcoded placeholder data — no CONTRACT_ADDRESS, no real API calls, no loading states.
- CRITICAL: The page must open to a FULLY VISIBLE, FULLY POPULATED design from the very first second. NEVER use display:none as the default state for any section or panel. If you use tabs, the first tab must have the active class set directly in the HTML markup. All content must be visible and populated on load with no JavaScript required to see it.
- Design goal: looks like a polished, real product. Use a cohesive colour palette, clean typography, proper spacing, and professional layout.
- Include inline SVG icons where appropriate. Show multiple realistic UI states (e.g. filled lists, non-empty forms).
- This file will be imported into Figma via the HTML to Figma plugin — so keep layout simple, avoid complex CSS transforms, prefer flexbox and grid.
- Zero CDN imports, zero external files — everything inline.
Output raw HTML only — starting with <!DOCTYPE html>. No JSON wrapping, no markdown fences, no explanation before or after.`,

    markdown: `From the specifications above, generate ONLY the main content in Markdown — the tutorial, documentation, research paper, game design document, or contribution plan appropriate for this mission.
Be thorough and include code examples where relevant.
Output raw Markdown only. No JSON wrapping.`,

    readme: `From the specifications above, generate ONLY the README and setup/deployment guide in Markdown.
Cover GenLayer Studio setup, Shipyard contract deployment, and Netlify Drop or Vercel for the frontend where applicable.
Output raw Markdown only. No JSON wrapping.`,
  }

  const system = `${GENLAYER_BASE_PROMPT}

You generate a single specific artifact for a GenLayer builder contribution. Generate only what is explicitly requested — no extra explanation, no JSON wrapping.`

  return [system, `${contextPrompt}\n\n---\n\n${instructions[artifact]}`]
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
