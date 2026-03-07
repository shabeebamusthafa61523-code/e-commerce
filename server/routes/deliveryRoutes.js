const express = require("express");
const router = express.Router();
const { 
  getMyDeliveries, 
  updateAvailability, 
  getAvailablePartners ,
  toggleAvailability,
  registerPartner,
  assignPartnerToOrder,
  getMarketplaceOrders

} = require("../controllers/deliveryController");
const { protect, admin, delivery } = require("../middleware/authMiddleware");

// Delivery Partner Specific
router.route("/register").post(protect, admin, registerPartner);
router.get("/my-orders", protect, delivery, getMyDeliveries);
router.put("/availability", protect, delivery, updateAvailability);
router.route("/:id/toggle").put(protect, admin, toggleAvailability);
// Admin Specific (to manage partners)
router.get("/partners/available", protect, admin, getAvailablePartners);
router.get("/partners/assign", protect, admin, assignPartnerToOrder);
router.get("/marketplace", protect, getMarketplaceOrders);
module.exports = router;