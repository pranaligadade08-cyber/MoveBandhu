import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString()
    },
    note: {
      type: String
    }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
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
    userId: {
      type: String,
      index: true
    },
    customerName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      index: true
    },
    email: {
      type: String,
      index: true
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
      default: "09:00 AM"
    },
    propertyType: {
      type: String,
      default: "1_bhk"
    },
    vehiclePreference: {
      type: String,
      default: "Tata Ace"
    },
    helpersCount: {
      type: Number,
      default: 2
    },
    packingRequired: {
      type: String,
      default: "none"
    },
    floorPickup: {
      type: Number,
      default: 0
    },
    hasLiftPickup: {
      type: Boolean,
      default: true
    },
    floorDrop: {
      type: Number,
      default: 0
    },
    hasLiftDrop: {
      type: Boolean,
      default: true
    },
    furnitureItems: {
      type: [String],
      default: []
    },
    estimatedDistanceKm: {
      type: Number,
      default: 5
    },
    estimatedCost: {
      type: Number,
      default: 1500
    },
    finalCost: {
      type: Number,
      default: 1500
    },
    status: {
      type: String,
      default: "Booking Confirmed"
    },
    assignedPartnerId: {
      type: String,
      index: true
    },
    assignedPartnerName: {
      type: String
    },
    assignedPartnerPhone: {
      type: String
    },
    assignedVehicle: {
      type: String
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: []
    },
    customerNotes: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
