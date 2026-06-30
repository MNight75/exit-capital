# Exit Capital

Exit Capital is an operating console for an autonomous venture studio with an adversarial board. Agents pitch business experiments, receive capped capital, launch inside a NemoClaw/OpenShell sandbox, and are scaled or killed by evidence.

The hook: what if the way an AI escapes the box is not by breaking containment, but by earning more budget, tools, and compute under governance?

## Current Runtime

- Mac host: `EchoFormAI.local`
- Sandbox: `exit-capital-hermes`
- NemoHermes: `v0.0.55`
- OpenShell: `0.0.44`
- Backend: Colima/Docker
- Model route: Ollama cloud `nemotron-3-ultra:cloud`
- Agent: Hermes Agent `v2026.5.16`
- Discord: NemoClaw/OpenShell channel bridge attached to the sandbox
- Stripe: CLI + Link CLI present, local Stripe skills installed, real spend locked
- Qdrant: dedicated Exit Capital instance on `127.0.0.1:6335`
- Orchestration: Research Intern -> Hermes Board -> Archivist -> Qdrant
- Red Team Council: Claude Opus 4.8, GPT-5.5, MiniMax M3, GLM 5.2, Kimi K2.7 Code via OpenRouter
- Inter-agent bus: `data/agent-bus/messages.jsonl`
- Markdown vault: `data/obsidian-vault/Business Ideas`
- Human gate: required before fund/scale execution, bypassable and logged
- Dashboard: `http://127.0.0.1:4177`

## Run

```sh
cd /Users/coderAI/nemo-boardroom-hackathon/app
npm start
```

## Check Nemo

```sh
nemohermes exit-capital-hermes status
```

## Stop Dashboard

```sh
kill $(cat /Users/coderAI/nemo-boardroom-hackathon/app/boardroom.pid)
```

## Sandbox Lane

```sh
nemohermes exit-capital-hermes status
nemohermes exit-capital-hermes connect
```

## Product Line

We put an AI company in a box with a capped treasury, Stripe rails, memory, and a hostile board. Its job is simple: earn the right to more budget, tools, and compute by surviving governance.

## What Is Real

- Live Hermes Agent API through NemoClaw/OpenShell at `127.0.0.1:8642`.
- Nemotron 3 Ultra route through Ollama.
- Discord policy/provider attached through NemoClaw/OpenShell, not a host-side sender.
- Qdrant memory writes from the dashboard.
- Venture cycle orchestration that checks the Markdown idea vault, asks Owl Alpha for a business idea or repair/pivot, recalls prior Qdrant memory, asks Hermes/Nemotron for a structured board decision, updates the operating portfolio and ledger, then archives research, decision, venture state, and audit event to Qdrant and Markdown.
- Stripe proposal workflow and installed Stripe skills.
- Exit Capital-specific Hermes identity baked into `SOUL.md`.

## Terms

- Research Intern: Owl Alpha/OpenRouter LLM that finds and frames ideas.
- Board: Hermes/Nemotron LLM that decides fund, reject, kill, or scale.
- Red Team Council: synchronous five-model adversarial review before high-stakes decisions.
- CFO: currently a board seat, owns budget caps and money gates; should become a separate endpoint before live Stripe.
- Archivist: deterministic server worker, not an LLM; writes Qdrant, audit log, and Markdown vault records.
- Secretary/Mailman: deterministic message router; owns Discord HOME and inter-agent bus delivery.
- Human Approval Gate: final human-in-the-loop; agents propose, the human authorizes execution unless bypass is explicitly enabled.
- Brand Agent: defined creative role for identity, pitch, and video briefs; provider not yet wired.
- Run Venture Cycle: check prior Markdown ideas, research one candidate, board it, update portfolio/ledger, then archive it.
- Run Red Team Council: send the current idea/portfolio to five models and archive the adversarial report.
- Video Production: dashboard lane for tomorrow's storyboard/provider work; Seedance/SeeDance provider is not wired yet.

## What Is Staged

- Treasury ledger values.
- Actual Stripe spend/provisioning.
- Business revenue validation.

## Presentation

Use `PRESENTATION_READY.md` for the final click path and claims checklist.
