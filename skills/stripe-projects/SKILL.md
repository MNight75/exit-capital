---
name: stripe-projects
description: Use Stripe Projects for approval-gated provisioning proposals, test-mode readiness checks, dry-run SaaS/infrastructure provisioning, and audited execution when explicitly authorized.
---

# Stripe Projects Provisioning Skill

Use this skill when Exit Capital needs to provision infrastructure, SaaS, or paid services through Stripe Projects.

## Safety Rules

- Default to test mode and dry-run plans.
- Do not provision paid resources without explicit approval.
- Do not expose public URLs, connect production credentials, or store payment secrets unless the user explicitly asks.
- Prefer reversible, low-cost resources with hard spend caps.
- Every provisioning proposal must include provider, purpose, budget cap, data exposure, kill criteria, and cleanup command.

## Operating Pattern

1. Identify the resource needed by the venture.
2. Explain why the venture cannot proceed without it.
3. Produce a capped provisioning proposal.
4. Ask the board/CFO for approval.
5. Check Stripe Projects readiness.
6. Execute only after explicit approval.
7. Append a proof event to the Exit Capital audit pack.

## Demo Mode

For hackathon demo mode, use mock provisioning events until Stripe Projects credentials are configured. Do not claim a real SaaS resource was created.
