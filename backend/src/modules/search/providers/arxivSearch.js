/**
 * Research paper search via the public arXiv API (no key required).
 * Returns XML, parsed here with light regex extraction to avoid pulling in
 * an XML parser dependency for a hackathon backend.
 */
async function searchArxiv(query, maxResults = 3) {
  try {
    const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
      query
    )}&start=0&max_results=${maxResults}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`[search:arxiv] arXiv request failed with status ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const entries = xml.split("<entry>").slice(1);

    return entries.map((entry) => {
      const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [, "Untitled paper"])[1]
        .trim()
        .replace(/\s+/g, " ");
      const summary = (entry.match(/<summary>([\s\S]*?)<\/summary>/) || [, ""])[1]
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 300);
      const id = (entry.match(/<id>([\s\S]*?)<\/id>/) || [, ""])[1].trim();
      const publishedYear = (entry.match(/<published>([\s\S]*?)<\/published>/) || [, ""])[1].slice(
        0,
        4
      );

      return {
        type: "paper",
        title,
        snippet: summary,
        url: id,
        publishedYear,
      };
    });
  } catch (err) {
    console.warn("[search:arxiv] error:", err.message);
    return [];
  }
}

module.exports = { searchArxiv };
