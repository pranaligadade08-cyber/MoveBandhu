import { Router } from "express";
import { dbStore } from "../config/db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
const router = Router();
router.get("/", (req, res) => {
  const all = dbStore.getPartnerProfiles();
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const partnersWithUser = all.map((p) => {
        const u = dbStore.getUserById(p.userId);
        return {
          ...p,
          driverName: u?.name || "Driver",
          email: u?.email || "",
          phone: u?.phone || ""
        };
      });
      res.json({ partners: partnersWithUser });
      return;
    } catch {
    }
  }
  const approved = all.filter((p) => p.verificationStatus === "approved");
  res.json({ partners: approved });
});
router.get("/my-profile", authenticate, requireRole("partner"), (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const profile = dbStore.getPartnerByUserId(req.user._id);
  if (!profile) {
    res.status(404).json({ error: "Partner profile not found" });
    return;
  }
  const bookings = dbStore.getBookings().filter((b) => b.assignedPartnerId === profile._id);
  res.json({ profile, bookings });
});
router.patch("/availability", authenticate, requireRole("partner"), (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const profile = dbStore.getPartnerByUserId(req.user._id);
  if (!profile) {
    res.status(404).json({ error: "Partner profile not found" });
    return;
  }
  const { isAvailable } = req.body;
  const updated = dbStore.updatePartnerProfile(profile._id, { isAvailable: Boolean(isAvailable) });
  res.json({ message: "Availability status updated", profile: updated });
});
router.patch("/:id/status", authenticate, requireRole("admin"), (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    res.status(400).json({ error: "Invalid verification status" });
    return;
  }
  const updated = dbStore.updatePartnerProfile(req.params.id, { verificationStatus: status });
  if (!updated) {
    res.status(404).json({ error: "Partner profile not found" });
    return;
  }
  res.json({ message: `Partner verification set to ${status}`, profile: updated });
});
export default router;
