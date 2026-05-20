import type { BuildConfig, IdeaConfig, IdeaItem, GeneratedOutput, Message, Mode } from '@/types'

export async function chatWithClaude(mode: Mode, messages: Message[]): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'chat', mode, messages }),
  })
  if (!res.ok) throw new Error('Chat request failed')
  const data = await res.json()
  return data.message
}

export async function generateIdeas(ideaConfig: IdeaConfig): Promise<IdeaItem[]> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'ideas', ideaConfig }),
  })
  if (!res.ok) throw new Error('Idea generation failed')
  const data = await res.json()
  return data.ideas
}

export async function buildDeliverable(buildConfig: BuildConfig): Promise<GeneratedOutput> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'build', buildConfig }),
  })
  if (!res.ok) throw new Error('Build generation failed')
  const data = await res.json()
  return data.output
}
