---
name: exit-capital-deep-handoff
description: Use only to tell the user where the full Exit Capital markdown files live. Do not load full markdown into Discord turns.
---

# Exit Capital Deep Handoff

Use this skill only for deep documentation location requests. For normal Discord operation, use `exit-capital-handoff` and read `SUMMARY.md` instead.

Source-of-truth files live on the Mac host and in the Codex workspace, not inside this Hermes skill:

- Mac: `/Users/coderAI/nemo-boardroom-hackathon/app/EXIT_CAPITAL_CARRY_FORWARD.md`
- Mac: `/Users/coderAI/nemo-boardroom-hackathon/app/README.md`
- Mac: `/Users/coderAI/nemo-boardroom-hackathon/app/DEMO_SCRIPT.md`
- Windows: `C:\Users\maste\OneDrive\Documents\WSL\nemo-boardroom-hackathon\app\`

Latency rule:

- Do not search `/Users/coderAI/...` from inside the sandbox.
- Do not use `session_search` for these host files.
- If exact full-document content is required, ask the host/operator to use Codex or the dashboard handoff.
