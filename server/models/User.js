const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    password: {
      type: String,
      required: true,
    },

    resetOtpHash: {
      type: String,
      default: undefined,
    },

    resetOtpExpires: {
      type: Date,
      default: undefined,
    },

    resetOtpAttempts: {
      type: Number,
      default: 0,
    },

    resetOtpLastSent: {
      type: Date,
      default: undefined,
    },

    // Customer or seller account.
    role: {
      type: String,
      enum: ["customer", "seller", "admin", "vet"],
      default: "customer",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);