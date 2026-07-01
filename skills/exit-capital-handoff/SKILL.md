---
name: exit-capital-handoff
description: Use for fast routine operation, explanation, repair triage, or demo guidance for the Exit Capital hackathon system. Provides the compact operational summary for the NemoClaw/Hermes/Stripe/Qdrant/Discord build.
---

# Exit Capital Handoff

Use this skill whenever the user asks about Exit Capital, the hackathon submission, NemoClaw/OpenShell, Hermes access, Discord bridge status, Qdrant memory, Stripe skills, Researcher, or the demo script.

Read this file for normal Discord/GUI operation:

- `SUMMARY.md` - fast operational state, approvals, known pitfalls, and demo next steps.
- `AGENT_RESEARCH_INTERN.md` - Researcher role and output contract.
- `AGENT_BOARD.md` - Hermes/Nemotron board role and structured decision contract.
- `AGENT_ARCHIVIST.md` - Qdrant memory and audit role.
- `AGENT_OPERATOR.md` - human-facing operating console and execution boundaries.
- `AGENT_CFO.md` - treasury, runway, margin, and Stripe gating.
- `AGENT_RED_TEAM_COUNCIL.md` - five-model adversarial council.
- `AGENT_SECRETARY_MAILMAN.md` - inter-agent messaging and delivery.
- `AGENT_BRAND.md` - brand/design/video direction.
- `AGENT_HUMAN_GATE.md` - final human approval and bypass policy.
- `LESSONS_LOOP.md` - how the company learns from wins/failures.
- `INTER_AGENT_COMMS.md` - message envelope and bus policy.
- `COMPANY_GAPS.md` - current red-team gap ledger.

If the user explicitly asks for the full markdown handoff, README, or demo script, use the separate `exit-capital-deep-handoff` skill instead of searching.

Important operating rules:

- Treat `exit-capital-hermes` as the active sandbox.
- Keep Discord on the NemoClaw/OpenShell bridge; do not use a host-side Discord sender.
- Qdrant memory writes, Researcher, Discord bridge messaging, and Stripe dry-run skill use are approved non-money rails.
- Real Stripe spend, live provisioning, or credentialed money movement remains locked unless the user explicitly approves money movement.
- Exit Capital is multi-agentic by governed orchestration: Research Intern -> Board -> Archivist -> Operator console. It is not an uncontrolled free-running swarm.
- Final human approval is required before fund/scale execution unless the operator explicitly enables bypass; bypass is logged.
- Do not claim real Stripe spend or live provisioning happened unless it actually did.
- Do not restart stale host-side Hermes gateways for this demo.

Search circuit breaker:

- Prefer these bundled skill files over `session_search` for Exit Capital state.
- If the user gives a path beginning with `/Users/coderAI/`, treat it as a Mac host path, not a guaranteed sandbox path.
- Do not spend more than two tool calls trying to resolve a host path from inside the sandbox.
- If a file/path lookup fails twice, stop searching and say what failed in one sentence.
- Then continue from `SUMMARY.md`.
- Never stay in `session_search` across multiple progress updates for a single missing file.
- If Discord reports `Still working` while `session_search` is active, summarize partial findings and ask the user whether to continue, instead of searching again.

Discord latency rule:

- For routine Discord answers, read only `SUMMARY.md` unless the user explicitly asks for the full handoff, README, or demo script.
- Do not read large markdown files in a routine Discord turn.
- Keep normal Discord responses under 8 bullets or under 250 words.
