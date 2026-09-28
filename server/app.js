const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
const { errorHandler } = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;
