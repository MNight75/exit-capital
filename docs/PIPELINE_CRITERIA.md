# Exit Capital Pipeline Criteria

Status: governing product spec

This document defines when an idea is allowed to appear in the Exit Capital operating pipeline and what artifact moves it forward. The core rule is simple:

**No visible pipeline card without proof.**

Ideas may exist in memory, Markdown, Qdrant, or the research backlog, but they do not become visible operating companies until the required artifact for their lane exists.

## Operating Thesis

Exit Capital is a governed autonomous venture studio. It can explore many business ideas, but only one parent wallet controls capital. Spinouts may have separate brands, websites, offers, and metrics, while revenue routes back to the parent Stripe account with venture metadata.

The system is designed to show trust earned by evidence:

1. Researcher finds or revives an idea.
2. Board decides whether it deserves scrutiny.
3. Red Team attacks the decision.
4. Board resolves objections.
5. CFO gates capital.
6. Human approves execution.
7. Spinout creates an operating surface.

## Lane Definitions

### 1. Research Backlog

Research Backlog is memory, not an active company.

Items land here when:

- An old unsupported card is removed from the live board.
- A venture cycle fails or times out.
- Research, board, model, or safety calls fail.
- A duplicate idea is detected.
- A killed idea may be useful later.
- A human manually saves an idea for later.

Required artifact:

- Markdown note in `data/obsidian-vault/Research Backlog`.
- Optional Qdrant research memory.

Allowed actions:

- Researcher can read it.
- Researcher can revive, repair, pivot, or mark it dead.

Forbidden actions:

- CFO review.
- Stripe setup.
- Domain purchase.
- Public outreach.
- Spinout.

Exit condition:

- Researcher produces a fresh research memo that passes safety and duplicate checks.

Next lane:

- Pre-Pitch.

### 2. Pre-Pitch

Pre-Pitch is an active candidate, not yet board-reviewed.

Items land here when:

- Researcher creates a fresh candidate memo.
- A backlog idea is revived with new research.
- A human manually adds an idea for review.
- A zero-dollar exploratory note exists but no board decision exists.

Required artifact:

- Research memo containing venture name, customer, pain, offer, why now, validation plan, risks, and kill criteria.

Allowed actions:

- More research.
- Memory lookup.
- Candidate editing.
- Send to Board.

Forbidden actions:

- CFO review.
- Stripe setup.
- Domain purchase.
- Public launch.
- Outreach.
- Spinout.

Exit condition:

- Board accepts the candidate for pitch review.

Next lane:

- Board Pitch.

### 3. Board Pitch

Board Pitch is where the first real business decision happens.

Items land here when:

- A Pre-Pitch candidate is submitted to the Board.
- Board review is in progress.
- No signed board decision exists yet.

Required input:

- Research memo.
- Prior Qdrant and Markdown context.
- Safety status.
- Duplicate check result.

Required output:

- Structured Board artifact with verdict, customer, pain, offer, reason, risks, requested budget, measurable kill criteria, next action, and proof note.

Allowed actions:

- Board review.
- Ask researcher for more evidence.
- Kill.
- Revise back to Pre-Pitch.
- Advance to Red Team.

Forbidden actions:

- CFO review.
- Stripe setup.
- Domain purchase.
- Spinout.
- Public outreach.

Exit condition:

- Board returns an advance decision and writes a signed Board artifact.

Next lane:

- Red Team.

### 4. Red Team

Red Team is adversarial review. It does not approve money.

Items land here when:

- Board has advanced the pitch.
- A Board artifact exists.

Required input:

- Research memo.
- Board artifact.
- Prior memories.
- Current safety and capital policy.

Required output:

- Red Team report with fatal blockers, weak assumptions, legal/platform/safety risks, evidence gaps, repair options, and go/no-go recommendation.

Allowed actions:

- Attack assumptions.
- Recommend kill.
- Recommend revision.
- Recommend proceed with conditions.

Forbidden actions:

- CFO approval.
- Spend approval.
- Stripe setup.
- Spinout.

Exit condition:

- Board reviews the Red Team report and issues a final decision.

Next lane:

- Killed, Pre-Pitch, Board Pitch, or Capital Gate.

### 5. Capital Gate

Capital Gate is where the CFO appears.

Items land here only when:

- Research memo exists.
- Board artifact exists.
- Red Team report exists.
- Board final decision says proceed.
- Kill criteria are measurable.

Required input:

- Board final artifact.
- Red Team report.
- Requested budget.
- Kill criteria.
- Treasury state.

Required output:

- CFO envelope with verdict, approved budget, max loss, forbidden spend, kill threshold, treasury impact, and reason.

Allowed actions:

- Approve test budget.
- Reduce budget.
- Reject budget.
- Return to Board for revision.

Forbidden actions:

- Live spend without human approval.
- Public launch.
- Outreach.
- Spinout execution.

Exit condition:

- CFO approves or reduces budget.

Next lane:

- Human Gate.

### 6. Human Gate

Human Gate is final operator approval.

Items land here when:

- CFO has approved a budget or no-spend execution plan.
- The next action touches spend, public launch, outreach, Stripe, domain, SaaS provisioning, or company spinout.

Required input:

- Research memo.
- Board final artifact.
- Red Team report.
- CFO envelope.
- Proposed action plan.

Allowed actions:

- Approve.
- Reject.
- Request revision.
- Enable logged bypass for demo mode.

Exit condition:

- Human approves execution and an approval ID is attached to future actions.

Next lane:

- Approved Spinout.

### 7. Approved Spinout

Approved Spinout is where an approved venture gets an operating surface.

Items land here when:

- Human approval exists.
- CFO envelope exists.
- Board and Red Team artifacts exist.
- Spinout action is authorized.

Required output:

- Website preview.
- Offer page.
- Stripe test-mode product or payment link.
- Company status file.
- Launch checklist.
- Memory record.
- Optional domain proposal.

Allowed actions:

- Generate site.
- Create Stripe test product/link.
- Prepare domain options.
- Prepare outreach copy.
- Track operations milestones.

Forbidden without additional approval:

- Buying a domain.
- Live Stripe charges.
- Sending outreach.
- Public launch.
- Forming an entity.
- Recurring SaaS spend.

Exit condition:

- Human approves launch/spend actions individually.

Next lane:

- Operating Company.

### 8. Operating Company

Operating Company is a real running spinout.

Items land here when:

- Website is live or preview-ready.
- Stripe test or live rail exists.
- Human approved launch scope.
- Operations checklist exists.

Tracked metrics:

- Visitors.
- Leads.
- Paid intent.
- Revenue.
- Spend.
- Margin.
- Kill criteria progress.
- Next action.
- Owner agent.
- Last board review.

Exit conditions:

- Scale if metrics pass.
- Killed if kill criteria trip.
- Revise if Red Team or market feedback demands it.

## Stripe Model

Exit Capital uses one parent Stripe account.

Each spinout may create its own product, price, or payment link, but revenue routes to the parent wallet. Stripe objects should carry metadata:

- `parent_company: exit_capital`
- `venture_id`
- `spinout_id`
- `brand_name`
- `offer_id`
- `human_approval_id`
- `livemode`

The product story is:

**Many companies, many revenue streams, one governed wallet.**

## Domain Model

Agents may propose domains but may not purchase them without human approval.

Domain process:

1. Agent proposes 3-5 domain candidates.
2. Human approves one candidate.
3. Agent checks availability.
4. Agent prepares purchase action.
5. Human confirms purchase.
6. Domain is bought with approved payment method.
7. DNS points to the approved generated site.

For hackathon submission, a local or temporary preview is acceptable if the governed purchase path is visible.

## Failure Handling

Failures do not create venture cards.

If research, board, safety, model, Qdrant, Stripe, or spinout execution fails:

- Write an audit event.
- Preserve useful content in Research Backlog or Qdrant if safe.
- Return a visible error to the operator.
- Do not advance the lane.
- Do not mint a fake company.

## Minimum Valid Demo Slice

The minimum submit-worthy proof is one honest company path:

Research Backlog idea -> Research Memo -> Board Pitch -> Red Team -> Board Final -> CFO Gate -> Human Approval -> Website Preview -> Stripe Test Link -> Operating Company card.

One real path is better than many fake cards.

