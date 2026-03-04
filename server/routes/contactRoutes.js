const express = require("express");
const router = express.Router();
const { 
  submitContactForm, 
  getContactMessages, 
  updateMessageStatus 
} = require("../controllers/contactController"); // No .js extension needed in CJS
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", submitContactForm);
router.get("/", protect, admin, getContactMessages);
router.put("/:id", protect, admin, updateMessageStatus);

module.exports = router;