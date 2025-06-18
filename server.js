import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import client from "./db.js";
import morgan from "morgan";

import transactionsRouter from "./routes/transactions.js";
import categoriesRouter from "./routes/categories.js";
import notificationsRouter from "./routes/notifications.js";
import usersRouter from "./routes/users.js";
import { checkJwt, requireUser } from "./middleware/auth.js";

dotenv.config();

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
});

// Handle OPTIONS requests with logging
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Authorization,Content-Type");
    res.set("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

// HTTP request logging
app.use(morgan("dev"));

// CORS middleware (consider removing if custom middleware suffices)
app.use(
  cors({
    origin: "https://expensofrontend-production.up.railway.app",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/users", checkJwt, usersRouter);
app.use("/api/transactions", checkJwt, requireUser, transactionsRouter);
app.use("/api/categories", checkJwt, requireUser, categoriesRouter);
app.use("/api/notifications", checkJwt, requireUser, notificationsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 3002;

// Start server with logging
client
  .connect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err.stack);
    process.exit(1); // Exit process if DB connection fails
  });

// Simple test route (optional, for debugging)
app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});
