const express = require("express");
const router = express.Router();

const controller = require("./controller");

// Dashboard
router.get("/dashboard/:userId", controller.getDashboard);

// Workspaces
router.get("/workspaces/:userId", controller.getWorkspaces);

router.post("/workspaces", controller.createWorkspace);

router.post("/workspaces/:workspaceId/save", controller.saveWorkspaceItem);

router.delete(
  "/workspaces/:workspaceId/items/:itemId",
  controller.deleteWorkspaceItem
);

module.exports = router;