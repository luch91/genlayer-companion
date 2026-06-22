# ADR-002: 5-Point Security Audit as a Post-Generation Artifact

**Date:** 2026-05-29  
**Status:** Implemented  
**Author:** Judith (Luchi) Ekeleme

---

## Context

Builders generating Intelligent Contracts through MISSIONS mode had no way to evaluate the security posture of what they were about to deploy. Generic smart contract audit checklists don't map to GenLayer-specific risks. `gl.exec_prompt` prompt injection, `gl.get_webpage` content validation failures, and unbounded contract state are not covered by Solidity tooling.

---

## Decision

Add a post-generation audit flow to MISSIONS. After artifacts are generated, the builder is nudged to run an audit. A second API call fires against the generated contract and frontend, returning a structured 5-point report.

The audit runs on OpenRouter (qwen3-coder-30b) — same model as artifact generation — so it audits against the same GenLayer context it generated from.

---

## The 5 Audit Items

Each item is evaluated specifically against the builder's actual generated code, not generically.

| # | Risk | Trigger condition |
|---|------|-------------------|
| 1 | **Prompt injection** | Raw user input passed into `gl.exec_prompt` without sanitization or fixed instruction wrapping |
| 2 | **Hardcoded secrets** | API keys, wallet addresses, private endpoints, or bearer tokens in contract Python or frontend JS |
| 3 | **No frontend error handling** | `readContract`/`writeContract` calls without try/catch or user-facing error states |
| 4 | **`gl.get_webpage` with no content validation** | Raw response passed into logic with no structure check or fallback for unreachable/changed URLs |
| 5 | **Unbounded state growth** | Contract storage appends to lists/dicts with no pruning, cap, or pagination |

Item 1 (prompt injection) is flagged as the most critical risk unique to GenLayer Intelligent Contracts.

---

## Response Schema

The model returns structured JSON only — no markdown, no preamble:

```json
{
  "summary": "2-sentence plain English deploy verdict",
  "critical_count": 0,
  "deploy_verdict": "ready" | "caution" | "not ready",
  "top_three": [1, 2, 3],
  "findings": [
    {
      "id": 1,
      "label": "string",
      "severity": "critical" | "high" | "medium" | "low",
      "applies": true,
      "reason": "specific to their code",
      "fix": "concrete action or empty string"
    }
  ]
}
```

---

## UI

- `AuditReportPanel.tsx` renders the verdict (`READY TO DEPLOY` / `DEPLOY WITH FIXES` / `DO NOT DEPLOY YET`) with severity-coded colors
- "Fix these first" block surfaces the `top_three` findings
- Full findings list is collapsible — non-applicable items render at 40% opacity with a `✓ clear` badge
- Post-generation nudge in `ExportPanel.tsx` with a skip option

---

## Implementation Files

- `lib/prompts/audit.ts` — system prompt + user prompt builder
- `components/build/AuditReportPanel.tsx` — UI
- `types/index.ts` — `AuditFinding`, `AuditChecklist` types
- `app/api/generate/route.ts` — `type: "audit"` request handler
