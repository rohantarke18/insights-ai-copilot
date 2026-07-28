
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Platform routes
const platformRoutes = require("./src/modules/platform/routes");
app.use("/api", platformRoutes);

// TODO: Person A mounts search routes here
const plannerRoutes = require("./src/modules/planner/routes");
app.use("/api", plannerRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
