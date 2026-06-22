# ADR-001: Four-Mode Architecture

**Date:** 2026-05-20  
**Status:** Implemented  
**Author:** Judith (Luchi) Ekeleme

---

## Context

The GenLayer ecosystem had an activation gap. Builders who discovered the protocol could not convert interest into shipped projects without deep familiarity with Python Intelligent Contracts, the GenLayer Studio environment, and the genlayer-js SDK. No single tool closed this gap end-to-end.

The Builder Companion was designed to solve this in one session — from zero context to a deployable artifact set.

---

## Decision

Ship four distinct modes in a single Next.js/TypeScript application, each targeting a specific builder state:

| Mode | Target builder state | Output |
|------|----------------------|--------|
| IDEATE | Has an interest, no idea | 5 validated project concepts with rationale |
| LEARN | Has questions, needs protocol context | Stateful chat scoped to a GenLayer topic |
| CONTRIBUTE | Wants to give back, doesn't know where | Curated open contribution paths |
| MISSIONS | Ready to build, needs a full scaffold | Complete deployable artifact set |

---

## MISSIONS Mode — The Core Deliverable

MISSIONS is the primary product. A builder selects a contribution track, picks an idea, answers a guided wizard, and receives six artifacts generated in parallel:

1. Python Intelligent Contract (GenLayer-native)
2. genlayer-js frontend integration
3. HTML prototype (single file, inline CSS/JS, no build step)
4. pytest-compatible test file for GenLayer Studio
5. Markdown content (documentation or research, depending on mission type)
6. README with Studio → Shipyard deployment steps

All six generate in one API call via OpenRouter (qwen3-coder-30b). The HTML prototype is export-ready for Netlify Drop or Vercel with no configuration.

Eight contribution tracks are supported: tutorial, minigame, projects, research, tools, community, documentation, educational.

---

## Model Stack

- **Groq / llama-3.3-70b-versatile** — IDEATE ideas generation and LEARN/chat modes. Fast, conversational, low latency.
- **OpenRouter / qwen/qwen3-coder-30b-a3b-instruct** — MISSIONS artifact generation and audit. Higher output quality for code generation. Thinking blocks stripped from output via regex before rendering.
- No backend persistence. No account required. All state is client-side within a session.

---

## Why This Architecture

A single chat interface would collapse the context separation each mode requires. LEARN needs full conversation history within a topic but resets on topic switch (React `key` prop). MISSIONS needs structured wizard input to generate coherent multi-artifact output. A monolithic chat loses both.

The four-mode split is the product. Each mode has one job.

---

## Security Boundary

The Anthropic/Groq/OpenRouter API keys live server-side only in `app/api/generate/route.ts`. The frontend never touches API keys directly. All model calls route through this single Next.js API route.
