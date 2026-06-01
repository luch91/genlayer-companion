'use client'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(9,19,28,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.1em' }}>
          POWERED BY
        </span>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em' }}>
          GENLAYER
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 97.76 91.93"
          style={{ width: '16px', height: '16px', fill: 'var(--accent)', flexShrink: 0 }}
          aria-label="GenLayer"
        >
          <polygon points="44.26 32.35 27.72 67.12 43.29 74.9 0 91.93 44.26 0 44.26 32.35" />
          <polygon points="53.5 32.35 70.04 67.12 54.47 74.9 97.76 91.93 53.5 0 53.5 32.35" />
          <polygon points="48.64 43.78 58.33 62.94 48.64 67.69 39.47 62.92 48.64 43.78" />
        </svg>
      </div>
    </footer>
  )
}
