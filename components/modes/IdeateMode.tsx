'use client'

import { useState } from 'react'
import type { Background as BG, Interest } from '@/types'
import { BACKGROUNDS, INTERESTS, TIME_COMMITMENTS } from '@/data/backgrounds'
import ChatPanel from '@/components/chat/ChatPanel'
import Chip from '@/components/ui/Chip'

const SEED =
  "I'm your GenLayer idea generator. Tell me about your background and interests, and I'll suggest Intelligent Contract ideas tailored just for you. Or answer the questions on the left and I'll generate a personalized list."

const SUGGESTIONS = [
  "I'm a Python developer interested in DeFi",
  'What can I build as a designer with no blockchain experience?',
  'I love gaming — what GenLayer projects would suit me?',
  'What are the most impactful things to build right now?',
]

export default function IdeateMode() {
  const [background, setBackground] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [time, setTime] = useState('')

  function toggleInterest(val: string) {
    setInterests((prev) => (prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]))
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '24px',
        alignItems: 'start',
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            letterSpacing: '0.06em',
            color: 'var(--text)',
            margin: '0 0 4px',
          }}
        >
          IDEATE
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginBottom: '32px', fontSize: '15px' }}>
          Tell us about yourself and we&apos;ll find your perfect GenLayer idea.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <section>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Your Background
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BACKGROUNDS.map((b: BG) => (
                <Chip
                  key={b.value}
                  label={b.label}
                  selected={background === b.value}
                  onClick={() => setBackground(b.value === background ? '' : b.value)}
                />
              ))}
            </div>
          </section>

          <section>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Interests (pick any)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {INTERESTS.map((interest: Interest) => (
                <Chip
                  key={interest.value}
                  label={interest.label}
                  selected={interests.includes(interest.value)}
                  onClick={() => toggleInterest(interest.value)}
                />
              ))}
            </div>
          </section>

          <section>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Time Available
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TIME_COMMITMENTS.map((t) => (
                <Chip
                  key={t.value}
                  label={t.label}
                  selected={time === t.value}
                  onClick={() => setTime(t.value === time ? '' : t.value)}
                />
              ))}
            </div>
          </section>

          {(background || interests.length > 0 || time) && (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--muted)',
              }}
            >
              <span style={{ color: 'var(--accent)' }}>TIP —</span> Share your selections with the AI assistant →
              and ask it to generate ideas for you.
            </div>
          )}
        </div>
      </div>

      <ChatPanel mode="ideate" seedMessage={SEED} suggestions={SUGGESTIONS} />
    </div>
  )
}
