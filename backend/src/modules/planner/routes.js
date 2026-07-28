const express = require("express");
const router = express.Router();

const controller = require("./controller");

// Full path once mounted at app.use("/api", plannerRoutes):
// GET /api/sessions/:sessionId/plan
router.get("/sessions/:sessionId/plan", controller.getSessionPlan);

module.exports = router;
