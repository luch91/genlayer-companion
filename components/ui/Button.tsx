'use client'

import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '6px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: '1px solid transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: 'var(--bg)',
    borderColor: 'var(--accent)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--accent)',
    borderColor: 'var(--accent)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text)',
    borderColor: 'var(--border)',
  },
  danger: {
    background: 'transparent',
    color: '#ff4444',
    borderColor: '#ff4444',
  },
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '11px' },
  md: { padding: '10px 18px', fontSize: '13px' },
  lg: { padding: '14px 24px', fontSize: '14px' },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...styles.base,
        ...variantStyles[variant],
        ...sizeStyles[size],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
