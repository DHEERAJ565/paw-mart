const express = require("express");
const router = express.Router();

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");

// Get logged-in user's favorites
router.get("/", getFavorites);

// Add a breed to favorites
router.post("/:breedId", addFavorite);

// Remove a breed from favorites
router.delete("/:breedId", removeFavorite);

module.exports = router;