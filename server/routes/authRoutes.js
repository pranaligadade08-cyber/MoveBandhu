import { Router } from "express";
import bcrypt from "bcryptjs";
import { dbStore } from "../config/db.js";
import { generateToken, authenticate } from "../middleware/auth.js";
const router = Router();
export function isValidIndianPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/[\s-]/g, "");
  return /^(\+91)?[6-9]\d{9}$/.test(clean);
}
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role = "customer", partnerDetails } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: "Please provide name, email, phone number, and password." });
      return;
    }
    if (!isValidIndianPhone(phone)) {
      res.status(400).json({ error: "Please enter a valid 10-digit Indian mobile number." });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long." });
      return;
    }
    const existingEmail = dbStore.getUserByEmail(email);
    if (existingEmail) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }
    const existingPhone = dbStore.getUserByPhone(phone);
    if (existingPhone) {
      res.status(409).json({ error: "An account with this phone number already exists." });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}`;
    const newUser = {
      _id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      passwordHash,
      role: role === "partner" ? "partner" : "customer",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbStore.addUser(newUser);
    if (role === "partner" && partnerDetails) {
      const partnerProfile = {
        _id: `prof-${Date.now()}`,
        userId,
        businessName: partnerDetails.businessName || `${newUser.name} Transport`,
        vehicleType: partnerDetails.vehicleType || "Tata Ace (Chhota Hathi)",
        vehicleNumber: partnerDetails.vehicleNumber || "MH 09 Registration",
        serviceCategories: partnerDetails.serviceCategories || ["home-shifting", "mini-truck-tempo"],
        operatingLocations: partnerDetails.operatingLocations || ["Kolhapur City"],
        experienceYears: Number(partnerDetails.experienceYears) || 1,
        helpersCount: Number(partnerDetails.helpersCount) || 1,
        verificationStatus: "pending",
        rating: 5,
        completedTrips: 0,
        isAvailable: true,
        notes: partnerDetails.notes || "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      dbStore.addPartnerProfile(partnerProfile);
    }
    const token = generateToken(newUser);
    res.status(201).json({
      message: "Account registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error during registration" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Please enter both email and password" });
      return;
    }
    const user = dbStore.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = generateToken(user);
    const partnerProfile = user.role === "partner" ? dbStore.getPartnerByUserId(user._id) : void 0;
    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        partnerProfile
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error during login" });
  }
});
router.get("/me", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const partnerProfile = req.user.role === "partner" ? dbStore.getPartnerByUserId(req.user._id) : void 0;
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      partnerProfile
    }
  });
});
router.put("/profile", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const { name, phone } = req.body;
  const updates = {};
  if (name) updates.name = name.trim();
  if (phone) {
    if (!isValidIndianPhone(phone)) {
      res.status(400).json({ error: "Invalid Indian phone number" });
      return;
    }
    updates.phone = phone.trim();
  }
  const updated = dbStore.updateUser(req.user._id, updates);
  res.json({ message: "Profile updated", user: updated });
});
export default router;
