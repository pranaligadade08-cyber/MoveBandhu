import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { connectMongoDB } from "./server/config/db.js";
import authRoutes from "./server/routes/authRoutes.js";
import inquiryRoutes from "./server/routes/inquiryRoutes.js";
import bookingRoutes from "./server/routes/bookingRoutes.js";
import pricingRoutes from "./server/routes/pricingRoutes.js";
import partnerRoutes from "./server/routes/partnerRoutes.js";
import serviceRoutes from "./server/routes/serviceRoutes.js";
import reviewRoutes from "./server/routes/reviewRoutes.js";
import adminRoutes from "./server/routes/adminRoutes.js";
import downloadRoutes from "./server/routes/downloadRoutes.js";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3e3;
const isProduction = process.env.NODE_ENV === "production";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectMongoDB();
app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/download", downloadRoutes);
app.get("/MoveBandhu.zip", (_req, res) => {
  res.redirect("/api/download/MoveBandhu.zip");
});
app.get("/Movemate.zip", (_req, res) => {
  res.redirect("/api/download/MoveBandhu.zip");
});
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "MoveBandhu Kolhapur API",
    businessPhone: process.env.BUSINESS_PHONE_NUMBER || "+918855029692",
    businessWhatsapp: process.env.BUSINESS_WHATSAPP_NUMBER || "+918855029692",
    time: (/* @__PURE__ */ new Date()).toISOString()
  });
});
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 MoveBandhu Kolhapur full-stack server running on http://localhost:${PORT}`);
  });
}
startServer();
