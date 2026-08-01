const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Full path once mounted at app.use("/api", clusteringRoutes):
// GET /api/sessions/:sessionId/clusters
router.get("/sessions/:sessionId/clusters", controller.getClusters);

module.exports = router;