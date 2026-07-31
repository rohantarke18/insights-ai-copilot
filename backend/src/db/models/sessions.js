const db = require("../connection");
const { randomUUID } = require("crypto");

function createSession(userId, ideaText) {
  const id = "sess_" + randomUUID();
  const createdAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO sessions (id, user_id, idea_text, status, created_at) VALUES (?, ?, ?, 'processing', ?)`
  ).run(id, userId, ideaText, createdAt);
  return { sessionId: id, ideaText, status: "processing", createdAt };
}

function getSession(sessionId) {
  return db.prepare(`SELECT * FROM sessions WHERE id = ?`).get(sessionId);
}

function updateSessionStatus(sessionId, status) {
  db.prepare(`UPDATE sessions SET status = ? WHERE id = ?`).run(status, sessionId);
}

function updateSessionSummary(sessionId, summary) {
  db.prepare(`UPDATE sessions SET summary = ? WHERE id = ?`).run(summary, sessionId);
}

function listSessionsByUser(userId) {
  return db
    .prepare(`SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC`)
    .all(userId);
}

function countSessionsByUser(userId) {
  return db.prepare(`SELECT COUNT(*) as count FROM sessions WHERE user_id = ?`).get(userId).count;
}

module.exports = {
  createSession,
  getSession,
  updateSessionStatus,
  updateSessionSummary,
  listSessionsByUser,
  countSessionsByUser,
};
