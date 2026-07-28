const { buildPlannerPrompt } = require("./prompt");
const { callLLM } = require("./llmClient");
const { getFakeSession, getFakeSources } = require("./fakeData");

// TODO (Day 2): swap this for real queries once backend/src/db/schema.js
// and a shared DB connection module exist, e.g.:
//   const session = await db.get("SELECT * FROM sessions WHERE id = ?", [sessionId]);
//   const sources  = await db.all("SELECT * FROM sources WHERE session_id = ?", [sessionId]);
async function fetchSessionData(sessionId) {
  const session = getFakeSession(sessionId);
  const sources = getFakeSources(sessionId);
  return { session, sources };
}

// Strips ```json / ``` fences if the model wraps its output despite
// instructions not to, then JSON.parses the result.
function parsePlanResponse(rawText) {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

function validatePlanShape(plan) {
  const requiredFields = ["sessionId", "architecture", "techStack", "milestones", "apisAndDatasets"];
  for (const field of requiredFields) {
    if (!(field in plan)) {
      throw new Error(`LLM response missing required field: ${field}`);
    }
  }
  if (!Array.isArray(plan.techStack) || !Array.isArray(plan.milestones) || !Array.isArray(plan.apisAndDatasets)) {
    throw new Error("LLM response has an array field that is not an array.");
  }
}

exports.getPlan = async (sessionId) => {
  const { session, sources } = await fetchSessionData(sessionId);
  const prompt = buildPlannerPrompt(session.idea_text, sources);

  let plan;
  let lastError;

  // Attempt 1, then exactly one retry on parse/validation failure.
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const rawText = await callLLM(prompt);
      const parsed = parsePlanResponse(rawText);
      validatePlanShape(parsed);
      plan = parsed;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!plan) {
    const err = new Error("Failed to get a valid plan from the LLM after retrying.");
    err.statusCode = 502;
    err.cause = lastError;
    throw err;
  }

  plan.sessionId = sessionId;
  return plan;
};
