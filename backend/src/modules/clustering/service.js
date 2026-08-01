const { buildClusteringPrompt } = require("./prompt");
const { callLLM } = require("./llmClient");
const sessionsModel = require("../../db/models/sessions");
const sourcesModel = require("../../db/models/sources");
const clustersModel = require("../../db/models/clusters");

function parseClusterResponse(rawText) {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed.clusters)) {
    throw new Error("LLM response missing a clusters array.");
  }
  return parsed.clusters;
}

/**
 * Turns the LLM's { label, description, sourceIndexes } groupings into
 * clusters backed by real source objects, and guarantees every source the
 * user actually has ends up in exactly one cluster — even if the model
 * dropped, duplicated, or invented an index.
 */
function attachRealSources(rawClusters, sources) {
  const byIndex = new Map(sources.map((s) => [s.citationIndex, s]));
  const seen = new Set();

  const clusters = rawClusters
    .map((c) => {
      const clusterSources = (Array.isArray(c.sourceIndexes) ? c.sourceIndexes : [])
        .filter((idx) => byIndex.has(idx) && !seen.has(idx))
        .map((idx) => {
          seen.add(idx);
          return byIndex.get(idx);
        });
      return {
        label: String(c.label || "Untitled Cluster").slice(0, 60),
        description: String(c.description || ""),
        sources: clusterSources,
      };
    })
    .filter((c) => c.sources.length > 0);

  // Anything the model missed or duplicated away from — surface it rather
  // than silently drop it, so no source vanishes from the UI.
  const leftover = sources.filter((s) => !seen.has(s.citationIndex));
  if (leftover.length > 0) {
    clusters.push({
      label: "Other / Unclustered",
      description: "Sources that didn't fit clearly into another theme.",
      sources: leftover,
    });
  }

  return clusters;
}

exports.getClusters = async (sessionId) => {
  const cached = clustersModel.getClusters(sessionId);
  if (cached) {
    return { sessionId, clusters: cached };
  }

  const session = sessionsModel.getSession(sessionId);
  if (!session) {
    const err = new Error(`Session ${sessionId} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const sources = sourcesModel.getSourcesBySession(sessionId);
  if (sources.length === 0) {
    const empty = [];
    clustersModel.saveClusters(sessionId, empty);
    return { sessionId, clusters: empty };
  }

  const prompt = buildClusteringPrompt(session.idea_text, sources);

  let clusters;
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const rawText = await callLLM(prompt);
      const rawClusters = parseClusterResponse(rawText);
      clusters = attachRealSources(rawClusters, sources);
      break;
    } catch (err) {
      lastError = err;
    }
  }

  // Best-effort, same philosophy as the DeepSearch summary: a clustering
  // failure shouldn't take down a page that otherwise has real data to show.
  // Fall back to one flat "All Sources" cluster instead of an error page.
  if (!clusters) {
    console.error("[clustering] failed after retry, falling back:", lastError?.message);
    clusters = [
      {
        label: "All Sources",
        description: "Automatic clustering is temporarily unavailable — showing all sources together.",
        sources,
      },
    ];
  }

  clustersModel.saveClusters(sessionId, clusters);
  return { sessionId, clusters };
};