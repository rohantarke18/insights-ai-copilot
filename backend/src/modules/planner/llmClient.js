/**
 * Thin wrapper around Groq's OpenAI-compatible chat completions API.
 * Requires env var: GROQ_API_KEY (free tier — see backend/.env.example)
 *
 * Switched from the Anthropic Messages API to Groq to avoid requiring a
 * paid ANTHROPIC_API_KEY. Kept the same exported callLLM(prompt) signature
 * so service.js and prompt.js don't need to change at all.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

async function callLLM(prompt) {
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
      max_tokens: 4000,
      // The prompt already demands raw JSON with no fences; this forces
      // it at the API level too, so parsePlanResponse() in service.js
      // has less to strip/retry on.
      response_format: { type: "json_object" },
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

module.exports = { callLLM };