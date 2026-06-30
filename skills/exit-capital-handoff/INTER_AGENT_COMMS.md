# Inter-Agent Communications

Current implementation:

- Server-side orchestration for live paths.
- Durable bus file: `data/agent-bus/messages.jsonl`.
- Discord HOME channel: `nemohermes` / `1521286176013815818`.
- Qdrant/audit log for durable memory.

Message envelope:

```json
{
  "id": "string",
  "at": "ISO-8601",
  "from": "research-intern|board|cfo|red-team-council|archivist|operator|brand|secretary",
  "to": "agent-or-role",
  "type": "research_brief|board_decision|red_team_report|archive_notice|spend_proposal|brand_brief|lesson",
  "payload": {},
  "status": "created|delivered|failed|archived",
  "delivery_target": "local|qdrant|discord|all"
}
```

Policy:

- Synchronous calls are used for decisions that block funding or scaling.
- Asynchronous calls are used for postmortems, daily scans, and brand/pitch refinement.
- Secretary/Mailman owns delivery state.
- Archivist owns durable memory.

Gap:

- The bus is append-only today. It does not yet have retries, acknowledgements, or a dashboard inbox.
