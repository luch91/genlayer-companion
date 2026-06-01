'use client'

import { useState } from 'react'
import type { BuildConfig, GeneratedOutput } from '@/types'
import { regenerateArtifact } from '@/lib/claude'
import Button from '@/components/ui/Button'

interface GeneratedOutputProps {
  output: GeneratedOutput
  buildConfig: BuildConfig
  onOutputChange: (updated: GeneratedOutput) => void
  onContinue: () => void
}

type Tab = 'contract' | 'frontend' | 'content' | 'readme' | 'test'

const tabToArtifact: Record<Tab, string> = {
  contract: 'contract',
  frontend: 'frontend',
  content: 'markdown',
  readme: 'readme',
  test: 'test',
}

export default function GeneratedOutputView({ output, buildConfig, onOutputChange, onContinue }: GeneratedOutputProps) {
  const allTabs: { id: Tab; label: string; content?: string }[] = [
    { id: 'contract' as Tab, label: 'CONTRACT', content: output.contract },
    { id: 'frontend' as Tab, label: 'FRONTEND', content: output.frontend },
    { id: 'content' as Tab, label: 'CONTENT', content: output.markdown },
    { id: 'readme' as Tab, label: 'README', content: output.readme },
    { id: 'test' as Tab, label: 'TEST FILE', content: output.test },
  ]
  const tabs = allTabs.filter((t) => !!t.content)

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]?.id || 'contract')
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState<Tab | null>(null)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')

  const activeContent = tabs.find((t) => t.id === activeTab)?.content || ''

  function copyContent() {
    navigator.clipboard.writeText(activeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleEditSave() {
    onOutputChange({ ...output, contract: editContent })
    setEditing(false)
  }

  function handleEditCancel() {
    setEditing(false)
    setEditContent('')
  }

  async function handleRegenerate() {
    if (regenerating) return
    setRegenerating(activeTab)
    try {
      const partial = await regenerateArtifact(buildConfig, tabToArtifact[activeTab])
      const updated: GeneratedOutput = { ...output }
      if (partial.contract !== undefined) updated.contract = partial.contract
      if (partial.frontend !== undefined) updated.frontend = partial.frontend
      if (partial.prototype !== undefined) updated.prototype = partial.prototype
      if (partial.markdown !== undefined) updated.markdown = partial.markdown
      if (partial.readme !== undefined) updated.readme = partial.readme
      if (partial.test !== undefined) updated.test = partial.test
      onOutputChange(updated)
    } catch {
      // existing content stays intact on failure
    } finally {
      setRegenerating(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', height: '100%' }}>
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowPreview(false); setEditing(false); setEditContent('') }}
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
          {activeTab === 'frontend' && output.frontend && !editing && (
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? 'CODE' : 'PREVIEW'}
            </Button>
          )}
          {!editing && (
            <Button variant="ghost" size="sm" onClick={copyContent}>
              {copied ? 'COPIED!' : 'COPY'}
            </Button>
          )}
          {activeTab === 'contract' && !editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setEditContent(activeContent); setEditing(true) }}
            >
              EDIT
            </Button>
          )}
          {editing && (
            <>
              <Button variant="ghost" size="sm" onClick={handleEditCancel}>
                CANCEL
              </Button>
              <Button variant="ghost" size="sm" onClick={handleEditSave}>
                SAVE
              </Button>
            </>
          )}
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating !== null}
            >
              {regenerating === activeTab ? '...' : 'REGENERATE'}
            </Button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {activeTab === 'contract' && editing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            spellCheck={false}
            style={{
              display: 'block',
              width: '100%',
              minHeight: '480px',
              height: '100%',
              margin: 0,
              padding: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text)',
              lineHeight: 1.7,
              background: 'rgba(0,229,160,0.02)',
              border: 'none',
              borderLeft: '2px solid rgba(0,229,160,0.3)',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
        ) : activeTab === 'frontend' && showPreview && output.frontend ? (
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
