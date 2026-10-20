const mongoose = require("mongoose");

const adoptionEnquirySchema = new mongoose.Schema(
  {
    petId: {
      type: String,
      required: true,
      trim: true,
    },

    petName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    petBreed: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    petType: {
      type: String,
      enum: ["Dog", "Cat", "Other"],
      default: "Other",
    },

    petAge: {
      type: String,
      default: "",
      trim: true,
    },

    petGender: {
      type: String,
      default: "",
      trim: true,
    },

    petLocation: {
      type: String,
      default: "",
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },

    livingSituation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.AdoptionEnquiry ||
  mongoose.model("AdoptionEnquiry", adoptionEnquirySchema);