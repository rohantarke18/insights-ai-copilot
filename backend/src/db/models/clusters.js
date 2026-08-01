const db = require("../connection");

function getClusters(sessionId) {
  const row = db
    .prepare(`SELECT clusters_json FROM clusters WHERE session_id = ?`)
    .get(sessionId);
  if (!row) return null;
  return JSON.parse(row.clusters_json);
}

function saveClusters(sessionId, clusters) {
  db.prepare(
    `INSERT INTO clusters (session_id, clusters_json, created_at)
     VALUES (?, ?, ?)
     ON CONFLICT(session_id) DO UPDATE SET clusters_json = excluded.clusters_json`
  ).run(sessionId, JSON.stringify(clusters), new Date().toISOString());
}

module.exports = { getClusters, saveClusters };