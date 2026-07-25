const service = require("./service");

exports.getDashboard = async (req, res) => {
    try {
        const data = await service.getDashboard(req.params.userId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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