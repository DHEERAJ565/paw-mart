const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    breed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Breed",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favorites for the same user
favoriteSchema.index(
  { userId: 1, breed: 1 },
  { unique: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);