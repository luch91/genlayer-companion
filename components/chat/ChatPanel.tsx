'use client'

import { useState, useRef, useEffect } from 'react'
import type { Mode, Message, MissionId } from '@/types'
import { chatWithClaude } from '@/lib/claude'
import LoadingDots from '@/components/ui/LoadingDots'

interface ChatPanelProps {
  mode: Mode
  missionId?: MissionId
  seedMessage?: string
  suggestions?: string[]
}

export default function ChatPanel({ mode, missionId, seedMessage, suggestions = [] }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(
    seedMessage ? [{ role: 'assistant', content: seedMessage }] : []
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const reply = await chatWithClaude(mode, [...messages, userMsg], missionId)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 110px)',
        maxHeight: '740px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'sticky',
        top: '76px',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--muted)',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ color: 'var(--accent)', fontSize: '8px' }}>●</span>
        AI ASSISTANT
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--muted)',
              textAlign: 'center',
              paddingTop: '32px',
              lineHeight: 1.6,
            }}
          >
            Ask me anything about GenLayer.
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: msg.role === 'user' ? 'rgba(0,229,160,0.12)' : 'var(--surface2)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(0,229,160,0.3)' : 'var(--border)'}`,
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px 12px 12px 2px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
              }}
            >
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {suggestions.length > 0 && messages.length <= 1 && (
        <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--muted)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                textAlign: 'left',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder="Ask anything..."
          style={{
            flex: 1,
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text)',
            outline: 'none',
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--bg)',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          SEND
        </button>
      </div>
    </div>
  )
}
