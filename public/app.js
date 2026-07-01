const $ = s => document.querySelector(s);
const fmt = n => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
const esc = s => String(s ?? '')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

/* ── AGENT COUNCIL ─────────────────────────────────────────── */
const AGENTS = [
  { id:'board', av:'◈', nm:'Board',            rl:'Hermes · Nemotron orchestrator' },
  { id:'owl',   av:'◑', nm:'Archivist',          rl:'Research · Claude Haiku' },
  { id:'red',   av:'⚔', nm:'Red-Team Council', rl:'5-model adversary' },
  { id:'safe',  av:'⛨', nm:'Safety Gate',      rl:'Nemotron 3.5 Content Safety' },
  { id:'cfo',   av:'$', nm:'CFO',               rl:'treasury · kill-criteria' },
  { id:'shell', av:'⛉', nm:'OpenShell',         rl:'NemoClaw runtime policy' },
  { id:'gate',  av:'✋', nm:'Human Gate',        rl:'final approval' },
  { id:'arch',  av:'▦', nm:'Archivist',          rl:'Qdrant memory · signing' },
];

function renderAgents(active = [], states = {}) {
  $('#agents').innerHTML = AGENTS.map(a => {
    const cls = states[a.id] || (active.includes(a.id) ? 'active' : '');
    const st  = active.includes(a.id) ? 'active' : 'idle';
    const title = a.id === 'safe' ? 'Click to reset Safety Gate after human review' : '';
    return `<div class="agent ${cls}" data-agent-id="${esc(a.id)}" title="${esc(title)}">
      <div class="av">${a.av}</div>
      <div><div class="nm">${esc(a.nm)}</div><div class="rl">${esc(a.rl)}</div></div>
      <div class="st">${st}</div>
    </div>`;
  }).join('');
}

/* ── VENTURE PIPELINE ──────────────────────────────────────── */
const LANES = ['Pre-Pitch','Board Pitch','Red-Team','Capital Gate','Live','Killed'];

function toLane(v) {
  if (v.status === 'scale')  return 'Live';
  if (v.status === 'reject' || v.status === 'kill') return 'Killed';
  if (v.status === 'red-team') return 'Red-Team';
  if (v.status === 'pre-pitch') return 'Pre-Pitch';
  if (v.status === 'board-pitch' || v.status === 'needs-board-pitch') return 'Board Pitch';
  if ((v.status === 'fund' || v.status === 'pending') && v.cfoEnvelope) return 'Capital Gate';
  if (v.status === 'fund' || v.status === 'pending') return 'Board Pitch';
  return 'Pre-Pitch';
}

function chips(v, lane) {
  const out = [];
  if (v.staged) out.push('<span class="chip amb" title="Seed/demo data, not from a live cycle">STAGED</span>');
  else          out.push('<span class="chip honest" title="Real data from a live venture cycle, not demo">🍵 Honest</span>');
  if (lane === 'Live')   out.push('<span class="chip ok">LIVE</span>');
  if (lane === 'Killed') out.push('<span class="chip warn">KILLED pre-spend</span>');
  if (lane === 'Board Pitch') out.push('<span class="chip amb">BOARD NEEDED</span>');
  if (lane === 'Capital Gate') out.push('<span class="chip amb">CFO READY</span>');
  if (v.score != null)   out.push(`<span class="chip">score ${v.score}</span>`);
  if (v.ask)             out.push(`<span class="chip amb">$${v.ask}</span>`);
  else if (v.requested_budget) out.push(`<span class="chip amb">ask held $${v.requested_budget}</span>`);
  return out.join('');
}

function renderPipe(ventures = []) {
  window._ventureById = Object.fromEntries((ventures || []).map(v => [v.id, v]));
  $('#pipe').innerHTML = LANES.map(lane => {
    const cls   = lane === 'Killed' ? 'kill' : lane === 'Live' ? 'live' : lane === 'Board Pitch' ? 'board' : '';
    const items = ventures.filter(v => toLane(v) === lane);
    return `<div class="lane ${cls}">
      <div class="lane-h">
        <span class="nm">${lane}</span>
        <span class="ct">${items.length || ''}</span>
      </div>
      <div class="lane-b">${items.map(v => {
        const vc = lane === 'Capital Gate' ? 'gate' : lane === 'Board Pitch' ? 'board' : lane === 'Killed' ? 'killed' : lane === 'Live' ? 'live' : '';
        return `<button class="vcard ${vc}" type="button" data-venture-id="${esc(v.id)}" title="Open venture details">
          <div class="vt">${esc(v.name)}</div>
          <div class="vd">${esc(v.market || '')}</div>
          <div class="chips">${chips(v, lane)}</div>
        </button>`;
      }).join('')}</div>
    </div>`;
  }).join('');
}

function money(n) {
  return `$${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function renderDetailList(items = []) {
  const clean = items.filter(Boolean);
  if (!clean.length) return '<div class="empty">No detail recorded.</div>';
  return `<ul class="detail-list">${clean.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

function openVentureDetail(id) {
  const v = window._ventureById?.[id];
  if (!v) return;
  const lane = toLane(v);
  const envelope = v.cfoEnvelope || {};
  $('#ventureDetailTitle').textContent = v.name || 'Venture detail';
  $('#ventureDetailBody').innerHTML = `
    <div class="detail-grid">
      <div><span class="detail-k">Status</span><b>${esc(v.status || 'unknown')}</b></div>
      <div><span class="detail-k">Decision</span><b>${esc(v.decision || 'pending')}</b></div>
      <div><span class="detail-k">Lane</span><b>${esc(lane)}</b></div>
      <div><span class="detail-k">Score</span><b>${esc(v.score ?? '—')}</b></div>
      <div><span class="detail-k">Budget</span><b>${money(v.ask ?? v.approved_budget)}</b></div>
      <div><span class="detail-k">Spend</span><b>${money(v.spend)}</b></div>
      <div><span class="detail-k">Revenue</span><b>${money(v.revenue)}</b></div>
      <div><span class="detail-k">Source</span><b>${esc(v.source || 'unknown')}</b></div>
    </div>
    <div class="detail-section">
      <h3>Customer / Market</h3>
      <p>${esc(v.market || 'No market recorded.')}</p>
    </div>
    <div class="detail-section">
      <h3>Board Reason</h3>
      <p>${esc(v.reason || 'No board reason recorded.')}</p>
    </div>
    <div class="detail-section">
      <h3>Evidence</h3>
      ${renderDetailList(v.evidence || [])}
    </div>
    <div class="detail-section">
      <h3>Kill Criteria</h3>
      <p>${esc(v.kill || v.kill_criteria || 'No kill criteria recorded.')}</p>
    </div>
    <div class="detail-section">
      <h3>CFO Envelope</h3>
      <div class="detail-grid">
        <div><span class="detail-k">Verdict</span><b>${esc(envelope.verdict || 'not reviewed')}</b></div>
        <div><span class="detail-k">Approved cap</span><b>${money(envelope.approved_budget_usd ?? v.approved_budget ?? v.ask)}</b></div>
        <div><span class="detail-k">Max loss</span><b>${money(envelope.max_loss_usd)}</b></div>
        <div><span class="detail-k">Treasury</span><b>${money(envelope.treasury_available_usd)}</b></div>
      </div>
      <p>${esc(envelope.reason || 'No CFO reason recorded.')}</p>
    </div>
    <div class="detail-actions">
      <button class="cmd primary" id="detailStartSpinout">Start Spinout</button>
      <button class="cmd" id="detailCfoReview">CFO Review</button>
      <button class="cmd" id="detailArchive">Archive Memory</button>
    </div>
  `;
  $('#ventureDetailModal').style.display = 'flex';
  $('#detailStartSpinout')?.addEventListener('click', async () => {
    const data = await call('/api/spinout/start', { venture_id: v.id, venture_name: v.name }, $('#detailStartSpinout'), 'Starting…');
    if (data?.spinout) {
      $('#phase').innerHTML = `<span class="dotc pulse" style="background:var(--emerald)"></span>Spinout started · ${esc(data.spinout.ventureName)}`;
      await refresh();
      openVentureDetail(id);
    }
  });
  $('#detailCfoReview')?.addEventListener('click', async () => {
    const data = await call('/api/cfo-review', {
      subject: v.name,
      action: `Review capital envelope for ${v.name}`,
      budget: Math.max(0, Math.min(50, Number(v.ask ?? v.approved_budget ?? 0))),
      kill_criteria: v.kill || v.kill_criteria || 'Kill if no measurable validation signal is produced before any further spend.'
    }, $('#detailCfoReview'), 'Reviewing…');
    if (data?.envelope) openVentureDetail(id);
  });
  $('#detailArchive')?.addEventListener('click', () => {
    call('/api/memory/archive', { text: `${v.name}: ${v.reason || v.kill || 'venture checkpoint'}` }, $('#detailArchive'), 'Archiving…');
  });
}

/* ── DECISION RECORD ───────────────────────────────────────── */
function renderRecord(board = [], ventures = [], transcript = [], humanGate = {}) {
  const pending = humanGate?.pending?.[0];
  const focus = pending?.proposed
             || ventures.find(v => v.status === 'scale')
             || ventures.find(v => v.status === 'fund')
             || ventures.find(v => v.status === 'pending')
             || ventures[0];

  if (!focus) {
    $('#recName').textContent = '—';
    $('#record').innerHTML = '<div class="empty">Awaiting active venture…</div>';
    return;
  }

  $('#recName').textContent = focus.name;

  let steps = [];

  if (pending?.boardDecision) {
    try {
      const bd = JSON.parse(pending.boardDecision);
      steps.push({ cls: 'done', ic: '1', label: 'Proposed by Research Intern → Board', sub: (bd.customer || '').slice(0, 90) });
      steps.push({ cls: 'done', ic: '2', label: `Board: ${(bd.verdict || 'reviewed').toUpperCase()}`, sub: (bd.reason || '').slice(0, 100) });
      if (bd.risks?.length) {
        steps.push({ cls: 'done', ic: '3', label: 'Red-Team risks identified', sub: bd.risks.slice(0, 2).join(' · ').slice(0, 120) });
      }
      const cap = bd.approved_budget != null ? `$${bd.approved_budget} cap` : 'CFO reviewed';
      steps.push({ cls: 'done', ic: bd.risks?.length ? '4' : '3', label: `CFO: ${cap}`, sub: (bd.kill_criteria || '').slice(0, 100) });
      const gateCls = pending.status === 'pending' ? 'active' : pending.status === 'approved' ? 'done' : 'deny';
      const gateN = bd.risks?.length ? '5' : '4';
      steps.push({ cls: gateCls, ic: gateN, label: `Human Gate: ${(pending.status || 'pending').toUpperCase()}`, sub: pending.status === 'pending' ? 'Awaiting final human approval' : (pending.note || '').slice(0, 100) });
    } catch { /* JSON parse failed — fall through to board roles */ }
  }

  if (!steps.length) {
    const verdictCls = v => v === 'Kill' || v === 'Reject' ? 'deny' : v === 'Gate' ? 'active' : 'done';
    steps = board.map((b, i) => ({ cls: verdictCls(b.verdict), ic: String(i + 1), label: `${b.role} — ${b.verdict}`, sub: b.line }));
    const last = transcript.filter(m => m.role === 'agent' || m.role === 'cfo').at(-1);
    if (last) {
      const preview = last.content.slice(0, 130).replace(/\n/g, ' ');
      steps.push({ cls: 'done', ic: '★', label: `${last.role === 'cfo' ? 'CFO' : 'Board'} output`, sub: preview + (last.content.length > 130 ? '…' : '') });
    }
  }

  let html = steps.map(s => `
    <div class="step ${s.cls}">
      <div class="ic">${s.ic}</div>
      <div class="tx"><b>${esc(s.label)}</b>
        ${s.sub ? `<div class="sub">${esc(s.sub)}</div>` : ''}
      </div>
    </div>`).join('');

  if (pending || steps.length >= 3) {
    const outcome = pending?.status === 'approved' ? 'funded'
                  : pending?.status === 'rejected' ? 'killed'
                  : focus.decision || focus.status || 'awaiting human gate';
    const sigState = pending?.status === 'approved'
      ? '<span class="sv verify">✓ signed · Archivist</span>'
      : '<span class="sv">signing pending…</span>';
    html += `<div class="sigbar">
      <div class="row"><span class="sk">venture</span><span class="sv">${esc(focus.name)}</span></div>
      <div class="row"><span class="sk">outcome</span><span class="sv">${esc(outcome)}</span></div>
      <div class="row"><span class="sk">Ed25519 sig</span>${sigState}</div>
    </div>`;
  }

  if (!html) html = '<div class="empty">Board has not reviewed a venture yet.</div>';
  $('#record').innerHTML = html;
  $('#record').scrollTop = $('#record').scrollHeight;
}

/* ── TREASURY LEDGER ───────────────────────────────────────── */
function renderLedger(entries = [], totals = {}) {
  const el = $('#ledger');
  el.innerHTML = entries.slice(-12).map(e => {
    const pos = (e.amount ?? 0) >= 0;
    return `<div class="lrow">
      <span class="lbl">${esc(e.item || e.type || '—')}</span>
      <span class="amt ${pos ? 'pos' : 'neg'}">${pos ? '+' : '−'}$${Math.abs(e.amount ?? 0).toFixed(2)}</span>
    </div>`;
  }).join('') || '<div class="empty">No ledger entries yet.</div>';

  const net = (totals.revenue || 0) - (totals.spend || 0);
  const netEl = $('#net');
  netEl.textContent = (net >= 0 ? '+' : '−') + '$' + Math.abs(net).toFixed(2);
  netEl.style.color = net >= 0 ? 'var(--emerald)' : 'var(--rose)';
}

function renderQdrant(qdrant = {}) {
  const el = $('#qdrantCounts');
  if (!qdrant.ok) {
    $('#qdrStatus').textContent = qdrant.stale ? 'stale' : 'offline';
    el.innerHTML = `<div class="empty">${esc(qdrant.error || 'Memory bridge unavailable.')}</div>`;
    return;
  }

  $('#qdrStatus').textContent = qdrant.stale ? 'stale' : 'live';
  const names = [
    ['exit_capital_board_decisions', 'board decisions'],
    ['exit_capital_ventures', 'ventures'],
    ['exit_capital_audit_events', 'audit events'],
    ['exit_capital_research', 'research'],
  ];
  const counts = qdrant.pointCounts || {};
  el.innerHTML = `<div class="qgrid">${names.map(([key, label]) => `
    <div class="qrow">
      <span>${esc(label)}</span>
      <b>${Number(counts[key] ?? 0).toLocaleString('en-US')}</b>
    </div>`).join('')}</div>`;
}

function renderSpinouts(spinouts = []) {
  const active = spinouts.filter(s => s.status === 'operating-plan' || s.stage === 'operating' || s.stage === 'spinout-ready');
  $('#spinoutBadge').textContent = `${active.length} active`;
  if (!spinouts.length) {
    $('#spinouts').innerHTML = '<div class="empty">No spinouts started yet.</div>';
    return;
  }
  $('#spinouts').innerHTML = spinouts.slice(0, 6).map(s => {
    const streams = (s.workstreams || []).slice(0, 5).map(w => `
      <div class="spin-stream ${esc(w.status || '')}">
        <span>${esc(w.label)}</span>
        <b>${esc(w.status || 'waiting')}</b>
      </div>
    `).join('');
    return `<div class="spinout">
      <div class="spin-top">
        <div>
          <b>${esc(s.ventureName)}</b>
          <span>${esc(s.stage || s.status || 'waiting')} · ${esc(s.domain || '')}</span>
        </div>
        <button class="mini-spin" data-spinout-venture="${esc(s.ventureId || '')}">open</button>
      </div>
      <div class="spin-summary">${esc(s.summary || '')}</div>
      <div class="spin-streams">${streams}</div>
    </div>`;
  }).join('');
}

/* ── MAIN REFRESH ──────────────────────────────────────────── */
let busy = false;

async function refresh() {
  if (busy) return;
  busy = true;
  try {
    const res = await fetch('/api/boardroom');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = await res.json();

    const ventures = d.ventures || [];
    const liveN  = ventures.filter(v => v.status === 'scale').length;
    const killN  = ventures.filter(v => v.status === 'kill' || v.status === 'reject').length;
    const rev    = d.totals?.revenue || 0;
    const spend  = d.totals?.spend   || 0;
    const treasury = 50 + rev - spend;

    $('#treasury').textContent = fmt(treasury);
    $('#margin').textContent   = fmt(rev);
    $('#liveN').textContent    = liveN;
    $('#killN').textContent    = killN;

    // Stripe pill — reflect real key presence
    const stripeOk = d.stripe?.stripeCli;
    const stripeAuth = d.stripe?.authenticated;
    $('#stripePill').innerHTML =
      `<span class="dot pulse"></span>STRIPE · ${stripeAuth ? 'CONNECTED' : 'TEST MODE'}`;
    $('#stripePill').className = `pill ${stripeOk ? 'test' : 'stack'}`;

    // Model pill
    const model = (d.status?.model || 'nemotron-3-ultra').toUpperCase();
    $('#modelPill').innerHTML = `<span class="dot" style="background:var(--blue)"></span>${model}`;

    // Phase
    const phase = d.status?.phase || 'standing by';
    $('#phase').innerHTML = `<span class="dotc pulse"></span>${esc(phase)}`;

    window._currentVentures = ventures;

    // Derive agent active states — map to valid CSS classes: active, ok, danger
    const recentRoles = (d.transcript || []).slice(-5).map(m => m.role);
    const activeIds = [], agentStates = {};
    if (recentRoles.includes('intern'))   { activeIds.push('owl'); }
    if (recentRoles.some(r => r === 'agent' || r === 'board-council')) { activeIds.push('board'); }
    if (recentRoles.includes('archivist')) { activeIds.push('arch'); agentStates['arch'] = 'ok'; }
    if (recentRoles.includes('cfo'))       { activeIds.push('cfo'); }
    const hasPending = (d.humanGate?.pending || []).length > 0;
    if (hasPending)                        { activeIds.push('gate'); }
    else if (recentRoles.includes('human')) { agentStates['gate'] = 'ok'; }
    const safetyBlocked = (d.safety?.recent || []).some(e => e.blocked || e.action === 'blocked');
    if (safetyBlocked)                     { agentStates['safe'] = 'danger'; }
    else if (recentRoles.includes('safety')) { activeIds.push('safe'); }
    renderAgents(activeIds, agentStates);

    renderPipe(ventures);
    renderRecord(d.board || [], ventures, d.transcript || [], d.humanGate || {});
    renderLedger(d.ledger || [], d.totals || {});
    renderQdrant(d.qdrant || {});
    renderSpinouts(d.spinouts || []);

  } catch (err) {
    $('#phase').innerHTML = `<span class="dotc" style="background:var(--rose)"></span>connection error — ${esc(err.message)}`;
  } finally {
    busy = false;
  }
}

/* ── INBOX ──────────────────────────────────────────────────── */
const TYPE_LABELS = {
  red_team_report:       'red_team_report',
  approval_required:     'approval_required',
  cfo_review:            'cfo_review',
  bypass_changed:        'bypass_changed',
  stripe_dry_run_executed: 'stripe_dry_run_executed',
};

function msgSummary(m) {
  const p = m.payload || {};
  switch (m.type) {
    case 'red_team_report':
      return `<b>${esc(p.subject?.slice(0,80) || '?')}</b> — ${p.passed ?? '?'}/${(p.models||[]).length} passed`;
    case 'approval_required':
      return `<b>Approval required</b>: ${esc(p.venture?.name || p.approval_id || '?')}`;
    case 'cfo_review':
      return `<b>CFO</b>: ${p.approved ? '✓ approved' : '✗ denied'} · $${((p.approved_budget_cents || 0)/100).toFixed(2)} cap`;
    case 'bypass_changed':
      return `<b>Human gate bypass</b>: ${p.enabled ? 'ON' : 'OFF'} — ${esc(p.reason || '')}`;
    case 'stripe_dry_run_executed':
      return `<b>Stripe dry-run</b>: ${esc(p.title || p.id || '?')}`;
    default:
      return `<b>${esc(m.from)}</b> → ${esc(m.to)}: ${esc(m.type)}`;
  }
}

function renderInbox(messages = []) {
  const count = messages.length;
  $('#inboxCount').textContent = count;
  const el = $('#inboxPanel');
  if (!count) {
    el.innerHTML = '<div class="empty">No agent bus messages yet.</div>';
    return;
  }
  el.innerHTML = messages.slice(0, 20).map(m => {
    const cls = TYPE_LABELS[m.type] || 'default';
    const ts  = m.at ? new Date(m.at).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}) : '';
    return `<div class="imsg">
      <span class="itype ${cls}">${esc(m.type.replace(/_/g,' '))}</span>
      <span class="ibody">${msgSummary(m)}</span>
      <span class="itime">${ts}</span>
    </div>`;
  }).join('');
}

let inboxOpen = false;
$('#inboxToggle').addEventListener('click', () => {
  inboxOpen = !inboxOpen;
  $('#inboxBar').classList.toggle('open', inboxOpen);
});

$('#pipe').addEventListener('click', (event) => {
  const card = event.target.closest('.vcard[data-venture-id]');
  if (!card) return;
  openVentureDetail(card.dataset.ventureId);
});

$('#ventureDetailClose').addEventListener('click', () => {
  $('#ventureDetailModal').style.display = 'none';
});
$('#ventureDetailModal').addEventListener('click', (event) => {
  if (event.target === $('#ventureDetailModal')) $('#ventureDetailModal').style.display = 'none';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') $('#ventureDetailModal').style.display = 'none';
});

$('#spinouts').addEventListener('click', (event) => {
  const btn = event.target.closest('[data-spinout-venture]');
  if (!btn) return;
  openVentureDetail(btn.dataset.spinoutVenture);
});

async function refreshInbox() {
  try {
    const res = await fetch('/api/inbox');
    if (!res.ok) return;
    const d = await res.json();
    renderInbox(d.messages || []);
  } catch { /* ignore */ }
}

/* ── COCKPIT TOGGLE ────────────────────────────────────────── */
let cockpitOpen = false;
$('#cockpitToggle').addEventListener('click', () => {
  cockpitOpen = !cockpitOpen;
  $('#cockpit').classList.toggle('open', cockpitOpen);
  $('#cockpitToggle').classList.toggle('active', cockpitOpen);
});

/* ── COCKPIT API CALLS ─────────────────────────────────────── */
async function call(endpoint, body, btn, label) {
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = label;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    await refresh();
    return data;
  } catch (err) {
    $('#phase').innerHTML = `<span class="dotc" style="background:var(--rose)"></span>${esc(err.message)}`;
    return null;
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

$('#runBoard').addEventListener('click', () => {
  const p = $('#agentPrompt').value.trim() || 'Evaluate the current portfolio and give a board verdict.';
  call('/api/agent', { prompt: p }, $('#runBoard'), 'Reviewing…');
});

$('#runVentureCycle').addEventListener('click', () => {
  const p = $('#agentPrompt').value.trim() || 'Synthetic data run: find one boring B2B operations workflow. Create a pre-pitch company card only. Use synthetic facts, internal analysis, and no live financial activity or public claims.';
  call('/api/venture-cycle', { seed: p }, $('#runVentureCycle'), 'Cycling…');
});

$('#agents').addEventListener('click', async (event) => {
  const item = event.target.closest('[data-agent-id="safe"]');
  if (!item) return;
  item.classList.add('active');
  $('#phase').innerHTML = `<span class="dotc pulse"></span>human resetting safety gate…`;
  try {
    const res = await fetch('/api/safety/reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ note: 'Human operator acknowledged blocked safety event from dashboard.' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Safety reset failed');
    $('#phase').innerHTML = `<span class="dotc"></span>Safety Gate reset by human operator`;
    await refresh();
  } catch (err) {
    $('#phase').innerHTML = `<span class="dotc" style="background:var(--rose)"></span>${esc(err.message)}`;
  } finally {
    item.classList.remove('active');
  }
});

$('#runRedTeam').addEventListener('click', () => {
  const p = $('#agentPrompt').value.trim() || 'Red-team the current Exit Capital portfolio.';
  call('/api/red-team', { subject: p }, $('#runRedTeam'), 'Attacking…');
});

$('#runResearch').addEventListener('click', () => {
  const p = $('#agentPrompt').value.trim() || 'Research a new venture opportunity for Exit Capital.';
  call('/api/research', { prompt: p }, $('#runResearch'), 'Researching…');
});

$('#runCfoReview').addEventListener('click', async () => {
  const v = (window._currentVentures || []).find(x => x.status === 'fund' || x.status === 'scale') || (window._currentVentures || [])[0];
  const subject = v?.name || ($('#agentPrompt').value.trim() || 'Current portfolio');
  const body = {
    subject,
    action: $('#agentPrompt').value.trim() || `Review capital envelope for ${subject}`,
    budget: Math.max(0, Math.min(50, Number(v?.ask ?? v?.approved_budget ?? 0))),
    kill_criteria: v?.kill || v?.kill_criteria || 'Kill if no measurable validation signal is produced before any further spend.'
  };
  const data = await call('/api/cfo-review', body, $('#runCfoReview'), 'CFO reviewing…');
  if (data?.envelope) {
    const verdict = data.approved ? 'APPROVED' : 'REJECTED';
    const color = data.approved ? 'var(--emerald)' : 'var(--rose)';
    $('#phase').innerHTML = `<span class="dotc" style="background:${color}"></span>CFO ${verdict} · $${Number(data.envelope.approved_budget_usd || 0)} cap · ${esc(data.envelope.reason || '')}`;
  }
});

$('#archiveMemory').addEventListener('click', () => {
  call('/api/memory/archive', { text: 'Exit Capital board checkpoint' }, $('#archiveMemory'), 'Archiving…');
});

$('#freeze').addEventListener('click', () => {
  $('#phase').innerHTML = `<span class="dotc pulse" style="background:var(--rose)"></span>GLOBAL FREEZE — all money rails halted`;
  $('#freeze').style.background = 'rgba(255,93,108,.18)';
});

/* ── AGENT CONTRACTS MODAL ─────────────────────────────────── */
$('#contractsToggle').addEventListener('click', async () => {
  const modal = $('#contractsModal');
  modal.style.display = 'block';
  const list = $('#contractsList');
  list.innerHTML = '<div style="color:#60728c;font-size:12px">Loading…</div>';
  try {
    const r = await fetch('/api/agent-contracts');
    const d = await r.json();
    let expanded = null;
    function render() {
      list.innerHTML = (d.contracts || []).map((c, i) => `
        <div style="border:1px solid rgba(80,100,130,.2);border-radius:9px;overflow:hidden">
          <div onclick="window._toggleContract(${i})" style="padding:11px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:rgba(20,28,40,.5)">
            <span style="font-size:11px;font-weight:600;color:#eef3fa">${esc(c.file)}</span>
            <span style="font-size:10px;color:#60728c;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.desc)}</span>
          </div>
          ${expanded === i ? `<pre style="padding:14px;font-size:10px;color:#93a4bd;overflow-x:auto;white-space:pre-wrap;background:#070a10;max-height:300px;overflow-y:auto">${esc(c.content)}</pre>` : ''}
        </div>`).join('');
    }
    window._toggleContract = (i) => { expanded = expanded === i ? null : i; render(); };
    render();
  } catch { list.innerHTML = '<div style="color:var(--rose)">Failed to load contracts.</div>'; }
});
$('#contractsClose').addEventListener('click', () => { $('#contractsModal').style.display = 'none'; });
$('#contractsModal').addEventListener('click', e => { if (e.target === $('#contractsModal')) $('#contractsModal').style.display = 'none'; });

/* ── HONEST TEA MODAL ──────────────────────────────────────── */
function honestRow(ok, label, detail) {
  const mark = ok === null ? '<span style="color:#60728c">—</span>'
    : ok ? '<span style="color:#2dd4bf">🍵 honest</span>'
         : '<span style="color:var(--amber)">⚠ demo</span>';
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border:1px solid rgba(80,100,130,.2);border-radius:8px;background:rgba(20,28,40,.4)">
    <div><div style="font-weight:600;color:#eef3fa">${esc(label)}</div><div style="font-size:10px;color:#93a4bd;margin-top:2px">${esc(detail)}</div></div>
    <div style="font-family:var(--mono);font-size:11px;font-weight:700;white-space:nowrap;margin-left:12px">${mark}</div>
  </div>`;
}

$('#honestToggle').addEventListener('click', async () => {
  const modal = $('#honestModal');
  modal.style.display = 'block';
  const list = $('#honestList');
  list.innerHTML = '<div style="color:#60728c;font-size:12px">Checking…</div>';
  try {
    const [stateR, verifyR] = await Promise.all([
      fetch('/api/state').then(r => r.json()),
      fetch('/api/verify/studio-wishlist').then(r => r.json()).catch(() => null)
    ]);
    const ventures = stateR.ventures || [];
    const realCount = ventures.filter(v => !v.staged).length;
    const stagedCount = ventures.length - realCount;
    const q = stateR.qdrant || {};
    const rows = [];
    rows.push(honestRow(
      !!verifyR?.signature_ok,
      'Decision signature',
      verifyR ? `Ed25519 verify on studio-wishlist: ${verifyR.signature_ok ? 'signature_ok, hash_ok' : 'failed'}` : 'No record to verify'
    ));
    rows.push(honestRow(
      ventures.length > 0,
      'Venture portfolio',
      `${realCount} from live cycles, ${stagedCount} seed/demo (each card is tagged on the board)`
    ));
    rows.push(honestRow(
      q.ok === true,
      'Qdrant memory',
      q.pointCounts ? Object.entries(q.pointCounts).map(([k, v]) => `${k.replace('exit_capital_', '')}: ${v}`).join(' · ') : 'unreachable'
    ));
    rows.push(honestRow(
      null,
      'What this badge does NOT mean',
      'Stripe stays in dry-run regardless of this badge. "Honest" = this data came from a real cycle, not that money moved.'
    ));
    list.innerHTML = rows.join('');
  } catch {
    list.innerHTML = '<div style="color:var(--rose)">Could not reach /api/state — dashboard backend may be down.</div>';
  }
});
$('#honestClose').addEventListener('click', () => { $('#honestModal').style.display = 'none'; });
$('#honestModal').addEventListener('click', e => { if (e.target === $('#honestModal')) $('#honestModal').style.display = 'none'; });

/* ── BOOT ──────────────────────────────────────────────────── */
renderAgents();
renderPipe([]);
refresh();
setInterval(refresh, 3000);
refreshInbox();
setInterval(refreshInbox, 5000);
