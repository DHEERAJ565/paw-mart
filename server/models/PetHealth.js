const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    dateGiven: {
      type: Date,
      default: null,
    },

    nextDueDate: {
      type: Date,
      default: null,
    },

    verificationStatus: {
      type: String,
      enum: ["Unverified", "Vet verified"],
      default: "Unverified",
    },

    notes: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const weightRecordSchema = new mongoose.Schema(
  {
    weightKg: {
      type: Number,
      required: true,
      min: 0.01,
      max: 300,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },

    source: {
      type: String,
      enum: [
        "Owner reported",
        "Seller reported",
        "Vet verified",
      ],
      required: true,
    },

    notes: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const vetVisitSchema = new mongoose.Schema(
  {
    visitDate: {
      type: Date,
      default: null,
    },

    veterinarian: {
      type: String,
      default: "",
      trim: true,
    },

    reason: {
      type: String,
      default: "",
      maxlength: 500,
    },

    notes: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    verificationStatus: {
      type: String,
      enum: ["Unverified", "Vet verified"],
      default: "Unverified",
    },
  },
  { timestamps: true }
);

const petHealthSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetListing",
      required: true,
      unique: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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

    knownConditions: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    knownAllergies: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    vaccinations: {
      type: [vaccinationSchema],
      default: [],
    },

    weightHistory: {
      type: [weightRecordSchema],
      default: [],
    },

    vetVisits: {
      type: [vetVisitSchema],
      default: [],
    },

    generalNotes: {
      type: String,
      default: "",
      maxlength: 3000,
    },

    informationSource: {
      type: String,
      enum: [
        "Not provided",
        "Seller reported",
        "Owner reported",
        "Vet verified",
      ],
      default: "Not provided",
    },

    sellerInformationSubmitted: {
      type: Boolean,
      default: false,
    },

    sellerInformationSubmittedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.PetHealth ||
  mongoose.model("PetHealth", petHealthSchema);