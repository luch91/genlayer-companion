'use client'

import { useState } from 'react'
import Image from 'next/image'
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
        background: 'rgba(8,46,56,0.82)',
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
          <Image
            src="/builder-companion-mark.svg"
            alt=""
            width={30}
            height={30}
            unoptimized
            style={{
              width: '30px',
              height: '30px',
              opacity: hovered ? 1 : 0.9,
              transition: 'opacity 0.2s ease',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
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
          <>
            <button
              onClick={onHome}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--muted)',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                padding: 0,
              }}
            >
              ← BACK
            </button>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: 'var(--accent)',
                background: 'rgba(231,111,81,0.1)',
                border: '1px solid rgba(231,111,81,0.3)',
                padding: '3px 10px',
                borderRadius: '4px',
              }}
            >
              {modeLabels[mode]}
            </span>
          </>
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
