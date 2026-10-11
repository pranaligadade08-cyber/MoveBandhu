import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    bookingReference: {
      type: String,
      default: "Verified Move"
    },
    customerName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    commentEn: {
      type: String,
      required: true
    },
    commentMr: {
      type: String
    },
    serviceName: {
      type: String,
      default: "Home Shifting"
    },
    location: {
      type: String,
      default: "Kolhapur"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Review = mongoose.model("Review", reviewSchema);
export default Review;
