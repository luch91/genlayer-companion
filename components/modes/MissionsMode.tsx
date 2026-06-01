'use client'

import { useState, useEffect } from 'react'
import type { MissionId, SavedBuild } from '@/types'
import { MISSIONS_DATA, OPEN_CONTRIBUTIONS } from '@/data/missions'
import { getBuildHistory, deleteBuild, timeAgo } from '@/lib/storage'
import ChatPanel from '@/components/chat/ChatPanel'
import BuildWizard from '@/components/build/BuildWizard'

const MISSION_LABELS: Record<string, string> = {
  tutorial:      'FEATURED',
  minigame:      'SPECIAL',
  projects:      'PROJECTS',
  research:      'RESEARCH',
  tools:         'TOOLS',
  community:     'COMMUNITY',
  documentation: 'DOCS',
  educational:   'EDUCATIONAL',
}

function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  const rotX = (y - 0.5) * -8
  const rotY = (x - 0.5) * 8
  el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
}

function handleTiltReset(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
}

export default function MissionsMode() {
  const [projectsSelected, setProjectsSelected] = useState(false)
  const [buildMissionId, setBuildMissionId] = useState<MissionId | null>(null)
  const [restoredBuild, setRestoredBuild] = useState<SavedBuild | null>(null)
  const [history, setHistory] = useState<SavedBuild[]>([])

  useEffect(() => {
    setHistory(getBuildHistory())
  }, [])

  const projectsContrib = OPEN_CONTRIBUTIONS.find((c) => c.id === 'projects')!

  const inactiveTracks: { id: string; title: string; description: string; badge: string | null }[] = [
    ...MISSIONS_DATA.map((m) => ({ id: m.id, title: m.title, description: m.description, badge: m.badge })),
    ...OPEN_CONTRIBUTIONS.filter((c) => c.id !== 'projects').map((c) => ({ id: c.id, title: c.title, description: c.description, badge: null })),
  ]

  if (buildMissionId) {
    return (
      <BuildWizard
        missionId={buildMissionId}
        restoredBuild={restoredBuild ?? undefined}
        onClose={() => {
          setBuildMissionId(null)
          setRestoredBuild(null)
          setHistory(getBuildHistory())
        }}
      />
    )
  }

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
          MISSIONS
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginBottom: '32px', fontSize: '15px' }}>
          Live Builder Portal missions — select one to plan and build your submission.
        </p>

        {/* Recent builds history */}
        {history.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Recent Builds
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((build) => (
                <div
                  key={build.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        color: 'var(--accent)',
                        border: '1px solid rgba(0,229,160,0.3)',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        flexShrink: 0,
                      }}
                    >
                      {MISSION_LABELS[build.missionId] ?? build.missionId.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'var(--text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {build.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--muted)',
                        flexShrink: 0,
                      }}
                    >
                      {timeAgo(build.savedAt)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        setRestoredBuild(build)
                        setBuildMissionId(build.missionId)
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(0,229,160,0.3)',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        letterSpacing: '0.05em',
                      }}
                    >
                      RESUME →
                    </button>
                    <button
                      onClick={() => {
                        deleteBuild(build.id)
                        setHistory(getBuildHistory())
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--muted)',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects & Milestones — always open, featured */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Open for Submission
          </div>

          <div
            onMouseMove={handleTilt}
            onMouseLeave={handleTiltReset}
            onClick={() => setProjectsSelected((v) => !v)}
            style={{
              background: projectsSelected ? 'rgba(14,29,42,0.9)' : 'rgba(9,19,28,0.72)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${projectsSelected ? 'var(--accent)' : 'rgba(0,229,160,0.3)'}`,
              borderRadius: '12px',
              padding: '28px 32px',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
              willChange: 'transform',
              boxShadow: projectsSelected
                ? '0 4px 32px rgba(0,229,160,0.12)'
                : '0 2px 24px rgba(0,229,160,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--bg)',
                  background: 'var(--accent)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  letterSpacing: '0.1em',
                }}
              >
                ACTIVE
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--muted)',
                  letterSpacing: '0.06em',
                }}
              >
                Open Contribution — Always Accepting Submissions
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px',
                letterSpacing: '0.05em',
                color: 'var(--text)',
                marginBottom: '10px',
              }}
            >
              Projects & Milestones
            </div>

            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--muted)',
                lineHeight: 1.6,
                marginBottom: projectsSelected ? '20px' : '0',
              }}
            >
              {projectsContrib.description}
            </div>

            {projectsSelected && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {projectsContrib.actions.map((a, i) => (
                    <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                      {a}
                    </li>
                  ))}
                </ul>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>SUBMISSION —</span> Start at MVP — rewards are earned incrementally as you hit each milestone on the Builder Portal
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setBuildMissionId('projects') }}
                  style={{
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px 28px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--bg)',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    alignSelf: 'flex-start',
                  }}
                >
                  START BUILDING →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mission-based tracks — informational only, not buildable */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Mission-Based Tracks
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 14px' }}>
            These tracks are not open for direct submission. GenLayer publishes specific missions for them when there is a concrete need — watch the Builder Portal for announcements.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {inactiveTracks.map((track) => (
              <div
                key={track.id}
                style={{
                  background: 'rgba(9,19,28,0.72)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '16px',
                  opacity: 0.5,
                  cursor: 'default',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>
                    {track.title}
                  </div>
                  {track.badge && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        flexShrink: 0,
                      }}
                    >
                      {track.badge}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {track.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChatPanel
        mode="missions"
        missionId={projectsSelected ? 'projects' : undefined}
        seedMessage={
          projectsSelected
            ? projectsContrib.chatSeed
            : "I'm your GenLayer build coach. Select Projects & Milestones to get started, or ask me anything about the Builder Portal."
        }
      />
    </div>
  )
}
