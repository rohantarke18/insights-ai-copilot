const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initSchema } = require("./src/db/schema");
initSchema();

const app = express();

app.use(cors());
app.use(express.json());

// Platform routes (dashboard, workspaces)
const platformRoutes = require("./src/modules/platform/routes");
app.use("/api", platformRoutes);

// Planner routes (project plan generation)
const plannerRoutes = require("./src/modules/planner/routes");
app.use("/api", plannerRoutes);

// Search routes (DeepSearch / research sessions)
const searchRoutes = require("./src/modules/search/routes");
app.use("/api", searchRoutes);



// Clustering routes (Knowledge Clustering — groups sources by theme)
const clusteringRoutes = require("./src/modules/clustering/routes");
app.use("/api", clusteringRoutes);

// Telegram AI Agent — optional, only starts if TELEGRAM_BOT_TOKEN is set
const { startAgent } = require("./src/modules/agent");
startAgent();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
