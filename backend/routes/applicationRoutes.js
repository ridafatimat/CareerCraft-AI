const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

// Create new application
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required. Please login first.",
      });
    }

    const newApplication = new Application({
      ...req.body,
      user: userId,
    });

    const savedApplication = await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application saved successfully.",
      data: savedApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save application.",
      error: error.message,
    });
  }
});

// Get all applications for a specific user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required to fetch applications.",
      });
    }

    const applications = await Application.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications.",
      error: error.message,
    });
  }
});

// Update application by ID
router.put("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required to update application.",
      });
    }

    const updatedApplication = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application updated successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update application.",
      error: error.message,
    });
  }
});

// Delete application by ID
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required to delete application.",
      });
    }

    const deletedApplication = await Application.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!deletedApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete application.",
      error: error.message,
    });
  }
});

// Get single application by ID
router.get("/:id", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required to fetch application.",
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch application.",
      error: error.message,
    });
  }
});

module.exports = router;