import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    nameEn: {
      type: String,
      required: true
    },
    nameMr: {
      type: String
    },
    nameHi: {
      type: String
    },
    descriptionEn: {
      type: String
    },
    descriptionMr: {
      type: String
    },
    descriptionHi: {
      type: String
    },
    iconName: {
      type: String,
      default: "Truck"
    },
    basePrice: {
      type: Number,
      required: true
    },
    vehicleRecommendation: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Service = mongoose.model("Service", serviceSchema);
export default Service;
