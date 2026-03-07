require("dotenv").config();
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5000;

// FIX: Static path configuration for Vercel
// This allows the browser to find the images you pushed to GitHub
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});