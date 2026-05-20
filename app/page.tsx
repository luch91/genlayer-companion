'use client'

import { useState } from 'react'
import type { Mode } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ModeGrid from '@/components/home/ModeGrid'
import IdeateMode from '@/components/modes/IdeateMode'
import LearnMode from '@/components/modes/LearnMode'
import ContributeMode from '@/components/modes/ContributeMode'
import MissionsMode from '@/components/modes/MissionsMode'

export default function Home() {
  const [mode, setMode] = useState<Mode>('home')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header mode={mode} onHome={() => setMode('home')} />
      <main style={{ flex: 1 }}>
        {mode === 'home' && <ModeGrid onSelect={setMode} />}
        {mode === 'ideate' && <IdeateMode />}
        {mode === 'learn' && <LearnMode />}
        {mode === 'contribute' && <ContributeMode />}
        {mode === 'missions' && <MissionsMode />}
      </main>
      <Footer />
    </div>
  )
}
