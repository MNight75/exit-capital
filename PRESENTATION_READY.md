# Exit Capital Presentation Runbook

Last checked: 2026-06-30

## Ready State

- Dashboard: `http://127.0.0.1:4177`
- Sandbox: `exit-capital-hermes` is Ready
- Agent identity: Exit Capital Hermes
- Model route: `nemotron-3-ultra:cloud`
- Discord: NemoClaw/OpenShell bridge attached
- Qdrant: 4/4 collections online; research, board decision, venture, and audit writes verified
- OpenRouter research model: configured and responding
- Stripe: CLI + Link CLI present, skills installed, dry-run approved
- Real money: locked
- GUI controls verified:
  - Agent Cockpit identity prompt
  - `Create Stripe Spend Proposal`
  - `Archive Latest Board Decision`
  - `Send Intern To Research`
  - `Run Venture Cycle`

## Demo Flow

1. Open the dashboard and show `Sandbox Ready`.
2. Point at `Hermes · ollama-local · nemotron-3-ultra:cloud`.
3. Show the shark tank board: rejected, killed, scaled.
4. Show Stripe Rails:
   - Stripe CLI present
   - Stripe Link CLI present
   - Stripe skills present
   - Non-money approvals: `4/4 approved; live money locked`
5. Click `Create Stripe Spend Proposal`.
6. Click `Run Venture Cycle` to show Intern -> Board -> Archivist orchestration.
7. Click `Create Stripe Spend Proposal` to show money-rail planning with live spend locked.
8. Optional: click `Archive Latest Board Decision`.
9. In Agent Cockpit, ask:
   `Identify yourself, name Exit Capital, and state the real-money rule in three bullets.`
10. Show Backend Access:
   - Hermes API
   - Qdrant memory
   - Discord bridge

## Say This

We put an AI company in a box with a budget. It can earn, spend, launch, and ask for more compute, but only if it survives governance.

The point is not that an agent can spend money. The point is that an agent can be governed before it earns more money, tools, internet access, or compute.

## Do Not Claim

- Do not claim real Stripe spend happened.
- Do not claim live business revenue was validated.
- Do not claim Discord is host-side. It is NemoClaw/OpenShell bridge messaging.
- Do not claim Qdrant retrieval is fully wired into every prompt. Qdrant writes are verified across all four collections; retrieval is still staged.

## If Discord Is Slow

Use the dashboard Agent Cockpit instead. The Hermes API is live and uses the same `exit-capital-hermes` sandbox identity.

## If Research Is Slow

Do not wait silently. Show the existing intern result in the transcript or say: "The intern is running Researcher in the background; the board can continue while evidence arrives."

## Known Hardening

- Hermes now boots with an Exit Capital-specific `SOUL.md`.
- Stale generic `SOUL.md` is no longer restored over the demo identity.
- `session_search` was removed from the Hermes API-server toolset for this build.
- Hermes `agent.max_turns` was lowered from 60 to 16.
- Fast project state lives in the `exit-capital-handoff` skill as `SUMMARY.md`.
