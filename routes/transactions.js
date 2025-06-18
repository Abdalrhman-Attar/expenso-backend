import { Router } from "express";
import client from "../db.js";

const router = Router();

// GET /api/transactions
router.get("/", async (req, res) => {
  const { rows } = await client.query(
    `SELECT * FROM transactions
     WHERE user_id = $1
     ORDER BY date DESC`,
    [req.userId]
  );
  res.json(rows);
});

// GET /api/transactions/:id
router.get("/:id", async (req, res) => {
  const { rows } = await client.query(
    `SELECT * FROM transactions
     WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ message: "Not Found" });
  res.json(rows[0]);
});

// POST /api/transactions
router.post("/", async (req, res) => {
  const { description, amount, type, category_id, date } = req.body;
  if (!description || amount == null || !type || !category_id || !date) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const insert = `
    INSERT INTO transactions
      (user_id, description, amount, type, category_id, date)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`;
  const { rows } = await client.query(insert, [req.userId, description, amount, type, category_id, date]);
  await client.query(
    `INSERT INTO notifications (user_id, message, type, scheduled_for)
     VALUES ($1, $2, $3, now())`,
    [req.userId, `Transaction "${description}" created`, "info"]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/transactions/:id
router.put("/:id", async (req, res) => {
  const { description, amount, type, category_id, date } = req.body;
  if (!description || amount == null || !type || !category_id || !date) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const update = `
    UPDATE transactions
    SET description=$1, amount=$2, type=$3, category_id=$4, date=$5, updated_at=now()
    WHERE id=$6 AND user_id=$7
    RETURNING *`;
  const { rows } = await client.query(update, [description, amount, type, category_id, date, req.params.id, req.userId]);
  if (!rows.length) return res.status(404).json({ message: "Not Found" });
  await client.query(
    `INSERT INTO notifications (user_id, message, type, scheduled_for)
     VALUES ($1, $2, $3, now())`,
    [req.userId, `Transaction "${description}" updated`, "info"]
  );
  res.json(rows[0]);
});

// DELETE /api/transactions/:id
router.delete("/:id", async (req, res) => {
  const { rowCount } = await client.query("DELETE FROM transactions WHERE id=$1 AND user_id=$2", [req.params.id, req.userId]);
  if (rowCount === 0) return res.status(404).json({ message: "Not Found" });
  await client.query(
    `INSERT INTO notifications (user_id, message, type, scheduled_for)
     VALUES ($1, $2, $3, now())`,
    [req.userId, `Transaction deleted`, "warning"]
  );
  res.sendStatus(204);
});

export default router;
