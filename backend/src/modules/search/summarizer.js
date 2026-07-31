/**
 * Generates the citation-backed research summary from the aggregated sources.
 * Uses Groq (OpenAI-compatible chat completions API) — free tier, fast
 * inference, good fit for a live demo. Separate small client (kept
 * independent from the planner module's llmClient.js on purpose — avoids
 * touching Person B's already tested code just to share a few lines).
 */
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in the environment.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("LLM response contained no text content.");
  }
  return text;
}

function buildSummaryPrompt(ideaText, sources) {
  const sourceList = sources
    .map((s) => `[${s.citationIndex}] (${s.type}) ${s.title}: ${s.snippet}`)
    .join("\n");

  return `You are a research assistant helping a student evaluate a project idea.

PROJECT IDEA:
"""
${ideaText}
"""

SOURCES FOUND (numbered):
"""
${sourceList || "No sources were found."}
"""

TASK:
Write a 2-3 paragraph research summary that:
- Assesses whether this idea is worth pursuing and what already exists in this space
- References specific sources inline using their bracket number, e.g. [1], [2], exactly matching the numbers above — do not invent a number that isn't listed
- Identifies at least one genuine gap or opportunity for innovation
- Is written in plain prose — no markdown headers, no bullet points

Return ONLY the summary text. No preamble like "Here is the summary", no closing remarks.`;
}

async function generateSummary(ideaText, sources) {
  if (sources.length === 0) {
    return "No external sources could be retrieved for this idea — search providers may be unconfigured or temporarily unavailable. This is a general assessment based on reasoning alone, not verified sources.";
  }
  const prompt = buildSummaryPrompt(ideaText, sources);
  const raw = await callGroq(prompt);
  return raw.trim();
}

module.exports = { generateSummary };