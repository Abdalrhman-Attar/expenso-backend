import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import client from "./db.js";

import transactionsRouter from "./routes/transactions.js";
import categoriesRouter from "./routes/categories.js";
import notificationsRouter from "./routes/notifications.js";
import usersRouter from "./routes/users.js";
import { checkJwt, requireUser } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

// 1) Users (upsert/fetch) → only JWT needed
app.use("/api/users", checkJwt, usersRouter);

// 2) Resource routes → JWT + requireUser
app.use("/api/transactions", checkJwt, requireUser, transactionsRouter);
app.use("/api/categories", checkJwt, requireUser, categoriesRouter);
app.use("/api/notifications", checkJwt, requireUser, notificationsRouter);

client
  .connect()
  .then(() => app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)))
  .catch((err) => console.error("DB connection error", err));
