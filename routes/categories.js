import { Router } from "express";
import client from "../db.js";

const router = Router();

// GET /api/categories
router.get("/", async (req, res) => {
  const { rows } = await client.query(
    `SELECT * FROM categories
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [req.userId]
  );
  res.json(rows);
});

// GET /api/categories/:id
router.get("/:id", async (req, res) => {
  const { rows } = await client.query(
    `SELECT * FROM categories
     WHERE id = $1     AND user_id = $2`,
    [req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ message: "Not Found" });
  res.json(rows[0]);
});

// POST /api/categories
router.post("/", async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: "Missing required field" });
  }

  const { rows } = await client.query(
    `INSERT INTO categories (user_id, name, type)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [req.userId, name, type]
  );
  const category = rows[0];

  await client.query(
    `INSERT INTO notifications (user_id, message, type, scheduled_for)
     VALUES ($1, $2, $3, now())`,
    [req.userId, `Category "${name}" created`, "info"]
  );

  res.status(201).json(category);
});

// PUT /api/categories/:id
router.put("/:id", async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const { rows } = await client.query(
    `UPDATE categories
     SET name=$1, type=$2, updated_at=now()
     WHERE id=$3 AND user_id=$4
     RETURNING *`,
    [name, type, req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ message: "Not Found" });

  await client.query(
    `INSERT INTO notifications (user_id, message, type, scheduled_for)
     VALUES ($1, $2, $3, now())`,
    [req.userId, `Category "${name}" updated`, "info"]
  );
  res.json(rows[0]);
});

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
  const { rows: txCheck } = await client.query(`SELECT 1 FROM transactions WHERE category_id = $1 LIMIT 1`, [req.params.id]);

  if (txCheck.length > 0) {
    return res.status(400).json({ message: "Category is in use and cannot be deleted." });
  }
  const { rowCount } = await client.query("DELETE FROM categories WHERE id=$1 AND user_id=$2", [req.params.id, req.userId]);
  if (rowCount === 0) return res.status(404).json({ message: "Not Found" });
  await client.query(
    `INSERT INTO notifications (user_id, message, type, scheduled_for)
     VALUES ($1, $2, $3, now())`,
    [req.userId, `Category deleted`, "warning"]
  );
  res.sendStatus(204);
});

export default router;
