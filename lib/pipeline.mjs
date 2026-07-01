export const LANES = Object.freeze({
  PRE_PITCH: "pre-pitch",
  BOARD_PITCH: "board-pitch",
  RED_TEAM: "red-team",
  CAPITAL_GATE: "capital-gate",
  KILL: "kill",
  REJECT: "reject",
  SCALE: "scale"
});

export function slugify(value) {
  return String(value || "venture")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "venture";
}

export function hashText(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return hash;
}

export function cleanResearchField(value, fallback = "") {
  return String(value || fallback)
    .replace(/\*\*/g, "")
    .replace(/^[-*\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function firstMatch(text, patterns, fallback = "") {
  for (const pattern of patterns) {
    const match = String(text || "").match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return fallback;
}

export function parsePrePitchCandidate({ seed = "", research = "", reason = "Research complete. Held at Pre-Pitch." } = {}) {
  const fallbackNames = [
    "Permit Queue Concierge",
    "Vendor Renewal Desk",
    "Shift Coverage Ledger",
    "Field Service Window",
    "Compliance Packet Runner",
    "Maintenance Quote Desk"
  ];
  const fallbackName = fallbackNames[Math.abs(hashText(`${seed}\n${research}`)) % fallbackNames.length];
  const rawName = firstMatch(research, [
    /\*\*Business Name:\*\*\s*([^\n]+)/i,
    /Business Name:\s*([^\n]+)/i,
    /\*\*Business Idea:\*\*\s*([^\n]+)/i,
    /\*\*Venture Name:\*\*\s*([^\n]+)/i,
    /^#+\s*\*{0,2}([^*\n#][^\n]{5,80}?)\*{0,2}\s*$/m,
    /^\*\*([^*\n]{6,80})\*\*\s*$/m
  ], fallbackName);
  const name = cleanResearchField(rawName)
    .replace(/^(business name|venture name|business idea)\s*:\s*/i, "")
    .trim() || fallbackName;
  const market = cleanResearchField(firstMatch(research, [
    /\*\*Customer:\*\*\s*([^\n]+)/i,
    /Customer:\s*([^\n]+)/i,
    /\*\*Target Customer:\*\*\s*([^\n]+)/i,
    /Target Customer:\s*([^\n]+)/i,
    /\*\*Market:\*\*\s*([^\n]+)/i
  ], "B2B operations buyer"));
  const pain = cleanResearchField(firstMatch(research, [
    /\*\*Pain:\*\*\s*([^\n]+)/i,
    /Pain:\s*([^\n]+)/i
  ], "Research identified an operational pain."));
  const offer = cleanResearchField(firstMatch(research, [
    /\*\*Offer:\*\*\s*([^\n]+)/i,
    /Offer:\s*([^\n]+)/i
  ], "Offer needs board review."));
  const fundingNeed = cleanResearchField(firstMatch(research, [
    /\*\*Funding Need:\*\*\s*([^\n]+)/i,
    /Funding Need:\s*([^\n]+)/i,
    /\*\*Funding:\*\*\s*([^\n]+)/i,
    /Funding:\s*([^\n]+)/i,
    /\*\*Validation Budget:\*\*\s*([^\n]+)/i,
    /Validation Budget:\s*([^\n]+)/i
  ], "$0 pre-pitch. Needs human-approved validation budget before outreach, domain, SaaS, or paid tools."));
  const kill = cleanResearchField(firstMatch(research, [
    /\*\*Kill criteria[^:]*:\*\*\s*([^\n]+)/i,
    /Kill criteria[^:]*:\s*([^\n]+)/i,
    /Kill if\s+([^\n]+)/i
  ], "Kill if no measurable validation signal appears before any spend or outreach."));

  return {
    name: name.slice(0, 120),
    market: market.slice(0, 120),
    ask: 0,
    requested_budget: 0,
    status: LANES.PRE_PITCH,
    score: 58,
    spend: 0,
    revenue: 0,
    decision: "Pre-Pitch",
    reason: String(reason).slice(0, 260),
    evidence: [pain, offer, `Funding need: ${fundingNeed}`].map((item) => String(item).slice(0, 180)),
    kill: kill.slice(0, 220),
    source: "live-venture-cycle",
    boardDecision: null,
    boardReviewedAt: null
  };
}

export function promoteResearchToBoardPitch(venture, now = new Date().toISOString()) {
  return {
    ...venture,
    status: LANES.BOARD_PITCH,
    decision: "Board Pitch",
    researchedAt: now,
    reason: "Research filled out the Pre-Pitch candidate and promoted it for board evaluation. No capital, outreach, public launch, or payment action is approved.",
    evidence: [
      ...(venture.evidence || []).slice(0, 2),
      "Researcher marked the candidate ready for Board Pitch."
    ].slice(0, 3)
  };
}

export function promoteBoardPitchToRedTeam(venture, now = new Date().toISOString()) {
  return {
    ...venture,
    status: LANES.RED_TEAM,
    decision: "Board Reviewed",
    boardReviewedAt: now,
    reason: "Board accepted the candidate for adversarial Red-Team review. CFO, capital, public launch, and money rails remain locked.",
    evidence: [
      ...(venture.evidence || []).slice(0, 2),
      "Board moved the candidate to Red-Team for adversarial review."
    ].slice(0, 3)
  };
}

export const MAJOR_FLAW_PATTERN = /\b(no[- ]?go|do not proceed|fatal blocker|fatal flaw|kill\b|reject\b|unsafe|illegal|non[- ]?viable|major flaw|stop before|should not advance)\b/i;

export function evaluateRedTeamResults(results, requiredGreenLights = 3) {
  const majorFlaws = results.filter((result) => result.ok && MAJOR_FLAW_PATTERN.test(result.content || ""));
  const greenLights = results.filter((result) => result.ok && !MAJOR_FLAW_PATTERN.test(result.content || ""));
  const failed = results.filter((result) => !result.ok);
  return {
    passed: greenLights.length >= requiredGreenLights && majorFlaws.length === 0,
    greenLights,
    majorFlaws,
    failed,
    requiredGreenLights,
    total: results.length
  };
}

export function applyRedTeamOutcome(venture, report, evaluation, now = new Date().toISOString()) {
  const base = {
    ...venture,
    redTeamReport: String(report || "").slice(0, 8000),
    redTeamReviewedAt: now,
    redTeamPassed: evaluation.passed
  };
  if (!evaluation.passed) {
    return {
      ...base,
      reason: evaluation.majorFlaws.length
        ? `Red-Team hold: ${evaluation.majorFlaws.length} responding seat${evaluation.majorFlaws.length === 1 ? "" : "s"} found a major flaw. Repair before capital review.`
        : `Red-Team hold: only ${evaluation.greenLights.length}/${evaluation.total} green-light seats responded. Repair before capital review.`
    };
  }
  return {
    ...base,
    status: LANES.CAPITAL_GATE,
    decision: "Red-Team Passed",
    reason: `Red-Team passed with ${evaluation.greenLights.length}/${evaluation.total} green-light seats and no major flaws detected. CFO and Human Gate still required before any spend, outreach, public launch, or Stripe action.`,
    evidence: [
      ...(venture.evidence || []).slice(0, 2),
      `Red-Team passed ${evaluation.greenLights.length}/${evaluation.total}; failures and model errors recorded for audit.`
    ].slice(0, 3)
  };
}

export function archivePayloadForVenture(venture, note = "") {
  if (!venture) return String(note || "Exit Capital archive checkpoint").trim();
  return [
    `Archived venture: ${venture.name}`,
    `Status at archive: ${venture.status || "unknown"}`,
    `Decision: ${venture.decision || "not recorded"}`,
    `Market: ${venture.market || "not recorded"}`,
    `Reason: ${venture.reason || note || "not recorded"}`,
    `Evidence: ${(venture.evidence || []).join(" | ") || "not recorded"}`,
    `Kill criteria: ${venture.kill || venture.kill_criteria || "not recorded"}`,
    venture.redTeamReport ? `Red-team report:\n${venture.redTeamReport}` : "",
    `Archive note: ${note || "not supplied"}`
  ].filter(Boolean).join("\n\n");
}
