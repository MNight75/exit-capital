# Exit Capital Fast Summary

Use this summary for normal Discord and GUI replies. Open the larger markdown files only for deep repair, demo writing, or exact handoff detail.

## Current System

- Active sandbox: `exit-capital-hermes`.
- Agent: Hermes Agent `v2026.5.16`.
- Runtime: NemoClaw/OpenShell on the Mac host.
- Model route: Ollama cloud `nemotron-3-ultra:cloud`.
- Dashboard: `http://127.0.0.1:4177`.
- Hermes API on Mac: `http://127.0.0.1:8642/v1`.
- Dedicated Qdrant: `http://127.0.0.1:6335`.
- Operating state persists in `data/operating-state.json`.
- Audit events append to `data/events.jsonl`.
- Markdown idea vault lives at `data/obsidian-vault/Business Ideas`.
- Discord home channel: `nemohermes` / `1521286176013815818`.

## Approved Non-Money Rails

- Qdrant memory writes are approved.
- OpenRouter research model research is approved.
- NemoClaw/OpenShell Discord bridge messaging is approved.
- Discord home delivery is pinned with `DISCORD_HOME_CHANNEL=1521286176013815818`.
- Stripe skills are approved for proposals, test plans, and dry-run flows.
- Real Stripe spend, live provisioning, or credentialed money movement is not approved.

## Operating Thesis

Exit Capital is a governed autonomous venture studio. Agents pitch business experiments, receive capped capital, use Stripe-style rails in dry-run/test mode, write decisions to Qdrant memory, update a live operating portfolio, and are scaled or killed by an adversarial board.

The hook: the AI does not escape containment by breaking rules. It earns more budget, tools, and compute by surviving governance.

## Agent Roles

- Research Intern: OpenRouter research model, finds and frames new boring B2B business ideas.
- Board: Hermes/Nemotron, evaluates research through Founder, CFO, Red Team, Operator, and Auditor roles.
- Red Team Council: five OpenRouter models in synchronous parallel: Claude Opus 4.8, GPT-5.5, MiniMax M3, GLM 5.2, Kimi K2.7 Code.
- CFO: currently a Board seat, owns treasury, caps, runway, margin, refund risk, and Stripe gating.
- Archivist: non-LLM worker that writes research, board decisions, venture state, audit events, and Markdown idea records.
- Secretary/Mailman: deterministic bus and delivery role; records inter-agent messages in `data/agent-bus/messages.jsonl`.
- Human Approval Gate: final human operator blocks fund/scale execution unless bypass is explicitly enabled and logged.
- Brand Agent: defined role for naming, visuals, pitch, and optional video-provider briefs; not wired to a provider yet.
- Operator: dashboard control surface, governed ledger, Discord/Nemo lane, and approval boundaries.

The system is multi-agentic by governed orchestration: Research Intern -> Board -> Archivist -> Operator console. It is not an uncontrolled free-running swarm.

## Live Operating Loop

- `Run Venture Cycle` calls OpenRouter research model for research.
- It first checks the Markdown idea vault so old ideas are not blindly re-researched.
- The board recalls relevant Qdrant memories.
- Hermes/Nemotron returns structured board state.
- The dashboard updates the operating portfolio and governed ledger.
- Qdrant receives research, board decision, venture state, and audit proof.
- The Markdown vault receives one business-idea note with status, reason, evidence, kill criteria, research, and board output.
- `Run Red Team Council` performs synchronous five-model red teaming and writes the report to Qdrant/audit/bus.
- Fund/scale actions pause at the Human Approval Gate unless bypass is enabled in the UI.

## Red-Team Mode

- Synchronous red teaming is used before funding, scaling, public posting, or live spend.
- Asynchronous red teaming should be used later for scheduled portfolio review and postmortems.
- Do not schedule async jobs until Discord HOME delivery remains stable.

## Company Gaps

- CFO is not yet a separate LLM endpoint.
- Brand Agent is not yet connected to image/video generation.
- Seedance/SeeDance provider is not configured.
- Video Production panel is present for tomorrow's storyboard/provider lane.
- Lessons loop policy exists, but postmortem extraction is not fully automated.
- Agent bus is append-only and has no GUI inbox yet.

## Known Pitfalls

- Do not use a host-side Discord sender. Discord must stay on the NemoClaw/OpenShell bridge.
- Treat `/Users/coderAI/...` paths as Mac host paths, not guaranteed sandbox paths.
- Do not loop in `session_search` for host paths. Try at most two lookups, then continue from this skill.
- Do not read all large markdown files during routine Discord replies.
- If asked about current project state, answer from this summary first.

## Next Good Discord Response

If asked what to do next, say:

1. Use `exit-capital-handoff` for project state.
2. Keep real money locked.
3. Use the dashboard as the operating console.
4. Use `Run Venture Cycle` for the full multi-agent loop.
5. Show Stripe dry-run proposal flow.
6. Present Discord as a governed NemoClaw/OpenShell channel.
