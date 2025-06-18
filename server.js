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
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Authorization,Content-Type");
    res.set("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});
app.use(morgan("dev"));

app.use(
  cors({
    origin: "https://expensofrontend-production.up.railway.app",
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.use("/api/users", checkJwt, usersRouter);

app.use("/api/transactions", checkJwt, requireUser, transactionsRouter);
app.use("/api/categories", checkJwt, requireUser, categoriesRouter);
app.use("/api/notifications", checkJwt, requireUser, notificationsRouter);

client
  .connect()
  .then(() => app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)))
  .catch((err) => console.error("DB connection error", err));
