const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Booking = require("./models/Booking");
const PetListing = require("./models/PetListing");
const PetHealth = require("./models/PetHealth");
const DogBreed = require("./models/DogBreed");

const router = express.Router();

// ========================================
// HELPERS
// ========================================

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (
    !keyId ||
    !keySecret ||
    keyId.includes("your_") ||
    keySecret.includes("your_")
  ) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

function isConfiguredSecret(value) {
  return Boolean(value && !value.includes("your_"));
}

function cleanNotes(notes) {
  return typeof notes === "string"
    ? notes.trim().slice(0, 500)
    : "";
}

function getOwnerId(listing) {
  const seller = listing.seller;

  if (!seller) {
    return null;
  }

  // Populated Mongoose User document.
  if (seller._id) {
    return seller._id;
  }

  // BSON Extended JSON.
  if (seller.$oid) {
    return new mongoose.Types.ObjectId(seller.$oid);
  }

  // MongoDB ObjectId.
  if (seller instanceof mongoose.Types.ObjectId) {
    return seller;
  }

  // String ObjectId.
  if (
    typeof seller === "string" &&
    mongoose.isValidObjectId(seller)
  ) {
    return new mongoose.Types.ObjectId(seller);
  }

  throw new Error("Pet listing has an invalid seller reference.");
}

function isOwnListing(listing, userId) {
  const ownerId = getOwnerId(listing);

  return Boolean(
    ownerId && ownerId.toString() === userId.toString()
  );
}

function listingIsAvailable(listing) {
  return listing.status === "Available";
}

/**
 * Retrieves a breed catalogue product and its price from MongoDB.
 * Never trusts a price supplied by the frontend.
 */
async function getBreedProduct(catalogBreedId) {
  if (
    !catalogBreedId ||
    !mongoose.isValidObjectId(catalogBreedId)
  ) {
    return null;
  }

  const breed = await DogBreed.findById(catalogBreedId).lean();

  if (!breed) {
    return null;
  }

  const price = Number(breed.price);

  if (!Number.isFinite(price) || price < 1) {
    const error = new Error(
      "This breed has an invalid price in the database."
    );

    error.statusCode = 400;
    throw error;
  }

  return {
    breed,
    price,
  };
}

// ========================================
// CREATE RAZORPAY PAYMENT ORDER
// POST /api/bookings/create-payment-order
//
// Supports:
// 1. Individual pet purchases
// 2. Breed catalogue purchases
// ========================================

router.post("/create-payment-order", async (req, res) => {
  let createdRazorpayOrderId = null;

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please sign in before creating a payment order.",
      });
    }

    const razorpay = getRazorpay();

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message:
          "Razorpay is not configured. Check your server .env file.",
      });
    }

    const {
      productType = "PetListing",
      petId,
      catalogBreedId,
      notes,
    } = req.body || {};

    let bookingData;
    let price;
    let razorpayNotes;

    // ----------------------------------------
    // OPTION 1: BREED CATALOGUE PRODUCT
    // ----------------------------------------

    if (productType === "Breed") {
      let result;

      try {
        result = await getBreedProduct(catalogBreedId);
      } catch (error) {
        return res.status(error.statusCode || 400).json({
          success: false,
          message: error.message || "Invalid breed price.",
        });
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message:
            "Breed catalogue product not found. Refresh the page and try again.",
        });
      }

      const { breed, price: breedPrice } = result;

      price = breedPrice;

      bookingData = {
        user: req.user._id,
        pet: null,
        seller: null,

        productType: "Breed",
        catalogBreedId: breed._id.toString(),

        dogName: breed.breed,
        breed: breed.breed,
        dogImage:
          typeof breed.image === "string"
            ? breed.image
            : "",

        price,
        notes: cleanNotes(notes),

        paymentMethod: "Razorpay",
        paymentStatus: "Pending",
      };

      razorpayNotes = {
        productType: "Breed",
        catalogBreedId: breed._id.toString(),
        customerId: req.user._id.toString(),
      };
    }

    // ----------------------------------------
    // OPTION 2: INDIVIDUAL PET LISTING
    // ----------------------------------------

    else if (productType === "PetListing") {
      if (!petId || !isValidId(petId)) {
        return res.status(400).json({
          success: false,
          message: "A valid pet listing ID is required.",
        });
      }

      const listing = await PetListing.findById(petId);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Pet listing not found.",
        });
      }

      if (!listingIsAvailable(listing)) {
        return res.status(409).json({
          success: false,
          message: "This pet is not currently available.",
        });
      }

      if (isOwnListing(listing, req.user._id)) {
        return res.status(403).json({
          success: false,
          message: "You cannot book your own pet listing.",
        });
      }

      price = Number(listing.price);

      if (!Number.isFinite(price) || price < 1) {
        return res.status(400).json({
          success: false,
          message: "The pet price must be at least ₹1.",
        });
      }

      bookingData = {
        user: req.user._id,
        pet: listing._id,
        seller: getOwnerId(listing),

        productType: "PetListing",
        catalogBreedId: null,

        dogName: listing.name,
        breed: listing.breed,
        dogImage: listing.image || "",

        price,
        notes: cleanNotes(notes),

        paymentMethod: "Razorpay",
        paymentStatus: "Pending",
      };

      razorpayNotes = {
        productType: "PetListing",
        petListingId: listing._id.toString(),
        customerId: req.user._id.toString(),
      };
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported product type. Use 'PetListing' or 'Breed'.",
      });
    }

    // ----------------------------------------
    // CREATE RAZORPAY ORDER
    // Amount comes from the database price.
    // Razorpay requires the amount in paise.
    // ----------------------------------------

    const amount = Math.round(price * 100);

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `pm_${Date.now()}`,
      notes: razorpayNotes,
    });

    createdRazorpayOrderId = razorpayOrder.id;

    const booking = await Booking.create({
      ...bookingData,
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully.",

      bookingId: booking._id,
      orderId: razorpayOrder.id,

      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,

      product: {
        type: booking.productType,
        id: booking.catalogBreedId || booking.pet,
        name: booking.dogName,
        breed: booking.breed,
        image: booking.dogImage,
        price: booking.price,
      },

      // Retained for compatibility with Payment.jsx.
      pet: {
        name: booking.dogName,
        breed: booking.breed,
        image: booking.dogImage,
        price: booking.price,
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    if (
      createdRazorpayOrderId &&
      req.user &&
      req.user._id
    ) {
      try {
        await Booking.deleteOne({
          razorpayOrderId: createdRazorpayOrderId,
          user: req.user._id,
          paymentStatus: "Pending",
        });
      } catch (cleanupError) {
        console.error(
          "Pending booking cleanup error:",
          cleanupError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
});

// ========================================
// VERIFY RAZORPAY PAYMENT
// POST /api/bookings/verify-payment
// ========================================

router.post("/verify-payment", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to verify this payment.",
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!isConfiguredSecret(keySecret)) {
      return res.status(503).json({
        success: false,
        message: "Payment verification is not configured.",
      });
    }

    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (
      !isValidId(bookingId) ||
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment verification details.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.paymentMethod !== "Razorpay") {
      return res.status(400).json({
        success: false,
        message: "This booking is not an online payment booking.",
      });
    }

    if (booking.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match the booking.",
      });
    }

    // Idempotent response for an already verified payment.
    if (
      booking.paymentStatus === "Paid" &&
      booking.razorpayPaymentId === razorpay_payment_id
    ) {
      return res.json({
        success: true,
        message: "Payment already verified.",
        booking,
      });
    }

    if (booking.paymentStatus === "Paid") {
      return res.status(409).json({
        success: false,
        message: "This booking has already been paid.",
      });
    }

    // Verify Razorpay's HMAC signature.
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "utf8"
    );

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "utf8"
    );

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    const razorpay = getRazorpay();

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured.",
      });
    }

    // Confirm the actual captured payment with Razorpay.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    const expectedAmount = Math.round(
      Number(booking.price) * 100
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      payment.amount !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The payment has not been confirmed as captured for this order.",
      });
    }

    booking.paymentStatus = "Paid";
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paidAt = new Date();

    await booking.save();

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      booking,
    });
  } catch (error) {
    console.error("Verify Razorpay payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment.",
    });
  }
});

// ========================================
// CREATE CASH ON DELIVERY BOOKING
// POST /api/bookings/cod
//
// Supports:
// 1. Individual pet listings
// 2. Breed catalogue orders
// ========================================

router.post("/cod", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please sign in before placing an order.",
      });
    }

    const {
      productType = "PetListing",
      petId,
      catalogBreedId,
      notes,
    } = req.body || {};

    let bookingData;
    let price;

    // ----------------------------------------
    // OPTION 1: BREED CATALOGUE COD ORDER
    // ----------------------------------------

    if (productType === "Breed") {
      let result;

      try {
        result = await getBreedProduct(catalogBreedId);
      } catch (error) {
        return res.status(error.statusCode || 400).json({
          success: false,
          message: error.message || "Invalid breed price.",
        });
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Breed catalogue product not found.",
        });
      }

      const { breed, price: breedPrice } = result;

      price = breedPrice;

      bookingData = {
        user: req.user._id,

        // A catalogue breed is not an individual pet listing.
        pet: null,
        seller: null,

        productType: "Breed",
        catalogBreedId: breed._id.toString(),

        dogName: breed.breed,
        breed: breed.breed,
        dogImage:
          typeof breed.image === "string"
            ? breed.image
            : "",

        price,
        notes: cleanNotes(notes),

        paymentMethod: "COD",
        paymentStatus: "Pending",
        status: "Pending",
      };
    }

    // ----------------------------------------
    // OPTION 2: INDIVIDUAL PET COD ORDER
    // ----------------------------------------

    else if (productType === "PetListing") {
      if (!petId || !isValidId(petId)) {
        return res.status(400).json({
          success: false,
          message: "A valid pet listing ID is required.",
        });
      }

      const listing = await PetListing.findById(petId);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Pet listing not found.",
        });
      }

      if (!listingIsAvailable(listing)) {
        return res.status(409).json({
          success: false,
          message: "This pet is not currently available.",
        });
      }

      if (isOwnListing(listing, req.user._id)) {
        return res.status(403).json({
          success: false,
          message: "You cannot book your own pet listing.",
        });
      }

      price = Number(listing.price);

      if (!Number.isFinite(price) || price < 1) {
        return res.status(400).json({
          success: false,
          message: "This listing has an invalid price.",
        });
      }

      bookingData = {
        user: req.user._id,

        pet: listing._id,
        seller: getOwnerId(listing),

        productType: "PetListing",
        catalogBreedId: null,

        dogName: listing.name,
        breed: listing.breed,
        dogImage: listing.image || "",

        price,
        notes: cleanNotes(notes),

        paymentMethod: "COD",
        paymentStatus: "Pending",
        status: "Pending",
      };
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported product type. Use 'PetListing' or 'Breed'.",
      });
    }

    // ----------------------------------------
    // SAVE COD BOOKING
    // ----------------------------------------

    const booking = await Booking.create(bookingData);

    return res.status(201).json({
      success: true,
      message: "Cash on Delivery order created successfully.",

      bookingId: booking._id,
      orderId: booking.orderId,

      productType: booking.productType,
      catalogBreedId: booking.catalogBreedId,

      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,

      price: booking.price,
      booking,
    });
  } catch (error) {
    console.error("Create COD booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create the COD order.",
    });
  }
});

// ========================================
// CONFIRM COD CASH COLLECTION
// POST /api/bookings/:id/collect-cod
//
// Only the seller associated with an individual
// pet listing can use this existing route.
// ========================================

router.post("/:id/collect-cod", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please sign in first.",
      });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Catalogue breed bookings have no individual seller.
    if (
      booking.productType === "Breed" ||
      !booking.seller
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order has no assigned seller. An authorized order manager must handle cash collection.",
      });
    }

    if (
      booking.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only this booking's seller can confirm cash collection.",
      });
    }

    if (booking.paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "This booking does not use Cash on Delivery.",
      });
    }

    if (booking.paymentStatus === "Paid") {
      return res.status(409).json({
        success: false,
        message: "Payment has already been recorded.",
      });
    }

    if (
      booking.status === "Cancelled" ||
      booking.status === "Rejected"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cash cannot be collected for a cancelled or rejected booking.",
      });
    }

    // Call only after the seller has actually received cash.
    booking.paymentStatus = "Paid";
    booking.codCollectedAt = new Date();
    booking.codCollectedBy = req.user._id;

    await booking.save();

    return res.json({
      success: true,
      message: "COD payment collection recorded successfully.",
      booking,
    });
  } catch (error) {
    console.error("COD collection error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to record COD payment collection.",
    });
  }
});

// ========================================
// LEGACY CREATE BOOKING
// POST /api/bookings
// ========================================

router.post("/", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please sign in before creating a booking.",
      });
    }

    const {
      pet: petId,
      dogName,
      breed,
      dogImage,
      price,
      notes,
    } = req.body || {};

    let listing = null;

    if (petId !== undefined && petId !== null && petId !== "") {
      if (!isValidId(petId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pet listing ID.",
        });
      }

      listing = await PetListing.findById(petId);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Pet listing not found.",
        });
      }

      if (!listingIsAvailable(listing)) {
        return res.status(409).json({
          success: false,
          message: "This pet is not currently available.",
        });
      }

      if (isOwnListing(listing, req.user._id)) {
        return res.status(403).json({
          success: false,
          message: "You cannot book your own pet listing.",
        });
      }
    }

    const finalDogName = listing ? listing.name : dogName;
    const finalBreed = listing ? listing.breed : breed;
    const finalDogImage = listing ? listing.image : dogImage;

    if (
      typeof finalDogName !== "string" ||
      !finalDogName.trim() ||
      typeof finalBreed !== "string" ||
      !finalBreed.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Dog name and breed are required.",
      });
    }

    let finalPrice = listing ? listing.price : price;

    if (
      finalPrice !== undefined &&
      finalPrice !== null &&
      finalPrice !== ""
    ) {
      finalPrice = Number(finalPrice);

      if (!Number.isFinite(finalPrice) || finalPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid price.",
        });
      }
    } else {
      finalPrice = null;
    }

    const bookingData = {
      user: req.user._id,

      dogName: finalDogName.trim(),
      breed: finalBreed.trim(),

      dogImage:
        typeof finalDogImage === "string"
          ? finalDogImage
          : "",

      notes: cleanNotes(notes),
      price: finalPrice,

      paymentMethod: "Razorpay",
      paymentStatus: "Pending",

      productType: "PetListing",
      catalogBreedId: null,
    };

    if (listing) {
      bookingData.pet = listing._id;
      bookingData.seller = getOwnerId(listing);
    }

    const booking = await Booking.create(bookingData);

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create booking.",
    });
  }
});

// ========================================
// GET CURRENT USER'S BOOKINGS
// GET /api/bookings
// ========================================

router.get("/", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view your bookings.",
      });
    }

    const bookings = await Booking.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Fetch bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings.",
    });
  }
});

// ========================================
// TRACK ORDER
// GET /api/bookings/track/:orderId
// ========================================

router.get("/track/:orderId", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to track your order.",
      });
    }

    const orderId = req.params.orderId.trim();

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Please provide an Order ID.",
      });
    }

    const booking = await Booking.findOne({
      orderId,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this account.",
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Track order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to track your order.",
    });
  }
});

// ========================================
// GET BOOKING HEALTH SUMMARY
// GET /api/bookings/:id/health
// ========================================

router.get("/:id/health", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view booking health details.",
      });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (!booking.pet) {
      return res.status(404).json({
        success: false,
        message:
          "This catalogue booking has no real listing health record.",
      });
    }

    const healthRecord = await PetHealth.findOne({
      pet: booking.pet,
      seller: booking.seller,
    }).select(
      "age sex knownConditions knownAllergies vaccinations weightHistory vetVisits generalNotes informationSource sellerInformationSubmitted sellerInformationSubmittedAt"
    );

    return res.json({
      success: true,
      healthRecord,
    });
  } catch (error) {
    console.error("Booking health fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load the health report.",
    });
  }
});

// ========================================
// CONFIRM DELIVERY
// POST /api/bookings/:id/confirm-delivery
// ========================================

router.post("/:id/confirm-delivery", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to confirm delivery.",
      });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (
      !booking.pet ||
      booking.productType === "Breed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Catalogue bookings cannot be confirmed as real pet deliveries.",
      });
    }

    if (booking.status !== "Ready for Pickup") {
      return res.status(400).json({
        success: false,
        message:
          "The booking must be Ready for Pickup before delivery confirmation.",
      });
    }

    if (booking.deliveredAt) {
      return res.status(409).json({
        success: false,
        message: "Delivery has already been confirmed.",
      });
    }

    const healthRecord = await PetHealth.findOne({
      pet: booking.pet,
      seller: booking.seller,
    });

    if (
      !healthRecord ||
      !healthRecord.sellerInformationSubmitted
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The seller must submit initial health information before delivery confirmation.",
      });
    }

    const deliveredAt = new Date();

    booking.deliveredAt = deliveredAt;
    booking.status = "Completed";

    booking.statusHistory.push({
      status: "Completed",
      updatedAt: deliveredAt,
      note: "Customer confirmed delivery.",
    });

    await booking.save();

    healthRecord.owner = booking.user;
    healthRecord.booking = booking._id;
    healthRecord.deliveredAt = deliveredAt;

    await healthRecord.save();

    return res.json({
      success: true,
      message:
        "Delivery confirmed. Your pet is now available in PawCare.",
      booking,
    });
  } catch (error) {
    console.error("Confirm delivery error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to confirm delivery.",
    });
  }
});

// ========================================
// CANCEL BOOKING
// PATCH /api/bookings/:id/cancel
// ========================================

router.patch("/:id/cancel", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to cancel a booking.",
      });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be cancelled.",
      });
    }

    if (booking.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message:
          "This booking has already been paid. Use the refund process if applicable.",
      });
    }

    booking.status = "Cancelled";

    booking.statusHistory.push({
      status: "Cancelled",
      updatedAt: new Date(),
      note: "Booking cancelled by the customer.",
    });

    await booking.save();

    return res.json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel booking.",
    });
  }
});

// ========================================
// DELETE CUSTOMER BOOKING
// DELETE /api/bookings/:id
// ========================================

router.delete("/:id", async (req, res) => {
  try {
    // Require an authenticated customer.
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to delete a booking.",
      });
    }

    const { id } = req.params;

    // Validate MongoDB booking ID.
    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    // Customers can delete only their own bookings.
    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const paymentStatus = String(
      booking.paymentStatus || ""
    ).toLowerCase();

    const bookingStatus = String(
      booking.status || ""
    ).toLowerCase();

    // Preserve bookings with processed payments.
    const paymentAlreadyProcessed =
      ["paid", "refunded", "captured"].includes(paymentStatus) ||
      Boolean(booking.paidAt) ||
      Boolean(booking.razorpayPaymentId) ||
      Boolean(booking.codCollectedAt);

    const bookingAlreadyCompleted = [
      "completed",
      "delivered",
    ].includes(bookingStatus);

    if (paymentAlreadyProcessed || bookingAlreadyCompleted) {
      return res.status(400).json({
        success: false,
        message:
          "Paid, refunded, or completed bookings cannot be deleted.",
      });
    }

    // Delete only this customer's booking.
    await Booking.deleteOne({
      _id: booking._id,
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
      bookingId: id,
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete this booking.",
    });
  }
});

// ========================================
// GET SINGLE BOOKING
// GET /api/bookings/:id
// ========================================

router.get("/:id", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view this booking.",
      });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Fetch booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking.",
    });
  }
});

module.exports = router;