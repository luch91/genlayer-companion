'use client'

import type { AuditChecklist } from '@/types'

const SEVERITY_COLOR = {
  critical: 'text-red-400',
  high:     'text-orange',
  medium:   'text-yellow-400',
  low:      'text-muted',
}

const VERDICT_CONFIG = {
  'ready':     { label: 'READY TO DEPLOY',   color: 'text-accent' },
  'caution':   { label: 'DEPLOY WITH FIXES', color: 'text-yellow-400' },
  'not ready': { label: 'DO NOT DEPLOY YET', color: 'text-red-400' },
}

export default function AuditReportPanel({ report }: { report: AuditChecklist }) {
  const verdict    = VERDICT_CONFIG[report.deploy_verdict]
  const applicable = report.findings.filter(f => f.applies)

  return (
    <div className="flex flex-col gap-4">

      {/* Verdict header */}
      <div className="flex items-center justify-between">
        <span className={`font-mono text-sm font-bold ${verdict.color}`}>
          {verdict.label}
        </span>
        <span className="font-mono text-xs text-muted">
          {applicable.length} of 25 risks apply to your build
        </span>
      </div>

      {/* Summary */}
      <p className="font-body text-sm text-text mt-3">
        {report.summary}
      </p>

      {/* Top 3 fixes */}
      {applicable.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 bg-surface rounded-lg p-4 border border-border">
          <p className="font-mono text-xs text-accent uppercase tracking-wider mb-2">
            Fix these first
          </p>
          {report.top_three.map(id => {
            const finding = report.findings.find(f => f.id === id)
            if (!finding) return null
            return (
              <div key={id} className="flex flex-col">
                <span className={`font-mono text-xs ${SEVERITY_COLOR[finding.severity]}`}>
                  [{finding.severity.toUpperCase()}]
                </span>
                <span className="font-mono text-xs text-text ml-2">
                  {finding.label}
                </span>
                <p className="font-body text-xs text-muted mt-1">
                  {finding.fix}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* All findings — collapsible */}
      <details className="mt-4">
        <summary className="font-mono text-xs text-muted cursor-pointer hover:text-text">
          View all 25 findings
        </summary>
        <div className="mt-3 space-y-2">
          {report.findings.map(finding => (
            <div
              key={finding.id}
              className={`flex flex-col py-2 border-b border-border last:border-0 ${!finding.applies ? 'opacity-40' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">
                  {String(finding.id).padStart(2, '0')}
                </span>
                <span className={`font-mono text-xs ${
                  finding.applies
                    ? SEVERITY_COLOR[finding.severity]
                    : 'text-muted line-through'
                }`}>
                  {finding.label}
                </span>
                {!finding.applies && (
                  <span className="font-mono text-xs text-accent">✓ clear</span>
                )}
              </div>
              {finding.applies && (
                <p className="font-body text-xs text-muted mt-1 ml-6">
                  {finding.reason} — {finding.fix}
                </p>
              )}
            </div>
          ))}
        </div>
      </details>

    </div>
  )
}
