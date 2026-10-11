import { Router } from "express";
import { dbStore } from "../config/db.js";
import { optionalAuthenticate, authenticate } from "../middleware/auth.js";
import { isValidIndianPhone } from "./authRoutes.js";
const router = Router();
const BUSINESS_PHONE = process.env.BUSINESS_PHONE_NUMBER || "+918855029692";
const BUSINESS_WHATSAPP = (process.env.BUSINESS_WHATSAPP_NUMBER || "918855029692").replace(/[^0-9]/g, "");
const VALID_STATUSES = [
  "Inquiry Received",
  "Estimate Prepared",
  "Awaiting Customer Confirmation",
  "Booking Confirmed",
  "Partner Assigned",
  "Pickup in Progress",
  "In Transit",
  "Delivered",
  "Completed",
  "Cancelled"
];
function generateBookingReference() {
  const num = Math.floor(1e3 + Math.random() * 9e3);
  return `BK-KOP-${num}`;
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
      preferredTime = "09:00 AM",
      propertyType = "1_bhk",
      vehiclePreference = "Tata Ace",
      helpersCount = 2,
      packingRequired = "none",
      floorPickup = 0,
      hasLiftPickup = true,
      floorDrop = 0,
      hasLiftDrop = true,
      furnitureItems = [],
      estimatedDistanceKm = 5,
      estimatedCost = 1500,
      customerNotes
    } = req.body;
    if (!customerName || !phone || !pickupAddress || !destinationAddress || !movingDate) {
      res.status(400).json({ error: "Please provide all required booking fields." });
      return;
    }
    if (!isValidIndianPhone(phone)) {
      res.status(400).json({ error: "Please enter a valid 10-digit Indian phone number." });
      return;
    }
    const referenceId = generateBookingReference();
    const newBooking = {
      _id: `bk-${Date.now()}`,
      referenceId,
      userId: req.user ? req.user._id : void 0,
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
      floorPickup: Number(floorPickup) || 0,
      hasLiftPickup: Boolean(hasLiftPickup),
      floorDrop: Number(floorDrop) || 0,
      hasLiftDrop: Boolean(hasLiftDrop),
      furnitureItems: Array.isArray(furnitureItems) ? furnitureItems : [],
      estimatedDistanceKm: Number(estimatedDistanceKm) || 5,
      estimatedCost: Number(estimatedCost) || 1500,
      finalCost: Number(estimatedCost) || 1500,
      status: "Booking Confirmed",
      statusHistory: [
        {
          status: "Inquiry Received",
          timestamp: new Date(Date.now() - 6e4).toISOString(),
          note: "Request initialized"
        },
        {
          status: "Booking Confirmed",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          note: "Booking requested by customer"
        }
      ],
      customerNotes: customerNotes ? customerNotes.trim() : void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbStore.addBooking(newBooking);
    const waText = `*MoveMate Kolhapur \u2014 Booking ${referenceId}*
\u{1F464} *Customer:* ${newBooking.customerName} (${newBooking.phone})
\u{1F69A} *Service:* ${newBooking.serviceCategory}
\u{1F4CD} *From:* ${newBooking.pickupAddress} [Floor ${newBooking.floorPickup}, Lift: ${newBooking.hasLiftPickup ? "Yes" : "No"}]
\u{1F3C1} *To:* ${newBooking.destinationAddress} [Floor ${newBooking.floorDrop}, Lift: ${newBooking.hasLiftDrop ? "Yes" : "No"}]
\u{1F4C5} *Date & Time:* ${newBooking.movingDate} at ${newBooking.preferredTime}
\u{1F69B} *Vehicle:* ${newBooking.vehiclePreference} | \u{1F477} Helpers: ${newBooking.helpersCount}
\u{1F4E6} *Packing:* ${newBooking.packingRequired}
\u{1F4B0} *Est. Total:* \u20B9${newBooking.estimatedCost}
${newBooking.customerNotes ? `\u{1F4DD} *Notes:* ${newBooking.customerNotes}` : ""}

Please confirm driver dispatch and team schedule.`;
    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(waText)}`;
    res.status(201).json({
      message: "Booking successfully placed! Our logistics coordinator will connect with you.",
      booking: newBooking,
      referenceId,
      whatsappUrl,
      directCallNumber: BUSINESS_PHONE
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error creating booking" });
  }
});
router.get("/", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const all = dbStore.getBookings();
  if (req.user.role === "admin") {
    res.json({ bookings: all });
    return;
  }
  if (req.user.role === "partner") {
    const partnerProfile = dbStore.getPartnerByUserId(req.user._id);
    if (!partnerProfile) {
      res.json({ bookings: [] });
      return;
    }
    const partnerBookings = all.filter(
      (b) => b.assignedPartnerId === partnerProfile._id || b.status === "Booking Confirmed" && !b.assignedPartnerId
    );
    res.json({ bookings: partnerBookings });
    return;
  }
  const customerBookings = all.filter(
    (b) => b.userId === req.user?._id || b.phone === req.user?.phone || b.email && b.email === req.user?.email
  );
  res.json({ bookings: customerBookings });
});
router.get("/:id", optionalAuthenticate, (req, res) => {
  const booking = dbStore.getBookingById(req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json({ booking });
});
router.patch("/:id/status", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { status, note, finalCost } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    return;
  }
  const booking = dbStore.getBookingById(req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const isAdmin = req.user.role === "admin";
  const partnerProfile = req.user.role === "partner" ? dbStore.getPartnerByUserId(req.user._id) : null;
  const isAssignedPartner = partnerProfile && booking.assignedPartnerId === partnerProfile._id;
  const isCustomer = booking.userId === req.user._id || booking.phone === req.user.phone;
  if (!isAdmin && !isAssignedPartner && !isCustomer) {
    res.status(403).json({ error: "You are not authorized to update this booking." });
    return;
  }
  if (isCustomer && !isAdmin && !isAssignedPartner) {
    if (status !== "Cancelled") {
      res.status(403).json({ error: "Customers can only cancel a booking prior to pickup." });
      return;
    }
    if (["Pickup in Progress", "In Transit", "Delivered", "Completed"].includes(booking.status)) {
      res.status(400).json({ error: "Cannot cancel booking once pickup has commenced." });
      return;
    }
  }
  const updates = {
    status
  };
  if (finalCost !== void 0 && isAdmin) {
    updates.finalCost = Number(finalCost);
  }
  if (note) {
    updates.customerNotes = note;
  }
  const updated = dbStore.updateBooking(booking._id, updates);
  res.json({ message: "Booking status updated successfully", booking: updated });
});
router.post("/:id/assign-partner", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const booking = dbStore.getBookingById(req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const { partnerId } = req.body;
  let targetPartnerId = partnerId;
  if (req.user.role === "partner") {
    const pProf = dbStore.getPartnerByUserId(req.user._id);
    if (!pProf) {
      res.status(400).json({ error: "Partner profile not found" });
      return;
    }
    targetPartnerId = pProf._id;
  } else if (req.user.role !== "admin") {
    res.status(403).json({ error: "Only admins and partners can assign jobs" });
    return;
  }
  const partner = dbStore.getPartnerById(targetPartnerId);
  if (!partner) {
    res.status(404).json({ error: "Partner profile not found" });
    return;
  }
  const partnerUser = dbStore.getUserById(partner.userId);
  const partnerName = partnerUser ? `${partnerUser.name} (${partner.businessName})` : partner.businessName;
  const updated = dbStore.updateBooking(booking._id, {
    assignedPartnerId: partner._id,
    assignedPartnerName: partnerName,
    assignedPartnerPhone: partnerUser ? partnerUser.phone : "+91 88550 29692",
    assignedVehicle: `${partner.vehicleType} (${partner.vehicleNumber})`,
    status: "Partner Assigned"
  });
  res.json({ message: "Partner assigned successfully", booking: updated });
});
router.post("/:id/cancel", authenticate, (req, res) => {
  const booking = dbStore.getBookingById(req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  if (["Pickup in Progress", "In Transit", "Delivered", "Completed"].includes(booking.status)) {
    res.status(400).json({ error: "Cannot cancel booking after transit has started" });
    return;
  }
  const updated = dbStore.updateBooking(booking._id, {
    status: "Cancelled"
  });
  res.json({ message: "Booking has been cancelled", booking: updated });
});
export default router;
