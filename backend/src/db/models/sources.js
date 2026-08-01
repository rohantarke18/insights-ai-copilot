const db = require("../connection");

// Self-migrating: adds published_date if it doesn't exist yet. Wrapped in
// try/catch because ALTER TABLE ADD COLUMN throws if the column is already
// there — better-sqlite3 has no IF NOT EXISTS for this, so "try and ignore
// duplicate" is the standard safe pattern for a hackathon-speed migration.
try {
  db.prepare(`ALTER TABLE sources ADD COLUMN published_date TEXT`).run();
} catch (err) {
  if (!/duplicate column/i.test(err.message)) {
    console.warn("[db:sources] published_date migration warning:", err.message);
  }
}

function insertSources(sessionId, sources) {
  const insert = db.prepare(
    `INSERT INTO sources (id, session_id, type, title, snippet, url, citation_index, published_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertMany = db.transaction((items) => {
    for (const s of items) {
      insert.run(
        s.id,
        sessionId,
        s.type,
        s.title,
        s.snippet || "",
        s.url || "",
        s.citationIndex,
        s.publishedDate || null
      );
    }
  });
  insertMany(sources);
}

function rowToSource(r) {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    snippet: r.snippet,
    url: r.url,
    citationIndex: r.citation_index,
    publishedDate: r.published_date || null,
  };
}

function getSourcesBySession(sessionId) {
  const rows = db
    .prepare(`SELECT * FROM sources WHERE session_id = ? ORDER BY citation_index ASC`)
    .all(sessionId);
  return rows.map(rowToSource);
}

function getSourceById(sourceId) {
  const row = db.prepare(`SELECT * FROM sources WHERE id = ?`).get(sourceId);
  return row ? rowToSource(row) : null;
}

function countSourcesByUser(userId) {
  return db
    .prepare(
      `SELECT COUNT(*) as count FROM sources
       JOIN sessions ON sources.session_id = sessions.id
       WHERE sessions.user_id = ?`
    )
    .get(userId).count;
}

// New — used by the Real-time Web Intelligence refresh to skip sources
// already saved for this session (same URL = same source).
function getExistingUrlsBySession(sessionId) {
  const rows = db
    .prepare(`SELECT url FROM sources WHERE session_id = ?`)
    .all(sessionId);
  return new Set(rows.map((r) => r.url));
}

// New — refresh needs to continue citation numbering (e.g. next new source
// becomes [9] if sources [1]-[8] already exist), never restart at 1.
function getMaxCitationIndex(sessionId) {
  const row = db
    .prepare(`SELECT MAX(citation_index) as maxIdx FROM sources WHERE session_id = ?`)
    .get(sessionId);
  return row.maxIdx || 0;
}

module.exports = {
  insertSources,
  getSourcesBySession,
  getSourceById,
  countSourcesByUser,
  getExistingUrlsBySession,
  getMaxCitationIndex,
};