import { Router } from "express";
import { dbStore } from "../config/db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
const router = Router();
router.get("/", (_req, res) => {
  const rules = dbStore.getPricingRules();
  res.json({ rules });
});
router.post("/calculate", (req, res) => {
  try {
    const {
      distanceKm = 5,
      propertyType = "1_bhk",
      vehicleType = "tata_ace",
      helpersCount = 2,
      packingType = "none",
      pickupFloor = 0,
      hasPickupLift = true,
      dropFloor = 0,
      hasDropLift = true
    } = req.body;
    const rules = dbStore.getPricingRules();
    const dist = Math.max(1, Number(distanceKm) || 5);
    const helpers = Math.max(0, Number(helpersCount) || 0);
    const extraKm = Math.max(0, dist - rules.baseCityDistanceKm);
    const transportBase = rules.baseRate + extraKm * rules.perKmRate;
    const vehicleMult = rules.vehicleMultipliers[vehicleType] || 1;
    const vehicleCost = Math.round(transportBase * vehicleMult);
    const propertyMult = rules.propertyMultipliers[propertyType] || 1;
    const loadAdjustedCost = Math.round(vehicleCost * propertyMult);
    const helpersCost = helpers * rules.helperRate;
    const packingCost = rules.packingRates[packingType] || 0;
    let floorCharges = 0;
    if (!hasPickupLift && Number(pickupFloor) > 1) {
      floorCharges += (Number(pickupFloor) - 1) * rules.floorChargePerFloor * (helpers > 0 ? 1 : 0.5);
    }
    if (!hasDropLift && Number(dropFloor) > 1) {
      floorCharges += (Number(dropFloor) - 1) * rules.floorChargePerFloor * (helpers > 0 ? 1 : 0.5);
    }
    floorCharges = Math.round(floorCharges);
    const subtotal = loadAdjustedCost + helpersCost + packingCost + floorCharges;
    const estimatedTotal = Math.round(subtotal / 50) * 50;
    res.json({
      estimatedTotal,
      isIndicative: true,
      breakdown: {
        baseAndDistanceCost: loadAdjustedCost,
        helpersCost,
        packingCost,
        floorCharges,
        distanceKm: dist,
        vehicleType,
        propertyType,
        helpersCount: helpers
      },
      disclaimer: "This is an indicative estimate based on Kolhapur standard transit rates. Final price is confirmed upon booking review."
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error calculating estimate" });
  }
});
router.put("/", authenticate, requireRole("admin"), (req, res) => {
  try {
    const updates = req.body;
    const updated = dbStore.updatePricingRules(updates);
    res.json({ message: "Pricing rules updated successfully", rules: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error updating pricing rules" });
  }
});
export default router;
