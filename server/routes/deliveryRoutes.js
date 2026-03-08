const express = require("express");
const router = express.Router();
const { 
  getMyDeliveries, 
  updateAvailability, 
  getAvailablePartners, // This is for available partners only
  getAllPartners,       // <--- ADD THIS for the management list
  toggleAvailability,
  registerPartner,
  assignPartnerToOrder,
  getMarketplaceOrders,
  updateDeliveryProfile
} = require("../controllers/deliveryController");
const { protect, admin, delivery } = require("../middleware/authMiddleware");

// --- PARTNER MANAGEMENT (Admin) ---
// This matches BASE_URL/ (which is /api/delivery/)
// If your Redux calls `${BASE_URL}/partners`, use the route below:
router.get("/partners", protect, admin, getAllPartners); 
router.post("/register", protect, admin, registerPartner);
router.route("/:id/toggle").put(protect, admin, toggleAvailability);
router.get("/partners/available", protect, admin, getAvailablePartners);
router.put("/partners/assign", protect, admin, assignPartnerToOrder);

// --- RIDER SPECIFIC ---
router.get("/my-orders", protect, delivery, getMyDeliveries);
router.put("/availability", protect, delivery, updateAvailability);
router.put('/profile', protect, updateDeliveryProfile);
router.get("/marketplace", protect, delivery, getMarketplaceOrders);

module.exports = router;