import test from "node:test";
import assert from "node:assert/strict";
import {
  LANES,
  applyRedTeamOutcome,
  archivePayloadForVenture,
  evaluateRedTeamResults,
  parsePrePitchCandidate,
  promoteBoardPitchToRedTeam,
  promoteResearchToBoardPitch
} from "../lib/pipeline.mjs";

test("parsePrePitchCandidate extracts named business fields", () => {
  const venture = parsePrePitchCandidate({
    seed: "synthetic run",
    research: [
      "Business Name: PermitPulse",
      "Target Customer: Small electrical contractors",
      "Pain: Permit status is tracked manually across city portals",
      "Offer: Daily permit-status digest and exception tracker",
      "Funding Need: $0 now, $35 for landing page after approval",
      "Kill Criteria: Kill if fewer than 5 of 30 contractors confirm weekly permit chasing"
    ].join("\n")
  });
  assert.equal(venture.name, "PermitPulse");
  assert.equal(venture.status, LANES.PRE_PITCH);
  assert.match(venture.market, /electrical contractors/);
  assert.match(venture.evidence.join(" "), /Funding need/);
});

test("research and board transitions are explicit lane promotions", () => {
  const prePitch = { id: "v1", name: "PermitPulse", status: LANES.PRE_PITCH, evidence: ["pain", "offer"] };
  const boardPitch = promoteResearchToBoardPitch(prePitch, "2026-07-01T00:00:00.000Z");
  assert.equal(boardPitch.status, LANES.BOARD_PITCH);
  assert.match(boardPitch.reason, /Research filled out/);

  const redTeam = promoteBoardPitchToRedTeam(boardPitch, "2026-07-01T00:01:00.000Z");
  assert.equal(redTeam.status, LANES.RED_TEAM);
  assert.match(redTeam.reason, /adversarial Red-Team/);
});

test("red-team passes on 3 green lights with no major flaw", () => {
  const results = [
    { model: "a", ok: true, content: "Proceed with conditions." },
    { model: "b", ok: true, content: "Green light, budget small." },
    { model: "c", ok: true, content: "No fatal blockers found." },
    { model: "d", ok: false, error: "credits" },
    { model: "e", ok: false, error: "timeout" }
  ];
  const evaluation = evaluateRedTeamResults(results);
  assert.equal(evaluation.passed, true);
  const venture = applyRedTeamOutcome({ id: "v1", name: "PermitPulse", status: LANES.RED_TEAM }, "report", evaluation);
  assert.equal(venture.status, LANES.CAPITAL_GATE);
});

test("red-team holds when a responding seat finds a major flaw", () => {
  const results = [
    { model: "a", ok: true, content: "Proceed with conditions." },
    { model: "b", ok: true, content: "Green light." },
    { model: "c", ok: true, content: "Fatal blocker: unsafe data dependency." }
  ];
  const evaluation = evaluateRedTeamResults(results);
  assert.equal(evaluation.passed, false);
  assert.equal(evaluation.majorFlaws.length, 1);
  const venture = applyRedTeamOutcome({ id: "v1", name: "PermitPulse", status: LANES.RED_TEAM }, "report", evaluation);
  assert.equal(venture.status, LANES.RED_TEAM);
  assert.match(venture.reason, /major flaw/);
});

test("archive payload preserves failure lessons", () => {
  const payload = archivePayloadForVenture({
    name: "PermitPulse",
    status: "red-team",
    decision: "Hold",
    market: "Contractors",
    reason: "No-go until evidence improves.",
    evidence: ["weak buyer proof"],
    kill: "Kill if no interviews convert",
    redTeamReport: "Major flaw: no buyer urgency."
  }, "operator archived failed idea");
  assert.match(payload, /Archived venture: PermitPulse/);
  assert.match(payload, /Red-team report/);
  assert.match(payload, /operator archived failed idea/);
});
