const express = require("express");
const router = express.Router();
const { createOrder, getUserOrders, cancelOrder ,getOrderById,updateOrderToPaid} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.put("/:id/pay", protect, updateOrderToPaid);
router.get("/my-order", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder); // New Cancellation Route
// GET single order
router.get("/:id", protect, getOrderById);
module.exports = router;