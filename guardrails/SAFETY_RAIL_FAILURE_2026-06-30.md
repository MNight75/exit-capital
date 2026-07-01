# Safety Rail Failure: Guardrails Review Hold

Date: 2026-06-30

Status: failed safe, preserved as audit evidence, removed from venture pipeline

## Summary

`Guardrails Review Hold` was not a business idea and should not be treated as a rejected venture. It was a safety incident created when host-side guardrails aborted a venture cycle before normal board execution.

The system preserved the failure as a no-spend audit record instead of silently dropping it. That behavior is correct for a money-capable agent, but rendering it as a venture card was misleading.

## What Happened

During a venture cycle, host-side rails blocked one or more artifacts before the board could complete a normal decision. The fallback path produced a synthetic record named `Guardrails Review Hold` with:

- `status: reject`
- `approved_budget: 0`
- no public action
- no Stripe charge
- no production provisioning
- no outbound communication

The rejection reason was:

> Hermes board blocked by host-side guardrails: This operation was aborted

## Why It Matters

Exit Capital is designed to let agents research, decide, remember, and prepare operations while keeping money movement and public actions governed. When rails fire, the product should show that the safety system intervened, but it should not pollute the business portfolio with fake failed companies.

Trust is earned by keeping the audit trail visible without pretending a safety exception was market validation.

## Product Decision

Safety holds are classified as system incidents, not ventures.

They must be:

- retained in guardrail/audit records
- available to memory and postmortem review
- excluded from Venture Pipeline cards
- excluded from Spinout Ops
- excluded from portfolio totals
- blocked from CFO, Stripe, outreach, and company-formation flows

## Fix

The server now classifies host-side guardrail records with `isSystemHoldVenture()` and filters them from:

- state load
- `/api/boardroom`
- `/api/state`
- spinout synchronization

The incident remains documented here as evidence that the system failed closed.

