const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
 getUserProfile,
  updateUserProfile,
  resetPasswordDirect
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
console.log("protect type:", typeof protect);

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post("/reset-password-direct", resetPasswordDirect);
module.exports = router;
