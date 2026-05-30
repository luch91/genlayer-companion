'use client'

import { useState, useEffect } from 'react'
import type { MissionId, BuildStep, IdeaItem, GeneratedOutput, BuildConfig } from '@/types'
import { buildDeliverable } from '@/lib/claude'
import IdeaGenerator from './IdeaGenerator'
import QuestionForm from './QuestionForm'
import GeneratedOutputView from './GeneratedOutput'
import ExportPanel from './ExportPanel'
import LoadingDots from '@/components/ui/LoadingDots'
import Button from '@/components/ui/Button'

const STORAGE_KEY = 'genlayer_last_build'
const MAX_AGE_MS  = 7 * 24 * 60 * 60 * 1000

interface SavedBuild {
  output: GeneratedOutput
  buildConfig: BuildConfig
  savedAt: string
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m  = Math.floor(ms / 60000)
  const h  = Math.floor(ms / 3600000)
  const d  = Math.floor(ms / 86400000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

interface BuildWizardProps {
  missionId: MissionId
  onClose: () => void
}

const GENERATING_MESSAGES: Record<MissionId, string> = {
  minigame:       'Claude is building your contract, frontend, and content...',
  projects:       'Claude is building your contract, frontend, and content...',
  tools:          'Claude is building your contract, frontend, and content...',
  tutorial:       'Claude is writing your tutorial and building the demo contract...',
  research:       'Claude is writing your research paper...',
  community:      'Claude is building your community contribution plan...',
  documentation:  'Claude is writing your documentation...',
  educational:    'Claude is building your educational content...',
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
  const [customIdeaText, setCustomIdeaText] = useState('')
  const [output, setOutput] = useState<GeneratedOutput | null>(null)
  const [buildConfig, setBuildConfig] = useState<BuildConfig | null>(null)
  const [savedBuild, setSavedBuild]   = useState<SavedBuild | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: SavedBuild = JSON.parse(raw)
      if (Date.now() - new Date(parsed.savedAt).getTime() > MAX_AGE_MS) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      setSavedBuild(parsed)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  function handleRestore() {
    if (!savedBuild) return
    setOutput(savedBuild.output)
    setBuildConfig(savedBuild.buildConfig)
    setIdea(savedBuild.buildConfig.idea)
    setStep('output')
  }

  async function handleAnswers(answers: Record<string, string | string[]>) {
    setStep('generating')
    setError('')
    try {
      const config: BuildConfig = { missionId, idea, answers }
      setBuildConfig(config)
      const result = await buildDeliverable(config)
      setOutput(result)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ output: result, buildConfig: config, savedAt: new Date().toISOString() }))
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

            {savedBuild && entryMode === null && (
              <div style={{
                background: 'var(--surface)',
                border: '1px solid rgba(0,229,160,0.2)',
                borderRadius: '8px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.1em', margin: '0 0 4px' }}>
                    RESUME LAST BUILD — {timeAgo(savedBuild.savedAt)}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text)', margin: 0 }}>
                    {savedBuild.buildConfig.idea?.title ?? savedBuild.buildConfig.missionId}
                  </p>
                </div>
                <Button variant="secondary" onClick={handleRestore}>
                  RESUME →
                </Button>
              </div>
            )}

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
                  Describe your idea — the more detail you give, the better your build will be.
                </p>
                <textarea
                  value={customIdeaText}
                  onChange={(e) => setCustomIdeaText(e.target.value)}
                  placeholder="e.g. A prediction market where users bet on real-world sports outcomes. The contract fetches live scores using gl.get_webpage and validators settle disputes automatically..."
                  rows={5}
                  style={{
                    width: '100%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--text)',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    lineHeight: 1.6,
                  }}
                />
                <Button
                  onClick={() => {
                    const trimmed = customIdeaText.trim()
                    if (!trimmed) return
                    setIdea({
                      title: trimmed.length > 60 ? trimmed.slice(0, 60).trimEnd() + '…' : trimmed,
                      description: trimmed,
                      contract: '',
                      difficulty: 'intermediate',
                    })
                    setStep('questions')
                  }}
                  disabled={!customIdeaText.trim()}
                >
                  CONTINUE TO QUESTIONS →
                </Button>
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
              position: 'relative',
              overflow: 'hidden',
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '15%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 70%)', filter: 'blur(48px)', animation: 'gl-float 9s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '65%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'gl-float-alt 11s ease-in-out infinite', pointerEvents: 'none' }} />

            {/* Expanding rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  border: '1px solid rgba(0,229,160,0.25)',
                  animation: 'gl-generating-ring 2.4s ease-out infinite',
                  animationDelay: `${i * 0.8}s`,
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Particles */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: '38%',
                  left: `${43 + i * 2.5}%`,
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'gl-particle 2.2s ease-in-out infinite',
                  animationDelay: `${i * 0.38}s`,
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Content */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '56px',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  animation: 'gl-pulse-glow 2.5s ease-in-out infinite',
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
                {GENERATING_MESSAGES[missionId]}
              </div>
            </div>
          </div>
        )}

        {step === 'output' && output && (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
            <GeneratedOutputView output={output} onContinue={() => setStep('export')} />
          </div>
        )}

        {step === 'export' && output && buildConfig && (
          <ExportPanel output={output} buildConfig={buildConfig} onBack={() => setStep('output')} />
        )}
      </div>
    </div>
  )
}
