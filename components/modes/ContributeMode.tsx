'use client'

import { CONTRIBS, CONTRIBUTE_SUGGESTIONS } from '@/data/contribute'
import type { ContribPath } from '@/types'
import ChatPanel from '@/components/chat/ChatPanel'

const SEED =
  "I'm your GenLayer contribution guide. Tell me your background and skills, and I'll help you find the right contribution path with concrete first steps. Every builder has a place in the GenLayer ecosystem."

export default function ContributeMode() {
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
          CONTRIBUTE
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginBottom: '32px', fontSize: '15px' }}>
          Six paths to make your mark on the GenLayer ecosystem.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {CONTRIBS.map((contrib: ContribPath) => (
            <div
              key={contrib.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--orange)',
                    letterSpacing: '0.05em',
                    marginBottom: '6px',
                  }}
                >
                  {contrib.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                  }}
                >
                  {contrib.description}
                </div>
              </div>
              <ol style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {contrib.steps.map((step, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: 'var(--text)',
                      lineHeight: 1.5,
                    }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <ChatPanel mode="contribute" seedMessage={SEED} suggestions={CONTRIBUTE_SUGGESTIONS} />
    </div>
  )
}
