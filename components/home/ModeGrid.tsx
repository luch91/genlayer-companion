'use client'

import { useEffect, useRef } from 'react'
import type { Mode } from '@/types'

interface ModeGridProps {
  onSelect: (mode: Mode) => void
}

const MODES: { id: Mode; title: string; subtitle: string; description: string; color: string; rgb: string; effect: string }[] = [
  {
    id: 'ideate',
    title: 'IDEATE',
    subtitle: 'Find your idea',
    description: 'Get personalized Intelligent Contract ideas based on your background and interests.',
    color: 'var(--accent)',
    rgb: '0,229,160',
    effect: 'A — SPOTLIGHT',
  },
  {
    id: 'learn',
    title: 'LEARN',
    subtitle: 'Master the stack',
    description: 'AI-guided walkthroughs of GenLayer concepts with working code examples.',
    color: 'var(--accent)',
    rgb: '0,229,160',
    effect: 'B — BORDER TRACE',
  },
  {
    id: 'contribute',
    title: 'CONTRIBUTE',
    subtitle: 'Make your mark',
    description: 'Six contribution paths with actionable first steps — whatever your skills.',
    color: 'var(--orange)',
    rgb: '255,107,53',
    effect: 'C — MAGNETIC PULL',
  },
  {
    id: 'missions',
    title: 'MISSIONS',
    subtitle: 'Ship and earn',
    description: 'Live Builder Portal missions — from idea to deployed contract + frontend.',
    color: 'var(--orange)',
    rgb: '255,107,53',
    effect: 'D — SCANLINE',
  },
]

const ORBS = [
  { top: '-8%',  left: '-6%',  w: 520, h: 520, color: 'rgba(0,229,160,0.18)',  dur: '9s',  anim: 'gl-float' },
  { top: '8%',   left: '68%',  w: 420, h: 420, color: 'rgba(255,107,53,0.14)', dur: '12s', anim: 'gl-float-alt' },
  { top: '58%',  left: '4%',   w: 340, h: 340, color: 'rgba(0,229,160,0.12)',  dur: '10s', anim: 'gl-float-alt' },
  { top: '42%',  left: '62%',  w: 280, h: 280, color: 'rgba(255,107,53,0.10)', dur: '7s',  anim: 'gl-float' },
  { top: '72%',  left: '38%',  w: 380, h: 380, color: 'rgba(0,229,160,0.10)',  dur: '14s', anim: 'gl-float-alt' },
]

const SHAPES = [
  { top: '14%', left: '80%', size: 28, delay: '0s',  dur: '22s' },
  { top: '68%', left: '6%',  size: 18, delay: '5s',  dur: '28s' },
  { top: '32%', left: '12%', size: 12, delay: '9s',  dur: '19s' },
  { top: '82%', left: '74%', size: 22, delay: '3s',  dur: '24s' },
  { top: '22%', left: '48%', size: 10, delay: '11s', dur: '30s' },
]

const BASE_BG = 'rgba(9,19,28,0.55)'

export default function ModeGrid({ onSelect }: ModeGridProps) {
  const layer1Ref = useRef<HTMLDivElement>(null)
  const layer2Ref = useRef<HTMLDivElement>(null)
  const scanRafRef = useRef<number>(0)
  const starRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const starEl = starRef.current
    if (!starEl) return

    const trigger = () => {
      const el = starRef.current
      if (!el) return
      el.style.left = `${Math.random() * window.innerWidth * 0.45}px`
      el.style.top = `${window.innerHeight * 0.4 + Math.random() * window.innerHeight * 0.3}px`
      el.style.animation = 'none'
      void el.offsetHeight
      el.style.animation = 'gl-shooting-star 1.4s ease-out forwards'
    }

    const initial = setTimeout(trigger, 1500)
    const interval = setInterval(trigger, 5000)
    return () => { clearTimeout(initial); clearInterval(interval) }
  }, [])

  useEffect(() => {
    let rafId: number
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        if (layer1Ref.current) layer1Ref.current.style.transform = `translateY(${y * 0.22}px)`
        if (layer2Ref.current) layer2Ref.current.style.transform = `translateY(${y * 0.1}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // A — Cursor Spotlight
  function handleSpotlightMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.background = `radial-gradient(280px circle at ${x}px ${y}px, rgba(0,229,160,0.18) 0%, rgba(9,19,28,0.55) 65%)`
  }
  function handleSpotlightLeave(e: React.MouseEvent<HTMLButtonElement>) {
    const el = e.currentTarget
    el.style.background = BASE_BG
    el.style.borderColor = 'var(--border)'
    el.style.boxShadow = 'none'
  }

  // B — Neon Border Trace (edge glow follows cursor)
  function handleBorderMove(e: React.MouseEvent<HTMLButtonElement>, rgb: string) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const L = Math.max(0, 1 - x * 2) * 24
    const R = Math.max(0, x * 2 - 1) * 24
    const T = Math.max(0, 1 - y * 2) * 24
    const B = Math.max(0, y * 2 - 1) * 24
    const shadows: string[] = []
    if (L > 0) shadows.push(`-${L}px 0 ${L * 2}px rgba(${rgb},0.7)`)
    if (R > 0) shadows.push(`${R}px 0 ${R * 2}px rgba(${rgb},0.7)`)
    if (T > 0) shadows.push(`0 -${T}px ${T * 2}px rgba(${rgb},0.7)`)
    if (B > 0) shadows.push(`0 ${B}px ${B * 2}px rgba(${rgb},0.7)`)
    el.style.boxShadow = shadows.length ? shadows.join(', ') : `0 0 20px rgba(${rgb},0.3)`
    el.style.borderColor = `rgba(${rgb},0.85)`
  }
  function handleBorderLeave(e: React.MouseEvent<HTMLButtonElement>) {
    const el = e.currentTarget
    el.style.boxShadow = 'none'
    el.style.borderColor = 'var(--border)'
    el.style.background = BASE_BG
  }

  // C — Magnetic Pull
  function handleMagneticMove(e: React.MouseEvent<HTMLButtonElement>, rgb: string) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const dx = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 22
    const dy = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 14
    el.style.transform = `translate(${dx}px, ${dy}px)`
    el.style.boxShadow = `${-dx * 0.6}px ${-dy * 0.6}px 40px rgba(${rgb},0.15)`
    el.style.borderColor = `rgba(${rgb},0.6)`
  }
  function handleMagneticLeave(e: React.MouseEvent<HTMLButtonElement>) {
    const el = e.currentTarget
    el.style.transform = ''
    el.style.boxShadow = 'none'
    el.style.borderColor = 'var(--border)'
  }

  // D — Scanline Reveal
  function handleScanEnter(e: React.MouseEvent<HTMLButtonElement>, rgb: string) {
    const el = e.currentTarget
    el.style.borderColor = `rgba(${rgb},0.7)`
    el.style.boxShadow = `0 0 30px rgba(${rgb},0.15), inset 0 0 30px rgba(${rgb},0.03)`
    cancelAnimationFrame(scanRafRef.current)
    let scanY = -14
    const animate = () => {
      scanY += 2.5
      el.style.backgroundImage = `linear-gradient(180deg, transparent ${Math.max(0, scanY - 12)}%, rgba(${rgb},0.12) ${scanY}%, rgba(${rgb},0.05) ${scanY + 6}%, transparent ${scanY + 16}%)`
      if (scanY < 120) {
        scanRafRef.current = requestAnimationFrame(animate)
      } else {
        el.style.backgroundImage = 'none'
      }
    }
    scanRafRef.current = requestAnimationFrame(animate)
  }
  function handleScanLeave(e: React.MouseEvent<HTMLButtonElement>) {
    cancelAnimationFrame(scanRafRef.current)
    const el = e.currentTarget
    el.style.backgroundImage = 'none'
    el.style.background = BASE_BG
    el.style.borderColor = 'var(--border)'
    el.style.boxShadow = 'none'
  }

  function getHandlers(m: typeof MODES[number]) {
    if (m.id === 'ideate') return {
      onMouseMove: handleSpotlightMove,
      onMouseEnter: undefined,
      onMouseLeave: handleSpotlightLeave,
    }
    if (m.id === 'learn') return {
      onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => handleBorderMove(e, m.rgb),
      onMouseEnter: undefined,
      onMouseLeave: handleBorderLeave,
    }
    if (m.id === 'contribute') return {
      onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => handleMagneticMove(e, m.rgb),
      onMouseEnter: undefined,
      onMouseLeave: handleMagneticLeave,
    }
    return {
      onMouseMove: undefined,
      onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => handleScanEnter(e, m.rgb),
      onMouseLeave: handleScanLeave,
    }
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 56px)' }}>

      {/* Radial gradient backdrop */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 12% 45%, rgba(0,229,160,0.06) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 88% 18%, rgba(255,107,53,0.05) 0%, transparent 65%)',
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(0,229,160,0.35) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.5,
      }} />

      {/* Shooting star */}
      <div
        ref={starRef}
        style={{
          position: 'absolute',
          width: '220px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(204,255,235,0.06) 30%, rgba(204,255,235,0.35) 75%, rgba(255,255,255,0.6) 100%)',
          borderRadius: '1px',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 6,
          boxShadow: '0 0 4px 1px rgba(200,255,230,0.2)',
        }}
      />

      {/* Layer 1 — slow parallax — large diffuse orbs */}
      <div ref={layer1Ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', willChange: 'transform' }}>
        {ORBS.map((orb, i) => (
          <div key={i} style={{
            position: 'absolute', top: orb.top, left: orb.left,
            width: orb.w, height: orb.h, borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(48px)',
            animation: `${orb.anim} ${orb.dur} ease-in-out infinite`,
            animationDelay: `${i * 1.8}s`,
          }} />
        ))}
      </div>

      {/* Layer 2 — faster parallax — small geometric diamonds */}
      <div ref={layer2Ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', willChange: 'transform' }}>
        {SHAPES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: s.top, left: s.left,
            width: s.size, height: s.size,
            border: '1px solid rgba(0,229,160,0.22)',
            transform: 'rotate(45deg)',
            animation: `gl-rotate ${s.dur} linear infinite`,
            animationDelay: s.delay,
            opacity: 0.55,
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '72px', animation: 'gl-fade-up 0.9s ease both' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 9vw, 108px)',
            letterSpacing: '0.06em',
            color: 'var(--text)',
            lineHeight: 0.95,
            margin: '0 0 22px',
            textShadow: '0 0 80px rgba(0,229,160,0.1)',
          }}>
            BUILD ON{' '}
            <span style={{
              color: 'var(--accent)',
              textShadow: '0 0 20px rgba(0,229,160,0.7), 0 0 60px rgba(0,229,160,0.4)',
              animation: 'gl-pulse-glow 2.5s ease-in-out infinite',
            }}>
              GENLAYER
            </span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '18px',
            color: 'var(--muted)', maxWidth: '480px',
            margin: '0 auto', lineHeight: 1.7,
          }}>
            From zero to deployed. Pick your path.
          </p>
        </div>

        {/* Mode cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {MODES.map((m, i) => {
            const handlers = getHandlers(m)
            return (
              <div key={m.id} style={{
                animationName: 'gl-fade-up',
                animationDuration: '0.7s',
                animationTimingFunction: 'ease',
                animationFillMode: 'both',
                animationDelay: `${0.15 + i * 0.1}s`,
              }}>
                <button
                  onClick={() => onSelect(m.id)}
                  onMouseMove={handlers.onMouseMove}
                  onMouseEnter={handlers.onMouseEnter}
                  onMouseLeave={handlers.onMouseLeave}
                  style={{
                    width: '100%',
                    background: BASE_BG,
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '32px 28px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: m.id === 'contribute'
                      ? 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.2s ease, box-shadow 0.2s ease'
                      : 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    willChange: 'transform',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '0.08em', color: m.color, lineHeight: 1 }}>
                      {m.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em', marginTop: '4px', textTransform: 'uppercase' }}>
                      {m.subtitle}
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
                    {m.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: m.color, letterSpacing: '0.05em' }}>
                      ENTER →
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--border)', letterSpacing: '0.08em' }}>
                      {m.effect}
                    </span>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
