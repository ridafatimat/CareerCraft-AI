const express = require("express");
const mongoose = require("mongoose");
const applicationRoutes = require("./routes/applicationRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("CareerCraft AI Backend is running");
});

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerCraft AI API is healthy",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});