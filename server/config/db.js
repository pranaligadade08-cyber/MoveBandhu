import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Inquiry from "../models/Inquiry.js";
import PartnerProfile from "../models/PartnerProfile.js";
import PricingRule from "../models/PricingRule.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "movebandhu_store.json");
const DEFAULT_PRICING = {
  _id: "pricing-kop-default",
  baseCityDistanceKm: 5,
  baseRate: 750,
  perKmRate: 35,
  helperRate: 400,
  floorChargePerFloor: 150,
  packingRates: {
    none: 0,
    standard: 600,
    premium: 1400
  },
  vehicleMultipliers: {
    "three_wheeler": 0.85,
    "tata_ace": 1,
    "bolero_pickup": 1.25,
    "eicher_14ft": 1.7,
    "truck_17ft": 2.2
  },
  propertyMultipliers: {
    "single_item": 0.6,
    "1_rk": 0.85,
    "1_bhk": 1,
    "2_bhk": 1.4,
    "3_bhk": 1.9,
    "villa_office": 2.5
  },
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
const DEFAULT_SERVICES = [
  {
    _id: "srv-1",
    key: "home-shifting",
    nameEn: "Complete Home Shifting",
    nameMr: "\u0918\u0930 \u0938\u094D\u0925\u0932\u093E\u0902\u0924\u0930 \u0938\u0947\u0935\u093E",
    nameHi: "\u0938\u092E\u094D\u092A\u0942\u0930\u094D\u0923 \u0918\u0930 \u0936\u093F\u092B\u094D\u091F\u093F\u0902\u0917",
    descriptionEn: "End-to-end relocation for apartments, bungalows, and flats with careful packing, loading, and safe transport across Kolhapur.",
    descriptionMr: "\u0915\u094B\u0932\u094D\u0939\u093E\u092A\u0941\u0930\u093E\u0924 \u092B\u094D\u0932\u0945\u091F, \u092C\u0902\u0917\u0932\u093E \u0906\u0923\u093F \u0918\u0930\u093E\u0902\u091A\u0947 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u092A\u0945\u0915\u093F\u0902\u0917, \u0932\u094B\u0921\u093F\u0902\u0917 \u0906\u0923\u093F \u0935\u093E\u0939\u0924\u0942\u0915 \u0938\u0947\u0935\u0947\u0938\u0939 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0938\u094D\u0925\u0932\u093E\u0902\u0924\u0930.",
    descriptionHi: "\u0905\u092A\u093E\u0930\u094D\u091F\u092E\u0947\u0902\u091F \u0914\u0930 \u0918\u0930\u094B\u0902 \u0915\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u092A\u0948\u0915\u093F\u0902\u0917, \u0932\u094B\u0921\u093F\u0902\u0917 \u0914\u0930 \u092A\u0930\u093F\u0935\u0939\u0928 \u0915\u0947 \u0938\u093E\u0925 \u0906\u0938\u093E\u0928 \u0914\u0930 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0936\u093F\u092B\u094D\u091F\u093F\u0902\u0917\u0964",
    iconName: "Home",
    basePrice: 2200,
    vehicleRecommendation: "Tata Ace / 14ft Eicher",
    isActive: true
  },
  {
    _id: "srv-2",
    key: "furniture-transport",
    nameEn: "Furniture Transport",
    nameMr: "\u092B\u0930\u094D\u0928\u093F\u091A\u0930 \u0935\u093E\u0939\u0924\u0942\u0915",
    nameHi: "\u092B\u0930\u094D\u0928\u0940\u091A\u0930 \u092A\u0930\u093F\u0935\u0939\u0928",
    descriptionEn: "Safe transit for sofas, dining sets, wardrobes, wooden beds, and office chairs with scratch-guard blankets.",
    descriptionMr: "\u0938\u094B\u092B\u093E, \u0915\u092A\u093E\u091F, \u0921\u093E\u092F\u0928\u093F\u0902\u0917 \u091F\u0947\u092C\u0932, \u0932\u093E\u0915\u0921\u0940 \u092C\u0947\u0921 \u0907\u0924\u094D\u092F\u093E\u0926\u0940\u0902\u091A\u0947 \u0938\u094D\u0915\u094D\u0930\u0945\u091A-\u092A\u094D\u0930\u0942\u092B \u092C\u094D\u0932\u0901\u0915\u0947\u091F\u0928\u0947 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0935\u0939\u0928.",
    descriptionHi: "\u0938\u094B\u092B\u093E, \u0905\u0932\u092E\u093E\u0930\u0940, \u0921\u093E\u0907\u0928\u093F\u0902\u0917 \u091F\u0947\u092C\u0932 \u0914\u0930 \u092A\u0932\u0902\u0917 \u0915\u0940 \u0938\u094D\u0915\u094D\u0930\u0948\u091A-\u092B\u094D\u0930\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0922\u0941\u0932\u093E\u0908\u0964",
    iconName: "Armchair",
    basePrice: 950,
    vehicleRecommendation: "Tata Ace / Piaggio Ape",
    isActive: true
  },
  {
    _id: "srv-3",
    key: "mini-truck-tempo",
    nameEn: "Mini Truck & Tempo Booking",
    nameMr: "\u092E\u093F\u0928\u0940 \u091F\u094D\u0930\u0915 \u0906\u0923\u093F \u091F\u0947\u092E\u094D\u092A\u094B \u092C\u0941\u0915\u093F\u0902\u0917",
    nameHi: "\u092E\u093F\u0928\u0940 \u091F\u094D\u0930\u0915 \u0935 \u091F\u0947\u092E\u094D\u092A\u094B \u092C\u0941\u0915\u093F\u0902\u0917",
    descriptionEn: "Verified local Tata Ace (Chhota Hathi), Bolero Maxi Truck, and Piaggio commercial tempos for on-demand hire.",
    descriptionMr: "\u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u0935\u093F\u0936\u094D\u0935\u0938\u0928\u0940\u092F \u091F\u093E\u091F\u093E \u090F\u0938 (\u091B\u094B\u091F\u093E \u0939\u093E\u0925\u0940), \u092C\u094B\u0932\u0947\u0930\u094B \u092E\u0945\u0915\u094D\u0938\u0940 \u091F\u094D\u0930\u0915 \u0935 \u091F\u0947\u092E\u094D\u092A\u094B \u0924\u094D\u0935\u0930\u093F\u0924 \u092D\u093E\u0921\u094D\u092F\u093E\u0928\u0947.",
    descriptionHi: "\u0932\u094B\u0915\u0932 \u0935\u093F\u0936\u094D\u0935\u0938\u0928\u0940\u092F \u091F\u093E\u091F\u093E \u090F\u0938, \u092C\u094B\u0932\u0947\u0930\u094B \u092A\u093F\u0915\u0905\u092A \u0914\u0930 \u091F\u0947\u092E\u094D\u092A\u094B \u0924\u0924\u094D\u0915\u093E\u0932 \u092C\u0941\u0915\u093F\u0902\u0917 \u0915\u0947 \u0932\u093F\u090F\u0964",
    iconName: "Truck",
    basePrice: 750,
    vehicleRecommendation: "Tata Ace / Bolero Pickup",
    isActive: true
  },
  {
    _id: "srv-4",
    key: "loading-unloading",
    nameEn: "Loading & Unloading Workers",
    nameMr: "\u0938\u093E\u092E\u093E\u0928 \u091A\u0922\u0935\u0923\u0947 \u0906\u0923\u093F \u0909\u0924\u0930\u0935\u0923\u0947 (\u0939\u092E\u093E\u0932)",
    nameHi: "\u0932\u094B\u0921\u093F\u0902\u0917 \u090F\u0935\u0902 \u0905\u0928\u0932\u094B\u0921\u093F\u0902\u0917 \u092E\u091C\u0926\u0942\u0930",
    descriptionEn: "Experienced and disciplined local helpers to handle heavy appliances, floor-climbing, and careful loading.",
    descriptionMr: "\u091C\u0921 \u0935\u0938\u094D\u0924\u0942, \u0915\u092A\u093E\u091F\u0947 \u0906\u0923\u093F \u092B\u094D\u0930\u093F\u091C \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u091C\u093F\u0928\u094D\u092F\u093E\u0935\u0930\u0942\u0928 \u091A\u0922\u0935\u0923\u0947 \u0935 \u0909\u0924\u0930\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0905\u0928\u0941\u092D\u0935\u0940 \u0939\u092E\u093E\u0932 \u092E\u0926\u0924\u0928\u0940\u0938.",
    descriptionHi: "\u092D\u093E\u0930\u0940 \u0938\u093E\u092E\u093E\u0928, \u0938\u0940\u0922\u093C\u093F\u092F\u094B\u0902 \u0938\u0947 \u091A\u0922\u093C\u093E\u0928\u093E-\u0909\u0924\u093E\u0930\u0928\u093E \u0914\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0932\u094B\u0921\u093F\u0902\u0917 \u0915\u0947 \u0932\u093F\u090F \u0915\u0941\u0936\u0932 \u0938\u0939\u093E\u092F\u0915\u0964",
    iconName: "Users",
    basePrice: 400,
    vehicleRecommendation: "N/A (Labor only)",
    isActive: true
  },
  {
    _id: "srv-5",
    key: "packing-wrapping",
    nameEn: "Packing & Wrapping",
    nameMr: "\u092A\u0945\u0915\u093F\u0902\u0917 \u0906\u0923\u093F \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0917\u0941\u0902\u0921\u093E\u0933\u0923\u0940",
    nameHi: "\u092A\u0948\u0915\u093F\u0902\u0917 \u0914\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0948\u092A\u093F\u0902\u0917",
    descriptionEn: "Industrial bubble wrap, corrugated sheets, stretch film, and sturdy carton boxes for electronics and crockery.",
    descriptionMr: "\u0907\u0932\u0947\u0915\u094D\u091F\u094D\u0930\u0949\u0928\u093F\u0915\u094D\u0938, \u091F\u0940\u0935\u094D\u0939\u0940 \u0906\u0923\u093F \u0915\u093E\u091A\u0947\u091A\u094D\u092F\u093E \u0928\u093E\u091C\u0942\u0915 \u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u092C\u092C\u0932 \u0930\u0945\u092A, \u092C\u0949\u0915\u094D\u0938 \u0935 \u092E\u091C\u092C\u0942\u0924 \u092A\u0945\u0915\u093F\u0902\u0917.",
    descriptionHi: "\u091F\u0940\u0935\u0940, \u092B\u094D\u0930\u093F\u091C \u0914\u0930 \u0915\u093E\u0902\u091A \u0915\u0947 \u092C\u0930\u094D\u0924\u0928\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u092C\u092C\u0932 \u0930\u0948\u092A \u0935 \u092A\u094D\u0930\u0940\u092E\u093F\u092F\u092E \u092C\u0949\u0915\u094D\u0938 \u092A\u0948\u0915\u093F\u0902\u0917\u0964",
    iconName: "PackageCheck",
    basePrice: 600,
    vehicleRecommendation: "N/A (Materials & Labor)",
    isActive: true
  },
  {
    _id: "srv-6",
    key: "dismantle-assemble",
    nameEn: "Furniture Dismantling & Assembly",
    nameMr: "\u092B\u0930\u094D\u0928\u093F\u091A\u0930 \u0909\u0918\u0921\u0923\u0947 \u0906\u0923\u093F \u092A\u0941\u0928\u094D\u0939\u093E \u091C\u094B\u0921\u0923\u0947",
    nameHi: "\u092B\u0930\u094D\u0928\u0940\u091A\u0930 \u0921\u093F\u0938\u092E\u0947\u0902\u091F\u0932 \u090F\u0935\u0902 \u0905\u0938\u0947\u0902\u092C\u0932\u0940",
    descriptionEn: "Carpentry assistance for modular wardrobes, king-size hydraulic beds, and wall-mounted shelves.",
    descriptionMr: "\u0939\u093E\u092F\u0921\u094D\u0930\u0949\u0932\u093F\u0915 \u092C\u0947\u0921, \u092E\u0949\u0921\u094D\u092F\u0941\u0932\u0930 \u0915\u092A\u093E\u091F \u0906\u0923\u093F \u0915\u0930\u094D\u091F\u0928 \u0930\u0949\u0921 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0916\u094B\u0932\u0923\u0947 \u0935 \u0928\u0935\u0940\u0928 \u0918\u0930\u0940 \u092C\u0938\u0935\u0942\u0928 \u0926\u0947\u0923\u0947.",
    descriptionHi: "\u0939\u093E\u0907\u0921\u094D\u0930\u094B\u0932\u093F\u0915 \u092C\u0947\u0921, \u092E\u0949\u0921\u094D\u092F\u0942\u0932\u0930 \u0905\u0932\u092E\u093E\u0930\u0940 \u0916\u094B\u0932\u0928\u093E \u0914\u0930 \u0928\u090F \u0918\u0930 \u092E\u0947\u0902 \u0938\u0939\u0940 \u0924\u0930\u0940\u0915\u0947 \u0938\u0947 \u0926\u094B\u092C\u093E\u0930\u093E \u092B\u093F\u091F \u0915\u0930\u0928\u093E\u0964",
    iconName: "Wrench",
    basePrice: 500,
    vehicleRecommendation: "N/A (Carpenter service)",
    isActive: true
  },
  {
    _id: "srv-7",
    key: "office-relocation",
    nameEn: "Office Relocation",
    nameMr: "\u0915\u093E\u0930\u094D\u092F\u093E\u0932\u092F \u0935 \u0926\u0941\u0915\u093E\u0928 \u0938\u094D\u0925\u0932\u093E\u0902\u0924\u0930",
    nameHi: "\u0911\u092B\u093F\u0938 \u0914\u0930 \u0926\u0941\u0915\u093E\u0928 \u0936\u093F\u092B\u094D\u091F\u093F\u0902\u0917",
    descriptionEn: "Commercial moves for IT cabins, retail shops, clinics, and showrooms with minimum business downtime.",
    descriptionMr: "\u0926\u0941\u0915\u093E\u0928, \u0915\u094D\u0932\u093F\u0928\u093F\u0915, \u0936\u094B\u0930\u0942\u092E \u0906\u0923\u093F \u0911\u092B\u093F\u0938\u091A\u0947 \u0924\u094D\u0935\u0930\u093F\u0924 \u0935 \u0928\u093F\u092F\u094B\u091C\u0928\u092C\u0926\u094D\u0927 \u0936\u093F\u092B\u094D\u091F\u093F\u0902\u0917.",
    descriptionHi: "\u0915\u092E\u0930\u094D\u0936\u093F\u092F\u0932 \u0911\u092B\u093F\u0938, \u0915\u094D\u0932\u093F\u0928\u093F\u0915 \u0914\u0930 \u0926\u0941\u0915\u093E\u0928\u094B\u0902 \u0915\u0940 \u092C\u093F\u0928\u093E \u0930\u0941\u0915\u093E\u0935\u091F \u0938\u0941\u0917\u092E \u0936\u093F\u092B\u094D\u091F\u093F\u0902\u0917\u0964",
    iconName: "Building2",
    basePrice: 3500,
    vehicleRecommendation: "14ft / 17ft Closed Container",
    isActive: true
  },
  {
    _id: "srv-8",
    key: "single-item-transport",
    nameEn: "Single-Item Transport",
    nameMr: "\u090F\u0915\u0932 \u0935\u0938\u094D\u0924\u0942 \u0935\u093E\u0939\u0924\u0942\u0915 (\u0938\u093F\u0902\u0917\u0932 \u0906\u092F\u091F\u092E)",
    nameHi: "\u0938\u093F\u0902\u0917\u0932 \u0906\u0907\u091F\u092E \u091F\u094D\u0930\u093E\u0902\u0938\u092A\u094B\u0930\u094D\u091F",
    descriptionEn: "Quick shifting for a single refrigerator, washing machine, almirah, or mattress at affordable mini rates.",
    descriptionMr: "\u092B\u0915\u094D\u0924 \u090F\u0915 \u092B\u094D\u0930\u093F\u091C, \u0935\u0949\u0936\u093F\u0902\u0917 \u092E\u0936\u0940\u0928 \u0915\u093F\u0902\u0935\u093E \u0917\u093E\u0926\u0940 \u0939\u0932\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u092A\u0930\u0935\u0921\u0923\u093E\u0931\u094D\u092F\u093E \u0926\u0930\u093E\u0924 \u091C\u0932\u0926 \u0938\u0947\u0935\u093E.",
    descriptionHi: "\u0915\u0947\u0935\u0932 \u090F\u0915 \u092B\u094D\u0930\u093F\u091C, \u0935\u093E\u0936\u093F\u0902\u0917 \u092E\u0936\u0940\u0928 \u092F\u093E \u0917\u0926\u094D\u0926\u093E \u0915\u093F\u092B\u093E\u092F\u0924\u0940 \u0926\u0930 \u092A\u0930 \u0932\u0947 \u091C\u093E\u0928\u0947 \u0915\u0940 \u0938\u0947\u0935\u093E\u0964",
    iconName: "Box",
    basePrice: 550,
    vehicleRecommendation: "Piaggio Ape / 3-Wheeler Tempo",
    isActive: true
  },
  {
    _id: "srv-9",
    key: "goods-transport",
    nameEn: "Local Goods Transportation",
    nameMr: "\u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u092E\u093E\u0932 \u0935\u093E\u0939\u0924\u0942\u0915 (\u0935\u094D\u092F\u093E\u092A\u093E\u0930\u0940)",
    nameHi: "\u0938\u094D\u0925\u093E\u0928\u0940\u092F \u092E\u093E\u0932 \u092A\u0930\u093F\u0935\u0939\u0928",
    descriptionEn: "Daily business logistics between Laxmipuri, Gandhinagar cloth market, and Shiroli/Gokul Shirgaon MIDC.",
    descriptionMr: "\u0932\u0915\u094D\u0937\u094D\u092E\u0940\u092A\u0941\u0930\u0940, \u0917\u093E\u0902\u0927\u0940\u0928\u0917\u0930 \u092E\u093E\u0930\u094D\u0915\u0947\u091F \u0906\u0923\u093F \u0936\u093F\u0930\u094B\u0932\u0940/\u0917\u094B\u0915\u0941\u0933 \u0936\u093F\u0930\u0917\u093E\u0935 \u090F\u092E\u0906\u092F\u0921\u0940\u0938\u0940 \u0926\u0930\u092E\u094D\u092F\u093E\u0928 \u0928\u093F\u092F\u092E\u093F\u0924 \u092E\u093E\u0932\u0935\u093E\u0939\u0924\u0942\u0915.",
    descriptionHi: "\u0932\u0915\u094D\u0937\u094D\u092E\u0940\u092A\u0941\u0930\u0940 \u0914\u0930 \u0917\u093E\u0902\u0927\u0940\u0928\u0917\u0930 \u092E\u093E\u0930\u094D\u0915\u0947\u091F \u0938\u0947 \u0936\u0939\u0930 \u0915\u0947 \u0935\u093F\u092D\u093F\u0928\u094D\u0928 \u0939\u093F\u0938\u094D\u0938\u094B\u0902 \u092E\u0947\u0902 \u0928\u093F\u092F\u092E\u093F\u0924 \u092E\u093E\u0932 \u0922\u0941\u0932\u093E\u0908\u0964",
    iconName: "Boxes",
    basePrice: 850,
    vehicleRecommendation: "Tata Ace / Bolero Pickup",
    isActive: true
  },
  {
    _id: "srv-10",
    key: "construction-materials",
    nameEn: "Construction Material Transport",
    nameMr: "\u092C\u093E\u0902\u0927\u0915\u093E\u092E \u0938\u093E\u0939\u093F\u0924\u094D\u092F \u0935\u093E\u0939\u0924\u0942\u0915",
    nameHi: "\u0928\u093F\u0930\u094D\u092E\u093E\u0923 \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u092A\u0930\u093F\u0935\u0939\u0928",
    descriptionEn: "Tiles, sanitaryware, paint drums, pipes, and hardware supply delivery directly to your building site.",
    descriptionMr: "\u091F\u093E\u0908\u0932\u094D\u0938, \u0938\u0945\u0928\u093F\u091F\u0930\u0940, \u092A\u0947\u0902\u091F\u094D\u0938, \u092A\u093E\u0908\u092A\u094D\u0938 \u0935 \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u0905\u0930 \u0938\u093E\u0939\u093F\u0924\u094D\u092F \u0938\u093E\u0908\u091F\u0935\u0930 \u0925\u0947\u091F \u092A\u094B\u0939\u094B\u091A\u0935\u0923\u0947.",
    descriptionHi: "\u091F\u093E\u0907\u0932\u094D\u0938, \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u092F\u0930, \u092A\u093E\u0907\u092A \u0914\u0930 \u092A\u0947\u0902\u091F \u0921\u094D\u0930\u092E \u0915\u0902\u0938\u094D\u091F\u094D\u0930\u0915\u094D\u0936\u0928 \u0938\u093E\u0907\u091F \u092A\u0930 \u0938\u0940\u0927\u0947 \u092A\u0939\u0941\u0901\u091A\u093E\u0928\u093E\u0964",
    iconName: "Hammer",
    basePrice: 900,
    vehicleRecommendation: "Bolero Pickup / Tipper",
    isActive: true
  }
];
class DataStore {
  data = {
    users: [],
    partnerProfiles: [],
    services: DEFAULT_SERVICES,
    pricingRules: DEFAULT_PRICING,
    inquiries: [],
    bookings: [],
    reviews: []
  };
  isInitialized = false;
  constructor() {
    this.init();
  }
  init() {
    if (this.isInitialized) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        this.data = JSON.parse(raw);
      } else if (fs.existsSync(path.join(DATA_DIR, "movemate_store.json"))) {
        const raw = fs.readFileSync(path.join(DATA_DIR, "movemate_store.json"), "utf-8");
        this.data = JSON.parse(raw);
        this.persist();
      } else {
        this.seedInitialData();
        this.persist();
      }
    } catch (e) {
      console.warn("Using memory store due to file sync error:", e);
      this.seedInitialData();
    }
    this.isInitialized = true;
  }
  seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const adminPassHash = bcrypt.hashSync("09062007", salt);
    const partnerPassHash = bcrypt.hashSync("Partner@123", salt);
    const customerPassHash = bcrypt.hashSync("Customer@123", salt);
    const adminUser = {
      _id: "usr-admin-pranali",
      name: "Pranali Gadade (Admin)",
      email: "pranaligadade04@gmail.com",
      phone: "+918855029692",
      passwordHash: adminPassHash,
      role: "admin",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const partnerUser1 = {
      _id: "usr-partner-1",
      name: "Santosh Patil",
      email: "partner@movemate.in",
      phone: "+919822345678",
      passwordHash: partnerPassHash,
      role: "partner",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const partnerUser2 = {
      _id: "usr-partner-2",
      name: "Sachin Chougule",
      email: "sachin.trans@movemate.in",
      phone: "+919850123456",
      passwordHash: partnerPassHash,
      role: "partner",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const partnerUser3 = {
      _id: "usr-partner-3",
      name: "Tanaji More",
      email: "tanaji.satara@movemate.in",
      phone: "+919881123456",
      passwordHash: partnerPassHash,
      role: "partner",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const customerUser = {
      _id: "usr-cust-1",
      name: "Rahul Jadhav",
      email: "customer@movemate.in",
      phone: "+918855029692",
      passwordHash: customerPassHash,
      role: "customer",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const partnerProfile1 = {
      _id: "prof-part-1",
      userId: "usr-partner-1",
      businessName: "Patil Kolhapur Cargo Express",
      vehicleType: "Tata Ace (Chhota Hathi)",
      vehicleNumber: "MH 09 CW 4512",
      serviceCategories: ["home-shifting", "furniture-transport", "mini-truck-tempo", "single-item-transport"],
      operatingLocations: ["Rajarampuri", "Tarabai Park", "Shahupuri", "Shiroli MIDC", "Nagala Park"],
      experienceYears: 7,
      helpersCount: 2,
      verificationStatus: "approved",
      rating: 4.9,
      completedTrips: 184,
      isAvailable: true,
      notes: "Reliable with protective blankets and experienced loaders.",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const partnerProfile2 = {
      _id: "prof-part-2",
      userId: "usr-partner-2",
      businessName: "Chougule Sangli & Miraj Shifting",
      vehicleType: "Tata Ace (Chhota Hathi)",
      vehicleNumber: "MH 10 DJ 2234",
      serviceCategories: ["home-shifting", "furniture-transport", "mini-truck-tempo", "goods-transport"],
      operatingLocations: ["Vishrambag", "Kupwad MIDC", "Miraj City", "Islampur", "Madhavnagar"],
      experienceYears: 6,
      helpersCount: 2,
      verificationStatus: "approved",
      rating: 4.9,
      completedTrips: 154,
      isAvailable: true,
      notes: "Specializes in Sangli-Miraj twin city moves and Islampur shifting.",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const partnerProfile3 = {
      _id: "prof-part-3",
      userId: "usr-partner-3",
      businessName: "More Satara & Karad Cargo Logistics",
      vehicleType: "Bolero Maxi Truck",
      vehicleNumber: "MH 11 AK 7890",
      serviceCategories: ["home-shifting", "office-relocation", "goods-transport", "construction-materials"],
      operatingLocations: ["Powai Naka", "Satara MIDC", "Karad City", "Wai", "Shirwal"],
      experienceYears: 8,
      helpersCount: 3,
      verificationStatus: "approved",
      rating: 4.9,
      completedTrips: 210,
      isAvailable: true,
      notes: "Highway expert for Satara, Karad, and Pune-Bengaluru NH-48 moves.",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const initialInquiry = {
      _id: "inq-1",
      referenceId: "MM-KOP-8421",
      customerName: "Rahul Jadhav",
      phone: "+918855029692",
      email: "customer@movemate.in",
      serviceCategory: "home-shifting",
      pickupAddress: "Flat 402, Royal Residency, Rajarampuri 6th Lane",
      destinationAddress: "Row House 12, Tarabai Park",
      pickupArea: "Rajarampuri",
      destinationArea: "Tarabai Park",
      movingDate: new Date(Date.now() + 864e5 * 2).toISOString().split("T")[0],
      preferredTime: "10:00 AM",
      propertyType: "2_bhk",
      vehiclePreference: "Tata Ace / 14ft Eicher",
      helpersCount: 2,
      packingRequired: "standard",
      additionalNotes: "Includes double bed, fridge, washing machine and dining table.",
      estimatedCost: 2850,
      status: "Inquiry Received",
      userId: "usr-cust-1",
      createdAt: new Date(Date.now() - 36e5 * 4).toISOString()
    };
    const initialBooking = {
      _id: "bk-1",
      referenceId: "BK-KOP-9102",
      userId: "usr-cust-1",
      customerName: "Rahul Jadhav",
      phone: "+918855029692",
      email: "customer@movemate.in",
      serviceCategory: "home-shifting",
      pickupAddress: "Flat 402, Royal Residency, Rajarampuri 6th Lane",
      destinationAddress: "Row House 12, Tarabai Park",
      pickupArea: "Rajarampuri",
      destinationArea: "Tarabai Park",
      movingDate: new Date(Date.now() + 864e5 * 3).toISOString().split("T")[0],
      preferredTime: "09:30 AM",
      propertyType: "2_bhk",
      vehiclePreference: "Tata Ace",
      helpersCount: 2,
      packingRequired: "standard",
      floorPickup: 4,
      hasLiftPickup: true,
      floorDrop: 0,
      hasLiftDrop: false,
      furnitureItems: ["Double Bed", "Fridge 260L", "Washing Machine", "Dining Set 4-Seater", "Sofa 3-Seater", "8 Carton Boxes"],
      estimatedDistanceKm: 6.5,
      estimatedCost: 2950,
      finalCost: 2950,
      status: "Partner Assigned",
      assignedPartnerId: "prof-part-1",
      assignedPartnerName: "Santosh Patil (Patil Kolhapur Cargo Express)",
      assignedPartnerPhone: "+91 98223 45678",
      assignedVehicle: "Tata Ace (MH 09 CW 4512)",
      statusHistory: [
        { status: "Inquiry Received", timestamp: new Date(Date.now() - 36e5 * 24).toISOString(), note: "Inquiry received from customer" },
        { status: "Estimate Prepared", timestamp: new Date(Date.now() - 36e5 * 20).toISOString(), note: "Estimate calculated for 2BHK shifting: \u20B92,950" },
        { status: "Booking Confirmed", timestamp: new Date(Date.now() - 36e5 * 12).toISOString(), note: "Customer confirmed booking and schedule" },
        { status: "Partner Assigned", timestamp: new Date(Date.now() - 36e5 * 4).toISOString(), note: "Assigned to Santosh Patil (Tata Ace MH 09 CW 4512)" }
      ],
      customerNotes: "Please ensure elevator protection pad is used at Rajarampuri flat.",
      createdAt: new Date(Date.now() - 36e5 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 36e5 * 4).toISOString()
    };
    const initialReviews = [
      {
        _id: "rev-1",
        bookingReference: "BK-KOP-7821",
        customerName: "Anand Shinde",
        rating: 5,
        commentEn: "Shifted my complete 2 BHK from Shahupuri to Tarabai Park in just 4 hours. Santosh Patil and his team handled the glass dining table with extreme care. Highly recommend MoveMate!",
        commentMr: "\u0936\u093E\u0939\u0942\u092A\u0941\u0930\u0940 \u0924\u0947 \u0924\u093E\u0930\u093E\u092C\u093E\u0908 \u092A\u093E\u0930\u094D\u0915 \u0968 \u092C\u0940\u090F\u091A\u0915\u0947 \u0938\u094D\u0925\u0932\u093E\u0902\u0924\u0930 \u092B\u0915\u094D\u0924 \u096A \u0924\u093E\u0938\u093E\u0902\u0924 \u092A\u0942\u0930\u094D\u0923 \u091D\u093E\u0932\u0947. \u0915\u093E\u091A\u0947\u091A\u0947 \u091F\u0947\u092C\u0932 \u0905\u0924\u094D\u092F\u0902\u0924 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924\u092A\u0923\u0947 \u092A\u094B\u0939\u094B\u091A\u0935\u0932\u0947. \u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u092E\u0942\u0935\u092E\u0947\u091F!",
        serviceName: "Complete Home Shifting",
        location: "Shahupuri, Kolhapur",
        createdAt: new Date(Date.now() - 864e5 * 4).toISOString()
      },
      {
        _id: "rev-2",
        bookingReference: "BK-KOP-8012",
        customerName: "Priyanka Kadam",
        rating: 5,
        commentEn: "Needed urgent sofa and wardrobe transport from Rajarampuri to Kasaba Bawada. The Tata Ace arrived in 25 mins. Fair pricing with zero bargaining headache.",
        commentMr: "\u0930\u093E\u091C\u093E\u0930\u093E\u092E\u092A\u0941\u0930\u0940 \u0924\u0947 \u0915\u0938\u092C\u093E \u092C\u093E\u0935\u0921\u093E \u0938\u094B\u092B\u093E \u0906\u0923\u093F \u0915\u092A\u093E\u091F \u0928\u0947\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u091F\u0947\u092E\u094D\u092A\u094B \u0968\u096B \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u0924 \u0939\u091C\u0930 \u091D\u093E\u0932\u093E. \u0915\u094B\u0923\u0924\u0947\u0939\u0940 \u0935\u093E\u0926\u0935\u093F\u0935\u093E\u0926 \u0928 \u0915\u0930\u0924\u093E \u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0915 \u0926\u0930.",
        serviceName: "Furniture Transport",
        location: "Rajarampuri, Kolhapur",
        createdAt: new Date(Date.now() - 864e5 * 7).toISOString()
      },
      {
        _id: "rev-3",
        bookingReference: "BK-KOP-8245",
        customerName: "Mahesh Ghatge",
        rating: 5,
        commentEn: "Moved my hardware stock to Shiroli MIDC. Honest helpers, proper loading straps, and clear communication on WhatsApp.",
        commentMr: "\u0936\u093F\u0930\u094B\u0932\u0940 \u090F\u092E\u0906\u092F\u0921\u0940\u0938\u0940 \u092F\u0947\u0925\u0947 \u092E\u093E\u0932\u0935\u093E\u0939\u0924\u0942\u0915 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E \u0938\u0947\u0935\u093E. \u0939\u092E\u093E\u0932\u093E\u0902\u091A\u0947 \u0915\u093E\u092E \u0936\u093F\u0938\u094D\u0924\u092C\u0926\u094D\u0927 \u0939\u094B\u0924\u0947.",
        serviceName: "Local Goods Transportation",
        location: "Shiroli MIDC, Kolhapur",
        createdAt: new Date(Date.now() - 864e5 * 11).toISOString()
      },
      {
        _id: "rev-4",
        bookingReference: "BK-SGL-8490",
        customerName: "Suresh Patil",
        rating: 5,
        commentEn: "Shifted our flat from Vishrambag, Sangli to Kolhapur Tarabai Park. Smooth transit on Sangli-Kolhapur road with no damage.",
        commentMr: "\u0935\u093F\u0936\u094D\u0930\u093E\u092E\u092C\u093E\u0917 (\u0938\u093E\u0902\u0917\u0932\u0940) \u0924\u0947 \u0924\u093E\u0930\u093E\u092C\u093E\u0908 \u092A\u093E\u0930\u094D\u0915 (\u0915\u094B\u0932\u094D\u0939\u093E\u092A\u0942\u0930) \u0918\u0930 \u0936\u093F\u092B\u094D\u091F \u0915\u0947\u0932\u0947. \u0938\u0930\u094D\u0935 \u092B\u0930\u094D\u0928\u093F\u091A\u0930 \u0905\u0924\u094D\u092F\u0902\u0924 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u092A\u094B\u0939\u094B\u091A\u0932\u0947.",
        serviceName: "Complete Home Shifting",
        location: "Vishrambag, Sangli",
        createdAt: new Date(Date.now() - 864e5 * 5).toISOString()
      },
      {
        _id: "rev-5",
        bookingReference: "BK-STR-9021",
        customerName: "Dr. Vikram Deshmukh",
        rating: 5,
        commentEn: "Clinic shifting from Sadar Bazar Satara to Karad. Heavy medical cabinets transported punctually on NH-48.",
        commentMr: "\u0938\u093E\u0924\u093E\u0930\u093E \u0924\u0947 \u0915\u0930\u093E\u0921 \u0915\u094D\u0932\u093F\u0928\u093F\u0915\u091A\u0947 \u0936\u093F\u092B\u094D\u091F\u093F\u0902\u0917 \u0935\u0947\u0933\u0947\u0935\u0930 \u0906\u0923\u093F \u0936\u093F\u0938\u094D\u0924\u092C\u0926\u094D\u0927 \u092A\u0926\u094D\u0927\u0924\u0940\u0928\u0947 \u092A\u0942\u0930\u094D\u0923 \u091D\u093E\u0932\u0947.",
        serviceName: "Office & Clinic Relocation",
        location: "Sadar Bazar, Satara",
        createdAt: new Date(Date.now() - 864e5 * 2).toISOString()
      }
    ];
    this.data = {
      users: [adminUser, partnerUser1, partnerUser2, partnerUser3, customerUser],
      partnerProfiles: [partnerProfile1, partnerProfile2, partnerProfile3],
      services: DEFAULT_SERVICES,
      pricingRules: DEFAULT_PRICING,
      inquiries: [initialInquiry],
      bookings: [initialBooking],
      reviews: initialReviews
    };
  }
  persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write data file:", e);
    }
  }
  // Getters & Mutators
  getUsers() {
    return this.data.users;
  }
  getUserById(id) {
    return this.data.users.find((u) => u._id === id);
  }
  getUserByEmail(email) {
    if (!email) return null;
    const search = email.toLowerCase().trim();
    const found = this.data.users.find((u) => u.email.toLowerCase() === search);
    if (found) return found;
    if (search.endsWith("@movebandhu.in")) {
      const alt = search.replace("@movebandhu.in", "@movemate.in");
      return this.data.users.find((u) => u.email.toLowerCase() === alt);
    }
    if (search.endsWith("@movemate.in")) {
      const alt = search.replace("@movemate.in", "@movebandhu.in");
      return this.data.users.find((u) => u.email.toLowerCase() === alt);
    }
    return null;
  }
  getUserByPhone(phone) {
    return this.data.users.find((u) => u.phone === phone);
  }
  addUser(user) {
    this.data.users.push(user);
    this.persist();
    if (mongoose.connection.readyState === 1) {
      User.findByIdAndUpdate(user._id, user, { upsert: true }).catch(() => {});
    }
    return user;
  }
  updateUser(id, updates) {
    const idx = this.data.users.findIndex((u) => u._id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      this.persist();
      if (mongoose.connection.readyState === 1) {
        User.findByIdAndUpdate(id, this.data.users[idx], { upsert: true }).catch(() => {});
      }
      return this.data.users[idx];
    }
    return null;
  }
  getPartnerProfiles() {
    return this.data.partnerProfiles;
  }
  getPartnerByUserId(userId) {
    return this.data.partnerProfiles.find((p) => p.userId === userId);
  }
  getPartnerById(id) {
    return this.data.partnerProfiles.find((p) => p._id === id);
  }
  addPartnerProfile(profile) {
    this.data.partnerProfiles.push(profile);
    this.persist();
    if (mongoose.connection.readyState === 1) {
      PartnerProfile.findByIdAndUpdate(profile._id, profile, { upsert: true }).catch(() => {});
    }
    return profile;
  }
  updatePartnerProfile(id, updates) {
    const idx = this.data.partnerProfiles.findIndex((p) => p._id === id);
    if (idx !== -1) {
      this.data.partnerProfiles[idx] = { ...this.data.partnerProfiles[idx], ...updates };
      this.persist();
      if (mongoose.connection.readyState === 1) {
        PartnerProfile.findByIdAndUpdate(id, this.data.partnerProfiles[idx], { upsert: true }).catch(() => {});
      }
      return this.data.partnerProfiles[idx];
    }
    return null;
  }
  getServices() {
    return this.data.services;
  }
  updateService(id, updates) {
    const idx = this.data.services.findIndex((s) => s._id === id);
    if (idx !== -1) {
      this.data.services[idx] = { ...this.data.services[idx], ...updates };
      this.persist();
      if (mongoose.connection.readyState === 1) {
        Service.findByIdAndUpdate(id, this.data.services[idx], { upsert: true }).catch(() => {});
      }
      return this.data.services[idx];
    }
    return null;
  }
  getPricingRules() {
    return this.data.pricingRules;
  }
  updatePricingRules(rules) {
    this.data.pricingRules = { ...this.data.pricingRules, ...rules, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.persist();
    if (mongoose.connection.readyState === 1) {
      PricingRule.findByIdAndUpdate(this.data.pricingRules._id, this.data.pricingRules, { upsert: true }).catch(() => {});
    }
    return this.data.pricingRules;
  }
  getInquiries() {
    return this.data.inquiries;
  }
  getInquiryById(id) {
    return this.data.inquiries.find((i) => i._id === id || i.referenceId === id);
  }
  addInquiry(inquiry) {
    this.data.inquiries.unshift(inquiry);
    this.persist();
    if (mongoose.connection.readyState === 1) {
      Inquiry.findByIdAndUpdate(inquiry._id, inquiry, { upsert: true }).catch(() => {});
    }
    return inquiry;
  }
  updateInquiry(id, updates) {
    const idx = this.data.inquiries.findIndex((i) => i._id === id || i.referenceId === id);
    if (idx !== -1) {
      this.data.inquiries[idx] = { ...this.data.inquiries[idx], ...updates };
      this.persist();
      if (mongoose.connection.readyState === 1) {
        Inquiry.findByIdAndUpdate(id, this.data.inquiries[idx], { upsert: true }).catch(() => {});
      }
      return this.data.inquiries[idx];
    }
    return null;
  }
  getBookings() {
    return this.data.bookings;
  }
  getBookingById(id) {
    return this.data.bookings.find((b) => b._id === id || b.referenceId === id);
  }
  addBooking(booking) {
    this.data.bookings.unshift(booking);
    this.persist();
    if (mongoose.connection.readyState === 1) {
      Booking.findByIdAndUpdate(booking._id, booking, { upsert: true }).catch(() => {});
    }
    return booking;
  }
  updateBooking(id, updates) {
    const idx = this.data.bookings.findIndex((b) => b._id === id || b.referenceId === id);
    if (idx !== -1) {
      const existing = this.data.bookings[idx];
      const updated = { ...existing, ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      if (updates.status && updates.status !== existing.status) {
        updated.statusHistory = [
          ...existing.statusHistory,
          {
            status: updates.status,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            note: updates.customerNotes || `Status updated to ${updates.status}`
          }
        ];
      }
      this.data.bookings[idx] = updated;
      this.persist();
      if (mongoose.connection.readyState === 1) {
        Booking.findByIdAndUpdate(id, updated, { upsert: true }).catch(() => {});
      }
      return updated;
    }
    return null;
  }
  getReviews() {
    return this.data.reviews;
  }
  addReview(review) {
    this.data.reviews.unshift(review);
    this.persist();
    if (mongoose.connection.readyState === 1) {
      Review.findByIdAndUpdate(review._id, review, { upsert: true }).catch(() => {});
    }
    return review;
  }
  getAuditLogs() {
    if (!this.data.auditLogs || this.data.auditLogs.length === 0) {
      // Default initial audit entries
      this.data.auditLogs = [
        {
          _id: "log-seed-1",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          actorEmail: "pranaligadade04@gmail.com",
          actorRole: "admin",
          action: "ADMIN_LOGIN",
          entityType: "AUTH",
          details: "Master Admin logged into MoveBandhu Ops Center from Kolhapur HQ",
          ipAddress: "103.21.124.8"
        },
        {
          _id: "log-seed-2",
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          actorEmail: "pranaligadade04@gmail.com",
          actorRole: "admin",
          action: "PARTNER_VERIFIED",
          entityType: "PARTNER",
          details: "Verified Santosh Patil (MH 09 CW 4512) for Home Shifting routes",
          ipAddress: "103.21.124.8"
        },
        {
          _id: "log-seed-3",
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          actorEmail: "customer@movemate.in",
          actorRole: "customer",
          action: "BOOKING_CREATED",
          entityType: "BOOKING",
          details: "Created booking BK-KOP-7821 for 2 BHK Shahupuri to Tarabai Park",
          ipAddress: "114.143.19.4"
        },
        {
          _id: "log-seed-4",
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          actorEmail: "pranaligadade04@gmail.com",
          actorRole: "admin",
          action: "PRICING_UPDATED",
          entityType: "PRICING",
          details: "Updated base city rate to ₹750 with ₹35/km per-km rate",
          ipAddress: "103.21.124.8"
        }
      ];
      this.persist();
    }
    return this.data.auditLogs;
  }
  addAuditLog(entry) {
    if (!this.data.auditLogs) {
      this.data.auditLogs = [];
    }
    const log = {
      _id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.persist();
    return log;
  }
}
export const dbStore = new DataStore();

export async function syncAllToMongoDB() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const data = dbStore.data;
    if (data.users?.length) {
      for (const u of data.users) {
        await User.findByIdAndUpdate(u._id, u, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
    }
    if (data.bookings?.length) {
      for (const b of data.bookings) {
        await Booking.findByIdAndUpdate(b._id, b, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
    }
    if (data.inquiries?.length) {
      for (const i of data.inquiries) {
        await Inquiry.findByIdAndUpdate(i._id, i, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
    }
    if (data.partnerProfiles?.length) {
      for (const p of data.partnerProfiles) {
        await PartnerProfile.findByIdAndUpdate(p._id, p, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
    }
    if (data.services?.length) {
      for (const s of data.services) {
        await Service.findByIdAndUpdate(s._id, s, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
    }
    if (data.pricingRules) {
      await PricingRule.findByIdAndUpdate(data.pricingRules._id, data.pricingRules, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    if (data.reviews?.length) {
      for (const r of data.reviews) {
        await Review.findByIdAndUpdate(r._id, r, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
    }
    console.log("✅ Synced MoveBandhu data into MongoDB Atlas (database: movebandhu).");
  } catch (err) {
    console.warn("⚠️ MongoDB auto-sync notice:", err.message);
  }
}

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("ℹ️ MONGODB_URI not configured. Operating with persistent MoveBandhu local JSON store.");
    return false;
  }
  try {
    await mongoose.connect(uri, {
      dbName: "movebandhu"
    });
    console.log("✅ Connected to MongoDB Atlas successfully (database: movebandhu).");
    await syncAllToMongoDB();
    return true;
  } catch (err) {
    console.warn("⚠️ MongoDB connection failed. Continuing with persistent MoveBandhu store fallback.", err.message);
    return false;
  }
}
