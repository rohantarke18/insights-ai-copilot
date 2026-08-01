const { buildPlannerPrompt } = require("./prompt");
const { callLLM } = require("./llmClient");
const sessionsModel = require("../../db/models/sessions");
const sourcesModel = require("../../db/models/sources");
const plansModel = require("../../db/models/plans");

// Real DB reads — replaces the old fakeData.js stand-ins now that
// backend/src/db/schema.js and a shared DB connection module exist.
async function fetchSessionData(sessionId) {
  const session = sessionsModel.getSession(sessionId);
  if (!session) {
    const err = new Error(`Session ${sessionId} not found.`);
    err.statusCode = 404;
    throw err;
  }
  const sources = sourcesModel.getSourcesBySession(sessionId);
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
  if (typeof plan.architecture !== "object" || plan.architecture === null) {
    throw new Error("LLM response field 'architecture' must be an object.");
  }
  const archFields = ["overview", "components", "dataFlow", "diagramMermaid"];
for (const field of archFields) {
  if (!(field in plan.architecture)) {
    throw new Error(`LLM response 'architecture' missing required field: ${field}`);
  }
}
if (typeof plan.architecture.diagramMermaid !== "string") {
  throw new Error("LLM response 'architecture.diagramMermaid' must be a string.");
}
  if (!Array.isArray(plan.architecture.components) || !Array.isArray(plan.techStack) || !Array.isArray(plan.milestones) || !Array.isArray(plan.apisAndDatasets)) {
    throw new Error("LLM response has an array field that is not an array.");
  }
}

exports.getPlan = async (sessionId) => {
  // Serve a cached plan if one already exists — avoids re-calling the LLM
  // (and risking a different answer) every time the user revisits Project Hub.
  const cached = plansModel.getPlan(sessionId);
  if (cached) {
    return cached;
  }

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
  plansModel.savePlan(sessionId, plan);
  return plan;
};