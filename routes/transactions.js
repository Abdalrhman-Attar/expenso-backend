import { Router } from "express";
const router = Router();

const dummy = [
  { id: 1, description: "Salary", amount: 5000, type: "income", category: "Salary", date: "2025-06-01" },
  { id: 2, description: "Groceries", amount: -200, type: "expense", category: "Food", date: "2025-06-02" },
];

router.get("/", (req, res) => {
  res.json(dummy);
});

export default router;
