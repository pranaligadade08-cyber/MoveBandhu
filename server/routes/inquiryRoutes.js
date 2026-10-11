import { Router } from "express";
import { dbStore } from "../config/db.js";
import { optionalAuthenticate, authenticate, requireRole } from "../middleware/auth.js";
import { isValidIndianPhone } from "./authRoutes.js";
const router = Router();
const BUSINESS_PHONE = process.env.BUSINESS_PHONE_NUMBER || "+918855029692";
const BUSINESS_WHATSAPP = (process.env.BUSINESS_WHATSAPP_NUMBER || "918855029692").replace(/[^0-9]/g, "");
function generateInquiryReference() {
  const num = Math.floor(1e3 + Math.random() * 9e3);
  return `MM-KOP-${num}`;
}
router.post("/", optionalAuthenticate, (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      serviceCategory = "home-shifting",
      pickupAddress,
      destinationAddress,
      pickupArea = "Kolhapur",
      destinationArea = "Kolhapur",
      movingDate,
      preferredTime = "Morning (9 AM - 12 PM)",
      propertyType = "1_bhk",
      vehiclePreference = "Tata Ace (Chhota Hathi)",
      helpersCount = 2,
      packingRequired = "none",
      additionalNotes,
      estimatedCost
    } = req.body;
    if (!customerName || !phone || !pickupAddress || !destinationAddress || !movingDate) {
      res.status(400).json({
        error: "Please fill all required fields: Name, Phone, Pickup Address, Destination Address, and Moving Date."
      });
      return;
    }
    if (!isValidIndianPhone(phone)) {
      res.status(400).json({ error: "Please provide a valid 10-digit Indian mobile number." });
      return;
    }
    const referenceId = generateInquiryReference();
    const newInquiry = {
      _id: `inq-${Date.now()}`,
      referenceId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : void 0,
      serviceCategory,
      pickupAddress: pickupAddress.trim(),
      destinationAddress: destinationAddress.trim(),
      pickupArea: pickupArea.trim(),
      destinationArea: destinationArea.trim(),
      movingDate,
      preferredTime,
      propertyType,
      vehiclePreference,
      helpersCount: Number(helpersCount) || 0,
      packingRequired: packingRequired || "none",
      additionalNotes: additionalNotes ? additionalNotes.trim() : void 0,
      estimatedCost: estimatedCost ? Number(estimatedCost) : void 0,
      status: "Inquiry Received",
      userId: req.user ? req.user._id : void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbStore.addInquiry(newInquiry);
    const waText = `*MoveMate Kolhapur \u2014 Inquiry ${referenceId}*
\u{1F464} *Name:* ${newInquiry.customerName}
\u{1F4DE} *Phone:* ${newInquiry.phone}
\u{1F69A} *Service:* ${newInquiry.serviceCategory}
\u{1F4CD} *Pickup:* ${newInquiry.pickupAddress} (${newInquiry.pickupArea})
\u{1F3C1} *Drop:* ${newInquiry.destinationAddress} (${newInquiry.destinationArea})
\u{1F4C5} *Date:* ${newInquiry.movingDate} (${newInquiry.preferredTime})
\u{1F4E6} *Load:* ${newInquiry.propertyType} | ${newInquiry.vehiclePreference}
\u{1F477} *Helpers:* ${newInquiry.helpersCount} | Packing: ${newInquiry.packingRequired}
${newInquiry.estimatedCost ? `\u{1F4B0} *Est. Quote:* \u20B9${newInquiry.estimatedCost}` : ""}
${newInquiry.additionalNotes ? `\u{1F4DD} *Notes:* ${newInquiry.additionalNotes}` : ""}

Please confirm availability and best quote.`;
    const encodedWaText = encodeURIComponent(waText);
    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodedWaText}`;
    res.status(201).json({
      message: "Inquiry submitted successfully! Our team will contact you shortly.",
      inquiry: newInquiry,
      referenceId,
      whatsappUrl,
      directCallNumber: BUSINESS_PHONE
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error processing inquiry" });
  }
});
router.get("/", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const all = dbStore.getInquiries();
  if (req.user.role === "admin") {
    res.json({ inquiries: all });
    return;
  }
  const userInquiries = all.filter(
    (i) => i.userId === req.user?._id || i.phone === req.user?.phone || i.email && i.email === req.user?.email
  );
  res.json({ inquiries: userInquiries });
});
router.get("/:id", optionalAuthenticate, (req, res) => {
  const inquiry = dbStore.getInquiryById(req.params.id);
  if (!inquiry) {
    res.status(404).json({ error: "Inquiry not found" });
    return;
  }
  res.json({ inquiry });
});
router.patch("/:id/status", authenticate, requireRole("admin"), (req, res) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: "Status is required" });
    return;
  }
  const updated = dbStore.updateInquiry(req.params.id, { status });
  if (!updated) {
    res.status(404).json({ error: "Inquiry not found" });
    return;
  }
  res.json({ message: "Inquiry status updated", inquiry: updated });
});
export default router;
