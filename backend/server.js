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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
