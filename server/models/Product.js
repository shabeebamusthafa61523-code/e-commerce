const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String },
image: {
    type: String, // 🔥 Change this from Object to String
    required: true
  },
  images: {
  type: [String],
  default: [],
},    nutritionInfo: { type: String },
    isOrganic: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  
  // ... other fields
  discountPrice: { type: Number, default: 0 },
  isFlashSale: { type: Boolean, default: false }, // Ensure this is a Boolean
},
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
