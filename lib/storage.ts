import type { BuildConfig, GeneratedOutput, SavedBuild } from '@/types'

const HISTORY_KEY = 'genlayer_build_history'
const LEGACY_KEY = 'genlayer_last_build'
const MAX_BUILDS = 5
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000

export function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.floor(ms / 60000)
  const h = Math.floor(ms / 3600000)
  const d = Math.floor(ms / 86400000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

function readRaw(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem(HISTORY_KEY)
    return []
  }
}

function migrateLegacy(): void {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      localStorage.removeItem(LEGACY_KEY)
      return
    }
    const age = Date.now() - new Date(parsed.savedAt).getTime()
    if (age < EXPIRY_MS && parsed.buildConfig && parsed.output) {
      const existing = readRaw()
      if (existing.length === 0) {
        const entry: SavedBuild = {
          id: String(new Date(parsed.savedAt).getTime()),
          savedAt: parsed.savedAt,
          missionId: parsed.buildConfig.missionId,
          label: parsed.buildConfig.idea?.title ?? parsed.buildConfig.missionId,
          buildConfig: parsed.buildConfig,
          output: parsed.output,
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify([entry]))
      }
    }
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    localStorage.removeItem(LEGACY_KEY)
  }
}

export function getBuildHistory(): SavedBuild[] {
  migrateLegacy()
  const all = readRaw()
  const now = Date.now()
  const fresh = all.filter((b) => now - new Date(b.savedAt).getTime() < EXPIRY_MS)
  if (fresh.length < all.length) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(fresh))
  }
  return fresh
}

export function saveBuild(buildConfig: BuildConfig, output: GeneratedOutput): string {
  const id = String(Date.now())
  try {
    const history = getBuildHistory()
    const entry: SavedBuild = {
      id,
      savedAt: new Date().toISOString(),
      missionId: buildConfig.missionId,
      label: buildConfig.idea?.title ?? buildConfig.missionId,
      buildConfig,
      output,
    }
    const updated = [entry, ...history].slice(0, MAX_BUILDS)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // storage failure is non-fatal
  }
  return id
}

export function updateBuild(id: string, output: GeneratedOutput): void {
  try {
    const history = getBuildHistory()
    const updated = history.map((b) =>
      b.id === id ? { ...b, output, savedAt: new Date().toISOString() } : b
    )
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // storage failure is non-fatal
  }
}

export function deleteBuild(id: string): void {
  try {
    const history = getBuildHistory()
    const updated = history.filter((b) => b.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // storage failure is non-fatal
  }
}
