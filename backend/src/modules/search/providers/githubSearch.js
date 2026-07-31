const STOPWORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "with",
  "using", "use", "build", "create", "make", "app", "system", "platform",
  "that", "this", "is", "are", "be", "how", "into", "based", "via", "help",
]);

/**
 * GitHub's search API AND-matches every word in `q` against name/description/
 * topics — feeding it a full idea sentence ("Reduce food waste in college
 * hostels using AI") almost always returns zero results because filler words
 * like "in"/"using" rarely appear together in any real repo. Stripping
 * stopwords and keeping only the salient keywords fixes that.
 */
function extractKeywords(text, maxWords = 5) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return words.slice(0, maxWords).join(" ") || text;
}

/**
 * GitHub repository search via the public GitHub REST API.
 * Works with NO token (60 requests/hour, shared across your IP), but set
 * GITHUB_TOKEN in .env for a much higher rate limit (5000/hour) — important
 * if multiple teammates are testing against the same network during the demo.
 */
async function searchGithub(query, maxResults = 4) {
  try {
    const headers = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const keywordQuery = extractKeywords(query);
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      keywordQuery
    )}&sort=stars&order=desc&per_page=${maxResults}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.warn(`[search:github] GitHub search failed with status ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.items || []).map((repo) => ({
      type: "github",
      title: repo.full_name,
      snippet: repo.description || "No description provided.",
      url: repo.html_url,
      stars: repo.stargazers_count,
    }));
  } catch (err) {
    console.warn("[search:github] error:", err.message);
    return [];
  }
}

module.exports = { searchGithub };
