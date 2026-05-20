'use client'

import { useState } from 'react'
import type { MissionId } from '@/types'
import { MISSIONS_DATA, OPEN_CONTRIBUTIONS } from '@/data/missions'
import ChatPanel from '@/components/chat/ChatPanel'
import BuildWizard from '@/components/build/BuildWizard'

export default function MissionsMode() {
  const [selectedMissionId, setSelectedMissionId] = useState<MissionId | null>(null)
  const [buildMissionId, setBuildMissionId] = useState<MissionId | null>(null)

  const activeMission = MISSIONS_DATA.find((m) => m.id === selectedMissionId)
  const activeContrib = OPEN_CONTRIBUTIONS.find((c) => c.id === selectedMissionId)
  const seedMessage = activeMission?.chatSeed || activeContrib?.chatSeed

  if (buildMissionId) {
    return <BuildWizard missionId={buildMissionId} onClose={() => setBuildMissionId(null)} />
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

        <div style={{ marginBottom: '32px' }}>
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
            Active Missions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MISSIONS_DATA.map((mission) => (
              <div
                key={mission.id}
                style={{
                  background: selectedMissionId === mission.id ? 'var(--surface2)' : 'var(--surface)',
                  border: `1px solid ${selectedMissionId === mission.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '10px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setSelectedMissionId(mission.id === selectedMissionId ? null : mission.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                  <div>
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
                        marginRight: '8px',
                      }}
                    >
                      {mission.badge}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--muted)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {mission.subtitle}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    letterSpacing: '0.05em',
                    color: 'var(--text)',
                    marginBottom: '8px',
                  }}
                >
                  {mission.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                    marginBottom: '12px',
                  }}
                >
                  {mission.description}
                </div>

                {selectedMissionId === mission.id && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>REQUIREMENTS</div>
                      <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {mission.requirements.map((r, i) => (
                          <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
                      <span style={{ color: 'var(--accent)' }}>PRIZE —</span> {mission.prize}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setBuildMissionId(mission.id) }}
                      style={{
                        background: 'var(--accent)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--bg)',
                        cursor: 'pointer',
                        letterSpacing: '0.05em',
                        alignSelf: 'flex-start',
                      }}
                    >
                      START BUILDING →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--orange)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Open Contribution Tracks
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {OPEN_CONTRIBUTIONS.map((contrib) => (
              <div
                key={contrib.id}
                onClick={() => setSelectedMissionId(contrib.id === selectedMissionId ? null : contrib.id)}
                style={{
                  background: selectedMissionId === contrib.id ? 'var(--surface2)' : 'var(--surface)',
                  border: `1px solid ${selectedMissionId === contrib.id ? 'var(--orange)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--orange)', marginBottom: '6px' }}>
                  {contrib.title}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '10px' }}>
                  {contrib.description}
                </div>
                {selectedMissionId === contrib.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setBuildMissionId(contrib.id) }}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--orange)',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--orange)',
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                    }}
                  >
                    BUILD →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChatPanel
        mode="missions"
        seedMessage={seedMessage || "I'm your GenLayer build coach. Select a mission to get started, or ask me anything about the Builder Portal missions."}
      />
    </div>
  )
}
