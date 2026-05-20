'use client'

import { useState } from 'react'
import type { MissionId, IdeaItem } from '@/types'
import { BACKGROUNDS, INTERESTS, TIME_COMMITMENTS } from '@/data/backgrounds'
import { generateIdeas } from '@/lib/claude'
import Chip from '@/components/ui/Chip'
import Button from '@/components/ui/Button'
import LoadingDots from '@/components/ui/LoadingDots'

interface IdeaGeneratorProps {
  missionId: MissionId
  onSelect: (idea: IdeaItem) => void
}

const difficultyColor: Record<string, 'accent' | 'orange' | 'muted'> = {
  beginner: 'accent',
  intermediate: 'orange',
  advanced: 'muted',
}

export default function IdeaGenerator({ missionId, onSelect }: IdeaGeneratorProps) {
  const [background, setBackground] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [time, setTime] = useState('')
  const [ideas, setIdeas] = useState<IdeaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleInterest(val: string) {
    setInterests((prev) => (prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]))
  }

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      const results = await generateIdeas({
        missionId,
        background: background || 'general',
        interests: interests.length > 0 ? interests : ['general'],
        timeCommitment: time || 'week',
      })
      setIdeas(results)
    } catch {
      setError('Failed to generate ideas. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSurpriseMe() {
    setLoading(true)
    setError('')
    try {
      const results = await generateIdeas({
        missionId,
        background: 'developer',
        interests: ['ai', 'gaming', 'defi'],
        timeCommitment: 'week',
      })
      setIdeas(results)
      if (results.length > 0) onSelect(results[0])
    } catch {
      setError('Failed to generate ideas. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Your Background
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {BACKGROUNDS.map((b) => (
            <Chip key={b.value} label={b.label} selected={background === b.value} onClick={() => setBackground(b.value === background ? '' : b.value)} />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Interests (pick any)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {INTERESTS.map((i) => (
            <Chip key={i.value} label={i.label} selected={interests.includes(i.value)} onClick={() => toggleInterest(i.value)} />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Time Available
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {TIME_COMMITMENTS.map((t) => (
            <Chip key={t.value} label={t.label} selected={time === t.value} onClick={() => setTime(t.value === time ? '' : t.value)} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <LoadingDots /> : 'GENERATE IDEAS'}
        </Button>
        <Button variant="ghost" onClick={handleSurpriseMe} disabled={loading}>
          SURPRISE ME
        </Button>
      </div>

      {error && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ff4444' }}>{error}</div>
      )}

      {ideas.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Select an Idea to Build
          </div>
          {ideas.map((idea, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(idea)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(idea)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'var(--surface2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{idea.title}</div>
                <Chip label={idea.difficulty} color={difficultyColor[idea.difficulty]} />
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{idea.description}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)' }}>{idea.contract}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
