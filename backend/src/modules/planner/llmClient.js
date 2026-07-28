/**
 * Thin wrapper around the Anthropic Messages API.
 * Requires env var: ANTHROPIC_API_KEY (add to backend/.env — see .env.example)
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

async function callLLM(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set in the environment.");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textBlock = (data.content || []).find((block) => block.type === "text");

  if (!textBlock || !textBlock.text) {
    throw new Error("LLM response contained no text content.");
  }

  return textBlock.text;
}

module.exports = { callLLM };
