import { Router } from "express";
const router = Router();

let categories = [
  { id: "c1", name: "Salary", type: "Income", createdAt: "2025-01-01" },
  { id: "c2", name: "Food", type: "Expense", createdAt: "2025-01-02" },
];

// GET    /api/categories
router.get("/", (req, res) => {
  res.json(categories);
});

// GET    /api/categories/:id
router.get("/:id", (req, res) => {
  const cat = categories.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ message: "Not Found" });
  res.json(cat);
});

// POST   /api/categories
router.post("/", (req, res) => {
  const { name, type, createdAt } = req.body;
  if (!name || !type || !createdAt) {
    return res.status(400).json({ message: "Missing required field" });
  }

  if (categories.some((c) => c.name === name && c.type === type)) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const newCat = {
    id: Date.now().toString(),
    name,
    type,
    createdAt,
  };
  categories.push(newCat);
  res.status(201).json(newCat);
});

// PUT    /api/categories/:id
router.put("/:id", (req, res) => {
  const idx = categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not Found" });
  const { name, type, createdAt } = req.body;
  if (!name || !type || !createdAt) {
    return res.status(400).json({ message: "Missing required field" });
  }
  if (categories.some((c) => c.id !== req.params.id && c.name === name && c.type === type)) {
    return res.status(400).json({ message: "Category with this name and type already exists" });
  }
  const updated = { id: req.params.id, name, type, createdAt };
  categories[idx] = updated;
  res.json(updated);
});

// DELETE /api/categories/:id
router.delete("/:id", (req, res) => {
  const before = categories.length;
  categories = categories.filter((c) => c.id !== req.params.id);
  if (categories.length === before) {
    return res.status(404).json({ message: "Not Found" });
  }
  res.status(204).send();
});

export default router;
