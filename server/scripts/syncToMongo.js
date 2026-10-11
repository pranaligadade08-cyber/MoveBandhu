import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Inquiry from "../models/Inquiry.js";
import PartnerProfile from "../models/PartnerProfile.js";
import PricingRule from "../models/PricingRule.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, "../../data/movebandhu_store.json");

async function syncDataToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ Error: MONGODB_URI not found in .env file!");
    process.exit(1);
  }

  console.log("⏳ Connecting to MongoDB Atlas (database: movebandhu)...");
  try {
    await mongoose.connect(uri, {
      dbName: "movebandhu"
    });
    console.log("✅ Successfully connected to MongoDB Atlas!");

    if (!fs.existsSync(DATA_FILE)) {
      console.error(`❌ Data file not found at ${DATA_FILE}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(rawData);

    console.log("\n📦 Syncing collections to MongoDB:");

    // 1. Users
    if (data.users && data.users.length > 0) {
      for (const u of data.users) {
        await User.findByIdAndUpdate(u._id, u, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      console.log(`  ✓ Synced ${data.users.length} Users into 'users' collection`);
    }

    // 2. Bookings
    if (data.bookings && data.bookings.length > 0) {
      for (const b of data.bookings) {
        await Booking.findByIdAndUpdate(b._id, b, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      console.log(`  ✓ Synced ${data.bookings.length} Bookings into 'bookings' collection`);
    }

    // 3. Inquiries
    if (data.inquiries && data.inquiries.length > 0) {
      for (const i of data.inquiries) {
        await Inquiry.findByIdAndUpdate(i._id, i, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      console.log(`  ✓ Synced ${data.inquiries.length} Inquiries into 'inquiries' collection`);
    }

    // 4. Partner Profiles
    if (data.partnerProfiles && data.partnerProfiles.length > 0) {
      for (const p of data.partnerProfiles) {
        await PartnerProfile.findByIdAndUpdate(p._id, p, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      console.log(`  ✓ Synced ${data.partnerProfiles.length} Partner Profiles into 'partnerprofiles' collection`);
    }

    // 5. Services
    if (data.services && data.services.length > 0) {
      for (const s of data.services) {
        await Service.findByIdAndUpdate(s._id, s, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      console.log(`  ✓ Synced ${data.services.length} Services into 'services' collection`);
    }

    // 6. Pricing Rules
    if (data.pricingRules) {
      const pr = data.pricingRules;
      await PricingRule.findByIdAndUpdate(pr._id, pr, { upsert: true, new: true, setDefaultsOnInsert: true });
      console.log(`  ✓ Synced Pricing Rules into 'pricingrules' collection`);
    }

    // 7. Reviews
    if (data.reviews && data.reviews.length > 0) {
      for (const r of data.reviews) {
        await Review.findByIdAndUpdate(r._id, r, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      console.log(`  ✓ Synced ${data.reviews.length} Reviews into 'reviews' collection`);
    }

    console.log("\n🎉 ALL COLLECTIONS SUCCESSFULLY CREATED & SYNCED TO MONGODB!");
    console.log("👉 Now open or refresh MongoDB Compass: you will see the 'movebandhu' database with all 7 collections!");

  } catch (err) {
    console.error("❌ MongoDB sync error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  }
}

syncDataToMongo();
