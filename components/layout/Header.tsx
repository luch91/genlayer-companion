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
        borderBottom: '1px solid rgba(22,36,53,0.8)',
        background: 'rgba(9,19,28,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 97.76 91.93"
          style={{ width: '28px', height: '28px', fill: 'var(--accent)', flexShrink: 0 }}
          aria-label="GenLayer"
        >
          <polygon points="44.26 32.35 27.72 67.12 43.29 74.9 0 91.93 44.26 0 44.26 32.35" />
          <polygon points="53.5 32.35 70.04 67.12 54.47 74.9 97.76 91.93 53.5 0 53.5 32.35" />
          <polygon points="48.64 43.78 58.33 62.94 48.64 67.69 39.47 62.92 48.64 43.78" />
        </svg>
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
