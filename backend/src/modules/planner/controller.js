const service = require("./service");

exports.getSessionPlan = async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required." });
  }

  try {
    const plan = await service.getPlan(sessionId);
    res.json(plan);
  } catch (err) {
    console.error("[planner] Failed to generate plan:", err);
    res.status(err.statusCode || 500).json({
      error: "Failed to generate project plan.",
      details: err.message,
    });
  }
};
