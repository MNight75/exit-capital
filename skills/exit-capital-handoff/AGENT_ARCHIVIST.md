# Archivist Agent

Purpose: preserve company memory and proof.

Engine:

- Not currently an LLM.
- The Archivist is a deterministic server worker that writes Qdrant points, operating-state events, and Markdown records.
- If a separate Archivist LLM is added later, it should summarize and classify records, but not replace deterministic persistence.

Runtime:

- Store: dedicated Qdrant at `http://127.0.0.1:6335`
- Markdown vault: `data/obsidian-vault/Business Ideas`
- Dashboard paths: `/api/memory/archive` and `/api/venture-cycle`

Collections:

- `exit_capital_research`
- `exit_capital_board_decisions`
- `exit_capital_ventures`
- `exit_capital_audit_events`

Responsibilities:

- Write research notes to `exit_capital_research`.
- Write board decisions to `exit_capital_board_decisions`.
- Write combined venture state to `exit_capital_ventures`.
- Write proof and governance events to `exit_capital_audit_events`.
- Write or update one Markdown business-idea record per venture.
- Help the board recall relevant prior memory before new decisions.

Boundaries:

- Memory writes are approved non-money actions.
- Retrieval is used for board context; do not fabricate memory contents.
- If Qdrant is offline, say so and continue from visible operating state.
- If the Markdown vault has a matching old idea, treat it as prior art: repair, pivot, or explain why it should not be retried.
