const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getAllOrders,
  getTopProducts,
  getTotalSales,
  getLowStockProducts,
  getDashboardStats,
  updateOrderStatus

} = require("../controllers/adminController");

// Users management
router.get("/users", protect, admin, getAllUsers);

// Orders management
router.get("/orders", protect, admin, getAllOrders);

// Analytics
router.get("/top-products", protect, admin, getTopProducts);
router.get("/total-sales", protect, admin, getTotalSales);
router.get("/low-stock", protect, admin, getLowStockProducts);
// PUT /api/orders/:id/status
router.put("/:id/status", protect, admin, updateOrderStatus);
router.get("/stats", getDashboardStats);
module.exports = router;
