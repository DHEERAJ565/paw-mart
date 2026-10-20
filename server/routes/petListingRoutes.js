const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const PetListing = require("../models/PetListing");

// GET /api/pets
// Fetch available pet listings
router.get("/", async (req, res) => {
try {
const pets = await PetListing.find({ status: "Available" })
.select("-__v")
.sort({ createdAt: -1 })
.lean();


return res.status(200).json({
  success: true,
  count: pets.length,
  pets,
});


} catch (error) {
console.error("Fetch pet listings error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to fetch pet listings.",
});


}
});

// GET /api/pets/:id
// Fetch one pet listing by MongoDB ID
router.get("/:id", async (req, res) => {
try {
const { id } = req.params;


if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid pet listing ID.",
  });
}

const pet = await PetListing.findById(id)
  .select("-__v")
  .lean();

if (!pet) {
  return res.status(404).json({
    success: false,
    message: "Pet listing not found.",
  });
}

return res.status(200).json({
  success: true,
  pet,
});


} catch (error) {
console.error("Fetch individual pet error:", error);

return res.status(500).json({
  success: false,
  message: "Failed to fetch pet details.",
});


}
});

module.exports = router;
