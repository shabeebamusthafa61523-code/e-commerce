const Product = require("../models/Product");

const { getRecommendations } = require("../services/aiService");

// controllers/aiController.js
const UserActivity = require("../models/UserActivity");

const recommendationController = async (req, res) => {
  try {
    // 1. Check if the frontend sent a specific product context
    const { productId, category } = req.body;

    // 2. If a category is provided, prioritize "Similar Items" logic
    if (category) {
      const relatedProducts = await Product.find({ 
        category: category, 
        _id: { $ne: productId } // Don't recommend the item the user is already viewing
      }).limit(5);

      return res.json({ 
        success: true, 
        count: relatedProducts.length, 
        products: relatedProducts 
      });
    }

    // 3. FALLBACK: Original logic for Personalized Recommendations (Cart/History)
    const activity = await UserActivity.findOne({ user: req.user._id }).populate("viewedProducts");

    if (!activity) {
      const fallbackProducts = await Product.find().limit(5);
      return res.json({ success: true, count: fallbackProducts.length, products: fallbackProducts });
    }

    const products = await getRecommendations(activity);
    res.json({ success: true, count: products.length, products });

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const { aiSearchService } = require("../services/aiService");

const aiSearchController = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    const products = await aiSearchService(query);

    return res.json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { aiSearchController,recommendationController };