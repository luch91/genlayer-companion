import type { BuildConfig } from '@/types'

export function getMinigamePrompts(config: BuildConfig): [string, string] {
  const system = `You are an expert GenLayer developer specializing in on-chain game mechanics. Generate a complete mini-game package for the GenLayer Builder Portal "Mini-Games for Community" mission.

You must return ONLY valid JSON with this exact structure:
{
  "contract": "full Python contract code as a string",
  "frontend": "complete single-file HTML with all CSS and JS inline",
  "markdown": "game design document and technical explanation in Markdown",
  "readme": "deployment and setup guide in Markdown"
}

Rules:
- contract: valid Python using \`from genlayer import *\`, Intelligent Contract is the CORE game engine (handles state, turns, scores, outcomes), Optimistic Democracy must be integral not bolted on, must include XP leaderboard stored on-chain, must support multiple players
- frontend: single self-contained HTML file — all CSS and JS inline, zero CDN imports. Must run in demo/mock mode when CONTRACT_ADDRESS is not set showing simulated gameplay.
- markdown: game design doc covering mechanics, how Optimistic Democracy affects gameplay, contract architecture, and frontend architecture
- readme: deployment guide covering Shipyard for contract and Netlify Drop for frontend

Return ONLY valid JSON. No markdown code fences. No preamble. No explanation outside the JSON.`

  const answers = config.answers
  const customGenre = answers['custom-genre'] ? ` (${answers['custom-genre']})` : ''

  const user = `Generate a complete multiplayer mini-game package with these specifications:

Game genre: ${answers['game-genre'] || 'trivia'}${customGenre}
Game concept: ${answers['game-concept'] || 'A trivia game where AI validators judge answer correctness'}
Players per session: ${answers.players || '2'}
How Optimistic Democracy affects gameplay: ${answers['consensus-role'] || 'Validators vote on correct answers using the Equivalence Principle'}
${config.idea ? `Inspired by idea: ${config.idea.title} — ${config.idea.description}` : ''}

Requirements:
1. Intelligent Contract handles ALL game logic — joining, turns, scoring, win conditions
2. Optimistic Democracy is used meaningfully in the core gameplay loop (not just for storing scores)
3. Game sessions are 5–15 minutes, replayable weekly
4. XP leaderboard stored on-chain, resets or accumulates weekly
5. Frontend shows real-time game state, player turns, and leaderboard
6. Must work in demo/mock mode without a real contract address`

  return [system, user]
}
