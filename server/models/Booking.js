const mongoose = require("mongoose");

const BOOKING_STATUSES = [
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
  "Ready for Pickup",
  "Completed",
];

const PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
];

const PAYMENT_METHODS = [
  "Razorpay",
  "COD",
];

const bookingSchema = new mongoose.Schema(
  {
    // Unique PawMart booking reference
    orderId: {
      type: String,
      unique: true,
      index: true,
    },

    // Customer who created the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Pet associated with the booking
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetListing",
      default: null,
      index: true,
    },

    // Type of product booked
    productType: {
      type: String,
      enum: ["PetListing", "Breed"],
      default: "PetListing",
      required: true,
      index: true,
    },

    // Breed catalogue ID when productType is Breed
    catalogBreedId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    // Seller / pet owner
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Pet information saved with the booking
    dogName: {
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

    dogImage: {
      type: String,
      default: "",
    },

    // Price in Indian rupees
    price: {
      type: Number,
      default: null,
      min: 0,
    },

    notes: {
      type: String,
      default: "",
      maxlength: 500,
    },

    // Booking lifecycle
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: "Pending",
      index: true,
    },

    // Record of booking status changes
    statusHistory: [
      {
        status: {
          type: String,
          enum: BOOKING_STATUSES,
          required: true,
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },

        note: {
          type: String,
          default: "",
          maxlength: 300,
        },
      },
    ],

    pickupDate: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
      index: true,
    },

    // Payment method selected by the customer
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "Razorpay",
      index: true,
    },

    // COD bookings remain Pending until payment is collected
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "Pending",
      index: true,
    },

    // Razorpay order created by the backend
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },

    // Razorpay payment reference
    razorpayPaymentId: {
      type: String,
      default: null,
    },

    // Time online payment was successfully verified
    paidAt: {
      type: Date,
      default: null,
    },

    // Time COD payment was actually collected
    codCollectedAt: {
      type: Date,
      default: null,
    },

    // User or administrator who recorded COD collection
    codCollectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a unique PawMart booking reference.
bookingSchema.pre("validate", function () {
  if (!this.orderId) {
    this.orderId =
      `PM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

module.exports =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);