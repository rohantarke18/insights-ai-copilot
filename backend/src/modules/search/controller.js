const service = require("./service");

exports.createSession = async (req, res) => {
  const { ideaText, userId } = req.body || {};

  if (!ideaText || typeof ideaText !== "string" || !ideaText.trim()) {
    return res.status(400).json({ error: "ideaText is required." });
  }

  try {
    const session = await service.createResearchSession(
      ideaText.trim(),
      userId || "user-student-1"
    );
    res.json(session);
  } catch (err) {
    console.error("[search] createSession failed:", err);
    res.status(500).json({ error: "Failed to create research session.", details: err.message });
  }
};

exports.getDeepSearchResults = (req, res) => {
  try {
    res.json(service.getDeepSearchResults(req.params.sessionId));
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
