'use client'

import { useState } from 'react'
import type { GeneratedOutput } from '@/types'
import { downloadHTML, NETLIFY_STEPS } from '@/lib/export/netlify'
import { VERCEL_STEPS } from '@/lib/export/vercel'
import Button from '@/components/ui/Button'

interface ExportPanelProps {
  output: GeneratedOutput
  onBack: () => void
}

export default function ExportPanel({ output, onBack }: ExportPanelProps) {
  const [contractCopied, setContractCopied] = useState(false)
  const [markdownDownloaded, setMarkdownDownloaded] = useState(false)
  const [htmlDownloaded, setHtmlDownloaded] = useState(false)
  const [showVercel, setShowVercel] = useState(false)

  function copyContract() {
    if (!output.contract) return
    navigator.clipboard.writeText(output.contract)
    setContractCopied(true)
    setTimeout(() => setContractCopied(false), 2000)
  }

  function handleDownloadHTML() {
    if (!output.frontend) return
    downloadHTML(output.frontend)
    setHtmlDownloaded(true)
  }

  function handleDownloadMarkdown() {
    if (!output.markdown) return
    const blob = new Blob([output.markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'genlayer-content.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setMarkdownDownloaded(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          ← BACK
        </button>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '0.06em', color: 'var(--text)', margin: 0 }}>
          EXPORT
        </h3>
      </div>

      {output.contract && (
        <ExportCard title="INTELLIGENT CONTRACT" badge="DEPLOY ON SHIPYARD">
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            Copy your contract code, then paste it into GenShipyard to deploy on GenLayer.
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button onClick={copyContract} variant="primary">
              {contractCopied ? 'COPIED!' : 'COPY CONTRACT'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open('https://genshipyard.com', '_blank')}
            >
              DEPLOY ON SHIPYARD →
            </Button>
          </div>
          <div
            style={{
              marginTop: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--muted)',
              lineHeight: 1.6,
            }}
          >
            After deploying: copy your contract address and paste it into the frontend HTML where it says{' '}
            <code style={{ color: 'var(--accent)' }}>CONTRACT_ADDRESS</code>.
          </div>
        </ExportCard>
      )}

      {output.frontend && (
        <ExportCard title="FRONTEND" badge="NETLIFY DROP">
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            Download your self-contained HTML file and drag it onto Netlify Drop for an instant live URL.
          </div>
          <Button onClick={handleDownloadHTML} variant="primary">
            DOWNLOAD HTML
          </Button>

          {htmlDownloaded && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {NETLIFY_STEPS.map((step) => (
                <div key={step.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                      background: 'rgba(0,229,160,0.1)',
                      border: '1px solid rgba(0,229,160,0.25)',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      minWidth: '28px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {step.step}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', marginBottom: '2px' }}>
                      {step.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                      {step.description}
                    </div>
                    {'url' in step && step.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ marginTop: '6px' }}
                        onClick={() => window.open(step.url, '_blank')}
                      >
                        {(step as { cta: string }).cta} →
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '12px' }}>
            <button
              onClick={() => setShowVercel(!showVercel)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--muted)',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {showVercel ? '▼' : '▶'} VERCEL GUIDE (ADVANCED)
            </button>

            {showVercel && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {VERCEL_STEPS.map((step) => (
                  <div key={step.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        minWidth: '28px',
                        textAlign: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {step.step}
                    </span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', marginBottom: '2px' }}>
                        {step.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                        {step.description}
                      </div>
                      {'url' in step && step.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ marginTop: '6px' }}
                          onClick={() => window.open((step as { url: string }).url, '_blank')}
                        >
                          {(step as { cta: string }).cta} →
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ExportCard>
      )}

      {output.markdown && (
        <ExportCard title="CONTENT / DOCUMENTATION" badge="MARKDOWN">
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            Download your generated content as Markdown or copy to clipboard.
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={handleDownloadMarkdown} variant="primary">
              {markdownDownloaded ? 'DOWNLOADED!' : 'DOWNLOAD .MD'}
            </Button>
            <Button variant="ghost" onClick={() => navigator.clipboard.writeText(output.markdown || '')}>
              COPY
            </Button>
          </div>
        </ExportCard>
      )}
    </div>
  )
}

function ExportCard({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.06em', color: 'var(--text)' }}>
          {title}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--accent)',
            background: 'rgba(0,229,160,0.1)',
            border: '1px solid rgba(0,229,160,0.25)',
            padding: '2px 8px',
            borderRadius: '3px',
            letterSpacing: '0.08em',
          }}
        >
          {badge}
        </span>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  )
}
