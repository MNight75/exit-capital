# Lessons Loop

Purpose: make Exit Capital get smarter instead of simply accumulating transcripts.

Current stores:

- Qdrant collections for research, board decisions, venture state, and audit events.
- Markdown idea vault at `data/obsidian-vault/Business Ideas`.
- Operating event log at `data/events.jsonl`.
- Agent bus at `data/agent-bus/messages.jsonl`.

Learning rule:

Every killed, rejected, funded, or scaled idea must leave behind:

- what was believed
- what evidence changed the belief
- why the decision happened
- what would make the idea worth revisiting
- what pattern should influence future research

Required status vocabulary:

- `new`
- `fund`
- `scale`
- `kill`
- `reject`
- `revise`
- `parked`

Next implementation:

- Add a postmortem step after each kill/reject.
- Add a weekly async red-team review.
- Add a retrieval pass that extracts lessons, not just similar text.
