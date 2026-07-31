const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Full paths once mounted at app.use("/api", searchRoutes):
// POST /api/sessions
// GET  /api/sessions/:sessionId/deepsearch
router.post("/sessions", controller.createSession);
router.get("/sessions/:sessionId/deepsearch", controller.getDeepSearchResults);

module.exports = router;
