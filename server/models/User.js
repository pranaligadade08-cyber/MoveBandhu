import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["customer", "partner", "admin"],
      default: "customer"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const User = mongoose.model("User", userSchema);
export default User;
