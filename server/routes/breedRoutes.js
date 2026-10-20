const express = require("express");

const {
  getBreeds,
  getBreedStats,
  getBreedById,
  getBreedCatalog,
} = require("../controllers/breedController");

const router = express.Router();

// Keep specific routes before /:id.
router.get("/stats", getBreedStats);
router.get("/catalog", getBreedCatalog);
router.get("/", getBreeds);
router.get("/:id", getBreedById);

module.exports = router;