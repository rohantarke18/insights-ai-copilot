const db = require("../connection");
const { randomUUID } = require("crypto");

function createWorkspace(userId, name, description) {
  const id = "ws_" + randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO workspaces (id, user_id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, userId, name, description || "", now, now);
  return { workspaceId: id, name, itemCount: 0, updatedAt: now };
}

function listWorkspaces(userId) {
  const rows = db
    .prepare(`SELECT * FROM workspaces WHERE user_id = ? ORDER BY updated_at DESC`)
    .all(userId);
  return rows.map((w) => {
    const itemCount = db
      .prepare(`SELECT COUNT(*) as count FROM workspace_items WHERE workspace_id = ?`)
      .get(w.id).count;
    return { workspaceId: w.id, name: w.name, itemCount, updatedAt: w.updated_at };
  });
}

function workspaceExists(workspaceId) {
  return !!db.prepare(`SELECT id FROM workspaces WHERE id = ?`).get(workspaceId);
}

function saveItem(workspaceId, source) {
  const id = "item_" + randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO workspace_items (id, workspace_id, source_id, title, snippet, type, url, saved_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    workspaceId,
    source.id || null,
    source.title || "",
    source.snippet || "",
    source.type || "",
    source.url || "",
    now
  );
  db.prepare(`UPDATE workspaces SET updated_at = ? WHERE id = ?`).run(now, workspaceId);
  return { success: true };
}

function removeItem(workspaceId, itemId) {
  db.prepare(`DELETE FROM workspace_items WHERE id = ? AND workspace_id = ?`).run(itemId, workspaceId);
  db.prepare(`UPDATE workspaces SET updated_at = ? WHERE id = ?`).run(
    new Date().toISOString(),
    workspaceId
  );
  return { success: true };
}

module.exports = { createWorkspace, listWorkspaces, workspaceExists, saveItem, removeItem };
