const sessionsModel = require("../../db/models/sessions");
const sourcesModel = require("../../db/models/sources");
const plansModel = require("../../db/models/plans");
const workspacesModel = require("../../db/models/workspaces");

exports.getDashboard = (userId) => {
  const sessionRows = sessionsModel.listSessionsByUser(userId);
  return {
    stats: {
      ideasExplored: sessionsModel.countSessionsByUser(userId),
      sourcesAnalyzed: sourcesModel.countSourcesByUser(userId),
      plansGenerated: plansModel.countPlansByUser(userId),
    },
    sessions: sessionRows.map((s) => ({
      sessionId: s.id,
      ideaText: s.idea_text,
      createdAt: s.created_at,
      status: s.status,
    })),
  };
};

exports.getWorkspaces = (userId) => workspacesModel.listWorkspaces(userId);

exports.createWorkspace = (body, userId) =>
  workspacesModel.createWorkspace(userId, body.name, body.description);

exports.saveWorkspaceItem = (workspaceId, body) => {
  if (!workspacesModel.workspaceExists(workspaceId)) {
    const err = new Error("Workspace not found.");
    err.statusCode = 404;
    throw err;
  }
  const source = sourcesModel.getSourceById(body.sourceId);
  if (!source) {
    const err = new Error("Source not found — it may have expired or the sourceId is wrong.");
    err.statusCode = 404;
    throw err;
  }
  return workspacesModel.saveItem(workspaceId, source);
};

exports.deleteWorkspaceItem = (workspaceId, itemId) =>
  workspacesModel.removeItem(workspaceId, itemId);
