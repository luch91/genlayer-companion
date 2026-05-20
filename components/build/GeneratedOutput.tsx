'use client'

import { useState } from 'react'
import type { GeneratedOutput } from '@/types'
import Button from '@/components/ui/Button'

interface GeneratedOutputProps {
  output: GeneratedOutput
  onContinue: () => void
}

type Tab = 'contract' | 'frontend' | 'content' | 'readme'

export default function GeneratedOutputView({ output, onContinue }: GeneratedOutputProps) {
  const allTabs: { id: Tab; label: string; content?: string }[] = [
    { id: 'contract' as Tab, label: 'CONTRACT', content: output.contract },
    { id: 'frontend' as Tab, label: 'FRONTEND', content: output.frontend },
    { id: 'content' as Tab, label: 'CONTENT', content: output.markdown },
    { id: 'readme' as Tab, label: 'README', content: output.readme },
  ]
  const tabs = allTabs.filter((t) => !!t.content)

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]?.id || 'contract')
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)

  const activeContent = tabs.find((t) => t.id === activeTab)?.content || ''

  function copyContent() {
    navigator.clipboard.writeText(activeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', height: '100%' }}>
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowPreview(false) }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', padding: '6px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {activeTab === 'frontend' && output.frontend && (
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? 'CODE' : 'PREVIEW'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={copyContent}>
            {copied ? 'COPIED!' : 'COPY'}
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {activeTab === 'frontend' && showPreview && output.frontend ? (
          <iframe
            srcDoc={output.frontend}
            style={{ width: '100%', height: '500px', border: 'none', background: '#fff' }}
            sandbox="allow-scripts"
            title="Frontend preview"
          />
        ) : (
          <pre
            style={{
              margin: 0,
              padding: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'transparent',
            }}
          >
            {activeContent}
          </pre>
        )}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <Button onClick={onContinue} size="lg" style={{ width: '100%' }}>
          CONTINUE TO EXPORT →
        </Button>
      </div>
    </div>
  )
}
