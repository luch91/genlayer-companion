'use client'

import { useState } from 'react'
import { TOPICS, LEARN_SUGGESTIONS, TOPIC_SEEDS, TOOL_IDS } from '@/data/learn'
import type { Topic } from '@/types'
import ChatPanel from '@/components/chat/ChatPanel'
import Chip from '@/components/ui/Chip'

const DEFAULT_SEED =
  "I'm your GenLayer learning guide. Select a topic or tool on the left to dive straight in, or ask me anything — from 'what is an Intelligent Contract?' to deep dives on Optimistic Democracy, gl.exec_prompt, and genlayer-js."

const levelColor: Record<string, 'accent' | 'orange' | 'muted'> = {
  beginner: 'accent',
  intermediate: 'orange',
  advanced: 'muted',
}

export default function LearnMode() {
  const [selected, setSelected] = useState<string | null>(null)

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
          LEARN
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginBottom: '32px', fontSize: '15px' }}>
          Master GenLayer concepts with AI-guided walkthroughs and real code examples.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {TOPICS.map((topic: Topic) => (
            <div
              key={topic.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(selected === topic.id ? null : topic.id)}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(selected === topic.id ? null : topic.id)}
              style={{
                background: selected === topic.id ? 'var(--surface2)' : 'var(--surface)',
                border: `1px solid ${selected === topic.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '16px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '4px',
                  }}
                >
                  {topic.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--muted)',
                  }}
                >
                  {topic.description}
                </div>
              </div>
              <Chip label={topic.level} color={levelColor[topic.level]} />
            </div>
          ))}
        </div>

        {selected && (
          <div
            style={{
              marginTop: '20px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--muted)',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>
              {TOOL_IDS.includes(selected) ? 'TOOL' : 'TOPIC'} —
            </span>{' '}
            {TOPICS.find((t) => t.id === selected)?.title}.{' '}
            {TOOL_IDS.includes(selected)
              ? 'Ask the assistant to explain this tool →'
              : 'Ask the assistant to teach you this topic →'}
          </div>
        )}
      </div>

      <ChatPanel
        key={selected ?? 'default'}
        mode="learn"
        seedMessage={selected && TOPIC_SEEDS[selected] ? TOPIC_SEEDS[selected] : DEFAULT_SEED}
        suggestions={LEARN_SUGGESTIONS}
      />
    </div>
  )
}
