---
name: stripe-link-cli
description: Use Stripe Link CLI for approval-gated agent spending, test-mode readiness checks, dry-run spend proposals, and audited purchase execution when explicitly authorized.
---

# Stripe Link CLI Spend Skill

Use this skill when Exit Capital needs to propose, approve, or execute agent spending through Stripe Link CLI.

## Safety Rules

- Default to dry-run planning unless the user explicitly authorizes a real Stripe action.
- Never create purchases, subscriptions, payment links, invoices, or outbound transfers without explicit user approval.
- Treat all Stripe keys, login links, customer data, payment methods, and account identifiers as secrets.
- If credentials are missing, return a readiness report and the exact next user action needed.
- Every proposed spend must include budget, vendor, reason, expected ROI, kill criteria, and rollback plan.

## Operating Pattern

1. Produce a spend proposal.
2. Ask the board/CFO for approval.
3. Check whether `link-cli` is installed.
4. If unauthenticated, request the user to authenticate Stripe Link CLI.
5. Execute only after explicit approval.
6. Append the action to the Exit Capital treasury/audit ledger.

## Demo Mode

For hackathon demo mode, report "Stripe Link CLI installed, dry-run only" when credentials are absent. Do not claim real spend occurred.
