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
  "architecture": {
    "overview": "1-2 sentences on the design philosophy for THIS specific idea",
    "components": [
      { "name": "string", "role": "what this component does", "techChoice": "specific tech used", "reasoning": "why this tech fits THIS idea specifically" }
    ],
    "dataFlow": "step-by-step description of how data/requests move end-to-end through the system".
    "diagramMermaid": "a Mermaid.js flowchart definition — see rules below"
  },
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
- - "diagramMermaid" must be valid Mermaid.js flowchart syntax starting with "flowchart TD".
- Do NOT draw a single straight linear chain (A-->B-->C-->D). Real architecture has layers, parallel paths, and a data store — reflect that structure.
- Group nodes into subgraphs by layer, e.g.: subgraph Frontend, subgraph Backend Services, subgraph Data Layer, subgraph External Integrations. Use at least 3 subgraphs.
- Include a database/storage node explicitly (e.g., a Database or Cache), even if not listed as a separate "components" entry — infer it from what the components need to persist.
- If any component runs independently/continuously (e.g., a scraper, a scheduler, a background worker), draw it as a separate branch feeding INTO the data layer, not inline in the main user-facing flow — show it in parallel, not sequentially.
- If the idea involves any external API or third-party service, add it as its own node in an "External Integrations" subgraph, connected with a distinct arrow style: -.->
- Use short alphanumeric node IDs (A, B, C...) with labels in square brackets, e.g. A[Resume Parser]. No special characters, quotes, or parentheses inside labels.
- Escape all newlines in "diagramMermaid" as \\n since it's a JSON string value.
- Example shape to follow (adapt structure and labels to THIS idea — do not copy this content):
  "flowchart TD\\n  subgraph Frontend\\n    A[Web Client]\\n  end\\n  subgraph Backend Services\\n    B[API Gateway]\\n    C[Core Processing Service]\\n  end\\n  subgraph Data Layer\\n    D[(Primary Database)]\\n  end\\n  subgraph External Integrations\\n    E[Third-Party API]\\n  end\\n  A --> B\\n  B --> C\\n  C --> D\\n  C -.-> E\\n  F[Background Worker] --> D"
- Include at least 3 milestones and at least 3 entries in apisAndDatasets, grounded in the research above where relevant.`;
}

module.exports = { buildPlannerPrompt };
