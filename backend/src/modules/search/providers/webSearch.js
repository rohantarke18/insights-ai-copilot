/**
 * Web search via Tavily (https://tavily.com) — built for LLM/agent use cases,
 * has a free tier, quick signup. Swap this file's internals if the team
 * prefers another provider (Serper, Brave Search, etc.) — the return shape
 * is what matters to the rest of the pipeline.
 *
 * Requires env var: TAVILY_API_KEY
 * Degrades gracefully (returns []) if the key is missing or the request fails,
 * so one flaky/missing provider never takes down the whole search pipeline.
 */
async function searchWeb(query, maxResults = 5) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.warn("[search:web] TAVILY_API_KEY not set — skipping web search.");
    return [];
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
        search_depth: "basic",
      }),
    });

    if (!response.ok) {
      console.warn(`[search:web] Tavily request failed with status ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.results || []).map((r) => ({
      type: "web",
      title: r.title,
      snippet: (r.content || "").slice(0, 300),
      url: r.url,
    }));
  } catch (err) {
    console.warn("[search:web] Tavily error:", err.message);
    return [];
  }
}

module.exports = { searchWeb };
