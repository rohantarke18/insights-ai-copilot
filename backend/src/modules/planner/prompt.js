/**
 * Builds the single prompt sent to the LLM.
 */

function summarizeSources(sources) {
  if (!sources || sources.length === 0) {
    return "No external research sources were found for this session.";
  }
  return sources.map((s, i) => `${i + 1}. ${s.title}: ${s.snippet}`).join("\n");
}

function buildPlannerPrompt(ideaText, sources) {
  const sourcesSummary = summarizeSources(sources);

  return `You are an expert technical project planner helping a hackathon team scope their project.

PROJECT IDEA:
"""
${ideaText}
"""

RELEVANT RESEARCH (DeepSearch results, summarized):
"""
${sourcesSummary}
"""

TASK:
Based on the specific project idea and research above, generate a detailed, PROJECT-SPECIFIC plan.
Do not give generic or boilerplate answers — the architecture, tech stack, milestones, APIs, and
datasets must be clearly tailored to THIS idea. Two different project ideas must never produce a
similar-looking plan.

Return a JSON object with EXACTLY this structure and these field names:

{
  "sessionId": "string",
  "architecture": "a paragraph describing system architecture",
  "techStack": [
    { "category": "Frontend", "items": ["React", "Tailwind"] },
    { "category": "Backend", "items": ["Node.js", "Express"] }
  ],
  "milestones": [
    { "title": "string", "description": "string", "estimatedDate": "Week 1", "complexity": "Low|Medium|High" }
  ],
  "apisAndDatasets": [
    { "name": "string", "type": "api|dataset", "description": "string", "link": "string" }
  ]
}

STRICT OUTPUT RULES:
- Return ONLY valid JSON. Nothing else.
- Do NOT wrap the JSON in markdown code fences.
- Do NOT include any explanation, preamble, or commentary before or after the JSON.
- Use the placeholder value "SESSION_ID_PLACEHOLDER" for "sessionId" — it gets overwritten separately.
- "complexity" must be exactly one of: "Low", "Medium", "High".
- Include at least 3 milestones and at least 3 entries in apisAndDatasets, grounded in the research above where relevant.`;
}

module.exports = { buildPlannerPrompt };
