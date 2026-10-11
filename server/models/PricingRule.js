import mongoose from "mongoose";

const pricingRuleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => "pricing-kop-default"
    },
    baseCityDistanceKm: {
      type: Number,
      default: 5
    },
    baseRate: {
      type: Number,
      default: 750
    },
    perKmRate: {
      type: Number,
      default: 35
    },
    helperRate: {
      type: Number,
      default: 400
    },
    floorChargePerFloor: {
      type: Number,
      default: 150
    },
    packingRates: {
      none: { type: Number, default: 0 },
      standard: { type: Number, default: 600 },
      premium: { type: Number, default: 1400 }
    },
    vehicleMultipliers: {
      type: Map,
      of: Number,
      default: {
        three_wheeler: 0.85,
        tata_ace: 1,
        bolero_pickup: 1.25,
        eicher_14ft: 1.7,
        truck_17ft: 2.2
      }
    },
    propertyMultipliers: {
      type: Map,
      of: Number,
      default: {
        single_item: 0.6,
        "1_rk": 0.85,
        "1_bhk": 1,
        "2_bhk": 1.4,
        "3_bhk": 1.9,
        villa_office: 2.5
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const PricingRule = mongoose.model("PricingRule", pricingRuleSchema);
export default PricingRule;
