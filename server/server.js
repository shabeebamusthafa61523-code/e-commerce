require("dotenv").config(); // MUST BE FIRST

const path = require("path");
const express = require("express"); // 👈 ADD THIS
const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5000;

// Make uploads folder public
// Serve uploads folder publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(` Backend running on port ${PORT}`);
});