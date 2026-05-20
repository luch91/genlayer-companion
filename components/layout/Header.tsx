'use client'

import type { Mode } from '@/types'

interface HeaderProps {
  mode: Mode
  onHome: () => void
}

const modeLabels: Record<Mode, string> = {
  home: '',
  ideate: 'IDEATE',
  learn: 'LEARN',
  contribute: 'CONTRIBUTE',
  missions: 'MISSIONS',
}

export default function Header({ mode, onHome }: HeaderProps) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <button
        onClick={onHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            lineHeight: 1,
          }}
        >
          GENLAYER
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            borderLeft: '1px solid var(--border)',
            paddingLeft: '10px',
          }}
        >
          BUILDER COMPANION
        </span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {mode !== 'home' && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              background: 'rgba(0,229,160,0.1)',
              border: '1px solid rgba(0,229,160,0.3)',
              padding: '3px 10px',
              borderRadius: '4px',
            }}
          >
            {modeLabels[mode]}
          </span>
        )}
        <a
          href="https://genshipyard.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--muted)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          SHIPYARD ↗
        </a>
      </div>
    </header>
  )
}
