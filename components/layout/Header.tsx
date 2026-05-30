'use client'

import { useState } from 'react'
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
  const [hovered, setHovered] = useState(false)

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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {/* Handshake icon */}
          <svg
            viewBox="0 0 32 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              width: '28px',
              height: '28px',
              color: hovered ? 'var(--accent)' : 'var(--muted)',
              filter: hovered ? 'drop-shadow(0 0 5px rgba(0,229,160,0.8))' : 'none',
              transition: 'color 0.2s ease, filter 0.2s ease',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {/* Left wrist + palm */}
            <path d="M1 20 L8 20 L8 16"/>
            {/* Left fingers */}
            <line x1="8" y1="13" x2="16" y2="9"/>
            <line x1="8" y1="16" x2="16" y2="13"/>
            <line x1="8" y1="19" x2="15" y2="17"/>
            {/* Left thumb */}
            <line x1="8" y1="11" x2="14" y2="6"/>
            {/* Right wrist + palm */}
            <path d="M31 20 L24 20 L24 16"/>
            {/* Right fingers (cross-interlocking with left) */}
            <line x1="24" y1="13" x2="14" y2="9"/>
            <line x1="24" y1="16" x2="14" y2="13"/>
            <line x1="24" y1="19" x2="17" y2="17"/>
            {/* Right thumb */}
            <line x1="24" y1="11" x2="18" y2="6"/>
          </svg>
          {/* Text */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 700,
              color: hovered ? 'var(--accent)' : 'var(--text)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
            }}
          >
            BUILDER COMPANION
          </span>
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
