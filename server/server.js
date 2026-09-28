const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`User connected to socket: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Middleware Order as per Phase 6 requirements:
// 1. Helmet
app.use(helmet());

// 2. CORS
app.use(cors());

// 3. Rate Limiters
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "Too many login attempts, please try again later."
});

const reportLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: "Too many report requests, please try again later."
});

const resourceLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many resource requests, please try again later."
});

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 150,
});
app.use(globalLimiter);

// 4. JSON Parser
app.use(express.json());
// Expose uploads statically so frontend can see images locally for now
app.use("/uploads", express.static("uploads"));

// 5. Routes
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/reports", reportLimiter, require("./routes/reportRoutes"));
app.use("/api/resources", resourceLimiter, require("./routes/resourceRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// 6. Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
