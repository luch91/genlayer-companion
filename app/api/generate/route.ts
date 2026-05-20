import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getMissionSystemPrompt, getBuildPrompt } from '@/lib/prompts/missions/index'
import { GENLAYER_BASE_PROMPT } from '@/lib/prompts/base'
import type { Mode, IdeaConfig, BuildConfig } from '@/types'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in .env.local')
}
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function parseJSON(raw: string) {
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type === 'chat') {
      const { mode, messages } = body as { mode: Mode; messages: { role: 'user' | 'assistant'; content: string }[] }
      const systemPrompt = getMissionSystemPrompt(mode)

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      })

      const message = response.content[0].type === 'text' ? response.content[0].text : ''
      return NextResponse.json({ type: 'chat', message })
    }

    if (body.type === 'ideas') {
      const { ideaConfig } = body as { ideaConfig: IdeaConfig }
      const { missionId, background, interests, timeCommitment } = ideaConfig

      const systemPrompt = `${GENLAYER_BASE_PROMPT}

You generate personalized Intelligent Contract ideas for GenLayer builders.
Return ONLY valid JSON — an array of exactly 5 idea objects with this structure:
[
  {
    "title": "short idea name",
    "description": "2-3 sentence description of what it does and why it's interesting",
    "contract": "1-2 sentences on how the Intelligent Contract works — which gl primitives it uses",
    "difficulty": "beginner" | "intermediate" | "advanced"
  }
]
No markdown fences. No preamble. Only the JSON array.`

      const userPrompt = `Generate 5 Intelligent Contract ideas for:
- Mission: ${missionId}
- Background: ${background}
- Interests: ${interests.join(', ')}
- Time available: ${timeCommitment}

Ideas should be realistic for this person to build in the given time, leveraging their background and interests.`

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })

      const raw = response.content[0].type === 'text' ? response.content[0].text : '[]'
      const ideas = parseJSON(raw)
      return NextResponse.json({ type: 'ideas', ideas })
    }

    if (body.type === 'build') {
      const { buildConfig } = body as { buildConfig: BuildConfig }
      const [systemPrompt, userPrompt] = getBuildPrompt(buildConfig)

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })

      const raw = response.content[0].type === 'text' ? response.content[0].text : '{}'
      const output = parseJSON(raw)
      return NextResponse.json({ type: 'build', output })
    }

    return NextResponse.json({ error: 'Unknown request type' }, { status: 400 })
  } catch (err) {
    console.error('/api/generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
