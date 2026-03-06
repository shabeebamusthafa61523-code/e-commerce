require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const activityRoutes = require("./routes/activityRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const contactRoutes = require("./routes/contactRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/contact",contactRoutes);
app.use("/api/delivery",deliveryRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("SMARTCART Backend is running!");
});

module.exports = app; // ✅ CommonJS
