import mongoose from "mongoose";

const partnerProfileSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    businessName: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      default: "Tata Ace (Chhota Hathi)"
    },
    vehicleNumber: {
      type: String,
      default: "MH 09 Registration"
    },
    serviceCategories: {
      type: [String],
      default: ["home-shifting", "mini-truck-tempo"]
    },
    operatingLocations: {
      type: [String],
      default: ["Kolhapur City"]
    },
    experienceYears: {
      type: Number,
      default: 1
    },
    helpersCount: {
      type: Number,
      default: 1
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    rating: {
      type: Number,
      default: 5.0
    },
    completedTrips: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const PartnerProfile = mongoose.model("PartnerProfile", partnerProfileSchema);
export default PartnerProfile;
