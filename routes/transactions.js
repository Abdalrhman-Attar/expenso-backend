import { Router } from "express";
const router = Router();

// In-memory store
let transactions = [
  { id: "1", description: "Salary", amount: 5000, type: "income", category: "Salary", date: "2025-06-01" },
  { id: "2", description: "Groceries", amount: -200, type: "expense", category: "Food", date: "2025-06-02" },
];

// GET  /api/transactions
router.get("/", (req, res) => {
  res.json(transactions);
});

// GET  /api/transactions/:id
router.get("/:id", (req, res) => {
  const transaction = transactions.find((t) => t.id === req.params.id);
  if (!transaction) return res.status(404).json({ message: "Not Found" });
  res.json(transaction);
});

// POST /api/transactions
router.post("/", (req, res) => {
  const { description, amount, type, category, date } = req.body;
  if (!description || amount == null || !type || !category || !date) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const newTransaction = {
    id: Date.now().toString(),
    description,
    amount: parseFloat(amount),
    type,
    category,
    date,
  };
  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

// PUT  /api/transactions/:id
router.put("/:id", (req, res) => {
  const idx = transactions.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not Found" });
  const { description, amount, type, category, date } = req.body;
  if (!description || amount == null || !type || !category || !date) {
    return res.status(400).json({ message: "Missing required field" });
  }
  const updated = {
    id: req.params.id,
    description,
    amount: parseFloat(amount),
    type,
    category,
    date,
  };
  transactions[idx] = updated;
  res.json(updated);
});

// DELETE /api/transactions/:id   → remove
router.delete("/:id", (req, res) => {
  const before = transactions.length;
  transactions = transactions.filter((t) => t.id !== req.params.id);
  if (transactions.length === before) {
    return res.status(404).json({ message: "Not Found" });
  }
  res.status(204).send();
});

export default router;
