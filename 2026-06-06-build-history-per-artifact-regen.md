# ADR-003: Build History and Per-Artifact Regeneration

**Date:** 2026-06-06  
**Status:** Implemented (v2)  
**Author:** Judith (Luchi) Ekeleme

---

## Context

v1 of MISSIONS mode had no state between generations. A builder who ran MISSIONS and wanted to tweak one artifact had to regenerate the entire set. There was also no record of past builds within a session.

Two gaps identified in the v1 review:
1. No build history — each generation was disposable
2. No per-artifact regeneration — all-or-nothing output

---

## Decision

### Build History

Client-side build history stored in `lib/storage.ts`. Each saved build (`SavedBuild` type) stores:

- `id` — unique build identifier
- `savedAt` — timestamp
- `missionId` — which contribution track
- `label` — human-readable build name
- `buildConfig` — full wizard inputs (idea, answers)
- `output` — all six generated artifacts

Versioned schema with migration logic on load to handle future shape changes.

### Per-Artifact Regeneration

Each artifact in `GeneratedOutput.tsx` gets an individual regenerate button. Clicking it sends a `type: "build"` request with `singleArtifact` set to that artifact's key. The route handler in `route.ts` checks for `singleArtifact` and runs only that one generation call instead of the full parallel set.

The inline contract editor (controlled textarea) allows builders to modify the Intelligent Contract directly. Edited contract state is passed as context when regenerating dependent artifacts (frontend, test).

---

## Route Handler Pattern

```typescript
if (body.type === 'build') {
  const { buildConfig, singleArtifact } = body
  const artifacts = singleArtifact
    ? [singleArtifact]
    : getMissionArtifacts(buildConfig.missionId)
  // runs only the requested artifact(s)
}
```

Full parallel generation for fresh builds. Single artifact call for regeneration. Same endpoint, same prompt logic.

---

## What v2 Did Not Address

- **Streaming** — still single-response per artifact. Full parallel generation can take 30–45 seconds with no intermediate feedback. Highest-priority gap for v3.
- **Cross-session persistence** — build history is session-scoped. Hard refresh clears it. By design (no backend, no auth) but flagged for v3.
- **Multi-build comparison** — no side-by-side view. Low priority.
