import { Router } from "express";
const router = Router();

const dummy = [
  { id: "c1", name: "Salary", type: "Income", createdAt: "2025-01-01" },
  { id: "c2", name: "Food", type: "Expense", createdAt: "2025-01-02" },
];

router.get("/", (req, res) => {
  res.json(dummy);
});

export default router;
