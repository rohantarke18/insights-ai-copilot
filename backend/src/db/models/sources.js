const db = require("../connection");

function insertSources(sessionId, sources) {
  const insert = db.prepare(
    `INSERT INTO sources (id, session_id, type, title, snippet, url, citation_index) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const insertMany = db.transaction((items) => {
    for (const s of items) {
      insert.run(s.id, sessionId, s.type, s.title, s.snippet || "", s.url || "", s.citationIndex);
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

module.exports = {
  insertSources,
  getSourcesBySession,
  getSourceById,
  countSourcesByUser,
};
