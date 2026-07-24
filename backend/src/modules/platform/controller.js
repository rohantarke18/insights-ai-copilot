const service = require("./service");

exports.getDashboard = (req, res) => {
    res.json(service.getDashboard(req.params.userId));
};

exports.getWorkspaces = (req, res) => {
    res.json(service.getWorkspaces(req.params.userId));
};

exports.createWorkspace = (req, res) => {
    res.json(service.createWorkspace(req.body));
};

exports.saveWorkspaceItem = (req, res) => {
    res.json(service.saveWorkspaceItem(req.params.workspaceId, req.body));
};

exports.deleteWorkspaceItem = (req, res) => {
    res.json(service.deleteWorkspaceItem(req.params.itemId));
};