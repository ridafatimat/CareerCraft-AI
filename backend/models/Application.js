const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    education: {
      type: String,
      required: true,
    },

    skills: {
      type: String,
      required: true,
    },

    projects: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      default: "",
    },

    jobRole: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    tone: {
      type: String,
      default: "professional",
    },

    generatedCoverLetter: {
      type: String,
      default: "",
    },

    generatedResumeSummary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);