'use client'

import { useState } from 'react'
import type { GeneratedOutput, BuildConfig, AuditChecklist } from '@/types'
import { downloadHTML } from '@/lib/export/netlify'
import { runAudit } from '@/lib/claude'
import Button from '@/components/ui/Button'
import LoadingDots from '@/components/ui/LoadingDots'
import AuditReportPanel from './AuditReportPanel'

interface ExportPanelProps {
  output: GeneratedOutput
  buildConfig: BuildConfig
  onBack: () => void
}

const HTML_SHELL = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GenLayer Project</title>
</head>
<body>
  <div id="root"></div>
  <script src="app.js"></script>
</body>
</html>`

const PACKAGE_JSON = JSON.stringify({
  name: 'genlayer-project',
  version: '1.0.0',
  description: 'An Intelligent Contract project built with GenLayer',
  scripts: { dev: 'npx serve .' },
  dependencies: { 'genlayer-js': 'latest' },
}, null, 2)

const NETLIFY_STEPS = [
  {
    step: 1,
    title: 'Find your ZIP in Downloads',
    body: 'Open your Downloads folder and locate genlayer-project.zip.',
  },
  {
    step: 2,
    title: 'Extract the folder',
    body: 'Windows: right-click the ZIP → "Extract All" → click Extract. Mac: double-click the ZIP. You now have a genlayer-project folder.',
  },
  {
    step: 3,
    title: 'Preview it first (optional)',
    body: 'Open the genlayer-project folder and double-click preview.html — your app opens instantly in the browser with no setup needed.',
  },
  {
    step: 4,
    title: 'Open Netlify Drop',
    body: 'Go to app.netlify.com/drop in your browser. You\'ll see a large drag-and-drop area.',
    url: 'https://app.netlify.com/drop',
    cta: 'Open Netlify Drop',
  },
  {
    step: 5,
    title: 'Drag the folder — not the ZIP',
    body: 'Drag your genlayer-project folder directly onto the Netlify Drop page. Important: drag the folder, not the .zip file.',
  },
  {
    step: 6,
    title: 'Your app is live',
    body: 'Netlify gives you an instant public URL like random-name-123.netlify.app. Copy it, share it, submit it.',
  },
]

const VERCEL_STEPS = [
  {
    step: 1,
    title: 'Push to GitHub first',
    body: 'Initialise a git repo inside your genlayer-project folder: git init → git add . → git commit -m "init" → push to a new GitHub repo.',
  },
  {
    step: 2,
    title: 'Connect to Vercel',
    body: 'Go to vercel.com, sign in with GitHub, click "Add New Project" and import your repo.',
    url: 'https://vercel.com/new',
    cta: 'Open Vercel',
  },
  {
    step: 3,
    title: 'Deploy with defaults',
    body: 'No build settings needed — leave everything as default and click Deploy. Vercel detects the static project automatically.',
  },
  {
    step: 4,
    title: 'Auto-deploys on every push',
    body: 'Every future git push to your repo triggers a new Vercel deploy automatically.',
  },
]

export default function ExportPanel({ output, buildConfig, onBack }: ExportPanelProps) {
  const [contractCopied, setContractCopied] = useState(false)
  const [contractAddress, setContractAddress] = useState('')
  const [markdownDownloaded, setMarkdownDownloaded] = useState(false)
  const [projectDownloaded, setProjectDownloaded] = useState(false)
  const [prototypeDownloaded, setPrototypeDownloaded] = useState(false)
  const [showVercel, setShowVercel] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [prototypeBlobUrl, setPrototypeBlobUrl] = useState<string | null>(null)
  const [showFrontendPreview, setShowFrontendPreview] = useState(false)
  const [frontendBlobUrl, setFrontendBlobUrl] = useState<string | null>(null)
  const [auditState, setAuditState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [auditChecklist, setAuditChecklist] = useState<AuditChecklist | null>(null)
  const [frontendView, setFrontendView] = useState<'demo' | 'prototype'>('demo')

  // — Prototype preview —
  function openPrototypePreview() {
    if (!output.prototype) return
    const url = URL.createObjectURL(new Blob([output.prototype], { type: 'text/html;charset=utf-8' }))
    setPrototypeBlobUrl(url)
    setShowPreview(true)
  }
  function closePrototypePreview() {
    setShowPreview(false)
    if (prototypeBlobUrl) { URL.revokeObjectURL(prototypeBlobUrl); setPrototypeBlobUrl(null) }
  }

  // — Frontend preview: always uses demo mode (CONTRACT_ADDRESS unreplaced) —
  function openFrontendPreview() {
    if (!output.frontend) return
    const previewHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview</title></head><body><div id="root"></div><script>
${output.frontend}
</script></body></html>`
    const url = URL.createObjectURL(new Blob([previewHtml], { type: 'text/html;charset=utf-8' }))
    setFrontendBlobUrl(url)
    setShowFrontendPreview(true)
  }
  function closeFrontendPreview() {
    setShowFrontendPreview(false)
    if (frontendBlobUrl) { URL.revokeObjectURL(frontendBlobUrl); setFrontendBlobUrl(null) }
  }

  function copyContract() {
    if (!output.contract) return
    navigator.clipboard.writeText(output.contract)
    setContractCopied(true)
    setTimeout(() => setContractCopied(false), 2000)
  }

  async function handleDownloadProject() {
    if (!output.frontend) return
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    const addr = contractAddress.trim()
    const js = addr ? output.frontend.replace(/CONTRACT_ADDRESS/g, addr) : output.frontend
    const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GenLayer Project — Local Preview</title>
</head>
<body>
  <div id="root"></div>
  <script>
${js}
  </script>
</body>
</html>`
    if (output.contract) zip.file('contract.py', output.contract)
    zip.file('app.js', js)
    zip.file('index.html', HTML_SHELL)
    zip.file('preview.html', previewHtml)
    zip.file('package.json', PACKAGE_JSON)
    if (output.readme) zip.file('README.md', output.readme)
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'genlayer-project.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setProjectDownloaded(true)
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

  async function handleRunAudit() {
    setAuditState('loading')
    try {
      const report = await runAudit(output, buildConfig)
      setAuditChecklist(report)
      setAuditState('done')
    } catch {
      setAuditState('idle')
    }
  }

  const locked = !!output.contract && !contractAddress.trim()

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

      {/* ── AUDIT NUDGE ── */}
      {auditState === 'idle' && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,107,53,0.3)',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: 'var(--orange)', flexShrink: 0 }}>
            ⚠
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
              Before you deploy
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
              Run a 25-point security audit on your build.
              Takes 15 seconds. Tells you exactly what to fix before you go live.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
            <Button variant="primary" onClick={handleRunAudit}>
              Run Security Audit
            </Button>
            <button
              style={{ background: 'none', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer', padding: 0 }}
              onClick={() => setAuditState('done')}
            >
              Skip, I know what I&apos;m doing
            </button>
          </div>
        </div>
      )}

      {/* ── AUDIT LOADING ── */}
      {auditState === 'loading' && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <LoadingDots />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', margin: 0, letterSpacing: '0.05em' }}>
            Auditing your contract and frontend...
          </p>
        </div>
      )}

      {/* ── AUDIT REPORT ── */}
      {auditState === 'done' && auditChecklist && (
        <AuditReportPanel report={auditChecklist} />
      )}

      {/* ── GITHUB SUBMISSION — Projects & Milestones only ── */}
      {buildConfig.missionId === 'projects' && (
        <ExportCard title="GITHUB REPOSITORY" badge="REQUIRED FOR SUBMISSION">
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.6 }}>
            A public GitHub repository is the only required field for your Projects &amp; Milestones submission. Reviewers read your code directly from the repo. Everything else below is optional but earns extra points.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { step: 1, title: 'Initialise a git repo', body: 'Inside your project folder: git init → git add . → git commit -m "init"' },
              { step: 2, title: 'Push to GitHub', body: 'Create a new public repo on github.com, then: git remote add origin <url> → git push -u origin main' },
              { step: 3, title: 'Copy your repo URL', body: 'Format: github.com/your-username/your-repo — paste this into the Portal submission form as the required field.' },
              { step: 4, title: 'Add optional extras for more points', body: 'Live deployment URL, demo link, or Shipyard deployment link are optional — each one tied directly to your project earns extra points.' },
            ].map(({ step, title, body }) => (
              <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)',
                  background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)',
                  borderRadius: '4px', padding: '2px 8px', minWidth: '28px',
                  textAlign: 'center', flexShrink: 0,
                }}>
                  {step}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', marginBottom: '2px' }}>{title}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </ExportCard>
      )}

      {/* ── INTELLIGENT CONTRACT ── */}
      {output.contract && (
        <ExportCard title="INTELLIGENT CONTRACT" badge="DEPLOY ON SHIPYARD">
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            Copy your contract code, then paste it into Shipyard to deploy on GenLayer.
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Button onClick={copyContract} variant="primary">
              {contractCopied ? 'COPIED!' : 'COPY CONTRACT'}
            </Button>
            <Button variant="secondary" onClick={() => window.open('https://genshipyard.com', '_blank')}>
              OPEN SHIPYARD →
            </Button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
            PASTE YOUR CONTRACT ADDRESS FROM SHIPYARD:
          </div>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            style={{
              width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '10px 14px', fontFamily: 'var(--font-mono)',
              fontSize: '12px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </ExportCard>
      )}

      {/* ── FRONTEND PROJECT ── */}
      {output.frontend && (
        <ExportCard title="FRONTEND" badge={output.prototype && frontendView === 'prototype' ? 'FIGMA-READY' : 'ZIP EXPORT'}>

          {/* View toggle — only shown when prototype is available */}
          {output.prototype && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
              {(['demo', 'prototype'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setFrontendView(view)}
                  style={{
                    background: frontendView === view ? 'rgba(0,229,160,0.08)' : 'none',
                    border: `1px solid ${frontendView === view ? 'rgba(0,229,160,0.4)' : 'var(--border)'}`,
                    borderRadius: '4px',
                    padding: '6px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: frontendView === view ? 'var(--accent)' : 'var(--muted)',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                  }}
                >
                  {view === 'demo' ? 'INTERACTIVE DEMO' : 'HI-FI PROTOTYPE'}
                </button>
              ))}
            </div>
          )}

          {/* ── Demo tab ── */}
          {(!output.prototype || frontendView === 'demo') && (
            <>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                Download your project as a ZIP — contains the Python contract, JavaScript frontend (app.js), HTML shell, and package.json. Push to GitHub and GitHub correctly shows Python + JavaScript.
              </div>

              {/* Address confirmation */}
              {output.contract && contractAddress.trim() && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
                  fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)',
                  background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)',
                  borderRadius: '6px', padding: '8px 12px',
                }}>
                  <span>✓</span>
                  <span>{contractAddress.trim().slice(0, 10)}...{contractAddress.trim().slice(-8)} — address will be baked into app.js</span>
                </div>
              )}

              {/* Locked notice — download/copy only */}
              {locked && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '16px' }}>
                  Preview runs in demo mode — paste your contract address above to unlock download and copy with your real address baked in.
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button variant="primary" onClick={openFrontendPreview}>
                  PREVIEW
                </Button>
                <Button
                  variant="secondary"
                  disabled={locked}
                  onClick={() => {
                    if (!output.frontend) return
                    const addr = contractAddress.trim()
                    const js = addr ? output.frontend.replace(/CONTRACT_ADDRESS/g, addr) : output.frontend
                    navigator.clipboard.writeText(js)
                  }}
                >
                  COPY app.js
                </Button>
                <Button variant="ghost" disabled={locked} onClick={handleDownloadProject}>
                  {projectDownloaded ? 'DOWNLOADED!' : 'DOWNLOAD PROJECT (ZIP)'}
                </Button>
              </div>

              {/* Post-download: Netlify steps */}
              {projectDownloaded && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '4px' }}>
                    DEPLOY WITH NETLIFY DROP
                  </div>
                  {NETLIFY_STEPS.map(({ step, title, body, url, cta }) => (
                    <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)',
                        background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)',
                        borderRadius: '4px', padding: '2px 8px', minWidth: '28px',
                        textAlign: 'center', flexShrink: 0,
                      }}>
                        {step}
                      </span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', marginBottom: '2px' }}>{title}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{body}</div>
                        {url && (
                          <Button variant="ghost" size="sm" style={{ marginTop: '6px' }} onClick={() => window.open(url, '_blank')}>
                            {cta} →
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Vercel advanced toggle */}
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={() => setShowVercel(!showVercel)}
                      style={{
                        background: 'none', border: 'none', fontFamily: 'var(--font-mono)',
                        fontSize: '11px', color: 'var(--muted)', cursor: 'pointer', letterSpacing: '0.05em',
                      }}
                    >
                      {showVercel ? '▼' : '▶'} VERCEL GUIDE (ADVANCED — REQUIRES GITHUB)
                    </button>
                    {showVercel && (
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {VERCEL_STEPS.map(({ step, title, body, url, cta }) => (
                          <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)',
                              border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 8px',
                              minWidth: '28px', textAlign: 'center', flexShrink: 0,
                            }}>
                              {step}
                            </span>
                            <div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', marginBottom: '2px' }}>{title}</div>
                              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{body}</div>
                              {url && (
                                <Button variant="ghost" size="sm" style={{ marginTop: '6px' }} onClick={() => window.open(url, '_blank')}>
                                  {cta} →
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Prototype tab ── */}
          {output.prototype && frontendView === 'prototype' && (
            <>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                A polished visual prototype — use it for pitching, stakeholder reviews, or import into Figma.
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button variant="primary" onClick={openPrototypePreview}>PREVIEW</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!output.prototype) return
                    downloadHTML(output.prototype, 'genlayer-prototype.html')
                    setPrototypeDownloaded(true)
                  }}
                >
                  {prototypeDownloaded ? 'DOWNLOADED!' : 'DOWNLOAD PROTOTYPE'}
                </Button>
              </div>

              {prototypeDownloaded && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em' }}>
                    IMPORT INTO FIGMA
                  </div>
                  {[
                    { step: 1, title: 'Open Figma', body: 'Go to figma.com and open or create a file.' },
                    { step: 2, title: 'Install the plugin', body: 'Search "HTML to Figma" in the Figma Community and install it (one-time setup).' },
                    { step: 3, title: 'Run the plugin', body: 'In your Figma file, go to Plugins → HTML to Figma → Run.' },
                    { step: 4, title: 'Upload your file', body: 'Choose "Upload HTML file" and select genlayer-prototype.html from your Downloads.' },
                    { step: 5, title: 'Edit in Figma', body: 'The plugin creates editable layers. Adjust colours, typography, and layout freely.' },
                  ].map(({ step, title, body }) => (
                    <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)',
                        background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)',
                        borderRadius: '4px', padding: '2px 8px', minWidth: '28px',
                        textAlign: 'center', flexShrink: 0,
                      }}>
                        {step}
                      </span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', marginBottom: '2px' }}>{title}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </ExportCard>
      )}

      {/* ── HI-FI PROTOTYPE ── */}
      {output.prototype && (
        <ExportCard title="HI-FI PROTOTYPE" badge="FIGMA-READY">
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            A polished visual prototype — use it for pitching, stakeholder reviews, or import into Figma.
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={openPrototypePreview}>PREVIEW</Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (!output.prototype) return
                downloadHTML(output.prototype, 'genlayer-prototype.html')
                setPrototypeDownloaded(true)
              }}
            >
              {prototypeDownloaded ? 'DOWNLOADED!' : 'DOWNLOAD PROTOTYPE'}
            </Button>
          </div>

          {prototypeDownloaded && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em' }}>
                IMPORT INTO FIGMA
              </div>
              {[
                { step: 1, title: 'Open Figma', body: 'Go to figma.com and open or create a file.' },
                { step: 2, title: 'Install the plugin', body: 'Search "HTML to Figma" in the Figma Community and install it (one-time setup).' },
                { step: 3, title: 'Run the plugin', body: 'In your Figma file, go to Plugins → HTML to Figma → Run.' },
                { step: 4, title: 'Upload your file', body: 'Choose "Upload HTML file" and select genlayer-prototype.html from your Downloads.' },
                { step: 5, title: 'Edit in Figma', body: 'The plugin creates editable layers. Adjust colours, typography, and layout freely.' },
              ].map(({ step, title, body }) => (
                <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)',
                    background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)',
                    borderRadius: '4px', padding: '2px 8px', minWidth: '28px',
                    textAlign: 'center', flexShrink: 0,
                  }}>
                    {step}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', marginBottom: '2px' }}>{title}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ExportCard>
      )}

      {/* ── CONTENT / DOCUMENTATION ── */}
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

      {/* ── FRONTEND PREVIEW MODAL ── */}
      {showFrontendPreview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
          <div style={{
            height: '52px', borderBottom: '1px solid var(--border)',
            background: 'rgba(9,19,28,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 20px', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', color: 'var(--accent)' }}>
                FRONTEND PREVIEW
              </span>
              {contractAddress.trim() && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>
                  ✓ {contractAddress.trim().slice(0, 10)}...{contractAddress.trim().slice(-8)}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Button variant="secondary" size="sm" onClick={handleDownloadProject}>DOWNLOAD ZIP</Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (!output.frontend) return
                  const addr = contractAddress.trim()
                  navigator.clipboard.writeText(addr ? output.frontend.replace(/CONTRACT_ADDRESS/g, addr) : output.frontend)
                }}
              >
                COPY app.js
              </Button>
              <button
                onClick={closeFrontendPreview}
                style={{
                  background: 'none', border: '1px solid var(--border)', borderRadius: '4px',
                  padding: '4px 10px', fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--muted)', cursor: 'pointer',
                }}
              >
                × CLOSE
              </button>
            </div>
          </div>
          <iframe src={frontendBlobUrl ?? undefined} title="Frontend Preview" style={{ flex: 1, border: 'none', width: '100%' }} />
        </div>
      )}

      {/* ── PROTOTYPE PREVIEW MODAL ── */}
      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
          <div style={{
            height: '52px', borderBottom: '1px solid var(--border)',
            background: 'rgba(9,19,28,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 20px', flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', color: 'var(--accent)' }}>
              PROTOTYPE PREVIEW
            </span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (!output.prototype) return
                  downloadHTML(output.prototype, 'genlayer-prototype.html')
                  setPrototypeDownloaded(true)
                }}
              >
                DOWNLOAD
              </Button>
              <button
                onClick={closePrototypePreview}
                style={{
                  background: 'none', border: '1px solid var(--border)', borderRadius: '4px',
                  padding: '4px 10px', fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--muted)', cursor: 'pointer',
                }}
              >
                × CLOSE
              </button>
            </div>
          </div>
          <iframe src={prototypeBlobUrl ?? undefined} title="Prototype Preview" style={{ flex: 1, border: 'none', width: '100%' }} />
        </div>
      )}
    </div>
  )
}

function ExportCard({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.06em', color: 'var(--text)' }}>
          {title}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)',
          background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)',
          padding: '2px 8px', borderRadius: '3px', letterSpacing: '0.08em',
        }}>
          {badge}
        </span>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  )
}
