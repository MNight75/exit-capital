const money = (value) => `${value < 0 ? "-" : ""}$${Math.abs(value).toLocaleString()}`;

function badge(status, label) {
  return `<span class="badge ${status}">${label}</span>`;
}

function renderBoard(rows) {
  document.querySelector("#board").innerHTML = rows.map((row) => `
    <div class="board-row">
      <strong>${row.role}</strong>
      ${badge("", row.verdict)}
      <span>${row.line}</span>
    </div>
  `).join("");
}

function renderLedger(rows) {
  document.querySelector("#ledger").innerHTML = rows.map((row) => `
    <div class="ledger-row">
      <span>${row.time}</span>
      <span>${row.type}</span>
      <span>${row.item}</span>
      <strong class="${row.amount > 0 ? "positive" : row.amount < 0 ? "negative" : ""}">${row.amount === 0 ? "hold" : money(row.amount)}</strong>
      <strong>${money(row.balance)}</strong>
    </div>
  `).join("");
}

function renderVentures(rows) {
  document.querySelector("#ventures").innerHTML = rows.map((v) => `
    <article class="venture">
      <div>
        ${badge(v.status, v.decision)}
        <h3>${v.name}</h3>
        <p>${v.market} · asks ${money(v.ask)}</p>
      </div>
      <div class="score" title="board confidence score"><span style="width:${v.score}%"></span></div>
      <p><strong>Board reason:</strong> ${v.reason}</p>
      <ul class="evidence">${v.evidence.map((e) => `<li>${e}</li>`).join("")}</ul>
      <p><strong>Kill rule:</strong> ${v.kill}</p>
      <p class="muted">Spend ${money(v.spend)} · Revenue ${money(v.revenue)}</p>
    </article>
  `).join("");
}

function renderAudit(rows) {
  document.querySelector("#audit").innerHTML = rows.map((row) => `
    <div class="audit-row"><span>${row}</span></div>
  `).join("");
}

function renderStripe(stripe) {
  if (!stripe) return;
  const stripeCli = document.querySelector("#stripeCli");
  const linkCli = document.querySelector("#linkCli");
  const skills = document.querySelector("#stripeSkills");
  const mode = document.querySelector("#stripeMode");
  const queue = document.querySelector("#stripeQueue");
  stripeCli.textContent = stripe.stripeCli ? stripe.stripeVersion : "Not installed";
  linkCli.textContent = stripe.linkCli ? stripe.linkVersion : "Not installed";
  skills.textContent = stripe.skills?.stripeLinkCliSkill && stripe.skills?.stripeProjectsSkill
    ? "stripe-link-cli + stripe-projects"
    : "Missing skill";
  mode.textContent = stripe.mode;
  stripeCli.parentElement.classList.toggle("ok", !!stripe.stripeCli);
  linkCli.parentElement.classList.toggle("ok", !!stripe.linkCli);
  skills.parentElement.classList.toggle("ok", stripe.skills?.stripeLinkCliSkill && stripe.skills?.stripeProjectsSkill);
  if (queue) {
    const rows = stripe.queue || [];
    queue.innerHTML = rows.length ? rows.map((item) => `
      <article class="stripe-action ${item.status}">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.venture)} · ${money(item.amount)} · ${escapeHtml(item.mode)} · ${escapeHtml(item.status)}</span>
          <p>${escapeHtml(item.reason || "")}</p>
          ${item.executionReceipt ? `<p class="muted">Receipt ${escapeHtml(item.executionReceipt.receipt)} · live money moved: no</p>` : ""}
        </div>
        <div class="approval-actions">
          <button type="button" data-stripe-action="approve-dry-run" data-stripe-id="${escapeHtml(item.id)}">Run Dry</button>
          <button type="button" data-stripe-action="reject" data-stripe-id="${escapeHtml(item.id)}">Reject</button>
        </div>
      </article>
    `).join("") : `<p class="muted">No Stripe actions queued.</p>`;
  }
}

function renderApprovals(approvals) {
  const target = document.querySelector("#approvalStatus");
  if (!target || !approvals) return;
  const approved = [
    approvals.qdrantMemory,
    approvals.researchIntern,
    approvals.discordBridge,
    approvals.stripeSkillsDryRun
  ].filter((item) => item?.approved).length;
  const liveLocked = approvals.liveStripeSpend?.approved === false;
  target.textContent = liveLocked
    ? `${approved}/4 approved; live money locked`
    : `${approved}/4 approved; money enabled`;
  target.parentElement.classList.toggle("ok", approved === 4 && liveLocked);
  target.parentElement.classList.toggle("locked", !liveLocked);
}

function renderQdrant(qdrant) {
  const target = document.querySelector("#qdrantStatus");
  if (!target || !qdrant) return;
  const present = (qdrant.collections || []).filter((item) => item.present).length;
  target.textContent = qdrant.ok
    ? `${qdrant.url} · ${present}/${qdrant.collections.length} collections`
    : `Offline: ${qdrant.error || "unknown error"}`;
  target.parentElement.classList.toggle("ok", !!qdrant.ok);
}

function renderOpenRouter(openrouter) {
  const target = document.querySelector("#openRouterStatus");
  if (!target || !openrouter) return;
  target.textContent = openrouter.configured
    ? `${openrouter.model} · key present`
    : `${openrouter.model} · key missing`;
  target.parentElement.classList.toggle("ok", !!openrouter.configured);
}

function renderDiscord(discord) {
  const policy = document.querySelector("#discordPolicy");
  const channel = document.querySelector("#discordChannel");
  const bridge = document.querySelector("#discordBridge");
  const mode = document.querySelector("#discordMode");
  if (!policy || !discord) return;
  policy.textContent = discord.policyEnabled ? "Nemo policy enabled" : "Policy missing";
  channel.textContent = discord.channelKnown ? "Discord channel registered" : "Channel not registered";
  bridge.textContent = discord.bridgeProviderAttached ? "Bridge attached in OpenShell" : "Bridge not attached";
  mode.textContent = discord.mode;
  policy.parentElement.classList.toggle("ok", !!discord.policyEnabled);
  channel.parentElement.classList.toggle("ok", !!discord.channelKnown);
  bridge.parentElement.classList.toggle("ok", !!discord.bridgeProviderAttached);
}

function renderVault(rows) {
  const status = document.querySelector("#vaultStatus");
  const target = document.querySelector("#vault");
  const list = rows || [];
  if (status) {
    status.textContent = `${list.length} Markdown idea records`;
    status.parentElement.classList.toggle("ok", list.length > 0);
  }
  if (!target) return;
  target.innerHTML = list.length ? list.slice(0, 8).map((item) => `
    <article class="vault-card">
      ${badge(item.status || "fund", item.status || "unknown")}
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.customer || "No customer recorded")}</p>
      <p><strong>Why:</strong> ${escapeHtml(item.reason || "No reason recorded")}</p>
      <p><strong>Kill:</strong> ${escapeHtml(item.kill_criteria || "No kill criteria recorded")}</p>
      <small>${escapeHtml(item.file || "")}</small>
    </article>
  `).join("") : `<p class="muted">No Markdown idea records yet.</p>`;
}

function renderRoles(rows) {
  const target = document.querySelector("#roles");
  if (!target || !rows) return;
  target.innerHTML = rows.map((role) => `
    <article class="role-card">
      <div>
        <strong>${escapeHtml(role.name)}</strong>
        ${badge("", escapeHtml(role.kind))}
      </div>
      <p>${escapeHtml(role.engine)}</p>
      <span>${escapeHtml(role.responsibility)}</span>
    </article>
  `).join("");
}

function renderHumanGate(gate) {
  const status = document.querySelector("#humanGateStatus");
  const mode = document.querySelector("#gateMode");
  const detail = document.querySelector("#gateDetail");
  const bypass = document.querySelector("#gateBypass");
  const pending = document.querySelector("#pendingApprovals");
  if (!gate) return;
  const pendingItems = gate.pending || [];
  if (status) {
    status.textContent = gate.bypass
      ? `Bypassed · ${pendingItems.length} pending`
      : `Required · ${pendingItems.length} pending`;
    status.parentElement.classList.toggle("ok", !gate.bypass);
    status.parentElement.classList.toggle("locked", !!gate.bypass);
  }
  if (mode) mode.textContent = gate.bypass ? "Bypass Enabled" : "Human Approval Required";
  if (detail) {
    detail.textContent = gate.bypass
      ? `Bypass is active: ${gate.bypassReason || "operator override"}`
      : "Fund and scale actions pause here until a human approves them.";
  }
  if (bypass) bypass.checked = !!gate.bypass;
  if (!pending) return;
  pending.innerHTML = pendingItems.length ? pendingItems.map((item) => `
    <article class="approval-card">
      ${badge("kill", "Pending")}
      <h3>${escapeHtml(item.proposed?.name || "Unnamed venture")}</h3>
      <p>${escapeHtml(item.proposed?.market || "No market recorded")}</p>
      <p><strong>Budget:</strong> ${money(Number(item.proposed?.ask || 0))}</p>
      <p>${escapeHtml(item.reason || "Human approval required.")}</p>
      <div class="button-row">
        <button type="button" class="command primary" data-approve="${escapeHtml(item.id)}">Approve</button>
        <button type="button" class="command" data-reject="${escapeHtml(item.id)}">Reject</button>
      </div>
    </article>
  `).join("") : `<p class="muted">No ventures are waiting for final human approval.</p>`;
  pending.querySelectorAll("[data-approve]").forEach((button) => {
    button.addEventListener("click", () => setHumanGateDecision("approve", button.dataset.approve));
  });
  pending.querySelectorAll("[data-reject]").forEach((button) => {
    button.addEventListener("click", () => setHumanGateDecision("reject", button.dataset.reject));
  });
}

function renderTranscript(rows) {
  const target = document.querySelector("#transcript");
  if (!target) return;
  target.innerHTML = rows.map((row) => `
    <div class="message ${row.role}">
      <strong>${row.role === "agent" ? "Board Agent" : row.role}</strong>
      <p>${escapeHtml(row.content)}</p>
    </div>
  `).join("");
  target.scrollTop = target.scrollHeight;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function refresh() {
  const response = await fetch("/api/boardroom");
  const data = await response.json();
  const pulse = document.querySelector("#pulse");
  pulse.className = `pulse ${data.status.ok ? "ok" : "bad"}`;
  document.querySelector("#phase").textContent = data.status.ok ? `Sandbox ${data.status.phase}` : "Sandbox needs attention";
  document.querySelector("#model").textContent = `${data.status.agentBackend?.label || "Agent"} · ${data.status.provider} · ${data.status.model} · ${data.status.openshell}`;

  document.querySelector("#revenue").textContent = money(data.totals.revenue);
  document.querySelector("#spend").textContent = money(data.totals.spend);
  document.querySelector("#net").textContent = money(data.totals.revenue - data.totals.spend);

  renderBoard(data.board);
  renderLedger(data.ledger);
  renderVentures(data.ventures);
  renderAudit(data.audit);
  renderStripe(data.stripe);
  renderApprovals(data.approvals);
  renderQdrant(data.qdrant);
  renderOpenRouter(data.openrouter);
  renderDiscord(data.discord);
  renderRoles(data.roles || []);
  renderVault(data.vault || []);
  renderHumanGate(data.humanGate);
  renderTranscript(data.transcript || []);
}

async function askAgent(prompt) {
  const button = document.querySelector("#askAgent");
  const textarea = document.querySelector("#agentPrompt");
  button.disabled = true;
  button.textContent = "Board Reviewing...";
  try {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Agent call failed.");
    renderTranscript(data.transcript || []);
  } catch (error) {
    renderTranscript([
      { role: "error", content: error.message }
    ]);
  } finally {
    button.disabled = false;
    button.textContent = "Run Board Review";
    textarea.focus();
  }
}

async function createStripeProposal() {
  const button = document.querySelector("#stripeProposal");
  button.disabled = true;
  button.textContent = "Drafting Stripe Proposal...";
  try {
    const response = await fetch("/api/stripe/propose", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ask: "Approve a test-mode Stripe spend/provisioning proposal for the scaled wishlist venture."
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Stripe proposal failed.");
    renderStripe(data.stripe);
    renderTranscript(data.transcript || []);
  } catch (error) {
    renderTranscript([{ role: "error", content: error.message }]);
  } finally {
    button.disabled = false;
    button.textContent = "Create Stripe Spend Proposal";
  }
}

async function stripeQueueAction(id, action) {
  const response = await fetch("/api/stripe/action", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, action })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Stripe action failed.");
  if (data.stripe) renderStripe(data.stripe);
  if (data.ledger) renderLedger(data.ledger);
  if (data.transcript) renderTranscript(data.transcript);
  if (data.qdrant) renderQdrant(data.qdrant);
  return data;
}

async function archiveMemory() {
  const button = document.querySelector("#archiveMemory");
  button.disabled = true;
  button.textContent = "Archiving...";
  try {
    const transcriptText = Array.from(document.querySelectorAll(".message p"))
      .map((node) => node.textContent)
      .filter(Boolean)
      .slice(-2)
      .join("\n\n");
    const response = await fetch("/api/memory/archive", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: transcriptText || "Exit Capital board checkpoint" })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Archive failed.");
    renderQdrant(data.qdrant);
    renderTranscript(data.transcript || []);
  } catch (error) {
    renderTranscript([{ role: "error", content: error.message }]);
  } finally {
    button.disabled = false;
    button.textContent = "Archive Latest Board Decision";
  }
}

async function runResearchIntern() {
  const button = document.querySelector("#researchIntern");
  const prompt = document.querySelector("#agentPrompt").value.trim()
    || "Research whether indie game studios would pay for wishlist recovery automation.";
  button.disabled = true;
  button.textContent = "Intern Researching...";
  try {
    const response = await fetch("/api/research", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Research failed.");
    renderOpenRouter(data.openrouter);
    renderTranscript(data.transcript || []);
  } catch (error) {
    renderTranscript([{ role: "error", content: error.message }]);
  } finally {
    button.disabled = false;
    button.textContent = "Send Intern To Research";
  }
}

async function runVentureCycle() {
  const button = document.querySelector("#ventureCycle");
  const seed = document.querySelector("#agentPrompt").value.trim()
    || "Find one small B2B business an AI company could validate for under $50 this week.";
  button.disabled = true;
  button.textContent = "Cycling Venture...";
  try {
    const response = await fetch("/api/venture-cycle", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ seed })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Venture cycle failed.");
    renderQdrant(data.qdrant);
    if (data.ventures) renderVentures(data.ventures);
    if (data.ledger) renderLedger(data.ledger);
    if (data.vault) renderVault(data.vault);
    renderTranscript(data.transcript || []);
  } catch (error) {
    renderTranscript([{ role: "error", content: error.message }]);
  } finally {
    button.disabled = false;
    button.textContent = "Run Venture Cycle";
  }
}

async function runRedTeamCouncil() {
  const button = document.querySelector("#redTeamCouncil");
  const subject = document.querySelector("#agentPrompt").value.trim()
    || "Red-team the current Exit Capital operating portfolio and the newest funded venture.";
  button.disabled = true;
  button.textContent = "Council Reviewing...";
  try {
    const response = await fetch("/api/red-team", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ subject })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Red-team council failed.");
    renderQdrant(data.qdrant);
    renderTranscript(data.transcript || []);
  } catch (error) {
    renderTranscript([{ role: "error", content: error.message }]);
  } finally {
    button.disabled = false;
    button.textContent = "Run Red Team Council";
  }
}

async function setHumanGateDecision(action, id) {
  try {
    const response = await fetch("/api/human-gate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, id, note: `${action} from Exit Capital operator console` })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Human gate action failed.");
    renderHumanGate(data.humanGate);
    if (data.ventures) renderVentures(data.ventures);
    if (data.ledger) renderLedger(data.ledger);
    if (data.qdrant) renderQdrant(data.qdrant);
    renderTranscript(data.transcript || []);
  } catch (error) {
    renderTranscript([{ role: "error", content: error.message }]);
  }
}

async function setHumanGateBypass(enabled) {
  try {
    const response = await fetch("/api/human-gate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "bypass",
        enabled,
        reason: enabled ? "Operator bypass for fast supervised run." : "Operator restored final human approval."
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Human gate bypass failed.");
    renderHumanGate(data.humanGate);
    renderTranscript(data.transcript || []);
  } catch (error) {
    renderTranscript([{ role: "error", content: error.message }]);
  }
}

refresh().catch((error) => {
  document.querySelector("#phase").textContent = "Dashboard error";
  document.querySelector("#model").textContent = error.message;
});

document.querySelector("#askAgent")?.addEventListener("click", () => {
  const prompt = document.querySelector("#agentPrompt").value.trim();
  if (prompt) askAgent(prompt);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = button.dataset.prompt;
    document.querySelector("#agentPrompt").value = prompt;
    askAgent(prompt);
  });
});

document.querySelector("#stripeProposal")?.addEventListener("click", () => {
  createStripeProposal();
});

document.querySelector("#stripeQueue")?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-stripe-action]");
  if (!button) return;
  button.disabled = true;
  const original = button.textContent;
  button.textContent = "Working...";
  try {
    await stripeQueueAction(button.dataset.stripeId, button.dataset.stripeAction);
  } catch (error) {
    renderTranscript([{ role: "error", content: error.message }]);
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
});

document.querySelector("#archiveMemory")?.addEventListener("click", () => {
  archiveMemory();
});

document.querySelector("#researchIntern")?.addEventListener("click", () => {
  runResearchIntern();
});

document.querySelector("#ventureCycle")?.addEventListener("click", () => {
  runVentureCycle();
});

document.querySelector("#redTeamCouncil")?.addEventListener("click", () => {
  runRedTeamCouncil();
});

document.querySelector("#gateBypass")?.addEventListener("change", (event) => {
  setHumanGateBypass(event.target.checked);
});

setInterval(refresh, 15000);
