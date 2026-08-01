const { randomUUID } = require("crypto");
const sessionsModel = require("../../db/models/sessions");
const sourcesModel = require("../../db/models/sources");
const { searchWeb } = require("./providers/webSearch");
const { searchGithub } = require("./providers/githubSearch");
const { searchArxiv } = require("./providers/arxivSearch");
const { generateSummary } = require("./summarizer");

/**
 * Runs all three providers in parallel, combines results, and assigns
 * sequential citation numbers across the combined list (not per-provider) —
 * this matters because the summary prompt and the frontend's [1][2][3]
 * citation markers both reference this single combined numbering.
 */
async function runSearchPipeline(ideaText) {
  const [webResults, githubResults, arxivResults] = await Promise.all([
    searchWeb(ideaText, 5),
    searchGithub(ideaText, 4),
    searchArxiv(ideaText, 3),
  ]);

  const combined = [...webResults, ...githubResults, ...arxivResults];

  return combined.map((s, index) => ({
    id: "src_" + randomUUID(),
    citationIndex: index + 1,
    ...s,
  }));
}

/**
 * IMPORTANT: this runs synchronously (the HTTP request stays open) until
 * search + summarization finish, rather than returning immediately with a
 * "processing" status. The frontend's mock api.ts already treats
 * createResearchSession as a single blocking call that returns a completed
 * session — matching that means zero frontend changes are needed to wire
 * this up. It also means this request can take 5-15 seconds; the frontend's
 * existing multi-step loading UI ("Searching sources...", "Drafting...")
 * covers that wait naturally.
 *
 * @param {string} language - ISO-ish code (en, hi, mr, es, fr, ta, te, bn)
 *   for Multilingual Support. Only affects the generated summary text —
 *   search queries and source content are unaffected. Defaults to English.
 */
exports.createResearchSession = async (ideaText, userId, language = "en") => {
  const session = sessionsModel.createSession(userId, ideaText);

  let sources = [];
  try {
    sources = await runSearchPipeline(ideaText);
    sourcesModel.insertSources(session.sessionId, sources);
  } catch (err) {
    // Providers already catch their own errors internally and return [],
    // so this only fires on something unexpected (e.g. a DB write failure).
    // A search failure IS fatal — there's nothing to show the user.
    sessionsModel.updateSessionStatus(session.sessionId, "failed");
    console.error("[search] search pipeline failed:", err);
    return {
      sessionId: session.sessionId,
      ideaText,
      createdAt: session.createdAt,
      status: "failed",
      sourcesCount: 0,
    };
  }

  // Summary generation is treated as best-effort: if the LLM call fails
  // (missing/invalid API key, rate limit, transient network error), we still
  // return the session as "completed" with the real sources we found, just
  // with a fallback summary — losing a nicely-written paragraph is a much
  // smaller problem than throwing away valid search results the user is
  // waiting on. Only a total absence of sources AND a failed summary call
  // is worth surfacing as an actual failure.
  let summary;
  try {
    summary = await generateSummary(ideaText, sources, language);
  } catch (err) {
    console.error("[search] summary generation failed, falling back:", err.message);
    summary = sources.length > 0
      ? "Sources were found, but an automated summary could not be generated right now. See the individual sources below."
      : "No sources were found and the summary could not be generated. Please check your API keys and try again.";
  }

  sessionsModel.updateSessionSummary(session.sessionId, summary);
  sessionsModel.updateSessionStatus(session.sessionId, "completed");

  return {
    sessionId: session.sessionId,
    ideaText,
    createdAt: session.createdAt,
    status: "completed",
    sourcesCount: sources.length,
  };
};

exports.getDeepSearchResults = (sessionId) => {
  const session = sessionsModel.getSession(sessionId);
  if (!session) {
    const err = new Error(`Session ${sessionId} not found.`);
    err.statusCode = 404;
    throw err;
  }
  const sources = sourcesModel.getSourcesBySession(sessionId);
  return {
    sessionId,
    summary: session.summary || "Research is still processing or failed to generate a summary.",
    sources,
  };
};

/**
 * Real-time Web Intelligence — re-runs ONLY the web provider (not GitHub/
 * arXiv, which don't meaningfully change hour-to-hour the way news/blog
 * results do) against the session's original idea text, and inserts only
 * sources whose URL isn't already saved for this session. Citation
 * numbering continues from the session's current max, so existing [1]-[8]
 * references in the stored summary text never shift.
 */
exports.refreshWebIntelligence = async (sessionId) => {
  const session = sessionsModel.getSession(sessionId);
  if (!session) {
    const err = new Error(`Session ${sessionId} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const freshResults = await searchWeb(session.idea_text, 5, { advanced: true });

  const existingUrls = sourcesModel.getExistingUrlsBySession(sessionId);
  const genuinelyNew = freshResults.filter((r) => r.url && !existingUrls.has(r.url));

  let startIndex = sourcesModel.getMaxCitationIndex(sessionId);
  const newSourceRecords = genuinelyNew.map((s) => ({
    id: "src_" + randomUUID(),
    citationIndex: ++startIndex,
    ...s,
  }));

  if (newSourceRecords.length > 0) {
    sourcesModel.insertSources(sessionId, newSourceRecords);
  }

  return {
    sessionId,
    newSourcesCount: newSourceRecords.length,
    newSources: newSourceRecords,
    totalSources: sourcesModel.getSourcesBySession(sessionId).length,
    checkedAt: new Date().toISOString(),
  };
};