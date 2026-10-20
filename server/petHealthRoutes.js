const express = require("express");
const mongoose = require("mongoose");

const Booking = require("./models/Booking");
const PetListing = require("./models/PetListing");
const PetHealth = require("./models/PetHealth");

const router = express.Router();

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

function normalizeText(value, maxLength = 2000) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function prepareHealthData(body = {}, source = "Owner reported") {
  const vaccinations = Array.isArray(body.vaccinations)
    ? body.vaccinations.map((item) => ({
        name: normalizeText(item.name, 150),
        dateGiven: item.dateGiven || null,
        nextDueDate: item.nextDueDate || null,
        notes: normalizeText(item.notes, 500),
        verificationStatus: "Unverified",
      }))
    : [];

  const weightHistory = Array.isArray(body.weightHistory)
    ? body.weightHistory.map((item) => ({
        weightKg: Number(item.weightKg),
        recordedAt: item.recordedAt || new Date(),
        source,
        notes: normalizeText(item.notes, 500),
      }))
    : [];

  const vetVisits = Array.isArray(body.vetVisits)
    ? body.vetVisits.map((item) => ({
        visitDate: item.visitDate || null,
        veterinarian: normalizeText(item.veterinarian, 150),
        reason: normalizeText(item.reason, 500),
        notes: normalizeText(item.notes, 2000),
        verificationStatus: "Unverified",
      }))
    : [];

  return {
    age: normalizeText(body.age, 100),

    sex: ["Male", "Female", "Unknown"].includes(body.sex)
      ? body.sex
      : "Unknown",

    knownConditions: normalizeText(body.knownConditions, 2000),

    knownAllergies: normalizeText(body.knownAllergies, 2000),

    vaccinations,

    weightHistory,

    vetVisits,

    generalNotes: normalizeText(body.generalNotes, 3000),

    informationSource: source,
  };
}

// ========================================
// SELLER: SUBMIT INITIAL HEALTH INFORMATION
// PUT /api/pet-health/seller/:petId
// ========================================

router.put("/seller/:petId", async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only authorized sellers can submit initial health information.",
      });
    }

    const { petId } = req.params;

    if (!isValidId(petId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pet listing ID.",
      });
    }

    const listing = await PetListing.findById(petId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Pet listing not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      listing.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another seller's pet.",
      });
    }

    const healthData = prepareHealthData(
      req.body,
      "Seller reported"
    );

    const now = new Date();

    const healthRecord = await PetHealth.findOneAndUpdate(
      {
        pet: listing._id,
        seller: listing.seller,
      },
      {
        $set: {
          ...healthData,
          sellerInformationSubmitted: true,
          sellerInformationSubmittedAt: now,
        },
        $setOnInsert: {
          pet: listing._id,
          seller: listing.seller,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      success: true,
      message: "Initial health information saved.",
      healthRecord,
    });
  } catch (error) {
    console.error("Seller health submission error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Please check the health information.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to save the initial health information.",
    });
  }
});

// ========================================
// PAWCARE: GET DELIVERED PETS
// GET /api/pet-health/mine
// ========================================

router.get("/mine", async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      deliveredAt: { $ne: null },
      pet: { $ne: null },
    }).sort({ deliveredAt: -1 });

    const bookingIds = bookings.map((booking) => booking._id);

    const records = await PetHealth.find({
      owner: req.user._id,
      booking: { $in: bookingIds },
    });

    const recordMap = new Map(
      records.map((record) => [
        record.booking.toString(),
        record,
      ])
    );

    const pets = bookings.map((booking) => ({
      bookingId: booking._id,
      orderId: booking.orderId,
      petId: booking.pet,
      dogName: booking.dogName,
      breed: booking.breed,
      dogImage: booking.dogImage,
      deliveredAt: booking.deliveredAt,
      healthRecord: recordMap.get(booking._id.toString()) || null,
    }));

    return res.json({
      success: true,
      pets,
    });
  } catch (error) {
    console.error("Fetch PawCare pets error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your pets.",
    });
  }
});

// ========================================
// CUSTOMER: VIEW HEALTH REPORT FOR BOOKED PET
// GET /api/pet-health/booking/:bookingId
// ========================================

router.get("/booking/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!isValidId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
      pet: { $ne: null },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const healthRecord = await PetHealth.findOne({
      pet: booking.pet,
      seller: booking.seller,
    });

    return res.json({
      success: true,
      pet: {
        bookingId: booking._id,
        orderId: booking.orderId,
        dogName: booking.dogName,
        breed: booking.breed,
        dogImage: booking.dogImage,
      },
      healthRecord,
    });
  } catch (error) {
    console.error("Fetch booking health error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load the health report.",
    });
  }
});

// ========================================
// OWNER: GET ONE DELIVERED PET'S HEALTH
// GET /api/pet-health/:bookingId
// ========================================

router.get("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!isValidId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
      deliveredAt: { $ne: null },
      pet: { $ne: null },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Delivered pet not found.",
      });
    }

    const healthRecord = await PetHealth.findOne({
      booking: booking._id,
      owner: req.user._id,
      pet: booking.pet,
    });

    return res.json({
      success: true,
      pet: {
        bookingId: booking._id,
        orderId: booking.orderId,
        dogName: booking.dogName,
        breed: booking.breed,
        dogImage: booking.dogImage,
        deliveredAt: booking.deliveredAt,
      },
      healthRecord,
    });
  } catch (error) {
    console.error("Fetch owner health error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load the health record.",
    });
  }
});

// ========================================
// OWNER: UPDATE ONGOING HEALTH INFORMATION
// PUT /api/pet-health/:bookingId
// ========================================

router.put("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!isValidId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
      deliveredAt: { $ne: null },
      pet: { $ne: null },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Delivered pet not found.",
      });
    }

    const existingRecord = await PetHealth.findOne({
      pet: booking.pet,
      booking: booking._id,
      owner: req.user._id,
    });

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "The pet's initial health record was not found.",
      });
    }

    const body = req.body || {};

    // Do not replace the seller's initial health report.
    // Owner updates append new records and update owner notes.
    const updates = {};

    if (body.generalNotes !== undefined) {
      updates.generalNotes = normalizeText(body.generalNotes, 3000);
    }

    if (body.knownConditions !== undefined) {
      updates.knownConditions = normalizeText(
        body.knownConditions,
        2000
      );
    }

    if (body.knownAllergies !== undefined) {
      updates.knownAllergies = normalizeText(
        body.knownAllergies,
        2000
      );
    }

    const $push = {};

    if (Array.isArray(body.newVaccinations)) {
      const newVaccinations = body.newVaccinations.map((item) => ({
        name: normalizeText(item.name, 150),
        dateGiven: item.dateGiven || null,
        nextDueDate: item.nextDueDate || null,
        notes: normalizeText(item.notes, 500),
        verificationStatus: "Unverified",
      }));

      $push.vaccinations = { $each: newVaccinations };
    }

    if (Array.isArray(body.newWeightRecords)) {
      const newWeights = body.newWeightRecords.map((item) => ({
        weightKg: Number(item.weightKg),
        recordedAt: item.recordedAt || new Date(),
        source: "Owner reported",
        notes: normalizeText(item.notes, 500),
      }));

      $push.weightHistory = { $each: newWeights };
    }

    if (Array.isArray(body.newVetVisits)) {
      const newVisits = body.newVetVisits.map((item) => ({
        visitDate: item.visitDate || null,
        veterinarian: normalizeText(item.veterinarian, 150),
        reason: normalizeText(item.reason, 500),
        notes: normalizeText(item.notes, 2000),
        verificationStatus: "Unverified",
      }));

      $push.vetVisits = { $each: newVisits };
    }

    const updateQuery = {};

    if (Object.keys(updates).length > 0) {
      updateQuery.$set = updates;
    }

    if (Object.keys($push).length > 0) {
      updateQuery.$push = $push;
    }

    if (Object.keys(updateQuery).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No health information was provided.",
      });
    }

    const healthRecord = await PetHealth.findOneAndUpdate(
      {
        pet: booking.pet,
        booking: booking._id,
        owner: req.user._id,
      },
      updateQuery,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      success: true,
      message: "Health information updated.",
      healthRecord,
    });
  } catch (error) {
    console.error("Save owner health error:", error);

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check the health information.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update the health record.",
    });
  }
});

module.exports = router;