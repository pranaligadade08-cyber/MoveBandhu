import jwt from "jsonwebtoken";
import { dbStore } from "../config/db.js";
const JWT_SECRET = process.env.JWT_SECRET || "movemate_kolhapur_jwt_secret_key_2026_super_secure";
export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required. No token provided." });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbStore.getUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: "User no longer exists or session expired." });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired authentication token." });
  }
}
export function optionalAuthenticate(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = dbStore.getUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
    }
  }
  next();
}
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Access denied. Requires one of roles: ${allowedRoles.join(", ")}` });
      return;
    }
    next();
  };
}
