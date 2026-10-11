import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    serviceCategory: {
      type: String,
      default: "home-shifting"
    },
    pickupAddress: {
      type: String,
      required: true
    },
    destinationAddress: {
      type: String,
      required: true
    },
    pickupArea: {
      type: String,
      default: "Kolhapur"
    },
    destinationArea: {
      type: String,
      default: "Kolhapur"
    },
    movingDate: {
      type: String,
      required: true
    },
    preferredTime: {
      type: String,
      default: "Morning (9 AM - 12 PM)"
    },
    propertyType: {
      type: String,
      default: "1_bhk"
    },
    vehiclePreference: {
      type: String,
      default: "Tata Ace (Chhota Hathi)"
    },
    helpersCount: {
      type: Number,
      default: 2
    },
    packingRequired: {
      type: String,
      default: "none"
    },
    additionalNotes: {
      type: String
    },
    estimatedCost: {
      type: Number
    },
    status: {
      type: String,
      default: "Inquiry Received"
    },
    userId: {
      type: String,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
