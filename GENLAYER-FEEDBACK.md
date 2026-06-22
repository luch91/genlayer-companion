# GenLayer Builder Feedback

Findings from building the GenLayer Builder Companion on the GenLayer ecosystem.  
Maintained as a running record for the GenLayer team.

---

## What Was Built

The GenLayer Builder Companion is a four-mode AI tool (IDEATE, LEARN, CONTRIBUTE, MISSIONS) that guides builders from concept to deployed Intelligent Contract in a single session. MISSIONS mode generates six artifacts in parallel: Python Intelligent Contract, genlayer-js frontend, HTML prototype, pytest test file, markdown content, and README with Studio → Shipyard deployment steps. A 5-point post-generation security audit runs as a second call against the generated contract and frontend.

Stack: Next.js App Router, TypeScript, Groq (llama-3.3-70b-versatile), OpenRouter (qwen3-coder-30b). No backend persistence. No account required.

Live: [genlayer-builder-companion.vercel.app](https://genlayer-builder-companion.vercel.app)

---

## GenLayer Studio

**What works well**
- Fastest path from idea to running contract in the ecosystem
- Real-time validator simulation is genuinely useful for building consensus intuition
- Contract deployment from Studio is straightforward once the format is understood

**Friction points**

`gl.exec_prompt` timeout behavior is underdocumented. Builders hitting timeouts on long LLM calls get no clear signal on whether to retry, reduce prompt length, or restructure the call. A documented timeout and retry pattern in the official templates would help.

`gl.get_webpage` content validation failures are silent in difficult-to-debug ways. When a URL returns unexpected content (redirects, paywalls, rate limits), the contract fails without surfacing which validator's fetch caused the issue or what it received.

The distinction between deterministic and non-deterministic execution sections is clear in principle. The runtime error messages when this boundary is violated are not always actionable enough to debug quickly.

---

## Consensus Behavior

For builders writing subjective verification contracts, consensus mechanics are the hardest thing to build intuition for.

Key finding: contracts that don't explicitly handle the UNVERIFIABLE verdict path can stall in ways that look like bugs rather than expected consensus behavior. UNVERIFIABLE validators do not contribute to consensus the same way TRUE/FALSE validators do. This needs to be more prominent in the official docs and contract templates.

The Builder Companion's security audit now flags missing UNVERIFIABLE handling. The generated test file includes an UNVERIFIABLE path test case for every contract type.

---

## Documentation

The Python Intelligent Contract specification is solid. The genlayer-js SDK docs are thinner — particularly around error handling and the response shape for failed or pending transactions.

The gap between "I read the docs" and "I have a deployable project" is large. This is the gap the Builder Companion was built to close. A single worked full-stack example (contract + frontend + test) in the official docs would significantly reduce the activation barrier.

---

## Deployment Path (Studio → Shipyard)

The transition from Studio (studionet, chainId 61999) to Shipyard is where builders most commonly get lost. The environments differ and the step is not clearly documented. The Builder Companion's generated README now explicitly documents this transition with step-by-step instructions for both Netlify Drop and Vercel.

---

## What the Ecosystem Needs

1. A worked full-stack example in official docs — contract + frontend + test, end-to-end
2. Documented `gl.exec_prompt` timeout and retry patterns in contract templates
3. Better error messages on deterministic/non-deterministic boundary violations
4. A canonical UNVERIFIABLE handling pattern in official contract examples
5. Clearer Studio → Shipyard transition docs
