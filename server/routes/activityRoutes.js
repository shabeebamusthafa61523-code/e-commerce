const express = require("express");
const router = express.Router();
const { getUserActivity, addToCart, removeFromCart } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getUserActivity);
router.post("/cart", protect, addToCart);
router.delete("/cart/:productId", protect, removeFromCart);

module.exports = router;
