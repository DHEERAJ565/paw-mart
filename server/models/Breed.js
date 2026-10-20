const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      enum: ["Small", "Medium", "Large", "Unknown"],
      default: "Unknown",
    },

    energy: {
      type: String,
      enum: ["Low", "Moderate", "High", "Unknown"],
      default: "Unknown",
    },

    coat: {
      type: String,
      default: "Unknown",
    },

    care: {
      type: String,
      default: "Unknown",
    },

    apartment: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    tag: {
      type: String,
      default: "Popular",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      default: "PawMart",
    },
  },
  {
    timestamps: true,
  }
);

breedSchema.index({
  name: "text",
  description: "text",
});

module.exports = mongoose.model("Breed", breedSchema);