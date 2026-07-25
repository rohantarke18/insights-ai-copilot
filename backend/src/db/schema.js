const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "../../database.sqlite"),
    (err) => {
        if (err) {
            console.error("Database connection failed:", err.message);
        } else {
            console.log("Connected to SQLite database.");
        }
    }
);

// Create all required tables
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            role TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea_text TEXT,
            created_at TEXT,
            status TEXT,
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER,
            type TEXT,
            title TEXT,
            snippet TEXT,
            url TEXT,
            citation_index INTEGER,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS project_plans (
            session_id INTEGER PRIMARY KEY,
            architecture TEXT,
            tech_stack_json TEXT,
            milestones_json TEXT,
            apis_json TEXT,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS workspaces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT,
            description TEXT,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS workspace_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workspace_id INTEGER,
            source_id INTEGER,
            title TEXT,
            snippet TEXT,
            type TEXT,
            url TEXT,
            saved_at TEXT,
            FOREIGN KEY(workspace_id) REFERENCES workspaces(id),
            FOREIGN KEY(source_id) REFERENCES sources(id)
        )
    `);

});

module.exports = db;