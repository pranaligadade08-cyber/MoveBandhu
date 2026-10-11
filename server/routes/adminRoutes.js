import { Router } from "express";
import { dbStore } from "../config/db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
const router = Router();
router.get("/stats", authenticate, requireRole("admin"), (_req, res) => {
  const users = dbStore.getUsers();
  const bookings = dbStore.getBookings();
  const inquiries = dbStore.getInquiries();
  const partners = dbStore.getPartnerProfiles();
  const activeBookings = bookings.filter((b) => !["Completed", "Cancelled"].includes(b.status)).length;
  const completedBookings = bookings.filter((b) => b.status === "Completed").length;
  const totalRevenue = bookings.filter((b) => b.status !== "Cancelled").reduce((sum, b) => sum + (b.finalCost || b.estimatedCost || 0), 0);
  const pendingPartners = partners.filter((p) => p.verificationStatus === "pending").length;
  const approvedPartners = partners.filter((p) => p.verificationStatus === "approved").length;
  res.json({
    metrics: {
      totalBookings: bookings.length,
      activeBookings,
      completedBookings,
      totalInquiries: inquiries.length,
      totalRevenue,
      totalUsers: users.length,
      approvedPartners,
      pendingPartners
    },
    recentBookings: bookings.slice(0, 5),
    recentInquiries: inquiries.slice(0, 5)
  });
});
router.get("/export/bookings-csv", authenticate, requireRole("admin"), (_req, res) => {
  const bookings = dbStore.getBookings();
  const headers = [
    "Reference ID",
    "Customer Name",
    "Phone",
    "Email",
    "Service",
    "Pickup Address",
    "Pickup Area",
    "Drop Address",
    "Drop Area",
    "Date",
    "Time",
    "Vehicle",
    "Helpers",
    "Estimated Cost (INR)",
    "Final Cost (INR)",
    "Status",
    "Assigned Partner",
    "Created At"
  ];
  const escapeCSV = (val) => {
    if (val === void 0 || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };
  const rows = bookings.map((b) => [
    escapeCSV(b.referenceId),
    escapeCSV(b.customerName),
    escapeCSV(b.phone),
    escapeCSV(b.email || ""),
    escapeCSV(b.serviceCategory),
    escapeCSV(b.pickupAddress),
    escapeCSV(b.pickupArea),
    escapeCSV(b.destinationAddress),
    escapeCSV(b.destinationArea),
    escapeCSV(b.movingDate),
    escapeCSV(b.preferredTime),
    escapeCSV(b.vehiclePreference),
    escapeCSV(b.helpersCount),
    escapeCSV(b.estimatedCost),
    escapeCSV(b.finalCost || b.estimatedCost),
    escapeCSV(b.status),
    escapeCSV(b.assignedPartnerName || "Unassigned"),
    escapeCSV(b.createdAt)
  ].join(","));
  const csvContent = [headers.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=movebandhu-kolhapur-bookings-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
  res.status(200).send(csvContent);
});
export default router;
