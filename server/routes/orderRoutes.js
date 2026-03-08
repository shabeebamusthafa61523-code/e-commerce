const express = require("express");
const router = express.Router();
const { createOrder, getUserOrders, cancelOrder ,getOrderById,updateOrderToPaid,claimOrder} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
// routes/orderRoutes.js

const { assignPartnerToOrder,updateOrderStatus } = require("../controllers/deliveryController");

// Both Admin and Delivery Personnel can hit this, 
// protected by your 'protect' middleware

module.exports = router;
router.post("/", protect, createOrder);
router.put("/:id/pay", protect, updateOrderToPaid);
router.get("/my-order", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder); // New Cancellation Route
// GET single order
router.get("/:id", protect, getOrderById);
router.put("/:id/claim", protect, claimOrder);
router.put("/:id/assign", protect, assignPartnerToOrder);
router.put("/:id/status", protect, updateOrderStatus);
module.exports = router;