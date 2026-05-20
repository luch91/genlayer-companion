'use client'

import { useState } from 'react'
import type { MissionId, Question } from '@/types'
import { BUILD_QUESTIONS } from '@/data/build-questions'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'

interface QuestionFormProps {
  missionId: MissionId
  onSubmit: (answers: Record<string, string | string[]>) => void
}

export default function QuestionForm({ missionId, onSubmit }: QuestionFormProps) {
  const questions = BUILD_QUESTIONS[missionId] || []
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [error, setError] = useState('')

  function isVisible(q: Question): boolean {
    if (!q.showIf) return true
    return answers[q.showIf.questionId] === q.showIf.value
  }

  function set(id: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function toggleChip(id: string, val: string) {
    const current = (answers[id] as string[]) || []
    const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
    set(id, next)
  }

  function handleSubmit() {
    const missing = questions.filter((q) => q.required && isVisible(q) && !answers[q.id])
    if (missing.length > 0) {
      setError(`Please answer: ${missing.map((q) => q.label).join(', ')}`)
      return
    }
    setError('')
    onSubmit(answers)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {questions.filter(isVisible).map((q) => (
        <div key={q.id}>
          <label
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text)',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            {q.label}
            {q.required && <span style={{ color: 'var(--accent)', marginLeft: '4px' }}>*</span>}
          </label>

          {q.type === 'select' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {q.options?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set(q.id, opt.value)}
                  style={{
                    background: answers[q.id] === opt.value ? 'rgba(0,229,160,0.08)' : 'var(--surface)',
                    border: `1px solid ${answers[q.id] === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '6px',
                    padding: '10px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: answers[q.id] === opt.value ? 'var(--accent)' : 'var(--text)',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {q.type === 'chips' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {q.options?.map((opt) => {
                const selected = ((answers[q.id] as string[]) || []).includes(opt.value)
                return (
                  <Chip
                    key={opt.value}
                    label={opt.label}
                    selected={selected}
                    onClick={() => toggleChip(q.id, opt.value)}
                  />
                )
              })}
            </div>
          )}

          {q.type === 'text' && (
            <input
              value={(answers[q.id] as string) || ''}
              onChange={(e) => set(q.id, e.target.value)}
              placeholder={q.placeholder}
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '10px 14px',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          )}

          {q.type === 'textarea' && (
            <textarea
              value={(answers[q.id] as string) || ''}
              onChange={(e) => set(q.id, e.target.value)}
              placeholder={q.placeholder}
              rows={4}
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '10px 14px',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          )}
        </div>
      ))}

      {error && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ff4444' }}>{error}</div>
      )}

      <Button onClick={handleSubmit} size="lg">
        GENERATE MY PROJECT →
      </Button>
    </div>
  )
}
