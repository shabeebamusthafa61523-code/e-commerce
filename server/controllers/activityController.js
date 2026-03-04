const UserActivity = require("../models/UserActivity");

// @desc Get or create user activity
// @route GET /api/activity
// @access Private
const getUserActivity = async (req, res) => {
  try {
    let activity = await UserActivity.findOne({ user: req.user._id })
      .populate("viewedProducts")
      .populate("cartProducts.product")
      .populate("orderedProducts");

    if (!activity) {
      activity = await UserActivity.create({ user: req.user._id });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add product to cart
// @route POST /api/activity/cart
// @access Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let activity = await UserActivity.findOne({ user: req.user._id });
    if (!activity) activity = await UserActivity.create({ user: req.user._id });

    // Check if product exists in cart
    const existingItem = activity.cartProducts.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      activity.cartProducts.push({ product: productId, quantity });
    }

    await activity.save();
    res.json(activity.cartProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove product from cart
// @route DELETE /api/activity/cart/:productId
// @access Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let activity = await UserActivity.findOne({ user: req.user._id });
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    activity.cartProducts = activity.cartProducts.filter(item => item.product.toString() !== productId);
    await activity.save();
    res.json(activity.cartProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserActivity, addToCart, removeFromCart };
