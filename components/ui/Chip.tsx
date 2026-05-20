'use client'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  color?: 'accent' | 'orange' | 'muted'
}

export default function Chip({ label, selected = false, onClick, color = 'accent' }: ChipProps) {
  const colorMap: Record<string, string> = {
    accent: 'var(--accent)',
    orange: 'var(--orange)',
    muted: 'var(--muted)',
  }
  const c = colorMap[color]

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '100px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        cursor: onClick ? 'pointer' : 'default',
        border: `1px solid ${selected ? c : 'var(--border)'}`,
        background: selected ? `${c}18` : 'transparent',
        color: selected ? c : 'var(--muted)',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  )
}
