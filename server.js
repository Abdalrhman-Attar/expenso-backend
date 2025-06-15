// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3002;

import transactionsRouter from "./routes/transactions.js";
import categoriesRouter from "./routes/categories.js";
import notificationsRouter from "./routes/notifications.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/notifications", notificationsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
