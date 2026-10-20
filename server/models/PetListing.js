const mongoose = require("mongoose");

const petListingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    breed: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    age: {
      type: String,
      default: "",
      trim: true,
    },

    sex: {
      type: String,
      enum: ["Male", "Female", "Unknown"],
      default: "Unknown",
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Reserved",
        "Sold",
        "Unavailable",
      ],
      default: "Available",
      index: true,
    },
  },
  { timestamps: true }
);

petListingSchema.index({ breed: 1, status: 1 });

module.exports =
  mongoose.models.PetListing ||
  mongoose.model("PetListing", petListingSchema);