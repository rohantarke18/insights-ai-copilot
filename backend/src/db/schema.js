const db = require("./connection");

/**
 * Creates all tables if they don't already exist. Safe to call on every
 * server startup — CREATE TABLE IF NOT EXISTS is a no-op once tables exist.
 */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'user-student-1',
      idea_text TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'processing',
      summary TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      snippet TEXT,
      url TEXT,
      citation_index INTEGER,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS plans (
      session_id TEXT PRIMARY KEY,
      architecture TEXT,
      tech_stack_json TEXT,
      milestones_json TEXT,
      apis_json TEXT,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'user-student-1',
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workspace_items (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      source_id TEXT,
      title TEXT,
      snippet TEXT,
      type TEXT,
      url TEXT,
      saved_at TEXT NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
  `);
}

module.exports = { initSchema };
