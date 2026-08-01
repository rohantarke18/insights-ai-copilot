const service = require("./service");

exports.getClusters = async (req, res) => {
  try {
    const result = await service.getClusters(req.params.sessionId);
    res.json(result);
  } catch (err) {
    console.error("[clustering] getClusters failed:", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};