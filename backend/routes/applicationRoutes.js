const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

// Create new application
router.post("/", async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    const savedApplication = await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application saved successfully",
      data: savedApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save application",
      error: error.message,
    });
  }
});

// Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
});

// Get single application by ID
router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message,
    });
  }
});

module.exports = router;