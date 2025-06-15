import { Router } from "express";
const router = Router();

const dummy = [{ id: "n1", message: "Rent due soon", type: "reminder", date: "2025-06-10T09:00:00Z" }];

router.get("/", (req, res) => {
  res.json(dummy);
});

export default router;
