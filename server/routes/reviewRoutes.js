import { Router } from "express";
import { dbStore } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.get("/", (_req, res) => {
  const reviews = dbStore.getReviews();
  res.json({ reviews });
});
router.post("/", authenticate, (req, res) => {
  try {
    const { bookingReference, rating, commentEn, commentMr, serviceName, location } = req.body;
    if (!rating || !commentEn) {
      res.status(400).json({ error: "Rating and review comment are required" });
      return;
    }
    const newReview = {
      _id: `rev-${Date.now()}`,
      bookingReference: bookingReference || "Verified Move",
      customerName: req.user?.name || "Kolhapur Resident",
      rating: Math.min(5, Math.max(1, Number(rating))),
      commentEn: commentEn.trim(),
      commentMr: commentMr ? commentMr.trim() : void 0,
      serviceName: serviceName || "Home Shifting",
      location: location || "Kolhapur",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbStore.addReview(newReview);
    res.status(201).json({ message: "Thank you for your review!", review: newReview });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error saving review" });
  }
});
export default router;
