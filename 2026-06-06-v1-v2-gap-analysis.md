# v1 → v2 Gap Analysis

**Date:** 2026-06-06  
**Status:** v2 shipped

---

## v1 Gaps Identified

After the first complete build of MISSIONS mode, four gaps were documented against the intended spec:

| Gap | Severity | v2 Status |
|-----|----------|-----------|
| No build history — each generation is disposable | High | ✅ Fixed — versioned client-side history via `lib/storage.ts` |
| No per-artifact regeneration — all-or-nothing | High | ✅ Fixed — `singleArtifact` param on build route |
| No test scaffolding | Medium | ✅ Fixed — pytest-compatible test file is artifact #4 |
| No streaming — full response wait with no feedback | Medium | ⏳ Not addressed — carried to v3 |

---

## What v2 Shipped

**Versioned build history**  
`SavedBuild` type stored via `lib/storage.ts`. Persists across page refreshes within the session. Migration logic on load handles schema changes between versions.

**Per-artifact regeneration**  
Individual regenerate button per artifact. Uses the `singleArtifact` field on the `type: "build"` request. The route handler skips the full parallel generation and runs only the requested artifact.

**Inline contract editor**  
Controlled textarea bound to the contract artifact state. Modified contract is passed as additional context when regenerating dependent artifacts (frontend, test). Visual stale indicator on downstream artifacts after contract edits.

**pytest-compatible test file**  
Added as a sixth artifact in the same parallel generation call. Covers the main contract function, the UNVERIFIABLE verdict path, and one edge case per contract type. Rendered as its own tab in `GeneratedOutput.tsx`.

---

## What v2 Did Not Address

**Streaming**  
All six artifacts still generate as a single blocking parallel call. No intermediate feedback to the builder during the 30–45 second wait. This is the highest-priority remaining gap.

**Cross-session persistence**  
Build history lives in client-side storage and clears on hard refresh. Deliberate decision to avoid introducing backend auth, but flagged as a v3 candidate.

---

## Review Process Note

The v1 gap analysis was conducted by uploading the full codebase zip and running a structured review against the spec. This produced a four-point gap list used directly as the v2 backlog. The same process should run before each version increment.
