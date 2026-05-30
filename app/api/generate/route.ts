import { NextRequest, NextResponse } from 'next/server'
import { getMissionSystemPrompt, getMissionIdeasContext, getMissionChatContext, getMissionArtifacts, getArtifactBuildPrompt } from '@/lib/prompts/missions/index'
import { GENLAYER_BASE_PROMPT } from '@/lib/prompts/base'
import type { Mode, IdeaConfig, BuildConfig, GeneratedOutput } from '@/types'

async function groqChat(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<string> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('GROQ_API_KEY is not set in .env.local')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })

  if (!res.ok) throw new Error(`Groq error: ${res.status} ${await res.text()}`)

  const data = await res.json()
  const choice = data.choices?.[0]
  if (choice?.finish_reason === 'length') throw new Error('Groq response truncated — token limit reached')
  return choice?.message?.content ?? ''
}

async function openrouterChat(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error('OPENROUTER_API_KEY is not set in .env.local')

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://genlayer-builder-companion.vercel.app',
      'X-Title': 'GenLayer Builder Companion',
    },
    body: JSON.stringify({
      model: 'qwen/qwen3-coder-30b-a3b-instruct',
      max_tokens: maxTokens,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })

  if (!res.ok) throw new Error(`OpenRouter error: ${res.status} ${await res.text()}`)

  const data = await res.json()
  const choice = data.choices?.[0]
  if (choice?.finish_reason === 'length') throw new Error('OpenRouter response truncated — token limit reached')

  let content = choice?.message?.content ?? ''
  // Strip thinking blocks if the model emits them inline
  content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  return content
}

function parseJSON(raw: string) {
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type === 'chat') {
      const { mode, messages, missionId } = body as { mode: Mode; messages: { role: 'user' | 'assistant'; content: string }[]; missionId?: string }
      let systemPrompt = getMissionSystemPrompt(mode)
      if (missionId) {
        const missionContext = getMissionChatContext(missionId as Parameters<typeof getMissionChatContext>[0])
        systemPrompt += `\n\nACTIVE MISSION CONTEXT — the user has selected this specific contribution track. All advice must be focused on it:\n${missionContext}`
      }

      const message = await groqChat(systemPrompt, messages, 1024)
      return NextResponse.json({ type: 'chat', message })
    }

    if (body.type === 'ideas') {
      const { ideaConfig } = body as { ideaConfig: IdeaConfig }
      const { missionId } = ideaConfig

      const missionContext = getMissionIdeasContext(missionId)

      const systemPrompt = `${GENLAYER_BASE_PROMPT}

You generate ideas for GenLayer builders for a specific contribution track.

CONTRIBUTION TRACK — THIS IS THE ONLY CONSTRAINT. Every idea MUST be a valid submission for this track and nothing else:
${missionContext}

Return ONLY valid JSON — an array of exactly 5 idea objects with this structure:
[
  {
    "title": "short idea name",
    "description": "2-3 sentence description of what it is and why it fits this contribution track",
    "contract": "1-2 sentences describing the core technical or structural approach",
    "difficulty": "beginner" | "intermediate" | "advanced"
  }
]
No markdown fences. No preamble. Only the JSON array.`

      const userPrompt = `Generate 5 ideas for the "${missionId}" contribution track. Every idea must be a valid, specific submission for that track — not a generic GenLayer project.`

      const raw = await groqChat(systemPrompt, [{ role: 'user', content: userPrompt }], 2048)
      const ideas = parseJSON(raw)
      return NextResponse.json({ type: 'ideas', ideas })
    }

    if (body.type === 'build') {
      const { buildConfig } = body as { buildConfig: BuildConfig }
      const artifacts = getMissionArtifacts(buildConfig.missionId)

      const results = await Promise.all(
        artifacts.map(async (artifact) => {
          const [system, user] = getArtifactBuildPrompt(buildConfig, artifact)
          const raw = await openrouterChat(system, [{ role: 'user', content: user }], 8192)
          const content = (artifact === 'contract' || artifact === 'frontend' || artifact === 'prototype')
            ? raw.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim()
            : raw.trim()
          return { artifact, content }
        })
      )

      const output: GeneratedOutput = { type: 'full' }
      for (const { artifact, content } of results) {
        if (artifact === 'contract') output.contract = content
        if (artifact === 'frontend') output.frontend = content
        if (artifact === 'prototype') output.prototype = content
        if (artifact === 'markdown') output.markdown = content
        if (artifact === 'readme') output.readme = content
      }

      return NextResponse.json({ type: 'build', output })
    }

    return NextResponse.json({ error: 'Unknown request type' }, { status: 400 })
  } catch (err) {
    console.error('/api/generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
