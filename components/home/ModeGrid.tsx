'use client'

import type { Mode } from '@/types'

interface ModeGridProps {
  onSelect: (mode: Mode) => void
}

const MODES: { id: Mode; title: string; subtitle: string; description: string; color: string }[] = [
  {
    id: 'ideate',
    title: 'IDEATE',
    subtitle: 'Find your idea',
    description: 'Get personalized Intelligent Contract ideas based on your background and interests.',
    color: 'var(--accent)',
  },
  {
    id: 'learn',
    title: 'LEARN',
    subtitle: 'Master the stack',
    description: 'AI-guided walkthroughs of GenLayer concepts with working code examples.',
    color: 'var(--accent)',
  },
  {
    id: 'contribute',
    title: 'CONTRIBUTE',
    subtitle: 'Make your mark',
    description: 'Six contribution paths with actionable first steps — whatever your skills.',
    color: 'var(--orange)',
  },
  {
    id: 'missions',
    title: 'MISSIONS',
    subtitle: 'Ship and earn',
    description: 'Live Builder Portal missions — from idea to deployed contract + frontend.',
    color: 'var(--orange)',
  },
]

export default function ModeGrid({ onSelect }: ModeGridProps) {
  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '64px 24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 96px)',
            letterSpacing: '0.06em',
            color: 'var(--text)',
            lineHeight: 0.95,
            margin: '0 0 16px',
          }}
        >
          BUILD ON{' '}
          <span style={{ color: 'var(--accent)' }}>GENLAYER</span>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            color: 'var(--muted)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          From zero to deployed. Pick your path.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '32px 28px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'var(--surface2)'
              el.style.borderColor = m.color
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'var(--surface)'
              el.style.borderColor = 'var(--border)'
              el.style.transform = 'translateY(0)'
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '36px',
                  letterSpacing: '0.08em',
                  color: m.color,
                  lineHeight: 1,
                }}
              >
                {m.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {m.subtitle}
              </div>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--text)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {m.description}
            </p>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: m.color,
                letterSpacing: '0.05em',
                marginTop: 'auto',
              }}
            >
              ENTER →
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
