
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./src/db/schema");

const app = express();

app.use(cors());
app.use(express.json());

// Platform routes
const platformRoutes = require("./src/modules/platform/routes");
app.use("/api", platformRoutes);

// TODO: Person A mounts search routes here
// TODO: Person B mounts planner routes here

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
