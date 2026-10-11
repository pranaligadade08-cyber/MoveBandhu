import { Router } from "express";
import { dbStore } from "../config/db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
const router = Router();
router.get("/", (_req, res) => {
  const services = dbStore.getServices();
  res.json({ services });
});
router.put("/:id", authenticate, requireRole("admin"), (req, res) => {
  const updates = req.body;
  const updated = dbStore.updateService(req.params.id, updates);
  if (!updated) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json({ message: "Service updated", service: updated });
});
export default router;
