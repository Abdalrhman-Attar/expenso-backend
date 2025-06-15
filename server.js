import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { client as pgclient } from "./db.js";

import transactionsRouter from "./routes/transactions.js";
import categoriesRouter from "./routes/categories.js";
import notificationsRouter from "./routes/notifications.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/notifications", notificationsRouter);

pgclient.connect().then(() => app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`)));
