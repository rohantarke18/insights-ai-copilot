/**
 * Builds the prompt asking the LLM to group sources into thematic clusters.
 *
 * Sources are referenced by their citationIndex (small integers already
 * shown to the user as [1][2][3] in DeepSearch), NOT by their DB id (a
 * UUID). Asking the model to echo back a UUID it never actually saw
 * correctly is asking for hallucination; small integers it can see in the
 * prompt round-trip far more reliably, and service.js maps them back to
 * real source objects afterwards.
 */
function buildClusteringPrompt(ideaText, sources) {
  const sourceList = sources
    .map((s) => `[${s.citationIndex}] (${s.type}) ${s.title}: ${s.snippet}`)
    .join("\n");

  return `You are organizing research sources for a student project into thematic clusters.

PROJECT IDEA:
"""
${ideaText}
"""

SOURCES (numbered):
"""
${sourceList}
"""

TASK:
Group these sources into 3-6 thematic clusters based on what they actually cover
(e.g. "Hardware & Sensors", "Similar Existing Projects", "Underlying Algorithms",
"Datasets & Benchmarks" — invent labels that actually fit these sources, don't
force these examples).

Rules:
- Every source number must appear in exactly one cluster.
- Do not invent a source number that isn't listed above.
- Each cluster needs a short label (2-4 words) and a one-sentence description
  of what ties these sources together.
- Return ONLY raw JSON, no markdown fences, no preamble, in this exact shape:

{
  "clusters": [
    { "label": "string", "description": "string", "sourceIndexes": [1, 2] }
  ]
}`;
}

module.exports = { buildClusteringPrompt };