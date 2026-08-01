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

const STOPWORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "with",
  "using", "use", "build", "create", "make", "app", "system", "platform",
  "that", "this", "is", "are", "be", "how", "into", "based", "via", "help",
]);

/**
 * Same fix githubSearch.js already needed: idea text like "Build an app to
 * reduce food waste..." makes Tavily latch onto "Build"/"app" as dominant
 * keywords, pulling in app-building platforms and unrelated companies
 * instead of matching the actual subject. Stripping filler words keeps the
 * query focused on what the idea is actually about.
 */
function extractKeywords(text, maxWords = 8) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return words.slice(0, maxWords).join(" ") || text;
}

/**
 * @param {string} query
 * @param {number} maxResults
 * @param {object} opts
 * @param {boolean} opts.advanced - use Tavily's "advanced" search depth
 *   instead of "basic". Advanced gives better semantic matching and is what
 *   actually populates published_date on most results — but costs more
 *   Tavily API credits per call, so it's opt-in rather than default. Used
 *   by the Real-time Web Intelligence refresh, not the initial DeepSearch
 *   pipeline (which runs 3 providers in parallel and favors speed).
 */
async function searchWeb(query, maxResults = 5, opts = {}) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.warn("[search:web] TAVILY_API_KEY not set — skipping web search.");
    return [];
  }

  try {
    const keywordQuery = extractKeywords(query);

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: keywordQuery,
        max_results: maxResults,
        search_depth: opts.advanced ? "advanced" : "basic",
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
      // Populated reliably only on advanced depth; basic often omits it —
      // that's expected, not a bug.
      publishedDate: r.published_date || null,
    }));
  } catch (err) {
    console.warn("[search:web] Tavily error:", err.message);
    return [];
  }
}

module.exports = { searchWeb };