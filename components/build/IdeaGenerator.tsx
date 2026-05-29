'use client'

import { useState } from 'react'
import type { MissionId, IdeaItem } from '@/types'
import { MISSIONS_DATA, OPEN_CONTRIBUTIONS } from '@/data/missions'
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

const fieldLabel: Record<MissionId, string> = {
  tutorial: 'Tutorial Structure',
  minigame: 'Game Contract',
  projects: 'Intelligent Contract',
  research: 'Research Approach',
  tools: 'Technical Approach',
  community: 'Content Format',
  documentation: 'Documentation Format',
  educational: 'Learning Format',
}

function getMissionInfo(missionId: MissionId): { title: string; description: string; badge?: string } | null {
  const mission = MISSIONS_DATA.find((m) => m.id === missionId)
  if (mission) return { title: mission.title, description: mission.description, badge: mission.badge }
  const contrib = OPEN_CONTRIBUTIONS.find((c) => c.id === missionId)
  if (contrib) return { title: contrib.title, description: contrib.description }
  return null
}

export default function IdeaGenerator({ missionId, onSelect }: IdeaGeneratorProps) {
  const [ideas, setIdeas] = useState<IdeaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const info = getMissionInfo(missionId)
  const label = fieldLabel[missionId]

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      const results = await generateIdeas({ missionId })
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
      const results = await generateIdeas({ missionId })
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

      {info && (
        <div style={{
          background: 'rgba(0,229,160,0.05)',
          border: '1px solid rgba(0,229,160,0.2)',
          borderRadius: '8px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {info.badge && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--accent)',
                background: 'rgba(0,229,160,0.1)',
                border: '1px solid rgba(0,229,160,0.25)',
                padding: '2px 6px',
                borderRadius: '3px',
                letterSpacing: '0.08em',
              }}>
                {info.badge}
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em' }}>
              {info.title}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            {info.description}
          </div>
        </div>
      )}

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
            Select an Idea
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                {label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)' }}>{idea.contract}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
