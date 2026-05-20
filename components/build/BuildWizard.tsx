'use client'

import { useState } from 'react'
import type { MissionId, BuildStep, IdeaItem, GeneratedOutput } from '@/types'
import { buildDeliverable } from '@/lib/claude'
import IdeaGenerator from './IdeaGenerator'
import QuestionForm from './QuestionForm'
import GeneratedOutputView from './GeneratedOutput'
import ExportPanel from './ExportPanel'
import LoadingDots from '@/components/ui/LoadingDots'
import Button from '@/components/ui/Button'

interface BuildWizardProps {
  missionId: MissionId
  onClose: () => void
}

const STEP_LABELS: Record<BuildStep, string> = {
  ideas: 'FIND IDEA',
  questions: 'CUSTOMIZE',
  generating: 'GENERATING',
  output: 'YOUR BUILD',
  export: 'EXPORT',
}

export default function BuildWizard({ missionId, onClose }: BuildWizardProps) {
  const [step, setStep] = useState<BuildStep>('ideas')
  const [entryMode, setEntryMode] = useState<'choose' | 'generate' | 'direct' | null>(null)
  const [idea, setIdea] = useState<IdeaItem | null>(null)
  const [output, setOutput] = useState<GeneratedOutput | null>(null)
  const [error, setError] = useState('')

  async function handleAnswers(answers: Record<string, string | string[]>) {
    setStep('generating')
    setError('')
    try {
      const result = await buildDeliverable({ missionId, idea, answers })
      setOutput(result)
      setStep('output')
    } catch {
      setError('Generation failed. Please try again.')
      setStep('questions')
    }
  }

  const steps: BuildStep[] = ['ideas', 'questions', 'output', 'export']
  const stepIndex = steps.indexOf(step === 'generating' ? 'questions' : step)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
            }}
          >
            BUILD WIZARD
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {steps.map((s, i) => (
              <div
                key={s}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    color: i === stepIndex ? 'var(--accent)' : i < stepIndex ? 'var(--muted)' : 'var(--border)',
                    textDecoration: i < stepIndex ? 'line-through' : 'none',
                  }}
                >
                  {STEP_LABELS[s]}
                </span>
                {i < steps.length - 1 && (
                  <span style={{ color: 'var(--border)', fontSize: '10px' }}>›</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          × CLOSE
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {step === 'ideas' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '40px',
                letterSpacing: '0.06em',
                color: 'var(--text)',
                margin: '0 0 8px',
              }}
            >
              WHAT ARE YOU BUILDING?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginBottom: '32px', fontSize: '15px' }}>
              Have an idea already, or need help finding one?
            </p>

            {entryMode === null && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button size="lg" onClick={() => setEntryMode('direct')}>
                  I HAVE AN IDEA
                </Button>
                <Button size="lg" variant="secondary" onClick={() => setEntryMode('generate')}>
                  HELP ME DECIDE
                </Button>
              </div>
            )}

            {entryMode === 'direct' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>
                  Go straight to the customization questions →
                </p>
                <Button onClick={() => setStep('questions')}>CONTINUE TO QUESTIONS →</Button>
              </div>
            )}

            {entryMode === 'generate' && (
              <IdeaGenerator
                missionId={missionId}
                onSelect={(selected) => {
                  setIdea(selected)
                  setStep('questions')
                }}
              />
            )}
          </div>
        )}

        {step === 'questions' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '40px',
                letterSpacing: '0.06em',
                color: 'var(--text)',
                margin: '0 0 8px',
              }}
            >
              CUSTOMIZE YOUR BUILD
            </h2>
            {idea && (
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  marginBottom: '24px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--muted)',
                }}
              >
                <span style={{ color: 'var(--accent)' }}>IDEA —</span> {idea.title}
              </div>
            )}
            {error && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ff4444', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            <QuestionForm missionId={missionId} onSubmit={handleAnswers} />
          </div>
        )}

        {step === 'generating' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '48px',
                letterSpacing: '0.08em',
                color: 'var(--accent)',
              }}
            >
              GENERATING
            </div>
            <LoadingDots />
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--muted)',
                letterSpacing: '0.08em',
              }}
            >
              Claude is building your contract, frontend, and content...
            </div>
          </div>
        )}

        {step === 'output' && output && (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
            <GeneratedOutputView output={output} onContinue={() => setStep('export')} />
          </div>
        )}

        {step === 'export' && output && (
          <ExportPanel output={output} onBack={() => setStep('output')} />
        )}
      </div>
    </div>
  )
}
