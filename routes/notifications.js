import { Router } from "express";
import client from "../db.js";

const router = Router();

// GET /api/notifications
router.get("/", async (req, res) => {
  const { rows } = await client.query(
    `SELECT * FROM notifications
     WHERE user_id = $1
     ORDER BY scheduled_for DESC`,
    [req.userId]
  );
  res.json(rows);
});

// GET /api/notifications/:id
router.get("/:id", async (req, res) => {
  const { rows } = await client.query(
    `SELECT * FROM notifications
     WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ message: "Not Found" });
  res.json(rows[0]);
});

// POST /api/notifications
router.post("/", async (req, res) => {
  const { message, type, scheduled_for } = req.body;
  if (!message || !type || !scheduled_for) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const { rows } = await client.query(
    `INSERT INTO notifications (user_id, message, type, scheduled_for)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [req.userId, message, type, scheduled_for]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/notifications/:id
router.put("/:id", async (req, res) => {
  const { message, type, scheduled_for, is_read } = req.body;
  if (!message || !type || !scheduled_for || is_read == null) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const { rows } = await client.query(
    `UPDATE notifications
     SET message=$1, type=$2, scheduled_for=$3, is_read=$4, updated_at=now()
     WHERE id=$5 AND user_id=$6
     RETURNING *`,
    [message, type, scheduled_for, is_read, req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ message: "Not Found" });
  res.json(rows[0]);
});

// DELETE /api/notifications/:id
router.delete("/:id", async (req, res) => {
  const { rowCount } = await client.query("DELETE FROM notifications WHERE id=$1 AND user_id=$2", [req.params.id, req.userId]);
  if (rowCount === 0) return res.status(404).json({ message: "Not Found" });
  res.sendStatus(204);
});

export default router;
