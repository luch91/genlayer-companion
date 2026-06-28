# GenLayer Builder Companion

An AI-powered community tool for the GenLayer ecosystem. It guides builders from idea to deployable output — generating Intelligent Contracts, frontends, and content across multiple contribution tracks.

**Live:** https://buildercompanion.vercel.app

---

## What it does

The Builder Companion walks a user through five steps:

1. **Find an idea** — describe your own or let AI generate five tailored suggestions
2. **Customize** — answer mission-specific questions that shape the output
3. **Generate** — AI builds all artifacts in parallel (contract, frontend, test file, README, content)
4. **Review** — inspect the full generated output before moving forward
5. **Export** — run a 5-point security audit, preview in-browser, download as ZIP, deploy

---

## Contribution tracks

**Active — open now:**
- Projects & Milestones — the primary open track; showcase your project from MVP to growth milestones, earn rewards as you build. Requires a public GitHub repo link for Portal submission.

**Pending — greyed out until GenLayer publishes an active mission:**
- From Zero to GenLayer — end-to-end tutorial
- Mini-Games for Community — multiplayer on-chain game
- Research & Analysis
- Tools & Infrastructure
- Community & Growth
- Documentation
- Educational Content

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | React 19, Tailwind CSS v4 |
| AI — chat & ideas | Groq (llama-3.3-70b-versatile) |
| AI — build & audit | OpenRouter (qwen/qwen3-coder-30b-a3b-instruct) |
| Build export | JSZip |
| Persistence | Browser localStorage (no backend) |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/luch91/genlayer-companion.git
cd genlayer-companion
npm install
```

### 2. Set up environment variables

Create `.env.local` in the project root:

```
GROQ_API_KEY=your_groq_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

- **Groq** — free tier, get a key at [console.groq.com](https://console.groq.com)
- **OpenRouter** — pay-per-use, get a key at [openrouter.ai](https://openrouter.ai)

> Never commit `.env.local`. It is already in `.gitignore`.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
app/
  api/generate/route.ts     Single API route — handles all AI calls server-side
  layout.tsx
  page.tsx

components/
  build/
    BuildWizard.tsx          Five-step wizard (ideas → questions → generating → output → export)
    IdeaGenerator.tsx        AI idea generation UI
    QuestionForm.tsx         Mission-specific customization questions
    GeneratedOutput.tsx      Output viewer (contract, frontend, markdown, readme, test tabs) with per-artifact REGENERATE and inline contract EDIT
    ExportPanel.tsx          Download, preview, deploy, and audit
    AuditReportPanel.tsx     5-point audit results display

  chat/ChatPanel.tsx         AI chat sidebar (context-aware per mode)
  home/ModeGrid.tsx          Landing mode selector
  modes/                     ContributeMode, IdeateMode, LearnMode, MissionsMode
  layout/Header.tsx Footer.tsx
  ui/Button.tsx Chip.tsx LoadingDots.tsx

data/
  missions.ts                Mission definitions and open contribution tracks
  build-questions.ts         Per-mission customization questions
  contribute.ts              Contribution path data
  learn.ts                   Learning topics
  backgrounds.ts             User background options

lib/
  claude.ts                  Client-side fetch helpers (chatWithClaude, generateIdeas, buildDeliverable, runAudit, regenerateArtifact)
  storage.ts                 Build history storage (getBuildHistory, saveBuild, updateBuild, deleteBuild, timeAgo)
  prompts/
    base.ts                  GENLAYER_BASE_PROMPT — GenLayer API rules injected into every build
    audit.ts                 5-point audit prompt (getAuditPrompt)
    missions/                Per-mission system prompts (one file per track)
  export/
    netlify.ts               HTML download helper
    vercel.ts                Vercel export helper

types/index.ts               All shared TypeScript interfaces
```

---

## AI architecture

All AI calls are server-side only. The client never sees API keys.

```
Client → POST /api/generate → Groq or OpenRouter → response → client
```

The single route (`app/api/generate/route.ts`) handles four request types:

| type | provider | max tokens | purpose |
|---|---|---|---|
| `chat` | Groq | 1024 | Mode-aware AI chat |
| `ideas` | Groq | 2048 | Generate 5 tailored ideas |
| `build` | OpenRouter | 8192 per artifact | Generate all project artifacts in parallel |
| `audit` | OpenRouter | 4096 | Run 5-point pre-deploy security audit |

Build artifacts are generated in parallel — one OpenRouter call per artifact — then assembled into a `GeneratedOutput` object. Individual artifacts can also be regenerated in isolation without touching the rest of the build.

---

## The 5-point security audit

Before a user exports their build, they're prompted to run a pre-deploy security audit. The audit checks for five GenLayer-specific risks:

1. **Prompt injection** — raw user input passed into `gl.exec_prompt` without sanitization
2. **Hardcoded secrets** — API keys, wallet addresses, or tokens in contract source or frontend
3. **No frontend error handling** — `readContract`/`writeContract` calls without try/catch or user-facing error states
4. **Unvalidated `gl.get_webpage` responses** — raw external content passed into contract logic without structure checks or fallbacks
5. **Unbounded state growth** — contract storage that appends without any size cap, pruning, or pagination

Returns a verdict (`ready` / `caution` / `not ready`), a ranked list of top issues to fix, and all 5 findings with reasons and concrete fix actions referenced to the actual generated code.

---

## Build history

Completed builds are saved to `localStorage` automatically and displayed in a history panel on the Missions screen. Up to 5 builds are retained. Any session can be resumed with one click — the wizard reopens at the Output step with all generated artifacts restored.

- Storage key: `genlayer_build_history`
- Max entries: 5 (oldest removed when limit is exceeded)
- Expiry: 7 days per entry
- Scope: per browser / per device (no account required)
- Legacy migration: old `genlayer_last_build` key is automatically migrated on first load

---

## Export

The Export panel produces:

| File | Contents |
|---|---|
| `contract.py` | The Python Intelligent Contract |
| `app.js` | The JavaScript frontend |
| `index.html` | Minimal HTML shell |
| `preview.html` | Self-contained local preview (JS inlined) |
| `package.json` | Project metadata with `genlayer-js` dependency |
| `README.md` | Generated deployment guide |

Downloaded as `genlayer-project.zip`. The frontend preview runs in-browser via a blob URL iframe — always in demo mode regardless of whether a contract address has been entered (demo mode is intentional; real contract interaction requires a live deployment).

The frontend export card has two tabs:
- **Interactive Demo** — preview, copy `app.js`, and download the ZIP with the real contract address baked in
- **Hi-Fi Prototype** — preview and download the Figma-ready prototype HTML, with Figma import guide

After download, the panel walks the user through deploying with **Netlify Drop** (drag-and-drop, no account required) or **Vercel** (requires GitHub).

Deployment flow:
1. Deploy contract on [genshipyard.com](https://genshipyard.com)
2. Copy the contract address
3. Paste into the Export panel — the address is baked into `app.js` on download

For **Projects & Milestones** submissions, the export panel also shows a GitHub repository guide — a public GitHub repo link is the only required field for Portal submission. Live deployment, demo links, and Shipyard deployment links are optional extras that earn additional points.

---

## Security notes

- API keys (`GROQ_API_KEY`, `OPENROUTER_API_KEY`) are server-only environment variables — never imported in any client component
- All AI calls are proxied through `app/api/generate/route.ts`
- No external database or user accounts — no data leaves the browser except AI prompts sent server-side
- Never link to `gen-shipyard.vercel.app` — the correct URL is `genshipyard.com`

---

## Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```
