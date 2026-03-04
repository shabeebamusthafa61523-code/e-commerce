const express = require("express");
const router = express.Router();
const { getRecommendations, shoppingAssistant, summarizeReviews } = require("../services/aiService");
const UserActivity = require("../models/UserActivity");
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const Review = require("../models/Review");
const { aiSearchController,recommendationController } = require("../controllers/aiController");


// Recommendations
router.get("/recommendations", protect, async (req, res) => {
  const activity = await UserActivity.findOne({ user: req.user._id }).populate("viewedProducts");
  const recommendedProducts = await getRecommendations(activity);
  res.json(recommendedProducts);
});

// Shopping Assistant
router.post("/assistant", protect, async (req, res) => {
  const { query } = req.body;
  const response = await shoppingAssistant(query);
  res.json({ response });
});

// Review Summarizer
router.get("/review-summary/:productId", protect, async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId });
  const summary = await summarizeReviews(reviews);
  res.json({ summary });
});



router.post("/search", aiSearchController);


router.post("/recommend",protect,recommendationController);

module.exports = router;
