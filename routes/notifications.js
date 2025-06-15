import { Router } from "express";
const router = Router();

let notifications = [{ id: "n1", message: "Rent due soon", type: "reminder", date: "2025-06-10T09:00:00Z" }];

// GET    /api/notifications
router.get("/", (req, res) => {
  res.json(notifications);
});

// GET    /api/notifications/:id
router.get("/:id", (req, res) => {
  const n = notifications.find((n) => n.id === req.params.id);
  if (!n) return res.status(404).json({ message: "Not Found" });
  res.json(n);
});

// POST   /api/notifications
router.post("/", (req, res) => {
  const { message, type, date } = req.body;
  if (!message || !type || !date) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const newN = {
    id: Date.now().toString(),
    message,
    type,
    date,
  };
  notifications.push(newN);
  res.status(201).json(newN);
});

// PUT    /api/notifications/:id
router.put("/:id", (req, res) => {
  const idx = notifications.findIndex((n) => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not Found" });
  const { message, type, date } = req.body;
  if (!message || !type || !date) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const updated = { id: req.params.id, message, type, date };
  notifications[idx] = updated;
  res.json(updated);
});

// DELETE /api/notifications/:id
router.delete("/:id", (req, res) => {
  const before = notifications.length;
  notifications = notifications.filter((n) => n.id !== req.params.id);
  if (notifications.length === before) {
    return res.status(404).json({ message: "Not Found" });
  }
  res.status(204).send();
});

export default router;
