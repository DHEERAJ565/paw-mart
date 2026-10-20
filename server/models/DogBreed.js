const mongoose = require("mongoose");

const dogBreedSchema = new mongoose.Schema(
  {
    breed: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      default: "dog",
    },

    price: {
      type: Number,
      default: 15000,
    },

    currency: {
      type: String,
      default: "INR",
    },

    demo: {
      type: Boolean,
      default: true,
    },

    listingStatus: {
      type: String,
      default: "demo",
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "dogbreeds",
  }
);

module.exports = mongoose.model("DogBreed", dogBreedSchema);