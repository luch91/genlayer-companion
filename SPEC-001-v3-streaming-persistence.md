# SPEC-001: v3 — Streaming + Cross-Session Persistence

**Date:** 2026-06-22  
**Status:** Planned  
**Author:** Judith (Luchi) Ekeleme

---

## Problem

Two gaps remain from v2 that affect builder experience directly:

1. **No streaming** — MISSIONS generation takes 30–45 seconds with no intermediate feedback. No signal that anything is happening. Abandonment risk is high.
2. **Session-only history** — Build history clears on hard refresh. Builders who return to the tool lose previous builds.

---

## v3 Scope

### 1. Streaming MISSIONS Generation

Stream each artifact as it completes rather than waiting for the full parallel set.

**Approach:**
- Switch the MISSIONS build route to a `ReadableStream` response
- Parse artifact boundaries from the stream (delimiter-based or structured JSON streaming)
- Render each artifact in the UI as its stream completes
- Show per-artifact loading state until that artifact arrives

**Expected result:** First artifact visible within 5–8 seconds. Builder sees progress. Full set arrives progressively.

**Risk to manage:** The audit call currently fires after full generation completes and needs the full contract artifact as input. Streaming changes this sequencing — the audit trigger needs to wait for the contract artifact stream to close before firing, not for the full generation set.

---

### 2. Cross-Session Persistence

Persist build history across hard refreshes without introducing user accounts.

**Option A — localStorage with manual export**  
Keep localStorage as the store. Add "Export history" (downloads JSON) and "Import history" (restores from file). No backend. Builder manages their own state file.

**Option B — Supabase anonymous sessions**  
Use Supabase anonymous auth for a persistent session ID. Store build history in a Supabase table keyed to the anonymous ID. Survives hard refresh and browser restarts. No user account required.

**Recommendation:** Option B. Solves the actual problem without requiring the builder to manage export files. The project already uses Supabase for the relay function on Shipyard — the infrastructure pattern is established.

---

## Out of Scope for v3

- Multi-build comparison view
- Collaborative/shared sessions
- Direct GenLayer Studio deployment integration

---

## Success Criteria

- [ ] First artifact visible within 8 seconds of generation start
- [ ] All six artifacts render progressively — no single blocking wait
- [ ] Build history survives hard refresh
- [ ] Audit flow still triggers correctly after contract artifact stream closes
- [ ] No regression on per-artifact regeneration or inline contract editor
