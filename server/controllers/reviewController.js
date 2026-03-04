const Review = require("../models/Review");
const Product = require("../models/Product");

// Add Review
const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  try {
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for product
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getReviews };
