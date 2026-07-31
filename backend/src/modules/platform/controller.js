const service = require("./service");

exports.getDashboard = (req, res) => {
  res.json(service.getDashboard(req.params.userId));
};

exports.getWorkspaces = (req, res) => {
  res.json(service.getWorkspaces(req.params.userId));
};

exports.createWorkspace = (req, res) => {
  const userId = req.body.userId || "user-student-1";
  res.json(service.createWorkspace(req.body, userId));
};

exports.saveWorkspaceItem = (req, res) => {
  try {
    res.json(service.saveWorkspaceItem(req.params.workspaceId, req.body));
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

exports.deleteWorkspaceItem = (req, res) => {
  try {
    res.json(service.deleteWorkspaceItem(req.params.workspaceId, req.params.itemId));
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
